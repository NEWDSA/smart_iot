<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="选择可控设备的成员分组" @ok="handleSubmit">
    <BasicTree :checkStrictly="true" ref="treeRef" :checkedKeys="checkedMenu" title="部门列表" toolbar checkable search
      treeWrapperClassName="h-[calc(100%-35px)] overflow-auto" :clickRowToExpand="false" :treeData="treeData"
      :fieldNames="{ key: 'Id', title: 'Name' }" @check="handleSelect" />
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, toRaw, unref } from 'vue';
import { BasicModal, useModalInner } from '@/components/Modal';
import { BasicTree, TreeItem, TreeActionType } from '@/components/Tree/index';
import { getDeptDrop } from '@/api/demo/system';
import { DeviceIdDepartMent } from '@/api/demo/system';
import { devicePermission } from '@/api/demo/region';
export default defineComponent({
  name: 'AccountModal',
  components: { BasicModal, BasicTree },
  emits: ['success', 'register', 'select'],
  setup(_, { emit }) {
    const treeRef = ref<Nullable<TreeActionType>>(null);
    const myResult = ref();
    const myDepartMent = ref();
    const treeData = ref<TreeItem[]>([]);
    const checkData = ref('');
    const checkedMenu = ref<Array<string | number>>([]);
    const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
      myResult.value = toRaw(data.DeviceId);

      const { Detail } = await DeviceIdDepartMent({
        DeviceId: myResult.value.toString()
      })
      if (Detail) {
        checkedMenu.value = Detail.map(item => item.DepartmentId);
      }
      const { TreeSelect } = await getDeptDrop();
      treeData.value = TreeSelect;
    });
    function getTree() {
      const tree = unref(treeRef);
      if (!tree) {
        throw new Error('tree is null!');
      }
      return tree;
    }

    function onSelectChange() {

    }
    function handleSelect(keys) {
      checkData.value = keys.checked;
    }
    async function handleSubmit() {
      const keys = getTree().getCheckedKeys();
      try {
        // 将数据传递给接口
        devicePermission({
          DeviceId: myResult.value,
          DepartmentId: keys?.checked
        })
        setModalProps({ confirmLoading: true });
        closeModal();
        emit('success');
      } finally {
        setModalProps({ confirmLoading: false });
      }
    }
    return { treeData, treeRef, checkData, checkedMenu, myResult, myDepartMent, registerModal, onSelectChange, handleSubmit, handleSelect };
  },
});
</script>

<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="选择部门" @ok="handleSubmit">
    <BasicTree :checkStrictly="true" ref="treeRef" :checkedKeys="checkedMenu" title="部门列表" toolbar checkable search
      treeWrapperClassName="h-[calc(100%-35px)] overflow-auto" :clickRowToExpand="false" :treeData="treeData"
      :fieldNames="{ key: 'Id', title: 'Name' }" @check="handleSelect" />
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, toRaw, unref } from 'vue';
import { BasicModal, useModalInner } from '@/components/Modal';
import { BasicTree, TreeItem, TreeActionType } from '@/components/Tree/index';
// import { getReginList } from '@/api/demo/region';
// import { DeviceIdDepartMent } from '@/api/demo/system';
import { getDeptDrop } from '@/api/demo/system';
import { useMessage } from '@/hooks/web/useMessage';
import { devicePermission } from '@/api/demo/region';
export default defineComponent({
  name: 'AccountModal',
  components: { BasicModal, BasicTree },
  emits: ['success', 'register', 'select'],
  setup(_, { emit }) {
    const treeRef = ref<Nullable<TreeActionType>>(null);
    const myResult = ref();
    const myDepartMent = ref();
    const { createMessage } = useMessage();
    const treeData = ref<TreeItem[]>([]);
    const checkData = ref('');
    const checkedMenu = ref<Array<string | number>>([]);
    const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
      // 清除数据
      checkedMenu.value=[];
      myResult.value = toRaw(data.DeviceId);
      // 接口调用错误
      // const { TreeSelect } = await getDeptDrop();
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
        await devicePermission({
          DeviceId: myResult.value,
          DepartmentId: keys?.checked
        }).then((res) => {
          //  操作成功
          res==0?createMessage.info('操作成功'):'';
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

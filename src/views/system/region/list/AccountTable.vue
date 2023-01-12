<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="选择可控设备的成员分组" @ok="handleSubmit">
    <BasicTree :checkStrictly="true" title="部门列表" toolbar checkable search
      treeWrapperClassName="h-[calc(100%-35px)] overflow-auto" :clickRowToExpand="false" :treeData="treeData"
      :fieldNames="{ key: 'Id', title: 'Name' }" @check="handleSelect" />
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref, computed, unref, onMounted } from 'vue';
import { useMessage } from '@/hooks/web/useMessage';
import { BasicModal, useModalInner } from '@/components/Modal';
// import { BasicTree, TreeItem, TreeActionType } from '@/components/Tree';
import { BasicTree, TreeItem, TreeActionType } from '@/components/Tree/index';
import { getDeptDrop } from '@/api/demo/system';
export default defineComponent({
  name: 'AccountModal',
  components: { BasicModal, BasicTree },
  emits: ['success', 'register', 'select'],
  setup(_, { emit }) {
    // const isUpdate = ref(true);
    const treeRef = ref<Nullable<TreeActionType>>(null);
    const treeData = ref<TreeItem[]>([]);
    const {
      createConfirm
    } = useMessage();
    const checkData = ref('');
    const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    });
    async function fetch() {
      const { TreeSelect } = await getDeptDrop();
      treeData.value = TreeSelect;
    }

    function onSelectChange() {

    }
    function handleSelect(keys) {
      checkData.value = keys.checked;
      // keys.checked.length > 1 ? createConfirm({
      //   iconType: 'info',
      //   title: '提示',
      //   content: '只能选择一项',
      // }) : ''

    }
    async function handleSubmit() {
      try {
        // 将数据传递给接口
        setModalProps({ confirmLoading: true });
        closeModal();
        emit('success', checkData.value);
      } finally {
        setModalProps({ confirmLoading: false });
      }
    }
    onMounted(() => {
      fetch();
    });
    return { treeData, treeRef, checkData, registerModal, onSelectChange, handleSubmit, handleSelect };
  },
});
</script>

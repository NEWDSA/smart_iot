<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="选择需要调入的分组" @ok="handleSubmit">
    <BasicTree :checkStrictly="true" title="部门列表" toolbar checkable search
      treeWrapperClassName="h-[calc(100%-35px)] overflow-auto" :clickRowToExpand="false" :treeData="treeData"
      :fieldNames="{ key: 'DeptId', title: 'DeptName' }" @check="handleSelect" />
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useMessage } from '@/hooks/web/useMessage';
import { BasicModal, useModalInner } from '@/components/Modal';
// import { BasicTree, TreeItem, TreeActionType } from '@/components/Tree';
import { BasicTree, TreeItem, TreeActionType } from '@/components/Tree/index';
import { getDeptList, BulkDept } from '@/api/demo/system';

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
    const user = ref();
    const checkData = ref('');
    const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
      user.value = data.user;
    });
    async function fetch() {
      treeData.value = (await getDeptList()) as unknown as TreeItem[];

      // (await getTree()).setSelectedKeys([]);
      // 组装后端数据
      function listToTreeSimple(data) {
        const res: any = [];
        data.List.forEach((item) => {
          const parent = data.List.find((node) => node.DeptId === item.ParentId);
          if (parent) {

            parent.children = parent.children || [];
            parent.children.push(item);
          } else {
            // * 根节点
            res.push(item);
          }
        });
        return res;
      }
      let datas = listToTreeSimple(treeData.value);
      treeData.value = datas;
      return treeData

    }

    function onSelectChange() {

    }
    function handleSelect(keys) {
      checkData.value = keys.checked;
      keys.checked.length > 1 ? createConfirm({
        iconType: 'info',
        title: '提示',
        content: '只能选择一项',
      }) : ''
    }
    async function handleSubmit() {
      try {
        // 将数据传递给接口
        await BulkDept({
          UserIds: user.value,
          DeptId: Number(checkData.value)
        })
        setModalProps({ confirmLoading: true });
        closeModal();
        emit('success');
      } finally {
        setModalProps({ confirmLoading: false });
      }
    }
    onMounted(() => {
      fetch();
    });
    return { treeData, treeRef, checkData, user, registerModal, onSelectChange, handleSubmit, handleSelect };
  },
});
</script>

<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicTree title="部门列表" toolbar checkable search treeWrapperClassName="h-[calc(100%-35px)] overflow-auto"
      :clickRowToExpand="false" :treeData="treeData" :fieldNames="{ key: 'DeptId', title: 'DeptName' }"
      @select="handleSelect" />
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref, computed, unref,onMounted } from 'vue';
import { BasicModal, useModalInner } from '@/components/Modal';
import { BasicTree, TreeItem } from '@/components/Tree';
import { getDeptList } from '@/api/demo/system';
export default defineComponent({
  name: 'AccountModal',
  components: { BasicModal, BasicTree },
  emits: ['success', 'register','select'],
  setup(_, { emit }) {
    const isUpdate = ref(true);
    const treeData = ref<TreeItem[]>([]);
    const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
      // setModalProps({ confirmLoading: false });
      // isUpdate.value = !!data?.isUpdate;
      // if (unref(isUpdate)) {
      //   rowId.value = data.record.id;
      // }
    });
    async function fetch() {
      treeData.value = (await getDeptList()) as unknown as TreeItem[];
      // 组装后端数据
      function listToTreeSimple(data) {
        const res: any = [];
        data.forEach((item) => {
          const parent = data.find((node) => node.DeptId === item.ParentId);
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
      emit('select', keys[0]);
    }
    const getTitle = computed(() => (!unref(isUpdate) ? '新增账号' : '编辑账号'));

    async function handleSubmit() {
      try {

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
    return { registerModal, getTitle,treeData, onSelectChange, handleSubmit,handleSelect };
  },
});
</script>

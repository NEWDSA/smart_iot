<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" showFooter :title="getTitle" width="500px" @ok="handleSubmit">
    <!-- <BasicForm @register="registerForm">
      <template #menu="{ model, field }"> -->
    <BasicTree v-model:value="model[field]" :treeData="treeData" :fieldNames="{ title: 'Name', key: 'Id' }" checkable
      toolbar title="菜单分配" />
    <!-- </template>
    </BasicForm> -->
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, ref, computed, unref } from 'vue';
import { BasicForm, useForm } from '@/components/Form/index';
import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
import { BasicTree, TreeItem } from '@/components/Tree';

import { getMenTree, CreateRole, ModifiRole } from '@/api/demo/system';

export default defineComponent({
  name: 'RoleDrawer',
  components: { BasicDrawer, BasicForm, BasicTree },
  emits: ['success', 'register'],
  setup(_, { emit }) {
    const isUpdate = ref(true);
    // const rowId = ref('');
    const treeData = ref<TreeItem[]>([]);

    const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
      setDrawerProps({ confirmLoading: false });
      // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告
      if (unref(treeData).length === 0) {
        const {TreeSelect}=await getMenTree();
  
        treeData.value = (TreeSelect) as any as TreeItem[];

      }

    });



    const getTitle = '管理快捷入口'

    async function handleSubmit() {
      try {
        const values = await validate();
        setDrawerProps({ confirmLoading: true });
        closeDrawer();
        !unref(isUpdate) ? await CreateRole(values) : await ModifiRole({ ...values, MenuIds: values.menu })
        console.log('测试123')
        emit('success');

      } finally {
        setDrawerProps({ confirmLoading: false });
      }
    }

    return {
      registerDrawer,
      getTitle,
      handleSubmit,
      treeData,
    };
  },
});
</script>

<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" showFooter :title="getTitle" width="500px" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #menu="{ model, field }">
        <BasicTree :treeData="treeData" :fieldNames="{ title: 'Name', key: 'Id' }" :defaultExpandAll="ExpandAll"
          checkable :checkedKeys="checkedKey" :selectedKeys="selectedKeys" @check="halkcheckedKey" />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, ref, computed, unref } from 'vue';
import { BasicForm, useForm } from '@/components/Form/index';
// import { formSchema } from './role.data';
import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
import { BasicTree, TreeItem } from '@/components/Tree';

import { shortCutTreeSelectMenu,AddshortCutMenu } from '@/api/sys/user';

export default defineComponent({
  name: 'RoleDrawer',
  components: { BasicDrawer, BasicForm, BasicTree },
  emits: ['success', 'register'],
  setup(_, { emit }) {
    const isUpdate = ref(true);
    // const rowId = ref('');
    const treeData = ref<TreeItem[]>([]);
    const checkedKey = ref()
    const selectedKeys = ref()
    const ExpandAll = ref(false)
    const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
      labelWidth: 90,
      baseColProps: { span: 24 },
      schemas: [{
        label: ' ',
        field: 'MenuIds',
        slot: 'menu',
        component: 'Input',
      },],
      showActionButtonGroup: false,
    });
    function halkcheckedKey(keys) {
      // console.log(keys)
      checkedKey.value = keys;
    }
    const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
      resetFields();
      // console.log(1)
      setDrawerProps({ confirmLoading: false });
      // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告
      // if (unref(treeData).length === 0) {
        const { TreeSelect,checkedKeys } = await shortCutTreeSelectMenu();

        treeData.value = (TreeSelect) as any as TreeItem[];

        checkedKey.value = checkedKeys
        
        console.log(checkedKey)

        ExpandAll.value = true

      // }
      isUpdate.value = !!data?.isUpdate;

      if (unref(isUpdate)) {
        // rowId.value = data.record.RoleId;
        setFieldsValue({
          ...data.record,
        });
      }
    });

    const getTitle = '管理快捷入口';

    async function handleSubmit() {
      try {
        const values = await validate();
        console.log(checkedKey.value, 'value')
        // debugger;
        setDrawerProps({ confirmLoading: true });
        values.MenuIds = checkedKey.value
        
        await AddshortCutMenu(values)
        closeDrawer();
        // !unref(isUpdate) ? await CreateRole(values) : await ModifiRole({ ...values, MenuIds: values.menu })
        emit('success');

      } finally {
        setDrawerProps({ confirmLoading: false });
      }
    }

    return {
      registerDrawer,
      registerForm,
      getTitle,
      handleSubmit,
      treeData,
      checkedKey,
      halkcheckedKey,
      selectedKeys,
      ExpandAll
    };
  },
});
</script>

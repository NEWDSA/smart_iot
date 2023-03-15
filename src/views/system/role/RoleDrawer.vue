<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" showFooter :title="getTitle" width="500px" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #menuIds="{ model, field }">
        <BasicTree v-model:value="model[field]" :checkedKeys="checkedMenu" :checkStrictly="true"   :treeData="treeData"
          :fieldNames="{ title: 'Name', key: 'Id' }" checkable toolbar title="菜单分配" />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, ref, computed, unref } from 'vue';
import { BasicForm, useForm } from '@/components/Form/index';
import { formSchema } from './role.data';
import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
import { BasicTree, TreeItem } from '@/components/Tree';

import { geRoletMenTree, CreateRole, ModifiRole } from '@/api/demo/system';

export default defineComponent({
  name: 'RoleDrawer',
  components: { BasicDrawer, BasicForm, BasicTree },
  emits: ['success', 'register'],
  setup(_, { emit }) {
    const isUpdate = ref(true);
    // const rowId = ref('');
    const treeData = ref<TreeItem[]>([]);
    const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
      labelWidth: 90,
      baseColProps: { span: 24 },
      schemas: formSchema,
      showActionButtonGroup: false,
    });
    const checkedMenu = ref<Array<string | number>>([]);
    const RoleId=ref('');
    const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
      resetFields();
      setDrawerProps({ confirmLoading: false });
      // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告

      isUpdate.value = !!data?.isUpdate;

      if (unref(isUpdate)) {
        setFieldsValue({
          ...data.record,
        });
        // if (unref(treeData).length === 0) {
          RoleId.value=data.record.RoleId;
          const { TreeSelect, checkedKeys
          } = await geRoletMenTree(data.record.RoleId);
          checkedMenu.value=checkedKeys;
          treeData.value = (TreeSelect) as any as TreeItem[];


        // }
        console.log(checkedKeys,'!!!升级!!!');


      }
    });

    const getTitle = computed(() => (!unref(isUpdate) ? '新增角色' : '编辑角色'));

    async function handleSubmit() {
      try {
        const values = await validate();
        console.log(values.menu
, 'value')
        debugger;
        setDrawerProps({ confirmLoading: true });
        closeDrawer();
        !unref(isUpdate) ? await CreateRole(values) : await ModifiRole({ ...values,RoleId:RoleId.value,menuIds: values.menuIds.checked })
        emit('success');

      } finally {
        setDrawerProps({ confirmLoading: false });
      }
    }

    return {
      registerDrawer,
      registerForm,
      getTitle,
      RoleId,
      checkedMenu,
      handleSubmit,
      treeData,
    };
  },
});
</script>

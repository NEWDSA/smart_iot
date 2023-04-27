<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" showFooter :title="getTitle" width="500px" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #menuIds="{ model, field }">
        <BasicTree :checkStrictly="checkStrictly" v-model:value="model[field]" @check="onCheck" :checkedKeys="checkedMenu"
          :treeData="treeData" :fieldNames="{ title: 'Name', key: 'Id' }" checkable title="菜单分配" />
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
import { Loading, useLoading } from '@/components/Loading';
import { geRoletMenTree, CreateRole, ModifiRole, getMenTree } from '@/api/demo/system';
import { object } from 'vue-types';
export default defineComponent({
  name: 'RoleDrawer',
  components: { BasicDrawer, BasicForm, BasicTree },
  emits: ['success', 'register'],
  setup(_, { emit }) {
    const [openFullLoading, closeFullLoading] = useLoading({
      tip: '数据处理中...',
    });
    const isUpdate = ref(true);
    const isTrue = ref(true);
    const check = ref();
    const checkStrictly = ref(false);
    const treeData = ref<TreeItem[]>([]);
    const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
      labelWidth: 90,
      baseColProps: { span: 24 },
      schemas: formSchema,
      showActionButtonGroup: false,
    });
    const checkedMenu = ref<Array<string | number>>([]);
    const RoleId = ref('');
    const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
      resetFields();
      setDrawerProps({ confirmLoading: false });
      // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告
      isUpdate.value = !!data?.isUpdate;
      if (unref(isUpdate)) {
        setFieldsValue({
          ...data.record,
        });
        RoleId.value = data.record.RoleId;
        const { TreeSelect, checkedKeys
        } = await geRoletMenTree(data.record.RoleId);
        checkedMenu.value = checkedKeys;
        treeData.value = (TreeSelect) as any as TreeItem[];
        checkStrictly.value = true;
      } else {
        const { TreeSelect
        } = await getMenTree();
        checkStrictly.value = false;
        // checkedMenu.value = checkedKeys;
        treeData.value = (TreeSelect) as any as TreeItem[];
        console.log(treeData.value, 'rererere')
      }


    });
    const getTitle = computed(() => (!unref(isUpdate) ? '新增角色' : '编辑角色'));
    async function handleSubmit() {
      try {
        const values = await validate();
        setDrawerProps({ confirmLoading: true });
        closeDrawer();

        openFullLoading();
        values.RoleSort === null || values.RoleSort === undefined ? values.RoleSort = 0 : values.RoleSort;
        var menuIdsSelect;
        if (values.menuIds?.checked) {
          menuIdsSelect = Object.keys(values.menuIds?.checked).map((key) => {
            console.log(key, '....key...')
            return parseInt(values.menuIds.checked[key], 10);
          })
        } else {
          menuIdsSelect = Object.keys(values.menuIds).map((key) => {
            return parseInt(values.menuIds.checked[key], 10);
          })
        }
        // var intArr = Object.keys(obj).map(function (key) {
        //   return parseInt(obj[key], 10);
        // });

        // console.log(intArr); // [1, 2, 3, 4, 5]

        !unref(isUpdate) ? await CreateRole(values) : await ModifiRole({ ...values, RoleId: RoleId.value, menuIds: menuIdsSelect })
        // 显示一个加载中 并延迟3s
        setTimeout(() => {
          closeFullLoading();
          emit('success');
        }, 2000)


      } finally {

        setDrawerProps({ confirmLoading: false });
      }
    }
    function onCheck(checkedKeys, e) {
      console.log(checkedKeys, '...checkedKeys...');
      // check.value = [...checkedKeys, ...e.halfCheckedKeys];
      // console.log(checkedKeys, e.halfCheckedKeys, '...checked...');
      // console.log(check.value, '...check.value....')


    }
    return {
      registerDrawer,
      registerForm,
      onCheck,
      checkStrictly,
      getTitle,
      RoleId,
      isTrue,
      check,
      checkedMenu,
      handleSubmit,
      treeData,
    };
  },
});
</script>

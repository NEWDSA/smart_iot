<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref, computed, unref } from 'vue';
import { BasicModal, useModalInner } from '@/components/Modal';
import { BasicForm, useForm } from '@/components/Form/index';
import { formSchema } from './menu.data';
import { useMessage } from '@/hooks/web/useMessage';
import { getMenTree, editMenuList, createMenuList } from '@/api/demo/system';
export default defineComponent({
  name: 'DeptModal',
  components: { BasicModal, BasicForm },
  emits: ['success', 'register'],
  setup(_, { emit }) {
    const isUpdate = ref(true);
    const MenuId = ref('');
    const MenuType = ref();
    const isShow = ref(false);
    const isModifiy = ref(0);
    const DeptId = ref('');
    const { createMessage } = useMessage();
    const [registerForm, { resetFields, setFieldsValue, updateSchema, validate, getFieldsValue }] = useForm({
      labelWidth: 100,
      schemas: formSchema,
      showActionButtonGroup: false,
      baseColProps: { lg: 12, md: 24 }
    });

    const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
      resetFields();
      setModalProps({ confirmLoading: false });
      isUpdate.value = !!data?.isUpdate;
      if (unref(isUpdate)) {
        setFieldsValue({
          ...data.record,
        });
        MenuType.value = data.record.MenuType;
        if (data.record.ParentId == 0) {
          setFieldsValue({
            ParentId: data.ParentId,
          });
        }
        MenuId.value = data.record.MenuId;
      }
      const treeData = await getMenTree().then((res) => {
        return res.TreeSelect
      });
      updateSchema({
        field: 'ParentId',
        componentProps: { treeData },
      });
    });
    const getTitle = computed(() => (!unref(isUpdate) ? '新增菜单' : MenuType.value == 'M' ? '编辑目录' : MenuType.value == 'F' ? '编辑按钮' : MenuType.value == 'C' ? '编辑菜单' : ''));
    async function handleSubmit() {
      try {
        const values = await validate();
        setModalProps({ confirmLoading: true });
        if (!values.ParentId) {
          values.ParentId = 0;
        }
        values.OrderNum === undefined || values.OrderNum === null ? values.OrderNum = 0 : values.OrderNum;
        // !unref(isUpdate) ? await createMenuList(values) : await editMenuList({ ...values, MenuId: MenuId.value })
        // switch
        switch (!unref(isUpdate)) {
          case false:
            await editMenuList({ ...values, MenuId: MenuId.value }).then((res) => {
              res.Code == '200' ? createMessage.info('操作成功') : '';
            })

            break;
          case true:
            const { Code, Msg } = await createMenuList(values)
            Code == '200' ? createMessage.info('操作成功') : '';
            break;
        }
        closeModal();
        emit('success');
      } finally {
        setModalProps({ confirmLoading: false });
      }
    }

    return { registerModal, registerForm, getTitle, isShow, isUpdate, MenuType, isModifiy, DeptId, handleSubmit };
  },
});
</script>

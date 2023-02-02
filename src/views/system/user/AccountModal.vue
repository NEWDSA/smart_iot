<template>
  <BasicModal  v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref, computed, unref } from 'vue';
import { BasicModal, useModalInner } from '@/components/Modal';
import { BasicForm, useForm } from '@/components/Form/index';
import { accountFormSchema } from './account.data';
import { getAllRoleList,getDeptDrop, modifiAccountList, createAccountList } from '@/api/demo/system';
export default defineComponent({
  name: 'AccountModal',
  components: { BasicModal, BasicForm },
  emits: ['success', 'register'],
  setup(_, { emit }) {
    const isUpdate = ref(true);
    const UserId = ref('');
    const [registerForm, { setFieldsValue, updateSchema, resetFields, validate }] = useForm({
      labelWidth: 100,
      baseColProps: { lg: 12, md: 12 },
      schemas: accountFormSchema,
      showActionButtonGroup: false
    });
    const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
      resetFields();
      setModalProps({ confirmLoading: false });
      isUpdate.value = !!data?.isUpdate;

      if (unref(isUpdate)) {
        UserId.value = data.record.UserId;
        setFieldsValue({
          ...data.record,
        });
      }
      const treeData = await getDeptDrop().then((res) => {
        return res.TreeSelect
      });
      updateSchema({
        field: 'DeptId',
        componentProps: { treeData },
      });
      // 调用接口对角色进行处理
      const {List} =await getAllRoleList()
      updateSchema({
        field:'RoleId',
        componentProps:{treeData:List}
      })
    });
    const getTitle = computed(() => (!unref(isUpdate) ? '新增账号' : '编辑账号'));
    async function handleSubmit() {
      try {
        const values = await validate();
        setModalProps({ confirmLoading: true });
        !unref(isUpdate) ? await createAccountList(values) : await modifiAccountList({ ...values,UserId: UserId.value})
        closeModal();
        emit('success', { isUpdate: unref(isUpdate), values: { ...values, UserId: UserId.value } });
      } finally {
        setModalProps({ confirmLoading: false });
      }
    }
    return { registerModal, registerForm, getTitle, handleSubmit };
  },
});
</script>

<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #customEmail="{ model, field }">
        <Tooltip :title="model[field]" placement="bottom">
          <a-input v-model:value="model[field]" placeholder="请输入邮箱" />
        </Tooltip>
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref, computed, unref } from 'vue';
import { Tooltip } from 'ant-design-vue';
import { BasicModal, useModalInner } from '@/components/Modal';
import { BasicForm, useForm } from '@/components/Form/index';
import { accountFormSchema } from './account.data';
import { useMessage } from '@/hooks/web/useMessage';
import { getUserRole, getDeptDrop, modifiAccountList, createAccountList } from '@/api/demo/system';
export default defineComponent({
  name: 'AccountModal',
  components: { BasicModal, BasicForm, Tooltip },
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
    const { createMessage } = useMessage();
    const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
      resetFields();
      setModalProps({ confirmLoading: false });
      isUpdate.value = !!data?.isUpdate;
      if (unref(isUpdate)) {
        UserId.value = data.record.UserId;
        setFieldsValue({
          ...data.record,
        });
        const result = await getUserRole(
          data.record.UserId
        )
        var resd = result.Roles.filter((item) => {
          if (item.RoleId == Number(result.RoleIds.join(','))) {
            return item
          }
        })
        updateSchema({
          field: 'RoleIds',
          defaultValue: result.RoleIds,
          required: true,
          componentProps: { treeData: result.Roles }
        })
        const treeData = await getDeptDrop().then((res) => {
          return res.TreeSelect
        });
        updateSchema({
          field: 'DeptId',
          required: true,
          defaultValue: data.record.DeptId,
          componentProps: { treeData }
        });

      } else {
        // 修改错误
        // const { List } = await getAllRoleList()
        const result = await getUserRole(
          0
        )
        updateSchema({
          field: 'RoleIds',
          required: true,
          componentProps: { treeData: result.Roles }
        })
        // setFieldsValue({ DeptId: data.DeptId });
        const treeData = await getDeptDrop().then((res) => {
          return res.TreeSelect
        });
        await updateSchema({
          field: 'DeptId',
          required: true,
          componentProps: { treeData },
        });

      }


    });
    const getTitle = computed(() => (!unref(isUpdate) ? '添加用户' : '编辑用户'));
    async function handleSubmit() {
      try {
        const values = await validate();
        setModalProps({ confirmLoading: true });
        // 判断是为数组
        if (values.RoleIds instanceof Array) { Object.assign(values, { RoleIds: values.RoleIds }); }
        else {
          Object.assign(values, { RoleIds: [Number(values.RoleIds)] })
        }
        // !unref(isUpdate) ? await createAccountList(values) : await modifiAccountList({ ...values, UserId: UserId.value })
        // 
        switch (!unref(isUpdate)) {
          case false:
            await modifiAccountList({ ...values, UserId: UserId.value }).then((res) => {
              res.Code == '200' ? createMessage.info('操作成功') : '';
            })
            break;
          case true:
            const { Code, Msg } = await createAccountList(values)
            Code == '200' ? createMessage.info('操作成功') : '';
            break;
        }
        closeModal();
        emit('success');
      } finally {
        setModalProps({ confirmLoading: false });
      }
    }
    return { registerModal, registerForm, getTitle, handleSubmit };
  },
});
</script>
<style lang="less" scoped>
.ant-form-item-control-input {
  &:hover {
    background: red;
  }
}
</style>

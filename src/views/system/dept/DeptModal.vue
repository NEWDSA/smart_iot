<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref, computed, unref } from 'vue';
import { BasicModal, useModalInner } from '@/components/Modal';
import { BasicForm, useForm } from '@/components/Form/index';
import { formSchema } from './dept.data';

import { getDeptDrop, createDept, modifiDept } from '@/api/demo/system';
export default defineComponent({
  name: 'DeptModal',
  components: { BasicModal, BasicForm },
  emits: ['success', 'register'],
  setup(_, { emit }) {
    const isUpdate = ref(true);
    const deptId = ref('');
    const isShow = ref(false);
    const isModifiy = ref(0);
    const DeptId = ref('');

    const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
      labelWidth: 100,
      baseColProps: { span: 24 },
      schemas: formSchema,
      showActionButtonGroup: false,
    });

    const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
      resetFields();
      setModalProps({ confirmLoading: false });
      isUpdate.value = !!data?.isUpdate;
      isModifiy.value = data?.isModifiy;
      DeptId.value = data.record?.DeptId;
      if (unref(isUpdate)) {
        setFieldsValue({
          ...data.record,
        });
      }
      const treeData = await getDeptDrop().then((res) => {
        return res.TreeSelect
      });
      updateSchema({
        field: 'ParentId',
        componentProps: { treeData },
        ifShow: !unref(isUpdate) ? false : !data.record ? true : data.record.ParentId == 0  ? false : true
      });

    });
    const getTitle = computed(() => (!unref(isUpdate) ? '创建部门' : '修改部门') && unref(isModifiy) == 1 ? '添加部门' : !unref(isUpdate) ? '创建部门' : '修改部门');

    async function handleSubmit() {
      try {
        const values = await validate();
        values.OrderNum===undefined || values.OrderNum===null ?values.OrderNum=0:values.OrderNum;
        unref(isModifiy) == 1 ? Object.assign(values, { ParentId:DeptId.value}) : ''
        setModalProps({ confirmLoading: true });
        !unref(isUpdate) ? await createDept(values) : await modifiDept({ ...values, deptId: DeptId.value })
        console.log(values);
        closeModal();
        emit('success');
      } finally {
        setModalProps({ confirmLoading: false });
      }
    }

    return { registerModal, registerForm, getTitle, isShow, isUpdate, isModifiy, DeptId, handleSubmit };
  },
});
</script>

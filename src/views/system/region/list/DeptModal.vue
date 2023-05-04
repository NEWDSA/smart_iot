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
import { useMessage } from '@/hooks/web/useMessage';
import { addRegion, getReginList, editRegion } from '@/api/demo/region';
export default defineComponent({
  name: 'DeptModal',
  components: { BasicModal, BasicForm },
  emits: ['success', 'register'],
  setup(_, { emit }) {
    const isUpdate = ref(true);
    const isModifiy = ref(0);
    const RegionId = ref('');
    const ParentId = ref('');
    const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
      labelWidth: 100,
      baseColProps: { span: 24 },
      schemas: formSchema,
      showActionButtonGroup: false,
    });
    const { createMessage } = useMessage();
    const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
      resetFields();
      setModalProps({ confirmLoading: false });
      isUpdate.value = !!data?.isUpdate;
      isModifiy.value = data?.isModifiy;
      ParentId.value = data.record?.ParentId;
      RegionId.value = data.record?.RegionId;
      if (unref(isUpdate)) {
        RegionId.value = data.record.RegionId;
        setFieldsValue({
          ...data.record,
        });
      }
      const { Detail } = await getReginList()
      updateSchema({
        field: 'ParentId',
        componentProps: { treeData: Detail },
        ifShow: unref(isUpdate)
      });
    });

    const getTitle = computed(() => (!unref(isUpdate) ? '创建区域' : '修改区域') && unref(isModifiy) == 1 ? '添加区域' : !unref(isUpdate) ? '创建区域' : '修改区域');


    async function handleSubmit() {
      try {
        const values = await validate();

        unref(isModifiy) == 1 ? Object.assign(values, { ParentId: RegionId.value }) : ''
        setModalProps({ confirmLoading: true });
        // await createDept(values)
        !unref(isUpdate) ? await addRegion(values).then((res) => {
          res == 0 ? createMessage.info('操作成功') : createMessage.info('操作失败');
        }) : await editRegion({ ...values, RegionId: RegionId.value }).then((res) => {
          res == 0 ? createMessage.info('操作成功') : createMessage.info('操作失败');
        })

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

<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="重置密码" @ok="handleSubmit">
    <BasicForm :schemas="schemas" @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref, computed, unref } from 'vue';
import { BasicModal, useModalInner } from '@/components/Modal';
import { BasicForm, useForm, FormSchema } from '@/components/Form/index';
import { updatePwd } from '@/api/demo/system';
const schemas: FormSchema[] = [
  {
    field: 'NewPassword',
    component: 'Input',
    label: '重置密码',
    componentProps: {
      placeholder: '请输入新的密码'
    }
  }
]
export default defineComponent({
  props: ['data'],
  name: 'pwdModal',
  components: { BasicModal, BasicForm },
  emits: ['success', 'register'],
  setup(props, { emit }) {
    console.log(props?.data, '???')
    const isUpdate = ref(true);
    const isModifiy = ref(0);
    const RegionId = ref('');
    const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
      labelWidth: 100,
      baseColProps: { span: 24 },
      showActionButtonGroup: false,
    });

    const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
      resetFields();
      setModalProps({ confirmLoading: false });
      isUpdate.value = !!data?.isUpdate;
      isModifiy.value = data?.isModifiy;
      if (unref(isUpdate)) {
        RegionId.value = data.record.RegionId;
        setFieldsValue({
          ...data.record,
        });
      }
    });

    async function handleSubmit() {
      try {
        const values = await validate();
        const value2 = props.data;
        const param = (({UserId
        }) => ({ UserId}))(value2)
        setModalProps({ confirmLoading: true });
        // 调用接口进行密码修改
        Object.assign(values, param);
        updatePwd({
          ...values
        })
        closeModal();
        emit('success');
      } finally {
        setModalProps({ confirmLoading: false });
      }
    }

    return { registerModal, registerForm, schemas, handleSubmit };
  },
});
</script>

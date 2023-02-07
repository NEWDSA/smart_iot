<template>
    <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
        <BasicForm @register="registerForm" />
    </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref, computed, unref } from 'vue';
import { BasicModal, useModalInner } from '@/components/Modal';
import { BasicForm, useForm } from '@/components/Form/index';
import { formSchema } from './visitorData';

//   import { getDeptDrop, createDept, modifiDept } from '@/api/demo/system';
import { visitorTypeSaveApi,visitorTypeEditApi } from '@/api/visitor/visitor';
export default defineComponent({
    name: 'DeptModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
        const isUpdate = ref(true);
        const VisitorTypeId = ref('');
        const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
            labelWidth: 100,

            baseColProps: { span: 24 },
            schemas: formSchema,
            showActionButtonGroup: false,
        });

        const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
            resetFields();
            setModalProps({ confirmLoading: false });
            isUpdate.value = !!data?.isUpdate;
            if (unref(isUpdate)) {
                VisitorTypeId.value = data.record.VisitorTypeId;
                console.log(VisitorTypeId , '...data.record...')
                console.log(data.record)
                setFieldsValue({
                    ...data.record,
                });
            }
        });

        const getTitle = computed(() => (!unref(isUpdate) ? '添加访客类型' : '编辑访客类型'));

        async function handleSubmit() {
            try {
                const values = await validate();
                setModalProps({ confirmLoading: true });
                // await createDept(values)
                console.log(values);
                !unref(isUpdate) ? await visitorTypeSaveApi(values) : await visitorTypeEditApi({ ...values, VisitorTypeId: VisitorTypeId.value })
                console.log(values);
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

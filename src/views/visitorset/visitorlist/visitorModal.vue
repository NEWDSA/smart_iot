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
  import { getAccountList } from '@/api/demo/system';
  import { visitorTypeListApi,visitorEditApi,visitorSaveApi } from '@/api/visitor/visitor'
export default defineComponent({
    name: 'DeptModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
        const isUpdate = ref(true);
        const VisitorId = ref('');
        const disabled = ref(false);
        const [registerForm, { resetFields, setFieldsValue, validate,updateSchema }] = useForm({
            labelWidth: 100,
            disabled:disabled,
            baseColProps: { span: 24 },
            schemas: formSchema,
            showActionButtonGroup: false,
        });

        const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
            resetFields();
            setModalProps({ confirmLoading: false });
            isUpdate.value = !!data?.isUpdate;
            if (unref(isUpdate)) {
                VisitorId.value = data.obj.VisitorId;
                console.log(VisitorId, '...data.obj...')
                console.log(data.obj)
                disabled.value = data.disabled
                setFieldsValue({
                    ...data.obj,
                });
            }

            const VisitorData = await getAccountList().then((res) => {
                console.log(res)
                return res.List
            });
            const VisitorTypeData = await visitorTypeListApi().then((res) => {
                console.log(res)
                return res.Detail
            });

            updateSchema({
                field: 'ReceptionId',
                componentProps: { options :VisitorData },
            });
            updateSchema({
                field: 'VisitorTypeId',
                componentProps: { options :VisitorTypeData },
            });
            
        });

        const getTitle = computed(() => (!unref(isUpdate) ? '新增访客类型' : disabled.value ? '访客详情' : '编辑访客类型'));

        async function handleSubmit() {
            try {
                const values = await validate();
                setModalProps({ confirmLoading: true });
                // await createDept(values)
                // console.log(values)
                console.log(values);//Date.parse(data)

                values.AppointTime = {}
                values.AppointTime.seconds = Number(Date.parse(values.yuyueTime)/1000)

                values.VisitorPhone = Number(values.VisitorPhone)

                delete values.yuyueTime

                !unref(isUpdate) ? await visitorSaveApi(values) : await visitorEditApi({ ...values, VisitorId: VisitorId.value })
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

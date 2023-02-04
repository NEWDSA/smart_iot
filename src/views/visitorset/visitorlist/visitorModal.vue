<template>
    <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
        <BasicForm @register="registerForm">
            <template #formFooter>
                <div class="flex items-center justify-center">
                    <div class="pr-2" style="width: 100px;text-align: right;"><span class="text-red-600">*</span> 正面照片</div>
                    <div style="width: calc(100% - 100px);">
                        <CropperAvatar :uploadApi="uploadApi" :value="showAvatar" @change="cropperOk" />
                    </div>

                </div>
            </template>
        </BasicForm>
    </BasicModal>

    <!-- <CollapseContainer title="头像裁剪"> -->
    <!-- </CollapseContainer> -->

</template>
<script lang="ts">
import { defineComponent, ref, computed, unref } from 'vue';
import { BasicModal, useModalInner } from '@/components/Modal';
import { BasicForm, useForm } from '@/components/Form/index';
import { formSchema } from './visitorData';
import { getAccountList } from '@/api/demo/system';
import { visitorTypeListApi, visitorEditApi, visitorSaveApi, seeFileApi } from '@/api/visitor/visitor';
import { uploadApi } from '@/api/sys/upload';
import { CropperAvatar } from '@/components/Cropper';
import { message } from 'ant-design-vue';

export default defineComponent({
    name: 'DeptModal',
    components: { BasicModal, BasicForm, CropperAvatar },
    emits: ['success', 'register'],
    setup(_, { emit }) {
        const url = ref('http://192.168.8.180:4000/api/v1/')
        const showAvatar = ref('');
        const avatar = ref('');
        const isUpdate = ref(true);
        const VisitorId = ref('');
        const disabled = ref(false);
        const [registerForm, { resetFields, setFieldsValue, validate, updateSchema }] = useForm({
            labelWidth: 100,
            disabled: disabled,
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
                if(data.obj.Photo){
                    avatar.value = data.obj.Photo
                    showAvatar.value = url.value+data.obj.Photo
                }else{
                    avatar.value = '/src/assets/images/motou.png'
                }

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
                componentProps: { options: VisitorData },
            });
            updateSchema({
                field: 'VisitorTypeId',
                componentProps: { options: VisitorTypeData },
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
                values.AppointTime.seconds = Number(Date.parse(values.yuyueTime) / 1000)

                values.VisitorPhone = Number(values.VisitorPhone)

                if (avatar.value != '/src/assets/images/motou.png') {
                    values.Photo = avatar.value
                }else{
                    message.warn('请上传正面照片。')
                    return;
                }

                delete values.yuyueTime

                !unref(isUpdate) ? await visitorSaveApi(values) : await visitorEditApi({ ...values, VisitorId: VisitorId.value })
                console.log(values);
                closeModal();
                emit('success');
            } finally {
                setModalProps({ confirmLoading: false });
            }
        }

        function cropperOk(source: any, data: any) {
            showAvatar.value = url.value + source.data.Data
            avatar.value = source.data.Data
            // console.log(source, data)
        }

        return { registerModal, registerForm, getTitle, handleSubmit, uploadApi: uploadApi as any, avatar, cropperOk, url,showAvatar };
    },
});
</script>

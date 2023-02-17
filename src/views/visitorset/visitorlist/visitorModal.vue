<template>
    <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit" :showOkBtn="!disabled? true : false">
        <BasicForm @register="registerForm" >
            <template #formFooter>
                <div class="flex items-center justify-center">
                    <div class="pr-2" style="width: 100px;text-align: right;"><span class="text-red-600" v-if="!disabled">*</span> 正面照片
                    </div>
                    <div style="width: calc(100% - 100px);" v-if="!disabled">
                        <CropperAvatar :uploadApi="uploadApi" :value="showAvatar" @change="cropperOk"
                            :showIcon="false" />
                    </div>
                    <div style="width: calc(100% - 100px);" v-else>
                        <img :src="showAvatar" alt="正面照片" style="width: 200px;height: 200px;border-radius: 50%;">
                        <!-- <CropperAvatar :uploadApi="uploadApi" :value="showAvatar" @change="cropperOk" /> -->
                    </div>

                </div>
            </template>
        </BasicForm>
    </BasicModal>

    <!-- <CollapseContainer title="头像裁剪"> -->
    <!-- </CollapseContainer> -->

</template>
<script lang="ts">
import { defineComponent, ref, computed, unref, reactive } from 'vue';
import { BasicModal, useModalInner } from '@/components/Modal';
import { BasicForm, useForm } from '@/components/Form/index';
import { formSchema } from './visitorData';
import { getAccountList } from '@/api/demo/system';
import { visitorTypeListApi, visitorEditApi, visitorSaveApi, seeFileApi } from '@/api/visitor/visitor';
import { uploadApi } from '@/api/sys/upload';
import { CropperAvatar } from '@/components/Cropper';
import { message } from 'ant-design-vue';
import { fileUrl } from '@/utils/file/fileUrl'
import headerImg from '@/assets/images/motou.png'

export default defineComponent({
    name: 'DeptModal',
    components: { BasicModal, BasicForm, CropperAvatar },
    emits: ['success', 'register'],
    setup(_, { emit }) {
        const url = ref('')
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

        const obj = reactive({
            PageNum: 1,
            PageSize: 10
        })

        const VisitorData: any = ref([])


        const getCompanyList = async (type) => {
            if (!type) {
                obj.PageNum = 1
                VisitorData.value = []
            } else {
                obj.PageNum += 1
            }
            await getAccountList(obj).then(res => {
                for (let i = 0; i < res.List.length; i++) {
                    VisitorData.value.push(res.List[i])
                }

                console.log(res.PageSize * res.PageNum, res.Total)
                console.log(VisitorData.value)
                if ((res.PageSize * res.PageNum) < res.Total) {
                    getCompanyList('next')
                    // return VisitorData.value
                }
            })
        }

        const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
            showAvatar.value = ''
            await getCompanyList();
            resetFields();
            setModalProps({ confirmLoading: false });
            isUpdate.value = !!data?.isUpdate;
            if (unref(isUpdate)) {
                VisitorId.value = data.obj.VisitorId;
                console.log(VisitorId, '...data.obj...')
                console.log(data.obj)

                disabled.value = data.disabled

                if (data.obj.Photo) {
                    avatar.value = data.obj.Photo
                    showAvatar.value = fileUrl() + data.obj.Photo
                } else {
                    avatar.value = '/src/assets/images/motou.png'
                    showAvatar.value = headerImg
                }

                if (disabled.value) {
                    updateSchema({ field: 'VisitorTypeId', required: false });
                    updateSchema({ field: 'VisitorName', required: false });
                    updateSchema({ field: 'VisitorPhone', required: false });
                    updateSchema({ field: 'VisitorTypeId', required: false });
                    updateSchema({ field: 'ReceptionId', required: false });
                    updateSchema({ field: 'yuyueTime', required: false });
                    updateSchema({ field: 'Company', required: false });
                    updateSchema({ field: 'LicensePlate', required: false });
                    updateSchema({ field: 'Reason', required: false });
                    updateSchema({ field: 'Status', required: false });
                }else{
                    updateSchema({ field: 'VisitorTypeId', required: true });
                    updateSchema({ field: 'VisitorName', required: true });
                    updateSchema({ field: 'VisitorPhone', required: true });
                    updateSchema({ field: 'VisitorTypeId', required: true });
                    updateSchema({ field: 'ReceptionId', required: true });
                    updateSchema({ field: 'yuyueTime', required: true });
                    updateSchema({ field: 'Company', required: true });
                    updateSchema({ field: 'LicensePlate', required: false });
                    updateSchema({ field: 'Reason', required: true });
                    updateSchema({ field: 'Status', required: true });
                }

                setFieldsValue({
                    ...data.obj,
                });
            } else {
                avatar.value = '/src/assets/images/motou.png'
                showAvatar.value = headerImg

                disabled.value = false

                console.log(avatar.value)
            }

            const VisitorTypeData = await visitorTypeListApi().then((res) => {
                console.log(res)
                return res.Detail
            });

            updateSchema({
                field: 'ReceptionId',
                componentProps: { options: VisitorData.value },
            });
            updateSchema({
                field: 'VisitorTypeId',
                componentProps: { options: VisitorTypeData },
            });


        });

        const getTitle = computed(() => (!unref(isUpdate) ? '添加预约访客' : disabled.value ? '访客详情' : '编辑访客'));

        async function handleSubmit() {
            try {
                if(disabled.value){
                    closeModal();
                    return;
                }

                const values = await validate();
                setModalProps({ confirmLoading: true });
                // await createDept(values)
                // console.log(values)
                console.log(values);//Date.parse(data)

                values.AppointTime = {}
                values.AppointTime.seconds = Number(Date.parse(values.yuyueTime) / 1000)

                values.VisitorPhone = Number(values.VisitorPhone)

                // console.log(avatar.value, 'avatar.value')
                if (avatar.value != '/src/assets/images/motou.png') {
                    values.Photo = avatar.value
                } else {
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
            showAvatar.value = fileUrl() + source.data.Data
            avatar.value = source.data.Data
            // console.log(source, data)
        }

        return { registerModal, registerForm, getTitle, handleSubmit, uploadApi: uploadApi as any, avatar, cropperOk, url, showAvatar, disabled };
    },
});
</script>

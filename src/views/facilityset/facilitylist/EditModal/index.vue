<template>
    <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
        <BasicForm @register="registerForm" />
    </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref, computed, unref } from 'vue';
import { BasicModal, useModalInner } from '@/components/Modal';
import { BasicForm, useForm } from '@/components/Form/index';
import { formSchema } from './fromData';
import { facilityTypeTreeApi, facilityRegionListApi, facilityEditApi } from '@/api/facility/facility'
import { message } from 'ant-design-vue';
export default defineComponent({
    name: 'DeptModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
        const DeviceId = ref('');
        const disabled = ref(false);
        const [registerForm, { resetFields, setFieldsValue, validate, updateSchema }] = useForm({
            labelWidth: 150,
            disabled: disabled,
            baseColProps: { span: 18 },
            schemas: formSchema,
            showActionButtonGroup: false,
        });

        const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
            resetFields();
            setModalProps({ confirmLoading: false });
            console.log(data, '...data.record...')

            DeviceId.value = data.record.DeviceId;

            console.log(data.record)
            setFieldsValue({
                ...data.record,
            });

            const TypeTree = await facilityTypeTreeApi().then((res) => {
                const TreeTableData: any = []
                for (let i = 0; i < res.length; i++) {
                    TreeTableData.push(res[i].SelfData)

                    if (res[i].SonData) {
                        TreeTableData[i].children = []
                        // console.log('res[i].SonData',res[i].SonData)
                        for (let y = 0; y < res[i].SonData.length; y++) {
                            TreeTableData[i].children.push(res[i].SonData[y].SelfData)

                            if (res[i].SonData[y].SonData) {
                                // console.log(res[i].SonData[y].SonData)
                                TreeTableData[i].children[y].children = []
                                // console.log('res[i].SonData',TreeTableData)
                                for (let x = 0; x < res[i].SonData[y].SonData.length; x++) {
                                    TreeTableData[i].children[y].children.push(res[i].SonData[y].SonData[x].SelfData)
                                }
                            }
                        }
                    }

                }
                return TreeTableData

            });

            const RegionList = await facilityRegionListApi().then((res) => {

                console.log(res)
                return res.Detail
            });

            updateSchema({
                field: 'TypeId',
                componentProps: { treeData: TypeTree },
            });
            updateSchema({
                field: 'RegionId',
                componentProps: { treeData: RegionList },
            });

        });

        const getTitle = '编辑设备';

        async function handleSubmit() {
            try {
                const values = await validate();
                // setModalProps({ confirmLoading: true });
                // await createDept(values)
                // console.log(values)
                console.log('values', values);//Date.parse(data)

                var m = values.LongitudeLatitude.split(",");

                if(m.length!=2){
                    message.warn('经纬度输入格式有误,例：39.908349,116.404412')
                    return;
                }

                const Latitude = Number(m[0]);
                const Longitude = Number(m[1]);

                console.log(Latitude,Longitude,'tyodf')

                if (typeof Latitude != "number" || isNaN(Latitude)){
                    message.warn('纬度输入格式有误')
                    return;
                }
                if (typeof Longitude != "number" || isNaN(Longitude)){
                    message.warn('经度输入格式有误')
                    return;
                }
                values.Latitude = String(Latitude)
                values.Longitude = String(Longitude)
                // delete values.CreatedTime

                await facilityEditApi({ ...values, DeviceId: DeviceId.value })
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

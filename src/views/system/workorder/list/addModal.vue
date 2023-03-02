<template>
    <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit" width="666px">
        <BasicForm @register="registerForm">
            <template #formFooter>
                <div class="ant-col ant-col-18">
                    <div class="ant-row ant-form-item items-center">
                        <div class="pr-2" style="width: 150px;text-align: right;"><span class="text-red-600">*</span>
                            工单受理组
                        </div>
                        <div class="flex items-center" style="width: calc(100% - 150px);">
                            <Select v-model:value="SZvalue" mode="tags" style="width: 80%" :token-separators="[',']"
                                placeholder="请选择工单受理组" disabled></Select>
                            <div class="pl-4" style="width:20%">
                                <Button @click="showSZu()">
                                    <Icon icon="ic:outline-plus"></Icon>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ant-col ant-col-18">
                    <div class="ant-row ant-form-item items-center">
                        <div class="pr-2" style="width: 150px;text-align: right;"><span class="text-red-600">*</span>
                            工单受理人
                        </div>
                        <div class="flex items-center" style="width: calc(100% - 150px);">
                            <Select v-model:value="SRvalueW" mode="tags" style="width: 80%" :token-separators="[',']"
                                placeholder="请选择工单受理人" disabled></Select>
                            <div class="pl-4" style="width:20%">
                                <Button @click="showSRen()">
                                    <Icon icon="ic:outline-plus"></Icon>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ant-col ant-col-18">
                    <div class="ant-row ant-form-item items-center">
                        <div class="pr-2" style="width: 150px;text-align: right;"><span class="text-red-600">*</span>
                            工单关注人
                        </div>
                        <div class="flex items-center" style="width: calc(100% - 150px);">
                            <Select v-model:value="SGRvalueW" mode="tags" style="width: 80%" :token-separators="[',']"
                                placeholder="请选择工单关注人" disabled></Select>
                            <div class="pl-4" style="width:20%">
                                <Button @click="showGRen()">
                                    <Icon icon="ic:outline-plus"></Icon>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ant-col ant-col-18">
                    <div class="ant-row ant-form-item items-center">
                        <div class="pr-2" style="width: 150px;text-align: right;"><span class="text-red-600">*</span>
                            关联设备
                        </div>
                        <div class="flex items-center" style="width: calc(100% - 150px);">
                            <Select v-model:value="DevicevalueW" mode="tags" style="width: 80%" :token-separators="[',']"
                                placeholder="请选择设备" disabled></Select>
                            <div class="pl-4" style="width:20%">
                                <Button @click="showDevice()">
                                    <Icon icon="ic:outline-plus"></Icon>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- <div class="ant-col flex items-center justify-center">
                    <div class="pr-2" style="width: 100px;text-align: right;"><span class="text-red-600">*</span> 正面照片
                    </div>
                    <div style="width: calc(100% - 100px);">
                        <Select v-model:value="value" mode="tags" style="width: 100%" :token-separators="[',']"
                            placeholder="Automatic tokenization" :options="options"></Select>
                    </div>

                     <Select :options="options"></Select> -->
                <!-- </div>  -->
            </template>
        </BasicForm>
    </BasicModal>
    <!-- 部门页面 -->
    <AccountTable @register="registerMyTable" @success="bulkPermission" />
    <!-- 用户列表 -->
    <userDrawer @register="registerMyTablee" @success="bulkPermissionn" />
    <!-- 设备 -->
    <deviceModal @register="registerMyTableee" @success="bulkPermissionnn"/>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { BasicModal, useModalInner, useModal } from '@/components/Modal';
import { BasicForm, useForm } from '@/components/Form/index';
import { getwarnFormConfig } from './workData';
import { TaskTicketSaveApi } from '@/api/sys/workorder'
import { message, Select, Button } from 'ant-design-vue';
import Icon from '@/components/Icon';

import AccountTable from '@/views/system/region/device/AccountTable.vue';
import userDrawer from '@/views/facilityset/facilitylist/components/userDrawer.vue';
import deviceModal from './deviceModal.vue';
const [registerMyTable, { openModal }] = useModal();

const [registerMyTablee, { openModal: openModal2 }] = useModal();
const [registerMyTableee, { openModal: openModal3 }] = useModal();

export default defineComponent({
    name: 'DeptModal',
    components: { BasicModal, BasicForm, AccountTable, Select, Button, Icon, userDrawer,deviceModal  },
    emits: ['success', 'register'],
    setup(_, { emit }) {
        const warnId = ref('');
        const disabled = ref(false);
        const SZvalue = ref([]);
        const SRvalue = ref([]);
        const SGRvalue = ref([]);

        const SZvalueW = ref([]);
        const SRvalueW = ref([]);
        const SGRvalueW = ref([]);

        const Devicevalue = ref([]);
        const DevicevalueW = ref([]);

        const [registerForm, { resetFields, setFieldsValue, validate, updateSchema }] = useForm({
            labelWidth: 150,
            disabled: disabled,
            baseColProps: { span: 18 },
            schemas: getwarnFormConfig,
            showActionButtonGroup: false,
        });


        
        const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
            resetFields();
            // 重置
            SZvalue.value = [];
            SRvalue.value = [];
            SGRvalue.value = [];
            Devicevalue.value = [];
            SZvalueW.value = [];
            SRvalueW.value = [];
            SGRvalueW.value = [];
            DevicevalueW.value = [];
            setModalProps({ confirmLoading: false });
            console.log(data, '...data.record...')

            warnId.value = data?.record.Id;

            console.log(data.record)
            setFieldsValue({
                ...data.record,
            });

        });

        const options = ref([
            {
                value: 'a1',
                label: 'a1',
            },
        ]);

        const getTitle = '设备上报';

        async function handleSubmit() {
            try {
                const values = await validate();
                // setModalProps({ confirmLoading: true });
                // await createDept(values)
                // console.log(values)
                console.log('values', values);//Date.parse(data)

                if (SZvalue.value.length && SRvalue.value.length && SGRvalue.value.length && Devicevalue.value.length) {
                    values.AcceptanceGroup = SZvalue.value
                    values.Acceptor = SRvalue.value
                    values.Followers = SGRvalue.value
                    values.RelevantDevice = Devicevalue.value[0]
                } else {
                    if (SZvalue.value.length < 1) {
                        message.warn('请选择工单受理组')
                    }

                    if (SRvalue.value.length < 1) {
                        message.warn('请选择工单受理人')
                    }

                    if (SGRvalue.value.length < 1) {
                        message.warn('请选择工单关注人')
                    }

                    if (Devicevalue.value.length == 0) {
                        message.warn('请选择关联设备')
                    }

                    return
                }


                await TaskTicketSaveApi({ ...values }).then(res=>{
                    // if(res?.code == 0){
                        message.success('新建成功')
                        closeModal();
                        emit('success');
                    // }else{
                    //     message.error(res)
                    // }
                })
                // console.log(values);
                // if(res)
                
            } finally {
                setModalProps({ confirmLoading: false });
            }
        }

        function showSZu() {
            openModal(true,{
                data:SZvalue.value
            });
        }

        function showSRen() {
            openModal2(true, {
                type: 'S',
                data:SRvalue.value
            });
        }

        function showGRen() {
            openModal2(true, {
                type: 'G',
                data:SGRvalue.value
            });
        }

        function showDevice(){
            openModal3(true, {
                data:Devicevalue.value
            });
        }

        function bulkPermission(data, dataW) {
            SZvalue.value = data
            SZvalueW.value = dataW
            // console.log(data)
        }

        function bulkPermissionn(data, type, dataW) {
            console.log(data,dataW)
            if (type == 'S') {
                SRvalue.value = data
                SRvalueW.value = dataW

            } else {
                SGRvalue.value = data
                SGRvalueW.value = dataW
            }
        }

        function bulkPermissionnn(data,dataW){
            console.log(dataW,'Devicevalue')
            Devicevalue.value = data
            DevicevalueW.value = dataW
        }


        function tree(data) {
            // debugger;
            console.log('data', data)
            let Array = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i].SonData) {

                    let obj = data[i].SelfData
                    obj.children = tree(data[i].SonData)

                    Array.push(obj)
                } else {
                    let obj = data[i].SelfData
                    Array.push(obj)
                }
                // Array.push(obj)
            }
            return Array;

        }

        return {
            registerModal, registerForm, getTitle, handleSubmit, tree, registerMyTable, bulkPermission, options, SZvalue, SRvalue,
            SGRvalue, showSZu, showSRen, showGRen, registerMyTablee, bulkPermissionn, SZvalueW, SRvalueW, SGRvalueW,warnId,showDevice,
            registerMyTableee,bulkPermissionnn,Devicevalue,DevicevalueW
        };
    },
});
</script>

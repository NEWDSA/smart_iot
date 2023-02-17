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
                            <Select v-model:value="SRvalue" mode="tags" style="width: 80%" :token-separators="[',']"
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
                            <Select v-model:value="SGRvalue" mode="tags" style="width: 80%" :token-separators="[',']"
                                placeholder="请选择工单关注人" disabled></Select>
                            <div class="pl-4" style="width:20%">
                                <Button @click="showGRen()">
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
</template>

<script lang="ts">
import { defineComponent, ref, computed, unref } from 'vue';
import { BasicModal, useModalInner, useModal } from '@/components/Modal';
import { BasicForm, useForm } from '@/components/Form/index';
import { getwarnFormConfig } from './tableData';
import { facilityAlertNoticeApi } from '@/api/facility/facility'
import { getDeptDrop, createDept, modifiDept } from '@/api/demo/system';
import { message, Select, Button } from 'ant-design-vue';
import Icon from '@/components/Icon';

import AccountTable from '@/views/system/region/device/AccountTable.vue';
import userDrawer from './userDrawer.vue';
const [registerMyTable, { openModal }] = useModal();

const [registerMyTablee, { openModal: openModal2 }] = useModal();

export default defineComponent({
    name: 'DeptModal',
    components: { BasicModal, BasicForm, AccountTable, Select, Button, Icon, userDrawer },
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
            SZvalueW.value = [];
            SRvalueW.value = [];
            SGRvalueW.value = [];
            
            setModalProps({ confirmLoading: false });
            console.log(data, '...data.record...')

            warnId.value = data.record.Id;

            console.log(data.record)
            setFieldsValue({
                ...data.record,
            });


            // updateSchema({
            //     field: 'AcceptanceGroup',
            //     componentProps: {
            //         treeData: treeData, dropdownVisibleChange: (e: any) => {
            //             console.log(e);
            //         },
            //     },

            //     // ifShow: !unref(isUpdate) ? false : !data.record ? true : data.record.ParentId == 0 ? false : true
            // });

            // updateSchema({
            //     field: 'Acceptor',
            //     componentProps: {
            //         treeData: treeData,
            //         onFocus: () => {
            //             blur()
            //             openModal(true);

            //         },
            //     },
            // });

            // updateSchema({
            //     field: 'TypeId',
            //     componentProps: { treeData: TypeTree },
            // });
            // updateSchema({
            //     field: 'RegionId',
            //     componentProps: { treeData: RegionList },
            // });

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

                if (SZvalue.value.length && SRvalue.value.length && SGRvalue.value.length) {
                    values.AcceptanceGroup = SZvalue.value
                    values.Acceptor = SRvalue.value
                    values.Followers = SGRvalue.value
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

                    return
                }

                const obj = {
                    Id:warnId.value,
                    TaskTicket:values
                }


                await facilityAlertNoticeApi({ ...obj })
                console.log(values);
                closeModal();
                emit('success');
            } finally {
                setModalProps({ confirmLoading: false });
            }
        }

        function showSZu() {
            openModal(true);
        }

        function showSRen() {
            openModal2(true, {
                type: 'S'
            });
        }

        function showGRen() {
            openModal2(true, {
                type: 'G'
            });
        }


        function bulkPermission(data, dataW) {
            SZvalue.value = data
            SZvalueW.value = dataW
            // console.log(data)
        }

        function bulkPermissionn(data, type, dataW) {
            if (type == 'S') {
                SRvalue.value = data
                SRvalueW.value = dataW

            } else {
                SGRvalue.value = data
                SGRvalueW.value = dataW
            }

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
            SGRvalue, showSZu, showSRen, showGRen, registerMyTablee, bulkPermissionn, SZvalueW, SRvalueW, SGRvalueW,warnId
        };
    },
});
</script>

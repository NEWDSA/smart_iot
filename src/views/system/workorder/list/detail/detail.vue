<template>
    <PageWrapper contentBackground>
        <!--   
                  <template #footer>
                    <a-tabs default-active-key="1">
                      <a-tab-pane key="1" tab="详情" />
                      <a-tab-pane key="2" tab="规则" />
                    </a-tabs>
                  </template> -->

        <div class="pt-4 m-4 desc-wrap flex ">
            <div class="w-7/10" style="border-right:1px solid #eeeeee;">
                <!-- <div > </div> -->
                <div class="px-5" v-if="editStatus == false">
                    <div class="flex items-center justify-between">
                        <div class="text-xl">{{ WorkorderDetail?.Title }}</div>
                        <Icon icon="heroicons:pencil-square-solid" :size="20" @click="editStatusFun" v-if="WorkorderDetail?.Status == 1"/>
                    </div>
                    <div class="text-gray-400 mt-5">{{ WorkorderDetail?.Content }}</div>
                </div>

                <div class="px-5" v-if="editStatus == true">
                    <div class="flex items-center justify-between">
                        <Input v-model:value="EWorkorderDetailTitle" />
                    </div>

                    <div class="flex items-center mt-5">
                        <div class="text-gray-400 w-7/10">
                            <Input v-model:value="EWorkorderDetailContent" />
                        </div>

                        <a-button type="primary" size="small" class="ml-4" @click="hadlkOkInput">
                            保 存
                        </a-button>
                        <a-button type="primary" size="small" class="ml-4" @click="hadlkCancelInput" ghost>
                            取 消
                        </a-button>
                    </div>

                </div>

                <div class="my-4" >
                    <a-button type="primary" size="large" @click="openmodal" :disabled="WorkorderDetail?.Status == 2">
                        转 交
                    </a-button>
                    <a-button type="primary" size="large" class="ml-4" @click="workOver" v-if="WorkorderDetail?.Status == 1">
                        完 结
                    </a-button>
                    <a-button type="primary" size="large" class="ml-4" v-if="WorkorderDetail?.Status == 2">
                        重 开 工 单
                    </a-button>
                </div>

                <div style="width:95%" >
                    <a-textarea v-model:value="value" placeholder="在这里输入你的跟进结果" :rows="4" :disabled="WorkorderDetail?.Status == 2"/>
                </div>

                <!-- <div>
                    <Upload v-model:file-list="fileList" name="file" :multiple="true"
                        action="http://192.168.8.208:4000/api/v1/file/upload" @change="handleChange">
                        <a-button>
                            <Icon icon="uil:upload" size="14px"></Icon>
                            上传附件
                        </a-button>
                    </Upload>
                </div> -->

                <div class="my-4">
                    <a-button type="primary" size="large" @click="hadlkOk" :disabled="WorkorderDetail?.Status == 2">
                        保 存
                    </a-button>
                    <a-button type="primary" size="large" class="ml-4" @click="hadlkCancel" ghost :disabled="WorkorderDetail?.Status == 2">
                        取 消
                    </a-button>
                </div>
                <div class="">
                    <Tabs default-active-key="1">
                        <TabPane key="1" tab="工单进度记录" />
                    </Tabs>
                    <Collapse v-model:activeKey="activeKey">
                        <CollapsePanel expandIconPosition="right" v-for="(item, index) in CollList" :key="index">
                            <template #header>
                                <div class="flex items-center flex-wrap">
                                    <Tag color="green">{{ item.Remarks }}</Tag>
                                    <div class="mx-5"></div>
                                    <div class="mr-5 text-gray-500">{{ checkTime(item.Basic?.CreatedAt.seconds) }}</div>
                                    <div class="mr-5 text-gray-500">{{ item.Remarks }}</div>
                                </div>
                            </template>

                            <div>
                                {{ item.Operation }}
                            </div>
                        </CollapsePanel>

                    </Collapse>
                </div>
            </div>

            <!-- 右侧边栏 -->
            <div class="w-3/10" style="border-left:1px solid #eeeeee;">
                <div class="">
                    <Tabs default-active-key="1" centered>
                        <template v-for="item in achieveList" :key="item.key">
                            <TabPane :tab="item.name">
                                <component :is="item.component" :workOrderId="WorkorderId" :DeviceId="DeviceId"
                                    :ref="(el) => childRef(el, item.key)" />
                            </TabPane>
                        </template>
                    </Tabs>
                </div>
            </div>

        </div>



        <Modal v-model:visible="sceneStopModal" title="系统提示" :footer="null">
            <div class="p-5">
                <div class="text-base">确认完结工单？</div>
                <div class="flex mt-3" style="justify-content: end;">
                    <div class="text-white rounded px-4 py-1 mr-2 bg-blue-600" @click="CheckOK">确认</div>
                    <div class="text-blue-600 rounded px-4 py-1" style="border:1px solid rgba(37, 99, 235,1)"
                        @click="CheckCancel">
                        取消</div>
                </div>
            </div>

        </Modal>
        <!-- 用户列表 -->
        <userDrawer @register="registerMyTable" @success="bulkPermission" />

    </PageWrapper>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { BasicTable } from '@/components/Table';
import { PageWrapper } from '@/components/Page';
import { TaskTicketInfoApi, TaskTicketCloseApi, TaskTicketProgressSaveApi, TaskTicketProgressListApi, TaskTicketHandOverApi, TaskTicketEditApi } from '@/api/sys/workorder';
import { Divider, Card, Empty, Descriptions, Steps, Tabs, Collapse, CollapsePanel, Tag, Upload, message, Modal, Input } from 'ant-design-vue';
import { useModal } from '@/components/Modal';
import { useRoute } from 'vue-router';
import Icon from '@/components/Icon';
import { achieveList } from './data'
import deviceDetail from './tab/deviceDetail.vue'
import log from './tab/log.vue'
import workorderDetail from './tab/workorderDetail.vue'
import userDrawer from './userDrawer.vue';
// import { refundTimeTableSchema, refundTimeTableData } from './data';
export default defineComponent({
    components: {
        Collapse,
        CollapsePanel,
        Tag,
        BasicTable,
        PageWrapper,
        [Divider.name]: Divider,
        [Card.name]: Card,
        Empty,
        [Descriptions.name]: Descriptions,
        [Descriptions.Item.name]: Descriptions.Item,
        [Steps.name]: Steps,
        [Steps.Step.name]: Steps.Step,
        Tabs,
        TabPane: Tabs.TabPane,
        Icon,
        deviceDetail,
        log,
        Upload,
        Modal,
        workorderDetail,
        userDrawer,
        Input
    },
    setup() {
        const route = useRoute();
        const WorkorderId = ref()
        const DeviceId = ref(null)

        const EWorkorderDetailTitle = ref('')
        const EWorkorderDetailContent = ref('')
        const editStatus = ref(false)
        const WorkorderDetail: any = ref()

        const value = ref('')
        const CollList: any = ref([])

        const activeKey = ref([]);
        const sceneStopModal = ref(false)

        const annoListRef: any = ref([])
        const childRef = (el: any) => {
            annoListRef.value.push(el)
        }

        interface FileItem {
            uid: string;
            name?: string;
            status?: string;
            response?: string;
            url?: string;
        }
        interface FileInfo {
            file: FileItem;
            fileList: FileItem[];
        }

        const [registerMyTable, { openModal }] = useModal();
        function bulkPermission(data, value) {
            var obj: any = {
                TaskTicketId: Number(WorkorderId.value),
                Transferor: data,
                Detail: {
                    Operation: value
                }
            }

            TaskTicketHandOverApi(obj).then(res => {
                if (res == 0) {
                    message.success('转交成功')
                } else {
                    message.error(res)
                }
            })
        }

        onMounted(() => {
            // 此处可以得到用户ID
            const facilityId = ref(route.params?.id);
            WorkorderId.value = facilityId.value
            getTaskTicketInfo(facilityId.value);
            getTaskTicketProgressList(facilityId.value)
        })

        function editStatusFun() {

            EWorkorderDetailTitle.value = WorkorderDetail.value.Title
            EWorkorderDetailContent.value = WorkorderDetail.value.Content
            editStatus.value = !editStatus.value

        }

        function getTaskTicketInfo(id) {
            TaskTicketInfoApi({ "Id": id }).then(res => {
                WorkorderDetail.value = res[0]

                DeviceId.value = res[0]?.RelevantDevice
            })
        }

        function getTaskTicketProgressList(id) {
            TaskTicketProgressListApi({ "TaskTicketId": id }).then(res => {
                CollList.value = res
            })
        }
        // const [registerTimeTable] = useTable({
        //   title: '退货进度',
        //   columns: refundTimeTableSchema,
        //   pagination: false,
        //   dataSource: refundTimeTableData,
        //   showIndexColumn: false,
        //   scroll: { y: 300 },
        // });

        const fileList = ref([]);
        const handleChange = (info: FileInfo) => {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} 文件上传成功`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 文件上传失败`);
            }
        };

        function workOver() {
            sceneStopModal.value = true
        }

        function hadlkOk() {
            var obj: any = {
                TaskTicketId: Number(WorkorderId.value),
                Detail: {}
            }
            if (fileList.value.length > 0) {
                obj.Detail.Files = fileList.value
            }
            if (value.value != '') {
                obj.Detail.Operation = value.value
            } else {
                message.error('请输入内容')
                return;
            }
            TaskTicketProgressSaveApi(obj).then(res => {
                if (res == 0) {
                    var Id = WorkorderId.value
                    WorkorderId.value = ''
                    WorkorderId.value = Id
                    message.success('操作成功')
                    value.value = ''
                    childHandle()
                    getTaskTicketProgressList(Number(WorkorderId.value))
                } else {
                    message.error('操作失败')
                }
            })
            // console.log(fileList.value)
        }
        function hadlkCancel() {
            value.value = ''
        }

        function openmodal() {
            openModal(true)
        }

        function CheckOK() {
            var obj: any = {
                TaskTicketId: Number(WorkorderId.value),
                Detail: {}
            }
            if (fileList.value.length > 0) {
                obj.Detail.Files = fileList.value
            }
            if (value.value != '') {
                obj.Detail.Operation = value.value
            }

            TaskTicketCloseApi(obj).then(res => {
                if (res == 0) {
                    var Id = WorkorderId.value
                    // WorkorderId.value = 33
                    WorkorderId.value = Id
                    message.success('操作成功')
                    sceneStopModal.value = false
                    childHandle()
                    getTaskTicketProgressList(Number(WorkorderId.value))
                    WorkorderDetail.value.Status = 2
                } else {
                    message.error('操作失败')
                }
            })
        }
        function CheckCancel() {
            sceneStopModal.value = false
        }

        function hadlkOkInput() {
            var obj = {
                Detail: {
                    Id: Number(WorkorderId.value),
                    Title: EWorkorderDetailTitle.value,
                    Content: EWorkorderDetailContent.value
                }
            }

            TaskTicketEditApi(obj).then(res => {
                EWorkorderDetailTitle.value = ''
                EWorkorderDetailContent.value = ''
                editStatus.value = false
                getTaskTicketInfo(Number(WorkorderId.value))
            })
        }
        function hadlkCancelInput() {
            EWorkorderDetailTitle.value = ''
            EWorkorderDetailContent.value = ''
            editStatus.value = false
        }

        function checkTime(time) {
            // console.log('record',record)
            var date = new Date(time * 1000);
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';

            var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
            var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
            var s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
            var strDate = Y + M + D + h + m + s;
            return strDate
        }

        const childHandle = () => {
            annoListRef.value.map(item => {
                console.log(item) // 打印效果在下方
                item.getTaskTicketInfo('我是传递的数据')
            })
        }

        return {
            getTaskTicketInfo,
            WorkorderId,
            DeviceId,
            WorkorderDetail,
            value,
            activeKey,
            sceneStopModal,
            // text,
            fileList,
            workOver,
            hadlkOk,
            hadlkCancel,
            handleChange,
            achieveList,
            CheckOK,
            CheckCancel,
            getTaskTicketProgressList,
            checkTime,
            CollList,
            childRef,
            childHandle,
            registerMyTable,
            bulkPermission,
            openmodal,
            editStatus,
            hadlkOkInput,
            hadlkCancelInput,
            EWorkorderDetailTitle,
            EWorkorderDetailContent,
            editStatusFun
            //   registerTimeTable,
        };
    },
});
</script>
  
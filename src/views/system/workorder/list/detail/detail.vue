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
                        <Icon icon="heroicons:pencil-square-solid" :size="20" @click="editStatusFun"
                            v-if="WorkorderDetail?.Status == 1 && mySelf == 2" />
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
                            保存
                        </a-button>
                        <a-button type="primary" size="small" class="ml-4" @click="hadlkCancelInput" ghost>
                            取消
                        </a-button>
                    </div>

                </div>

                <div class="my-4">

                </div>

                <div style="width:95%">
                  <!-- 2是完结 1 不是自己 -->
                    <a-textarea v-model:value="value" placeholder="在这里输入你的跟进结果" :rows="4"
                        :disabled="WorkorderDetail?.Status == 2 || mySelf == 1" />
                </div>

                <div class="mt-5">
                    <Upload v-model:file-list="fileList" name="file" :multiple="true"
                        :disabled="WorkorderDetail?.Status == 2 || mySelf == 1" :action="fileUrl() + 'file/upload'"
                        @change="handleChange" :maxCount="9" :headers="{
                            'Authorization': getToken()
                        }">
                        <a-button :disabled="WorkorderDetail?.Status == 2 || mySelf == 1">
                            <Icon icon="uil:upload" size="14px"></Icon>
                            上传附件
                        </a-button>
                    </Upload>
                </div>

                <div class="my-4">
                    <a-button type="primary" size="large" @click="hadlkOk"
                        :disabled="WorkorderDetail?.Status == 2 || mySelf == 1">
                        更新
                    </a-button>
                    <a-button type="primary" size="large" class="ml-4" @click="hadlkCancel" ghost
                        :disabled="WorkorderDetail?.Status == 2 || mySelf == 1">
                        取消
                    </a-button>
                    <a-button type="primary" size="large" class="ml-4" @click="openmodal"
                        v-if="WorkorderDetail?.Status == 1" :disabled="WorkorderDetail?.Status == 2 || mySelf == 1">
                        转交
                    </a-button>
                    <a-button type="primary" size="large" class="ml-4" @click="workOver" v-if="WorkorderDetail?.Status == 1"
                        :disabled="WorkorderDetail?.Status == 2 || mySelf == 1">
                        完结
                    </a-button>
                    <a-button type="primary" size="large" class="ml-4" @click="againOpen"
                        v-if="WorkorderDetail?.Status == 2" :disabled="WorkorderDetail?.Status == 1 || mySelf == 1">
                        重新受理
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
                                    <!-- <Tag color="green">{{ item.Status == 1 ? '新建工单进度' : item.Status == 2 ? '转交工单' :
                                        item.Status == 3 ? '工单完结' : '更新工单进度' }}</Tag> -->
                                    <Tag :color="item.Status == 1 ? 'blue' : item.Status == 2 ? 'orange' :
                                        item.Status == 3 ? 'green' : 'red'">{{ item.Status == 1 ? '创建' : item.Status ==
        2 ? '转交' :
        item.Status == 3 ? '完结' : '更新' }}</Tag>

                                    <div class="mx-5 font-bold"> {{ item.CreatorName }}</div>
                                    <div class="mr-5 text-gray-500">{{ checkTime(item.Basic?.CreatedAt.seconds) }}</div>
                                    <div class="mr-5 text-gray-500">{{ item.Remarks }}</div>
                                </div>
                            </template>

                            <div>
                                {{ item.Operation }}
                            </div>
                            <div v-if="item.Files?.length>0 &&item.Files[0] != ''">
                                <div class="mt-3 font-semibold">附件：</div>
                                <Upload v-model:file-list="item.FilesUrl" name="file"
                                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76" @change="handleChange">

                                    <template #itemRender="{ file, actions }">
                                        <Space>
                                            <span :style="file.status === 'error' ? 'color: red' : ''"
                                                class="font-semibold">{{ file.name
                                                }}</span>
                                            <a href="javascript:;" @click="actions.download" class="ml-5">下载</a>
                                            <!-- <a href="javascript:;" @click="actions.remove">delete</a> -->
                                        </Space>
                                    </template>
                                </Upload>
                            </div>
                        </CollapsePanel>

                    </Collapse>
                </div>
            </div>

            <!-- 右侧边栏 -->
            <div class="w-3/10" style="border-left:1px solid #eeeeee;">
                <Tabs default-active-key="1" centered @change="changeTab">
                    <template v-for="item in achieveList" :key="item.key">
                        <TabPane :tab="item.name">
                            <component :is="item.component" :workOrderId="Number(WorkorderId)" :DeviceId="Number(DeviceId)"
                                :workTitle="WorkorderDetail?.Title" :workContent="WorkorderDetail?.Content" :mySelf="mySelf"
                                :ref="(el) => childRef(el, item.key)" />
                        </TabPane>
                    </template>
                </Tabs>
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
import { defineComponent, ref, onMounted, watch } from 'vue';
import { BasicTable } from '@/components/Table';
import { PageWrapper } from '@/components/Page';
import { TaskTicketInfoApi, TaskTicketCloseApi, TaskTicketProgressSaveApi, TaskTicketProgressListApi, TaskTicketHandOverApi, TaskTicketEditApi, TaskTicketCopyApi, TaskTicketAuthApi } from '@/api/sys/workorder';
import { Divider, Card, Empty, Descriptions, Steps, Tabs, Collapse, CollapsePanel, Tag, Upload, message, Modal, Input } from 'ant-design-vue';
import { useModal } from '@/components/Modal';
import { useRoute } from 'vue-router';
import Icon from '@/components/Icon';
import { achieveList } from './data'
import deviceDetail from './tab/deviceDetail.vue'
import log from './tab/log.vue'
import workorderDetail from './tab/workorderDetail.vue'
import userDrawer from './userDrawer.vue';
import { useUserStore } from '@/store/modules/user'
import { fileUrl } from '@/utils/file/fileUrl'
import { getToken } from '@/utils/auth'
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
        const DeviceId = ref(1)
        const mySelf = ref(1)
        const EWorkorderDetailTitle = ref('')
        const EWorkorderDetailContent = ref('')
        const editStatus = ref(false)
        const WorkorderDetail: any = ref()

        const value = ref('')
        const CollList: any = ref([])

        const TabKey = ref('1');
        const activeKey = ref([]);
        const sceneStopModal = ref(false)

        const annoListRef: any = ref([])
        const annoListRefj: any = ref([])
        const annoListRefIndexj: any = ref([])
        const annoListRefIndex: any = ref([])
        const childRef = (el: any, key) => {
            annoListRefj.value.push(el)
            annoListRefIndexj.value.push(key)

        }

        watch(() => annoListRefj.value, (newValue, oldValue) => {
            annoListRef.value = unique(newValue)
            annoListRefIndex.value = unique(annoListRefIndexj.value)

        }, { deep: true }) // 开启深度监视才行

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

        const userStore = useUserStore()

        const [registerMyTable, { openModal }] = useModal();
        function bulkPermission(data, value) {
            var obj: any = {
                TaskTicketId: Number(WorkorderId.value),
                Transferor: data,
                Detail: {
                    Operation: value
                }
            }

            TaskTicketHandOverApi(obj, Number(WorkorderId.value)).then(res => {
                if (res == 0) {
                    message.success('转交成功')
                    getTaskTicketProgressList(Number(WorkorderId.value))
                } else {
                    message.error(res)
                }
            })
        }

        onMounted(() => {
            // 此处可以得到用户ID
            const facilityId = ref(route.params?.id);
            WorkorderId.value = facilityId.value
            getTaskTicketAuth(facilityId.value)
            getTaskTicketInfo(facilityId.value);
            getTaskTicketProgressList(facilityId.value)
        })

        function editStatusFun() {

            EWorkorderDetailTitle.value = WorkorderDetail.value.Title
            EWorkorderDetailContent.value = WorkorderDetail.value.Content
            editStatus.value = !editStatus.value

        }

        function getTaskTicketAuth(id) {
            TaskTicketAuthApi(id).then(res => {
                if (res == false) {
                    mySelf.value = 1
                } else {
                    mySelf.value = 2
                }
            })
        }

        function getTaskTicketInfo(id) {
            TaskTicketInfoApi({ "Id": id }).then(res => {
                WorkorderDetail.value = res[0]

                DeviceId.value = res[0]?.RelevantDevice

                const user: any = userStore.getUserInfo
                // console.log(user.user); console.log(res[0])
                // 判断是不是自己
                if (res[0].Acceptor) {
                    // console.log(res[0].Acceptor.indexOf(user.user.UserId), 'res[0].Acceptor.indexOf(user.user.UserId)res[0].Acceptor.indexOf(user.user.UserId)')
                    if (res[0].Acceptor.indexOf(user.user.UserId) > -1) {
                        mySelf.value = 2
                    }
                }
                // else if (res[0].AcceptanceGroup) {
                //     // console.log(res[0].Acceptor.indexOf(user.user.UserId), 'res[0].Acceptor.indexOf(user.user.UserId)res[0].Acceptor.indexOf(user.user.UserId)')
                //     if (res[0].AcceptanceGroup.indexOf(user.user.DeptId) > -1) {
                //         mySelf.value = 2
                //     }
                // }

            })
        }

        function getTaskTicketProgressList(id) {
            TaskTicketProgressListApi({ "TaskTicketId": id }).then(res => {
                CollList.value = res
                for (let i = 0, val; val = CollList.value[i++];) {
                    if (val.Files) {
                        // console.log(CollList.value[i].Files)
                        CollList.value[i - 1].FilesUrl = []
                        // $set( CollList.value[i], 'FilesUrl', [])
                        // CollList.value[i]['FilesUrl'] = []
                        console.log(CollList.value[i])
                        for (let y = 0, vall; vall = val.Files[y++];) {
                            var a = vall.split('/')
                            // console.log(a)
                            // message.error(a[2])
                            CollList.value[i - 1].FilesUrl.push({
                                uid: y,
                                name: a[2],
                                // status: 'done',
                                url: fileUrl() + vall
                                // thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ
                            })
                        }
                    }
                }
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
                obj.Detail.Files = []
                for (let i = 0, val; val = fileList.value[i++];) {
                    // console.log(val)
                    obj.Detail.Files.push(val.response.Data)
                }
            }
            if (value.value != '') {
                obj.Detail.Operation = value.value
            } else {
                message.error('请输入内容')
                return;
            }
            TaskTicketProgressSaveApi(obj, Number(WorkorderId.value)).then(res => {
                if (res == 0) {
                    var Id = WorkorderId.value
                    WorkorderId.value = ''
                    WorkorderId.value = Id
                    message.success('操作成功')
                    value.value = ''
                    fileList.value = []
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

            TaskTicketCloseApi(obj, Number(WorkorderId.value)).then(res => {
                if (res == 0) {
                    var Id = WorkorderId.value
                    // WorkorderId.value = 33
                    WorkorderId.value = Id
                    message.success('操作成功')
                    sceneStopModal.value = false
                    childHandle()
                    getTaskTicketProgressList(Number(WorkorderId.value))
                    annoListRef.value[0].getTaskTicketInfo(Number(WorkorderId.value))
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
                    Content: EWorkorderDetailContent.value,
                    Priority: WorkorderDetail.value.Priority
                }
            }

            TaskTicketEditApi(obj, Number(WorkorderId.value)).then(res => {
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

        function againOpen() {
            TaskTicketCopyApi({ Id: Number(WorkorderId.value) }).then(res => {
                if (res) {
                    message.success('重开成功，请返回列表查看')
                }
                // console.log(res)
            })
        }

        function changeTab(e) {

            var o = isInArray(annoListRefIndex.value, e)

            annoListRef.value[o].getTaskTicketInfo(e != 2 ? Number(WorkorderId.value) : Number(DeviceId.value))
        }
        const childHandle = () => {
            console.log(21)
            // annoListRef.value.map(item => {
            //     console.log(item) // 打印效果在下方
            //     item.value.getTaskTicketInfo(Number(WorkorderId.value))
            // })
        }
        function isInArray(arr, value) {
            if (arr.length > 0) {
                for (var i = 0; i < arr.length; i++) {
                    if (value === arr[i]) {
                        return i;
                    }
                }
            }
            return false;
        }
        function unique(arr) {
            console.log(arr)
            var newArr = [];
            for (var i = 0; i < arr.length; i++) {
                if (newArr.indexOf(arr[i]) === -1) {
                    newArr.push(arr[i]);
                }
            }
            return newArr;
        }
        return {
            getTaskTicketInfo,
            WorkorderId,
            DeviceId,
            WorkorderDetail,
            value,
            TabKey,
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
            editStatusFun,
            againOpen,
            mySelf,
            isInArray,
            changeTab,
            unique,
            fileUrl,
            getToken
            //   registerTimeTable,
        };
    },
});
</script>
  
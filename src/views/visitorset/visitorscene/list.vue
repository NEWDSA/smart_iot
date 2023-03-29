<template>
    <PageWrapper contentFullHeight title="场景联动详情">
        <div>
            <div class="p-2 bg-white">

                <div class="my-4 md:flex items-center">
                    <div class="flex">
                        <div class="px-3 py-1 mr-2" v-for="(item, index) in visitorSceneTab" :key="item.id"
                            :class="visitorSceneTabIndex == index ? 'bg-gray-100 sp-blue-text rounded-2xl' : ''"
                            @click="cutTab(item.VisitorTypeId, index)">
                            {{ item.VisitorTypeName }}
                        </div>
                    </div>
                    <div class="search md:ml-10 mt-3 md:mt-0 flex">
                        <a-input-search v-model:value="searchValue" placeholder="搜索" class="w-full md:w-50 pl-3"
                            @search="onSearch" />
                    </div>
                </div>

                <div class="visitor-list">
                    <div class="mb-5">

                        <div class="flex items-center flex-wrap" v-if="visitorSceneList.length > 0">

                            <div v-for="(Scene, index) in visitorSceneList" :key="Scene.RuleId" class="w-100 mb-5"
                                @click="pushScene(Scene.RuleId)">

                                <div class="border border-gray-200 border-solid rounded w-11/12 px-4 py-5">
                                    <div class="flex items-center justify-between">
                                        <div class="font-bold">{{ Scene.Name }}</div>
                                        <div class="rounded-md px-2 flex items-center"
                                            :class="computedStatus(Scene.Status, true)">
                                            <div class="w-1 h-1 mr-2" :class="computedStatus(Scene.Status, false)"
                                                style="border-radius: 50%;"></div>
                                            {{
                                                Scene.Status == 1 ? '启用' : Scene.Status == 2 ? '禁用' : Scene.Status == 3 ?
                                                    '异常' :
                                                    Scene.Status == 4 ? '故障' : Scene.Status == 5 ? '运行' : '离线'
                                            }}
                                        </div>
                                    </div>
                                    <div class="text-gray-500 mb-5">{{ checkVisitorType(Scene.VisitorTypeId) }}</div>
                                    <!-- <div class="text-gray-500">关联设备 <span class="text-black">{{
                                        checkDevice(Scene.DeviceIds)
                                    }}</span></div> -->
                                    <div class="text-gray-500">关联访客 <span class="text-black">{{
                                        checkVisitorType(Scene.VisitorTypeId)
                                    }}</span></div>

                                    <div class="bottom-but flex items-center mt-2 justify-end">
                                        <!-- <Modal
                                        v-model:visible="ModalShow[SceneTabIndex == '0' && !SearchStatus ? index : 0].model[index2]"
                                        @ok="handleOk(index, index2)" @cancel="handleClock(index, index2)" title="移出设备">
                                        <div class="p-3">确认移出 {{ ModalDeviceName }} 此设备？</div>
                                    </Modal> -->
                                        <div v-if="hasPermission(['Delete_visitorsceneList'])"
                                            class="bg-gray-100 py-2 px-4 mr-3 rounded"
                                            @click.stop="showModalClick(Scene.RuleId, index)">
                                            删除
                                        </div>


                                        <div v-if="hasPermission(['Edit_visitorsceneList'])"
                                            class="bg-gray-100 py-2 px-4 mr-3 rounded"
                                            @click.stop="pushScene(Scene.RuleId)">
                                            编辑</div>
                                        <div class="sp-blue-bg text-white py-2 px-4 mr-3 rounded"
                                            v-if="Scene.Status == 2 && hasPermission(['Enable_visitorsceneList']) || !Scene.Status && hasPermission(['Enable_visitorsceneList'])"
                                            @click.stop="enableDevice(Scene.RuleId, index)">启用</div>
                                        <div class="bg-red-600 text-white py-2 px-4 mr-3 rounded"
                                            v-if="Scene.Status == 1 && hasPermission(['disableDevice_visitorsceneList']) || Scene.Status == 5 && hasPermission(['disableDevice_visitorsceneList'])"
                                            @click.stop="disableDevice(Scene.RuleId, index)">禁用</div>
                                        <div class="bg-gray-300 text-white py-2 px-4 mr-3 rounded"
                                            v-if="Scene.Status == 3 || Scene.Status == 4">启用</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- <div class="w-100 mb-5" v-if="visitorSceneListlock == false">
                            <div class="border border-gray-200 border-solid rounded w-11/12 px-4 py-5"
                                @click="addpage(index, SceneTabIndex)" style="height:195px;">
                                更多+
                            </div>
                        </div> -->
                        <div v-else class="w-100 mb-5">
                            <div class="border border-gray-200 border-solid rounded w-11/12 px-4 py-5"
                                style="height:195px;">
                                暂无联动
                            </div>

                        </div>

                    </div>

                    <Pagination v-model:current="seachObj.PageNum" v-model:pageSize="seachObj.PageSize" :total="total"
                        show-size-changer @change="cutPage()"></Pagination>

                    <!-- <div class="flex text-right" style="text-align: center;">
                    <div class="mr-2" v-for="count in visitorSceneListlock">
                        <div class="px-3 py-1 rounded" @click="cutPage(count)"
                            :class="seachObj.PageNum == count ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'">
                            {{ count }} </div>
                    </div>
                </div> -->
                </div>
            </div>

            <Modal v-model:visible="ModalShow" @ok="handleOk()" @cancel="handleClock()" title="删除场景">
                <div class="p-3">确认删除 <span class="text-red-500">{{ ModalObj.Name }}</span> 此场景？</div>
            </Modal>
        </div>
    </PageWrapper>
</template>

<script lang="ts">
import { ref, defineComponent, reactive, onMounted, nextTick } from 'vue';
import { visitorTypeListApi, ruleVisitorListApi, ruleEnableApi, ruleDisableApi, ruleDeleteApi } from '@/api/visitor/visitor'
import { message, Modal, Pagination } from 'ant-design-vue';
import { PageWrapper } from '@/components/Page';
import { facilityDetailApi } from '@/api/facility/facility'
import { usePermission } from '@/hooks/web/useButtonPermission';
import { useGo } from '@/hooks/web/usePage';
// import { nextTick } from 'process';

export default defineComponent({
    components: { Modal, Pagination, PageWrapper },
    setup() {
        const { hasPermission } = usePermission();
        onMounted(() => {
            getTypeList();
        })
        const go = useGo();
        const visitorSceneTab = ref()
        const visitorSceneTabIndex = ref(0);
        const visitorSceneList: any = ref([])

        const visitorSceneListlock = ref();
        const seachObj = reactive({
            VisitorTypeId: '',
            Name: '',
            PageSize: 12,
            PageNum: 1
        })
        const total = ref()

        const searchValue = ref()
        const ModalShow = ref<boolean>(false);
        const ModalObj = reactive({
            Name: '',
            RuleId: '',
            index: ''
        })

        // tab栏
        function getTypeList() {
            visitorTypeListApi().then(res => {
                visitorSceneTab.value = res.Detail
                visitorSceneTab.value.unshift({
                    VisitorTypeName: '全部',
                    VisitorTypeId: 0
                });

                getSceneList(true, null)
            })
        }

        function getSceneList(type: boolean, Name: any) {
            console.log(seachObj, 'seachObj')
            if (type) {
                seachObj.PageNum = 1
            }
            if (Name) {
                seachObj.Name = searchValue.value
                seachObj.VisitorTypeId = ''
            } else {
                seachObj.Name = ''
                seachObj.VisitorTypeId = visitorSceneTab.value[visitorSceneTabIndex.value].VisitorTypeId
            }

            ruleVisitorListApi(seachObj).then(res => {
                if (res.Page.List) {
                    visitorSceneList.value = res.Page.List

                    console.log(visitorSceneList.value)
                    // 计算分页
                    // visitorSceneListlock.value = Math.ceil(res.Page.Total / 12)
                    total.value = res.Page.Total
                } else {
                    visitorSceneList.value = []
                }

            })

        }

        function showModalClick(index: string) {

            ModalObj.Name = visitorSceneList.value[index].Name
            ModalObj.RuleId = visitorSceneList.value[index].RuleId
            ModalObj.index = index
            ModalShow.value = true
            // console.log(ModalShow.value)
        }

        function handleOk() {
            ruleDeleteApi({ Ids: [ModalObj.RuleId] }).then(res => {
                if (res == 0) {
                    visitorSceneList.value.splice(ModalObj.index, 1)
                    ModalShow.value = false
                    message.error('操作成功')
                    cleanModal()
                } else {
                    message.error('操作失败')

                }
            })
        }

        function cleanModal() {
            ModalObj.Name = '';
            ModalObj.RuleId = '';
            ModalObj.index = '';
        }

        function handleClock() {
            ModalShow.value = false
            cleanModal()

        }

        function enableDevice(id: any, index: any) {
            ruleEnableApi({ Id: id }).then(res => {
                if (res == 0) {
                    message.success('操作成功')
                    visitorSceneList.value[index].Status = 1
                } else {
                    message.error('操作失败')

                }
            })
        }

        function disableDevice(id: any, index: any) {
            ruleDisableApi({ Id: id }).then(res => {
                if (res == 0) {
                    message.success('操作成功')
                    visitorSceneList.value[index].Status = 2
                } else {
                    message.error('操作失败')

                }
            })
        }

        function cutTab(id: any, index: number) {
            visitorSceneTabIndex.value = index
            getSceneList(true, null)
        }

        function cutPage() {
            console.log(seachObj)
            // seachObj.PageNum = count
            getSceneList(false, null)
        }

        function onSearch() {
            if (searchValue.value == '') {
                message.warn('请输入搜索内容')
                return;
            }
            getSceneList(false, 1)
        }

        function pushScene(id) {
            go('/scene/linkage/' + id)

        }

        function checkVisitorType(id: any) {

            for (let i = 0; i < visitorSceneTab.value.length; i++) {
                if (id == visitorSceneTab.value[i].VisitorTypeId) {
                    // console.log(id)
                    return visitorSceneTab.value[i].VisitorTypeName
                }

            }
        }

        function checkDevice(idd) {
            nextTick(async ()=>{
            console.log(idd.length)
            var arr = []
            for (let i = 0; i < idd.length; i++) {
                // if (id == visitorSceneTab.value[i].VisitorTypeId) {
                // console.log(id)
                await facilityDetailApi({ Id: idd[i] }).then(res => {
                    // console.log(res[0])
                    arr.push(res[0].DeviceName)
                })

            }
            // console.log(arr)
            let s = arr.toString()

            return s

            })
        }

        function computedStatus(status: any, type: any) {
            // console.log(status)
            switch (status) {
                case 1:
                    return type ? 'bg-green-200' : 'bg-green-500'
                case 2:
                    return type ? 'bg-gray-200' : 'bg-gray-500'
                case 3:
                    return type ? 'bg-yellow-500' : 'bg-white'
                case 4:
                    return type ? 'bg-red-200' : 'bg-red-500'
                case 5:
                    return type ? 'bg-blue-500' : 'bg-white'

                default:
                    return type ? 'bg-gray-200' : 'bg-gray-500'
            }
        }

        return {
            visitorSceneTab,
            visitorSceneTabIndex,
            hasPermission,
            getTypeList,
            getSceneList,
            visitorSceneList,
            visitorSceneListlock,
            seachObj,
            cutPage,
            cutTab,
            checkVisitorType,
            computedStatus,
            onSearch,
            searchValue,
            showModalClick,
            ModalShow,
            handleOk,
            handleClock,
            ModalObj,
            enableDevice,
            disableDevice,
            total,
            pushScene,
            checkDevice
        };
    },
});

</script>
<style lang="less">
body {
    font-family: 'Alibaba PuHuiTi';
}

.sp-blue-text {
    color: rgb(22, 100, 255);
}

.sp-blue-bg {
    background: rgb(22, 100, 255);
}

.fasility-class-select {
    .ant-select-selector {
        font-size: 10px;
        border-radius: 5px !important;
        height: 22px !important;

        .ant-select-selection-item {
            line-height: 22px !important;
        }
    }
}

.ant-select-arrow {
    color: rgb(28, 92, 255) !important;
}
</style>

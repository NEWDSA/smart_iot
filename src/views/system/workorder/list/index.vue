<template>
    <PageWrapper contentFullHeight title="工单列表">
        <div class="bg-white">
            <div class="p-2 flex justify-between items-center">
                <div>
                    <a-button type="primary" preIcon="ic:baseline-plus" @click="addVisitor()">
                        创建工单
                    </a-button>
                </div>
            </div>
            <BasicTable @register="registertab">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'action'">
                        <TableAction :actions="createActions(record, column)" />
                    </template>
                    <!-- <template v-if="column.key === 'VisitorName'">
                        <div class="flex items-center justify-start">
                        <div class="w-10 h-10 rounded-3xl overflow-hidden mr-3" v-if="record.Photo">
                            <img :src="url + record.Photo" alt="">
                        </div>
                        <div>{{ record.VisitorName }}</div>
                        </div>
            
                    </template> -->
                </template>
                <template #headerTop>
                    <div class="flex">
                        <div class="px-3 py-1 mr-2" v-for="(item, index) in workTypeTab" :key="item.id"
                            :class="workTypeTabIndex == index ? 'bg-gray-100 sp-blue-text rounded-2xl' : ''"
                            @click="cutTab(item.id, index)">
                            {{ item.label }}
                        </div>
                    </div>
                </template>
            </BasicTable>


            <!-- <visitorModel @register="registerModal" @success="handleSuccess"></visitorModel> -->
        </div>
</PageWrapper>
</template>
  
<script lang="ts">






import { ref, defineComponent, reactive, onMounted, nextTick } from 'vue';
import { BasicTable, TableAction, useTable } from '@/components/Table'
import { TaskTicketPageApi } from '@/api/sys/workorder'
import { TabColumns, getFormConfig } from './workData'
import { useModal } from '@/components/Modal';
//   import visitorModel from './visitorModal.vue';
import { message, Select, Input } from 'ant-design-vue';
import { useLoading } from '@/components/Loading';
import { PageWrapper } from '@/components/Page';

export default defineComponent({
    components: { BasicTable, TableAction, Select, Input, PageWrapper },
    setup() {
        onMounted(() => {
            // visitorTypeListApi().then(res => {
            //     VisitorTypeList.value = res.Detail
            // })
        })
        const workTypeTab = ref([
            {
                id: 0,
                label: '全部'
            },
            {
                id: 1,
                label: '我受理的工单'
            },
            {
                id: 2,
                label: '我提交的工单'
            },
            {
                id: 3,
                label: '我需关注的工单'
            }
        ])
        const workTypeTabIndex = ref(0)

        const [registerModal, { openModal }] = useModal();
        // 表格数据
        const searchInfo = ref()
        const [registertab, { getForm, reload }] = useTable({
            api: TaskTicketPageApi,
            columns: TabColumns(),
            useSearchForm: true,
            searchInfo: searchInfo,
            actionColumn: {
                width: 80,
                title: '操作',
                dataIndex: 'action',
                // slots: { customRender: 'action' },
                fixed: undefined,
            },
            fetchSetting: {
                // 传给后台的当前页字段
                pageField: 'PageNum',
                // 传给后台的每页显示多少条的字段
                sizeField: 'PageSize',
                // 接口返回表格数据的字段
                listField: 'List',
                // 接口返回表格总数的字段
                totalField: 'Total'
            },
            formConfig: getFormConfig(),
            showTableSetting: true,
            tableSetting: { fullScreen: true },
            showIndexColumn: false,
            handleSearchInfoFn: (e) => {
                console.log(e)
                // if (e.Search || e.Search != undefined || e.SearchValue != '' || e.SearchValue != undefined) {
                //     e[e.Search] = e.SearchValue
                // }
                e.Search = undefined
                e.SearchValue = undefined

            }
        })

        setTimeout(() => {
            getForm().updateSchema({
                field: 'VisitorTypeId',
                componentProps: { options: VisitorTypeList.value },
            });
        }, 1000)

        const VisitorTypeList = ref()

        // 操作
        function createActions(record) {
            return [
                {
                    label: '查看',
                    onClick: handleLook.bind(null, record)
                }
            ]
        }

        function cutTab(id,index){
            workTypeTabIndex.value = index
        }

        function addVisitor() {
            openModal(true, {
                isUpdate: false,
            });
        }

        function handleEdit(record) {
            // console.log(record)
            visitorInfoApi({ VisitorId: record.VisitorId }).then(res => {
                // if (res == 0) {
                var time = res.Detail.AppointTime.seconds
                // console.log(record.record.Basic.CreatedAt.seconds)

                res.Detail.yuyueTime = HuanTime(time)
                var obj = res.Detail

                openModal(true, {
                    isUpdate: true,
                    obj
                });
                // }
            })

        }

        function handleLook(record) {
            visitorInfoApi({ VisitorId: record.VisitorId }).then(res => {
                // if (res == 0) {
                var time = res.Detail.AppointTime.seconds
                // console.log(record.record.Basic.CreatedAt.seconds)

                res.Detail.yuyueTime = HuanTime(time)
                var obj = res.Detail

                openModal(true, {
                    isUpdate: true,
                    obj,
                    disabled: true
                });
                // }
            })
        }

        function handlecancel(record, status) {
            //Status 5 因为是取消所以固定死
            visitorStatusEditApi({ Status: status, VisitorId: record.VisitorId }).then(res => {
                if (res == 0) {
                    reload()
                } else {
                    message.error('操作失败')
                }
                // console.log(res)
            })
        }

        function handleSuccess() {
            message.success('操作成功')
            reload();
        }

        // loading
        const [openWrapLoading, closeWrapLoading] = useLoading({
            props: {
                tip: '加载中...',
                absolute: true,
                background: 'rgba(0,0,0,.3)'
            },
        });

        function HuanTime(time) {
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

        return {
            registertab,
            registerModal,
            handleSuccess,
            createActions,
            handleLook,
            addVisitor,
            handleEdit,
            HuanTime,
            searchInfo,
            VisitorTypeList,
            workTypeTab,
            workTypeTabIndex,
            cutTab
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
  
<template>
  <div>
    <div class="text-lg flex items-center">日志管理</div>
    <BasicTable @register="registertab">
      <!-- <template #toolbar>
        <a-button type="primary" @click="expandAll">展开全部</a-button>
        <a-button type="primary" @click="collapseAll">折叠全部</a-button>
      </template> -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="createActions(record, column)" />
        </template>
      </template>
    </BasicTable>
  </div>

  <detailDrawer @register="registerDrawer" @success="handleSuccess" :DetailId="DetailId" />
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { BasicTable, useTable, TableAction } from '@/components/Table';
import { getRoleListByPage } from '@/api/demo/system';
import detailDrawer from '../detailDrawer.vue';
import { useDrawer } from '@/components/Drawer';
import { getLogFormConfig } from '../tableData';
import { facilityLogListApi } from '@/api/facility/facility';

const DetailId = ref()
const logDetail = ref();

const TreeTabColumns = reactive([
  {
    title: '类型',
    dataIndex: 'OperationType',
    width: 200,
    customRender: ({ record }) => {
      let msg
      switch (record.LogType) {
        case '1':
          msg = '设备控制'
          return msg;
        case '2':
          msg = '设备状态'
          return msg;
        case '3':
          msg = '设备告警'
          return msg;

      }
    },
  },
  {
    title: '内容',
    dataIndex: 'Message',
    width: 400,
  },
  {
    title: '时间',
    dataIndex: ['Basic','CreatedAt','seconds'],
    width: 200,
    customRender: ({ record }) => {
        // console.log('record',record)
        var date = new Date(record.Basic.CreatedAt.seconds *1000);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';

        var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
        var s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
        var strDate = Y + M + D + h + m + s;
        return strDate
      },
  },
])
// console.log('456456',facilityLogListApi({DeviceSerial:'go-iot-3'}))
const [registertab] = useTable({
  // title: '树形表格',
  // canRowDrag: true
  api: facilityLogListApi,
  searchInfo: {
    DeviceId: props.DeviceName,
    StartTime:1672502400,
    EndTime:Date.parse(new Date(new Date().getTime()))/1000,
  },
  columns: TreeTabColumns,
  showIndexColumn: false,
  useSearchForm: true,
  striped: false,
  actionColumn: {
    width: 80,
    title: '操作',
    dataIndex: 'action',
    // slots: { customRender: 'action' },
    fixed: undefined
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
  titleHelpMessage: '树形组件不能和序列号列同时存在',
  formConfig: getLogFormConfig(),
  showTableSetting: true,
  tableSetting: { fullScreen: true },
})

const [registerDrawer, { openDrawer }] = useDrawer()

const props = defineProps({
  DeviceName: {
    type: String,
    default: ''
  },
  NetworkStatus: {
    type: Number,
    default: 0
  },
})

const handleLook = (record) => { 
  console.log('查看详情', record)
  // DetailId.value = record.DetailId
  // logDetail.value = record
  // console.log(logDetail)
  openDrawer(true, {
    record,
    // isUpdate: true,
  })
}

const handleSuccess = async () => {
  const values = await validate();
  setDrawerProps({ confirmLoading: true });
  // TODO custom api
  console.log(values);
}

// 操作
const createActions = (record) => {
  return [
    {
      label: '查看',
      onClick: handleLook.bind(null, record)
    }
  ]
}

</script>

<style lang="less">

</style>
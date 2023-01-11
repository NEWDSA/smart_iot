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
import { ref, reactive,onMounted } from 'vue';
import { BasicTable, useTable, TableAction } from '@/components/Table';
import { getRoleListByPage } from '@/api/demo/system';
import detailDrawer from '../detailDrawer.vue';
import { useDrawer } from '@/components/Drawer';
import { facilityLogListApi } from '@/api/facility/facility';

const DetailId = ref()
const logDetail = ref();

const TreeTabColumns = reactive([
  {
    title: '类型',
    dataIndex: 'OperationType',
    width: 200
  },
  {
    title: '内容',
    dataIndex: 'Status',
    width: 400,
  },
  {
    title: '当前状态',
    dataIndex: 'Id',
    width: 200,
  },


])
// console.log('456456',facilityLogListApi({DeviceSerial:'go-iot-3'}))
const [registertab] = useTable({
  // title: '树形表格',
  // canRowDrag: true
  api: facilityLogListApi,
  searchInfo: {
    DeviceSerial: props.DeviceName
  },
  columns: TreeTabColumns,
  showIndexColumn: false,
  striped: false,
  actionColumn: {
    width: 80,
    title: '操作',
    dataIndex: 'action',
    // slots: { customRender: 'action' },
    fixed: undefined
  },
  titleHelpMessage: '树形组件不能和序列号列同时存在',
})

const [registerDrawer, { openDrawer }] = useDrawer()

const props = defineProps({
  DeviceName: {
    type: String,
    default: ''
  }
})

const handleLook = (record) => {
  console.log('查看详情', record)
  DetailId.value = record.DetailId
  logDetail.value = record
  // console.log(logDetail)
  openDrawer(true, {
    record,
    isUpdate: true,
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
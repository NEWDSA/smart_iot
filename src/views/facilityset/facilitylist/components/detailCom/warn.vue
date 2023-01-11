<template>
  <!-- <a-button type="primary" @click="getFormValues">获取表单数据</a-button> -->
  <BasicTable @register="registerTable">
    <template #form-resetBefore>
      <a-button type="primary" @click="getFormValues" class="mr-3">查询</a-button>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <TableAction :actions="createActions(record, column)" />
      </template>
    </template>
  </BasicTable>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { BasicTable, useTable, TableAction } from '@/components/Table';
import { getBasicColumns, getFormConfig } from '../tableData';

import { facilityAlertListApi, facilityAlertIgnoreApi, facilityAlertNoticeApi } from '@/api/facility/facility';

// console.log(demoListApi)
const props = defineProps({
  DeviceName: {
    type: String,
    default: ''
  }
})

const checkedKeys = ref<Array<string | number>>([]);
const [registerTable, { getForm, reload }] = useTable({
  api: facilityAlertListApi,
  // searchInfo: searchType.value,
  columns: getBasicColumns(),
  searchInfo: {
    DeviceSerial: '37a2b4a881'  //props.DeviceName
  },
  useSearchForm: true,
  bordered: true,
  handleSearchInfoFn(info) {
    console.log('handleSearchInfoFn', info);
    return info;
  },
  actionColumn: {
    width: 80,
    title: '告警处理',
    dataIndex: 'action',
    // slots: { customRender: 'action' },
    fixed: undefined
  },
  formConfig: getFormConfig(),
  showTableSetting: true,
  tableSetting: { fullScreen: true },
  showIndexColumn: false,
});

function getFormValues() {
  console.log(getForm().getFieldsValue())
  reload()

}

function handleUp(record) {
  console.log(record)
  facilityAlertNoticeApi({ 'Id': record.Id }).then(res => {
    if (res == '0') {
      reload()
    }
  })

}

function handleLost(record) {
  console.log(record)
  facilityAlertIgnoreApi({ 'Id': record.Id }).then(res => {
    if (res == '0') {
      reload()
    }
  })

}

// function subbut() {
//   console.log(getForm().getFieldsValue());
// }

// function onSelectChange(selectedRowKeys: (string | number)[]) {
//   console.log(selectedRowKeys);
//   checkedKeys.value = selectedRowKeys;
// }

// 操作
const createActions = (record) => {
  if (!record.Status) {
    return [
      {
        label: '上报',
        onClick: handleUp.bind(null, record)
      },
      {
        label: '忽略',
        onClick: handleLost.bind(null, record)
      }
    ]
  } else {
    if (record.Status == 1) {
      return [
        {
          label: '已上报',
          disabled:true
        }
      ]
    }else if (record.Status == 1) {
      return [
        {
          label: '已处理',
          disabled:true
        }
      ]
    }else {
      return [
        {
          label: '已忽略',
          disabled:true
        }
      ]
    }

  }

}

</script>

<template>
  <div class="p-5">
    <div class="p-5 bg-white">
      <div class="text-xl">访客列表</div>
      <div>
        <!-- <BasicForm @register="register"></BasicForm> -->
      </div>
      <div>
        <a-button type="primary" preIcon="ic:baseline-plus" @click="addVisitor()">
          创建新的访客
        </a-button>
      </div>

      <div class="flex p-3">
        <div class="mr-3">
          <Select v-model:value="souSelect.value" class="w-45" @change="SelectCut">
            <div :value="item.label" v-for="(item, index) in souSelect.list" :key="item.value">
              {{ item.label }}
            </div>
          </Select>
        </div>


        <div class="w-50 mr-3" v-if="souSelect.key != ''">
          <Select class="w-45" @change="TypeChange" v-if="souSelect.key == 'VisitorTypeId'">
            <div :value="item.VisitorTypeName" v-for="(item, index) in VisitorTypeList" :key="item.VisitorTypeId">
              {{ item.VisitorTypeName }}
            </div>
          </Select>

          <Input v-if="souSelect.key == 'VisitorPhone'" v-model:value="souOrder.VisitorPhone"></Input>
          <Input v-if="souSelect.key == 'VisitorName'" v-model:value="souOrder.VisitorName"></Input>
          <Input v-if="souSelect.key == 'LicensePlate'" v-model:value="souOrder.LicensePlate"></Input>
        </div>

        <a-button type="primary" @click="getFormValues" class="mr-3">查询</a-button>
        <a-button @click="resetFormValues" class="mr-3">重置</a-button>

      </div>
    </div>
    <BasicTable @register="registertab">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="createActions(record, column)" />
        </template>

        <template v-if="column.key === 'VisitorName'">
          <div class="flex items-center justify-center">
            <div class="w-10 h-10 rounded-3xl overflow-hidden mr-3" v-if="record.Photo">
              <img :src="url + record.Photo" alt="">
            </div>
            <div>{{ record.VisitorName }}</div>
          </div>

        </template>

      </template>
    </BasicTable>


    <visitorModel @register="registerModal" @success="handleSuccess"></visitorModel>
  </div>
</template>

<script>
import { ref, defineComponent, reactive, onMounted, nextTick } from 'vue';
import { BasicTable, TableAction, useTable } from '@/components/Table'
import { visitorListApi, visitorInfoApi, visitorTypeListApi } from '@/api/visitor/visitor'
import { TabColumns, getFormConfig } from './visitorData'
import { useModal } from '@/components/Modal';
import visitorModel from './visitorModal.vue';
import { message, Select, Input } from 'ant-design-vue';
import { useLoading } from '@/components/Loading';

export default defineComponent({
  components: { BasicTable, TableAction, visitorModel, Select, Input },
  setup() {
    onMounted(() => {
      visitorTypeListApi().then(res => {
        VisitorTypeList.value = res.Detail
      })
    })

    const url = ref('http://192.168.8.180:4000/api/v1/')

    const [registerModal, { openModal }] = useModal();
    // 表格数据
    const searchInfo = ref()
    const [registertab, { getForm, reload }] = useTable({
      api: visitorListApi,
      columns: TabColumns(),
      useSearchForm: false,
      searchInfo: searchInfo,
      actionColumn: {
        width: 80,
        title: '操作',
        dataIndex: 'action',
        // slots: { customRender: 'action' },
        fixed: undefined,
      },
      formConfig: getFormConfig(),
      showTableSetting: true,
      tableSetting: { fullScreen: true },
      showIndexColumn: false,
    })

    const souSelect = reactive({
      value: '',
      key: '',
      list: [
        { label: '访客类型', value: 'VisitorTypeId' },
        { label: '手机号', value: 'VisitorPhone' },
        { label: '访客名称', value: 'VisitorName' },
        { label: '车牌号', value: 'LicensePlate' },
        { label: '预定时间', value: 'AppointTime' }
      ]
    })

    const souOrder = reactive({
      VisitorTypeId: null,
      VisitorPhone: null,
      VisitorName: null,
      LicensePlate: null,
      AppointTime: null,
    })

    const VisitorTypeList = ref()

    // 操作
    function createActions(record) {
      return [
        {
          label: '取消',
          onClick: handleLook.bind(null, record)
        },
        {
          label: '修改',
          onClick: handleEdit.bind(null, record)
        },
        {
          label: '查看',
          onClick: handleLook.bind(null, record)
        }
      ]
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

    function handleSuccess() {
      message.success('操作成功')
      reload();
    }

    function reset(type) {
      if (type) {
        nextTick(() => {
          souSelect.value = ''
          souSelect.key = ''
        })

      }
      searchInfo.value = null
      souOrder.VisitorTypeId = null
      souOrder.VisitorPhone = null
      souOrder.VisitorName = null
      souOrder.LicensePlate = null
      souOrder.AppointTime = null
    }

    function SelectCut(value, data) {
      reset()

      souSelect.key = data.key
      console.log(souSelect.key)
    }

    function getFormValues() {
      var obj = {}
      if (souSelect.key != '') {
        if (souOrder[souSelect.key] != '' || souOrder[souSelect.key] != null) {
          obj[souSelect.key] = souOrder[souSelect.key]
        }
        searchInfo.value = obj
        openWrapLoading()
        // 延迟
        setTimeout(() => {
          reload()
          closeWrapLoading()
        }, 500);

      } else {
        reload()
      }
      // console.log(obj)
    }

    function resetFormValues() {
      openWrapLoading()

      reset(true)
      // 延迟
      setTimeout(() => {
        reload()
        closeWrapLoading()
      }, 500);
    }

    function TypeChange(value, data) {
      souOrder.VisitorTypeId = data.key
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
      souSelect,
      VisitorTypeList,
      souOrder,
      reset,
      SelectCut,
      getFormValues,
      resetFormValues,
      TypeChange,
      url
    };
  },
});



</script>

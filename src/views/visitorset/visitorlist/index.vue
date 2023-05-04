<template>
  <PageWrapper contentFullHeight title="访客列表">
    <div class="bg-white">
      <div class="p-2 flex justify-between items-center">

        <!-- <div class="flex p-3"> -->
        <!-- <div class="mr-3">
                <Select v-model:value="souSelect.value" class="w-45" @change="SelectCut">
                  <div :value="item.label" v-for="(item, index) in souSelect.list" :key="item.value">
                    {{ item.label }}
                  </div>
                </Select>
              </div> -->


        <!-- <div class="mr-3 flex items-center">
                <div class="flex items-center mr-3">
                  <div class="px-2 w-20 text-center">访客类型</div>
                  <Select v-model:value="souOrder.VisitorTypeName" class="w-45" @change="TypeChange" placeholder="请选择访客类型">
                    <div :value="item.VisitorTypeName" v-for="(item, index) in VisitorTypeList" :key="item.VisitorTypeId">
                      {{ item.VisitorTypeName }}
                    </div>
                  </Select>
                </div>

                <div class="flex items-center mr-3">
                  <div class="px-2 w-20 text-center">访客状态</div>
                  <Select v-model:value="souOrder.StatusName" class="w-45" @change="StatusChange" placeholder="请选择访客状态">
                    <div :value="item.StatusName" v-for="(item, index) in VisitorStatus" :key="item.StatusId">
                      {{ item.StatusName }}
                    </div>
                  </Select>
                </div>

                <div class="flex items-center mr-3">
                  <Select v-model:value="souSelect.value" class="w-45" @change="SelectCut" placeholder="请选择查询状态">
                    <div :value="item.label" v-for="(item, index) in souSelect.list" :key="item.value">
                      {{ item.label }}
                    </div>
                  </Select>
                </div>

                <Input :disabled="souSelect.key == ''" v-model:value="souSelect.InputValue"
                  :placeholder="souSelect.key == '' ? '请选择查询状态' : '请输入关键字'"></Input>
              </div>

              <a-button type="primary" @click="getFormValues" class="mr-3">查询</a-button>
              <a-button @click="resetFormValues" class="mr-3">重置</a-button>

            </div> -->



      </div>
      <BasicTable @register="registertab">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <TableAction :actions="createActions(record, column)" />
          </template>

          <template v-if="column.key === 'VisitorName'">
            <div class="flex items-center justify-start w-full" style="padding-left: 30%;">
              <div class="w:1/2">
                <div class="w-10 h-10 rounded-3xl overflow-hidden mr-3" v-if="record.Photo">
                  <img :src="url + record.Photo" alt="">
                </div>
              </div>

              <div class="w:1/2  overflow-ellipsis overflow-hidden ...">{{ record.VisitorName }}</div>
            </div>

          </template>

        </template>


        <template #form-advanceAfter>
          <!-- <div class="" style="width: 60px;"> -->
          <a-button v-if="hasPermission(['addVisitor_visitorlist'])" type="primary" preIcon="ic:baseline-plus"
            @click="addVisitor()" class="ml-10">
            添加预约访客
          </a-button>
          <!-- </div> -->
        </template>
      </BasicTable>


      <visitorModel @register="registerModal" @success="handleSuccess"></visitorModel>
    </div>
  </PageWrapper>
</template>

<script>


import { ref, defineComponent, reactive, onMounted, nextTick } from 'vue';
import { BasicTable, TableAction, useTable } from '@/components/Table'
import { visitorListApi, visitorInfoApi, visitorTypeListApi, visitorStatusEditApi } from '@/api/visitor/visitor'
import { TabColumns, getFormConfig } from './visitorData'
import { useModal } from '@/components/Modal';
import visitorModel from './visitorModal.vue';
import { message, Select, Input } from 'ant-design-vue';
// import { useLoading } from '@/components/Loading';
import { PageWrapper } from '@/components/Page';
import { fileUrl } from '@/utils/file/fileUrl'
import { usePermission } from '@/hooks/web/useButtonPermission';
import { Loading, useLoading } from '@/components/Loading';

export default defineComponent({
  components: { BasicTable, TableAction, visitorModel, Select, Input, PageWrapper },
  setup() {
    const { hasPermission } = usePermission();
    const devImg = ref('');
    onMounted(() => {
      visitorTypeListApi().then(res => {
        VisitorTypeList.value = res.Detail
      })
    })

    const url = ref(fileUrl())

    const [openFullLoading, closeFullLoading] = useLoading({
      tip: '加载中...',
    });

    const [registerModal, { openModal }] = useModal();
    // 表格数据
    const searchInfo = ref()
    const [registertab, { getForm, reload }] = useTable({
      api: visitorListApi,
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
      formConfig: getFormConfig(),
      showTableSetting: true,
      tableSetting: { fullScreen: true },
      showIndexColumn: false,
      handleSearchInfoFn: (e) => {
        if (e.Search || e.Search != undefined || e.SearchValue != '') {
          e[e.Search] = e.SearchValue
        }
        e.Search = undefined
        e.SearchValue = undefined

      }
    })

    // const souSelect = reactive({
    //   value: null,
    //   key: '',
    //   InputValue: null,
    //   list: [
    //     { label: '访客姓名', value: 'VisitorName' },
    //     { label: '手机号', value: 'VisitorPhone' },
    //   ]
    // })

    setTimeout(() => {
      getForm().updateSchema({
        field: 'VisitorTypeId',
        componentProps: { options: VisitorTypeList.value },
      });
    }, 1000)

    const VisitorTypeList = ref()
    // const VisitorStatus = ref([
    //   { StatusName: '待确认', StatusId: 1 },
    //   { StatusName: '已预约', StatusId: 2 },
    //   { StatusName: '已登记', StatusId: 3 },
    //   { StatusName: '已离开', StatusId: 4 },
    //   { StatusName: '已取消', StatusId: 5 },
    //   { StatusName: '已推迟', StatusId: 6 },
    // ])

    // const souOrder = reactive({
    //   VisitorTypeName: null,
    //   VisitorTypeId: null,
    //   VisitorName: null,
    //   Status: null,
    //   StatusName: null,
    // })

    // 操作
    function createActions(record) {

      if (record.Status == 5 || record.Status == 4) {
        return [
          {
            label: '查看',
            ifShow: hasPermission(['handleLook_visitorlist']),
            onClick: handleLook.bind(null, record)
          }
        ]
      }

      if (record.Status == 1) {
        return [
          {
            label: '预约',
            popConfirm: {
              title: '是否确认预约',
              placement: 'left',
              ifShow: hasPermission(['handleMake_visitorlist']),
              confirm: handlecancel.bind(null, record, 2),
            },
            // onClick: handleLook.bind(null, record)
          },
          {
            label: '取消',
            ifShow: hasPermission(['handlecancel_visitorlist']),
            popConfirm: {
              title: '是否确认取消',
              placement: 'left',
              confirm: handlecancel.bind(null, record, 5),
            },
            // onClick: handleLook.bind(null, record)
          },
          {
            label: '修改',
            ifShow: hasPermission(['handleEdit_visitorlist']),
            onClick: handleEdit.bind(null, record)
          },
          {
            label: '查看',
            ifShow: hasPermission(['handleLook_visitorlist']),
            onClick: handleLook.bind(null, record)
          }
        ]
      }

      if (record.Status == 2 || record.Status == 6) {
        return [
          {
            label: '登记',
            ifShow: hasPermission(['handleRegister_visitorlist']),
            popConfirm: {
              title: '是否确认登记',
              placement: 'left',
              confirm: handlecancel.bind(null, record, 3),
            },
            // onClick: handleLook.bind(null, record)
          },
          {
            label: '取消',
            ifShow: hasPermission(['handlecancel_visitorlist']),
            popConfirm: {
              title: '是否确认取消',
              placement: 'left',
              confirm: handlecancel.bind(null, record, 5),
            },
            // onClick: handleLook.bind(null, record)
          },
          {
            label: '修改',
            ifShow: hasPermission(['handleEdit_visitorlist']),
            onClick: handleEdit.bind(null, record)
          },
          {
            label: '查看',
            ifShow: hasPermission(['handleLook_visitorlist']),
            onClick: handleLook.bind(null, record)
          }
        ]
      }

      if (record.Status == 3) {
        return [
          {
            label: '离开',
            popConfirm: {
              title: '是否确认离开',
              placement: 'left',
              confirm: handlecancel.bind(null, record, 4),
            },
            ifShow:hasPermission(['handleLeavie_visitorlist']),
            // onClick: handleLook.bind(null, record)
          },
          {
            label: '修改',
            ifShow: hasPermission(['handleEdit_visitorlist']),
            onClick: handleEdit.bind(null, record)
          },
          {
            label: '查看',
            ifShow: hasPermission(['handleLook_visitorlist']),
            onClick: handleLook.bind(null, record)
          }
        ]
      }
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
      openFullLoading()
      //Status 5 因为是取消所以固定死
      visitorStatusEditApi({ Status: status, VisitorId: record.VisitorId }).then(res => {
        if (res == 0) {
          message.success('操作成功')
          reload()
        } else {
          message.error('操作失败')
        }
        closeFullLoading()

        // console.log(res)
      })
    }

    function handleSuccess() {
      message.success('操作成功')
      reload();
    }

    // 重置 （总的/select的）
    // function reset(type) {
    //   if (type) {
    //     nextTick(() => {
    //       souSelect.value = null
    //       souSelect.key = ''
    //       souOrder.VisitorTypeName = null
    //       souOrder.VisitorTypeId = null
    //       souOrder.StatusName = null
    //       souOrder.Status = null
    //     })

    //   }
    //   searchInfo.value = null
    //   souSelect.InputValue = null
    // }

    // function SelectCut(value, data) {
    //   reset()

    //   souSelect.key = data.key
    //   console.log(souSelect.key)
    // }

    // // 查询
    // function getFormValues() {

    //   var obj = {}

    //   // 类型
    //   if (souOrder.VisitorTypeId != '' || souSelect.VisitorTypeId != null) {
    //     obj.VisitorTypeId = souOrder.VisitorTypeId
    //   }

    //   // 状态
    //   if (souOrder.Status != '' || souSelect.Status != null) {
    //     obj.Status = souOrder.Status
    //   }

    //   // input
    //   if (souSelect.key != '' || souSelect.InputValue != null) {
    //     obj[souSelect.key] = souSelect.InputValue
    //   }

    //   searchInfo.value = obj
    //   openWrapLoading()
    //   // 延迟
    //   setTimeout(() => {
    //     reload()
    //     closeWrapLoading()
    //   }, 500);

    //   // console.log(obj)
    // }

    // // 重置
    // function resetFormValues() {
    //   openWrapLoading()

    //   reset(true)
    //   // 延迟
    //   setTimeout(() => {
    //     reload()
    //     closeWrapLoading()
    //   }, 500);
    // }

    // function TypeChange(value, data) {
    //   // console.log(data)
    //   souOrder.VisitorTypeName = data.value
    //   souOrder.VisitorTypeId = data.key
    // }

    // function StatusChange(value, data) {
    //   souOrder.StatusName = data.value
    //   souOrder.Status = data.key
    // }

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
      hasPermission,
      // souSelect,
      VisitorTypeList,
      // reset,
      // SelectCut,
      // getFormValues,
      // resetFormValues,
      // TypeChange,
      url,
      // souOrder,
      devImg,
      // VisitorStatus,
      // StatusChange
    };
  },
});



</script>

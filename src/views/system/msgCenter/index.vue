<template>
  <PageWrapper :class="prefixCls" dense contentFullHeight contentClass="flex">
    <Tabs @change="Tab_Click">
      <template v-for="item in settingList" :key="item.key">
        <TabPane :tab="item.name">
          <PageList ref="ListRef" :Datalist="item.list" :params="item.params" :Total="item.total" @changePage="changePage"
            @title-click="onNoticeClick" />
        </TabPane>
      </template>
    </Tabs>
    <div class="board">
      <div class="board_item">
        <div style="padding: 10px">
          <Icon @click="SelectUser" icon="ion:ios-share-alt" :size="20" />
          <Icon @click="DelMsg" icon="material-symbols:delete-outline-rounded" :size="20" />
        </div>
      </div>
      <template v-if="infoDetail?.Detail">
        <div class="p-3 text-lg">{{
          filterresult(infoDetail?.Detail?.Basic?.CreatedAt?.seconds)
        }}</div>
        <!-- 主题 -->
        <div class="p-3 text-xl">{{ infoDetail.Detail?.NoticeTitle }}</div>
        <div class="p-3 text-base"><span style="color: #2a96f3">{{ infoDetail?.Detail?.RegionalLocation }}-{{
          infoDetail.DeviceName }}</span>:<span>{{ infoDetail?.Detail?.Content }}</span></div>
        <!-- 报警类型 -->
        <div v-if="infoDetail.Detail.Type == 1" class="p-3 text-base">{{
          infoDetail?.Detail.AlertType == 1
          ? '异常告警'
          : infoDetail?.Detail.AlertType == 2
            ? '故障告警'
            : infoDetail?.Detail.AlertType == 3
              ? '其他告警'
              : ''
        }}<span>，设备ID:{{ infoDetail.DeviceId }}</span></div>
        <!-- 告警级别 -->
        <div v-if="infoDetail.Detail.Type == 1" class="p-3 text-base">告警级别：{{
          infoDetail.Detail?.Level == 1
          ? '低,请尽快处理'
          : infoDetail.Detail?.Level == 2
            ? '一般,请尽快处理'
            : infoDetail.Detail?.Level == 3
              ? '紧急,请尽快处理'
              : infoDetail.Detail?.Level == 4
                ? '非常紧急,请尽快处理'
                : ''
        }}</div>
        <div v-if="infoDetail.Detail.Type == 2" class="p-3 text-base">
          系统自动上报，优先级:{{ infoDetail?.Detail.AlertType == 1
            ? '异常告警'
            : infoDetail?.Detail.AlertType == 2
              ? '故障告警'
              : infoDetail?.Detail.AlertType == 3
                ? '其他告警'
                : '' }}
                工单号:{{ infoDetail?.Detail.TaskTicketNo
 }},
          
        </div>
        <div v-if="infoDetail.Detail.Type == 2" class="p-3 text-base">请尽快处理!</div>
        <!-- 跳转按钮 -->
        <Button style="background: rgb(22, 93, 255)" @click="goDetail(infoDetail)" class="m-5"
          type="primary">查看详情</Button>
        <Button style="background: rgb(22, 93, 255)" @click="nextItem" class="m-5" type="primary">下一条</Button>
      </template>
      <template v-else>
        <div class="nobrad">
          <img src="@/assets/images/404.png" />
          <div class="p-4" style="width: 100%">请选择消息</div>
        </div>
      </template>
    </div>
    <!-- 弹窗组件 -->
    <AccountModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, onMounted, h, watch } from 'vue'
import { NoticeList, DelNotice, NoticeRead } from '@/api/demo/system'
import { PageWrapper } from '@/components/Page'
import { Tabs } from 'ant-design-vue'
import { useGo } from '@/hooks/web/usePage'
import { NoticeInfo } from '@/api/demo/system'
import { deviceInfo } from '@/api/demo/scence'
import Icon from '@/components/Icon'
import { useUserStore } from '@/store/modules/user'
import { Button } from '@/components/Button'
import { Divider } from 'ant-design-vue'
import { useModal } from '@/components/Modal'
import AccountModal from './components/AccountModal.vue'
import { useMessage } from '@/hooks/web/useMessage'
import emitter from '@/utils/mybus'
import dayjs from 'dayjs'
// 引入自定义组件
import PageList from './components/list.vue'
export default defineComponent({
  name: 'AccountManagement',
  components: {
    PageWrapper,
    Tabs,
    TabPane: Tabs.TabPane,
    PageList,
    Icon,
    Divider,
    Button,
    AccountModal
  },
  setup() {
    const ListRef = ref()
    const itemIndex = ref()
    const go = useGo()
    const settingList: any = ref([])
    const userStore = useUserStore()
    const infoDetail: any = reactive({
      Detail: null,
      DeviceName: null,
      DeviceId: null
    })
    const [registerModal, { openModal }] = useModal()
    const myTotal = ref(0)
    const { createConfirm, createMessage } = useMessage()
    const { info } = createMessage
    watch(
      () => settingList,
      (newValue, oldValue) => {
        settingList.value = newValue
      }
    )
    onMounted(async () => {
      emitter.on('getData', async () => {
        // 对接口进行重置
        settingList.value = []
        for (var i = 0; i <= 2; i++) {
          await getData(i)
        }
      })
      for (var i = 0; i <= 2; i++) {
        await getData(i)
      }
    })
    const PageNum = ref(1)
    const tabIndex = ref(0)
    function handleSuccess() {
      // 提示
      info('操作成功')
    }
    function filterresult(result) {
      return dayjs.unix(result).format('YYYY-MM-DD HH:mm:ss')
    }
    async function Tab_Click(e) {
      tabIndex.value = e
      settingList.value[tabIndex.value]
    }
    async function getData(type) {
      const data = await NoticeList({
        PageNum: 1,
        PageSize: 9,
        Type: type
      })
      // settingList.value=[];
      settingList.value.push({
        key: type,
        name: type == 0 ? '全部' : type == 1 ? '设备告警' : type == 2 ? '工单' : '',
        component: '',
        current: 1,
        list: data.Detail,
        total: data.Total,
        params: {
          current: 1,
          PageSize: 10,
          Total: data.Total
        }
      })
    }

    async function onNoticeClick(record, index) {
      //  显示详细内容到其他div
      // record.NoticeId
      // 对record进行类型判断
      itemIndex.value = index
      let NoticeId = null
      if (typeof record === 'object') {
        NoticeId = record.NoticeId
      } else {
        NoticeId = record
      }

      const Code = await NoticeRead({ NoticeId: [NoticeId] })
      if (Code == 0) {
        const data = await NoticeList({
          PageNum: 1,
          PageSize: 9,
          Type: tabIndex.value
        })
        settingList.value[tabIndex.value].list = data.Detail
      }

      // 详情
      const { Detail } = await NoticeInfo({
        NoticeId: NoticeId
      })
      infoDetail.Detail = Detail
      // 通过设备ID查找设备
      const result = await deviceInfo({
        Id: Detail.DeviceId
      })
      infoDetail.DeviceName = result[0].DeviceName
      infoDetail.DeviceId = result[0].DeviceId
    }
    async function changePage(index) {
      PageNum.value = index
      const { Detail, Total } = await NoticeList({
        PageNum: PageNum.value,
        PageSize: 8,
        Type: tabIndex.value
      })
      settingList.value[tabIndex.value].list = Detail
      settingList.value[tabIndex.value].current = PageNum.value.toString()
    }
    function SelectUser() {
      if (ListRef.value[tabIndex.value].myselectedIndex !== null) {
        openModal(true, {
          NoticeId: infoDetail?.Detail?.NoticeId,
          isUpdate: false
        })
      } else {
        createConfirm({
          iconType: 'info',
          title: '提示',
          content: '至少选择一条消息'
        })
      }
    }
    function getNotice() {
      alert('Notice title')
    }
    function goDetail(infoDetail) {
      // 跳转具体页面
      // workorder_detail/:id

      switch (infoDetail.Detail.Type) {
        case 1:
          go('/facilityset/facility_detail/' + infoDetail.Detail.DeviceId + '/detail') // 设备详情设备
          break
        case 2:
          go('/system/workorder/workorder_detail/' + infoDetail.Detail?.TaskTicketNo) //工单
          break
      }
    }
    // 删除消息
    async function DelMsg() {
      const userId = await userStore.getUserInfo.user?.UserId
      // UserId
      // 弹出确认删除提示框
      createConfirm({
        iconType: 'warning',
        title: () => h('span', '温馨提示'),
        content: () => h('span', '是否删除消息?'),
        onOk: async () => {
          try {
            await DelNotice({
              NoticeId: Number(infoDetail?.Detail?.NoticeId),
              // 获取用户UserId
              UserId: [Number(userId)]
            })
          } finally {
            infoDetail.Detail = null
            settingList.value = []
            for (var i = 0; i <= 2; i++) {
              await getData(i)
            }
          }
        }
      })
    }
    function nextItem() {
      // 当前数据长度
      if (
        ListRef.value[tabIndex.value].myselectedIndex <
        settingList.value[tabIndex.value].list.length - 1
      ) {
        ++ListRef.value[tabIndex.value].myselectedIndex
        onNoticeClick(
          ListRef.value[tabIndex.value].Datalist[ListRef.value[tabIndex.value].myselectedIndex],
          ''
        )
      } else {
        ListRef.value[tabIndex.value].myselectedIndex = 0
        // console.log(ListRef.value[tabIndex.value].Datalist[ListRef.value[tabIndex.value].myselectedIndex],'?...520...?');
        onNoticeClick(
          ListRef.value[tabIndex.value].Datalist[ListRef.value[tabIndex.value].myselectedIndex],
          ''
        )
      }
    }
    return {
      ListRef,
      prefixCls: 'account-setting',
      contentStyle: {
        height: '800px'
      },
      itemIndex,
      myTotal,
      infoDetail,
      PageNum,
      getData,
      registerModal,
      goDetail,
      getNotice,
      nextItem,
      filterresult,
      changePage,
      onNoticeClick,
      SelectUser,
      handleSuccess,
      DelMsg,
      info,
      tabIndex,
      settingList,
      Tab_Click
    }
  }
})
</script>
<style lang="less" scoped>
.account-setting {
  margin: 12px;
  background-color: F6F8FB;

  .base-title {
    padding-left: 0;
  }

  .ant-tabs-tab-active {
    background-color: @item-active-bg;
  }

  .ant-tabs-tabpane {
    height: calc(100% - 81px);
  }

  ::v-deep(.ant-tabs-content) {
    display: inline-block;
    width: 100%;
    height: 100%;
  }

  ::v-deep(.ant-tabs) {
    border-radius: 20px;
    border: 1px solid rgb(197, 198, 201);
    background: rgb(246, 248, 251);
  }

  ::v-deep(.ant-tabs-nav-wrap) {
    justify-content: center;
    width: 400px;
  }
}

.nobrad {
  position: relative;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -40%);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  text-align: center;
  color: #b9b1b1;
}

.board {
  position: relative;
  width: calc(100% - 400px);
  background: #ffffff;

  &_item {
    height: 50px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border-bottom: 1px solid rgb(238, 238, 238);
  }
}
</style>

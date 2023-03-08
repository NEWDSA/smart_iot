<template>
  <PageWrapper :class="prefixCls" dense fixedHeight contentClass="flex">

    <Tabs @change="Tab_Click">
      <template v-for="item in settingList" :key="item.key">
        <TabPane :tab="item.name">
          <component ref="ListRef" :Datalist="Datalist" :params="params" :Total="myTotal" @changePage="changePage"
            :is="item.component" @title-click="onNoticeClick" />
        </TabPane>
      </template>
    </Tabs>
    <div style="width: 900px;background:#ffffff">
      <div style="height:50px;display: flex;justify-content: end;align-items: center;border-bottom: 1px solid #9b9394;">
        <div style="padding:10px">
          <Icon @click="SelectUser" icon="ion:ios-share-alt" :size="20" />
          <Icon @click="DelMsg" icon="material-symbols:delete-outline-rounded" :size="20" />
        </div>
      </div>
      <template v-if="infoDetail?.Detail">
        <div class="p-5 text-lg">{{ filterresult(infoDetail?.Detail?.Basic?.CreatedAt?.seconds) }}</div>
        <!-- 主题 -->
        <div class="p-5 text-xl">{{ infoDetail.Detail?.NoticeTitle }}-{{ infoDetail.Detail?.Content }}</div>
        <div class="p-5 text-base">{{ infoDetail?.Detail?.RegionalLocation }}-{{ infoDetail.DeviceName }}:<span>{{
          infoDetail?.Detail?.Content
        }}</span></div>
        <!-- 报警类型 -->
        <div class="p-5 text-base">{{ infoDetail?.NoticeType }}<span>{{ infoDetail.DeviceId }}</span></div>
        <!-- 告警级别 -->
        <div class="p-5 text-base">{{ infoDetail.Detail?.Level }}</div>
        <!-- 跳转按钮 -->
        <Button @click="goDetail(infoDetail)" class="m-5" type="primary">查看详情</Button>
        <Button @click="nextItem" class="m-5" type="primary">下一条</Button>
      </template>
      <template v-else>
        <div class="nobrad">
          <img src="@/assets/images/404.png" />
          <div class="p-4" style="width:100%;">请选择消息</div>
        </div>
      </template>
    </div>
    <!-- 弹窗组件 -->
    <AccountModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, onMounted, h } from 'vue';
import { NoticeList, DelNotice, NoticeRead } from '@/api/demo/system';
import { PageWrapper } from '@/components/Page';
import { Tabs } from 'ant-design-vue';
import { useGo } from '@/hooks/web/usePage';
import { NoticeInfo } from '@/api/demo/system';
import { deviceInfo } from '@/api/demo/scence';
import Icon from '@/components/Icon'
import { useUserStore } from '@/store/modules/user'
import { Button } from '@/components/Button'
import { Divider } from 'ant-design-vue';
import { useModal } from '@/components/Modal';
import AccountModal from './components/AccountModal.vue';
import { useMessage } from '@/hooks/web/useMessage';
import dayjs from 'dayjs';
// 引入自定义组件
import PageList from './components/list.vue';
export default defineComponent({
  name: 'AccountManagement',
  components: { PageWrapper, Tabs, TabPane: Tabs.TabPane, PageList, Icon, Divider, Button, AccountModal },
  setup() {
    const ListRef = ref();
    const go = useGo();
    const userStore = useUserStore();
    const infoDetail = reactive({
      Detail: null,
      DeviceName: null,
      DeviceId: null
    });
    const [registerModal, { openModal }] = useModal();
    const myTotal = ref(0);
    const {
      createConfirm,
      createMessage
    } = useMessage();
    const { info } = createMessage;
    onMounted(async () => {
  
      const userStore = await useUserStore()
      const { Detail, Total } = await NoticeList({
        Token: userStore.getToken,
        PageNum: PageNum.value,
        PageSize: 8
      })
      Datalist.value = Detail;
      myTotal.value = Total;
      params.value = {
        PageNum: PageNum.value,
        Total: myTotal.value
      }
    })
    const PageNum = ref(1);
    const tabIndex = ref(0);
    const params = ref({});
    const settingList = [{
      key: '0',
      name: '全部',
      component: 'PageList'
    }, {
      key: '1',
      name: '设备告警',
      component: 'PageList'
    }, {
      key: '2',
      name: '工单',
      component: 'PageList'
    }]
    const Datalist: any = ref([]);
    function handleSuccess() {
      // 提示
      info('操作成功');

    }
    function filterresult(result) {
      return dayjs.unix(result).format('YYYY-MM-DD HH:mm:ss')
    }
    async function Tab_Click(e) {
      tabIndex.value = e;
      PageNum.value = 1;
      infoDetail.Detail = null;
      const userStore = useUserStore()
      const { Detail, Total } = await NoticeList({
        Token: userStore.getToken,
        PageNum: PageNum.value,
        PageSize: 8,
        Type: tabIndex.value == 0 ? '' : tabIndex.value
      })
      Datalist.value = Detail;
      params.value = {
        PageNum: PageNum.value,
        Total: Total
      }


    }
    async function onNoticeClick(record) {

      //  显示详细内容到其他div
      // record.NoticeId
      // 对record进行类型判断
      let NoticeId = null;
      if (typeof record === "object") {
        NoticeId = record.NoticeId;
      } else {
        NoticeId = record;
      }
      const userStore = useUserStore()
      NoticeRead({
        NoticeId: [NoticeId],
        Token:userStore.getToken
      }).then(async () => {
        const userStore = useUserStore()
        const { Detail, Total } = await NoticeList({
          Token: userStore.getToken,
          PageNum: PageNum.value,
          PageSize: 8,
          Type: tabIndex.value
        })
        Datalist.value = Detail;
        params.value = {
          PageNum: PageNum.value,
          Total: Total
        }
      })
      const { Detail } = await NoticeInfo({
        NoticeId: NoticeId
      })
      infoDetail.Detail = Detail;
      // 通过设备ID查找设备
      const result = await deviceInfo({
        Id: Detail.DeviceId
      })
      infoDetail.DeviceName = result[0].DeviceName;
      infoDetail.DeviceId = result[0].DeviceId;
    }
    async function changePage(index) {
      PageNum.value = index;
      const userStore = useUserStore()
      const { Detail, Total } = await NoticeList({
        Token: userStore.getToken,
        PageNum: PageNum.value,
        PageSize: 8,
        Type: tabIndex.value
      })
      Datalist.value = Detail;
      params.value = {
        PageNum: PageNum.value,
        Total: Total
      }


    }
    function SelectUser() {
      console.log(ListRef.value[tabIndex.value].myselectedIndex, '?...myselectedIndex...?');
      if (ListRef.value[tabIndex.value].myselectedIndex !== null) {
        openModal(true, {
          NoticeId: infoDetail?.Detail?.NoticeId,
          isUpdate: false
        });
      } else {
        createConfirm({
          iconType: 'info',
          title: '提示',
          content: '至少选择一条消息',
        });
      }

    }
    function goDetail(infoDetail) {
      // 跳转具体页面
      // workorder_detail/:id

      switch (infoDetail.Detail.Type) {
        case 1:
          go('/facilityset/facility_detail/' + infoDetail.Detail.DeviceId + '/detail'); // 设备详情设备
          break;
        case 2:
          go('/system/workorder/workorder_detail/' + infoDetail.Detail?.TaskTicketNo);  //工单
          break;
      }
    }
    // 删除消息
    async function DelMsg() {

      const userId = await userStore.getUserInfo.user?.UserId
      // const userId =  await userStore.getUserInfo.user;
      console.log(userId, '?...userId...?')
      // UserId
      // 弹出确认删除提示框
      createConfirm({
        iconType: 'warning',
        title: () => h('span', '温馨提示'),
        content: () => h('span', '是否删除消息?'),
        onOk: async () => {
          await DelNotice({
            NoticeId: infoDetail?.Detail?.NoticeId,
            // 获取用户UserId
            UserId: userId
          })
        }
      })

    }
    function nextItem() {

      console.log(ListRef.value[tabIndex.value].myselectedIndex, '?...selectedIndex...?');
      console.log(Datalist.value.length, '....Datalist.length....?');

      // 当前数据长度
      if (ListRef.value[tabIndex.value].myselectedIndex < Datalist.value.length - 1) {
        ++ListRef.value[tabIndex.value].myselectedIndex;
        onNoticeClick(Datalist.value[ListRef.value[tabIndex.value].myselectedIndex].NoticeId);
        console.log(Datalist.value[ListRef.value[tabIndex.value].myselectedIndex].NoticeId, '?...NoticeId...?');

      } else {
        ListRef.value[tabIndex.value].myselectedIndex = 0;
      }


    }
    return {
      ListRef,
      prefixCls: 'account-setting',
      contentStyle: {
        height: '800px'
      },
      myTotal,
      infoDetail,
      PageNum,
      Datalist,
      registerModal,
      goDetail,
      nextItem,
      filterresult,
      changePage,
      onNoticeClick,
      SelectUser,
      handleSuccess,
      DelMsg,
      info,
      params,
      tabIndex,
      settingList,
      Tab_Click
    };
  },
});
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

  ::v-deep(.ant-tabs-content) {
    display: inline-block;
    width: 100%;
  }

  ::v-deep(.ant-tabs) {
    border: 1px solid;
    border-radius: 20px;
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
</style>

<template>
  <div :class="prefixCls">
    <Popover id="mypopup" title="" trigger="click" :overlayClassName="`${prefixCls}__overlay`">
      <Badge :count="count" dot :numberStyle="numberStyle">
        <BellOutlined />
      </Badge>
      <template #content>
        <Tabs @change="Tab_Click">
          <template v-for="item, index in listData" :key="item.key">
            <TabPane>
              <template #tab>
                {{ item.name }}
                <span v-if="item.list">({{ item.total }})</span>
              </template>
              <NoticeLists :Datalist="item.list" :params="params" :Total="myTotal" @changePage="changePage"
                @title-click="onNoticeClick" />
            </TabPane>
          </template>
        </Tabs>
        <div class="btn_container">
          <div class="btn_1" @click="AllRead">
            全部已读</div>
          <div class="btn_2" @click="SeeMore">
            查看更多</div>
        </div>
      </template>

    </Popover>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref, onMounted } from 'vue'
import { Popover, Tabs, Badge } from 'ant-design-vue'
import { BellOutlined } from '@ant-design/icons-vue'
import { tabListData } from './data'
import NoticeLists from './NoticeList.vue'
import { NoticeList, NoticeAllRead } from '@/api/demo/system';
import { useDesign } from '@/hooks/web/useDesign'
import { useUserStore } from '@/store/modules/user'
import { useGo } from '@/hooks/web/usePage';
import { useLoading } from '@/components/Loading';
import emitter from '@/utils/mybus'
export default defineComponent({
  components: { Popover, BellOutlined, Tabs, TabPane: Tabs.TabPane, Badge, NoticeLists },
  setup() {
    const { prefixCls } = useDesign('header-notify')
    const go = useGo();
    const listData = ref(tabListData);
    const Datalist: any = ref([]);
    const tabIndex = ref(0);
    const PageNum = ref(1);
    const params = ref({});
    const myTotal = ref(0);
    const [openFullLoading, closeFullLoading] = useLoading({
      tip: '加载中...',
    });
    const count = computed(() => {
      return params.value?.Total;
    })
    onMounted(async () => {
      console.log(listData.value, '?...listData...?');

    })
    function onNoticeClick(record) {
      // createMessage.success('你点击了通知，ID=' + record.id)
      // 可以直接将其标记为已读（为标题添加删除线）,此处演示的代码会切换删除线状态
      // record.titleDelete = !record.titleDelete
    }
    function handleClickChange() {
      // clicked.value = !clicked.value;
    }
    function AllRead() {
      var NoticeId: any = [];
      Datalist.value.forEach((item) => {
        NoticeId.push(item.NoticeId)
      })
      const userStore = useUserStore()
      try {
        NoticeAllRead({
          Token: userStore.getToken
        })
      } finally {
        // emit('getData');
        emitter.emit('getData');
        // location.reload();
        //调用页面的刷新方法

      }
    }
    function SeeMore() {

      let mydiv = document.getElementsByClassName('vben-header-notify__overlay').item(0);
      mydiv.style.display = 'none';
      openFullLoading();
      setTimeout(() => {
        closeFullLoading();
        go('/messagecenter/msgCenter'); // 设备详情设备
      }, 2000)


    }
    async function changePage(index) {
      PageNum.value = index;
      const userStore = useUserStore()
      const { Detail, Total } = await NoticeList({
        Token: userStore.getToken,
        PageNum: PageNum.value,
        PageSize: 4,
        Type: tabIndex.value
      })
      Datalist.value = Detail;
      params.value = {
        PageNum: PageNum.value,
        Total: Total
      }


    }
    async function Tab_Click(e) {
      tabIndex.value = e;
      const userStore = useUserStore()
      const { Detail, Total } = await NoticeList({
        Token: userStore.getToken,
        PageNum: PageNum.value,
        PageSize: 4,
        Type: tabIndex.value == 0 ? '' : tabIndex.value
      })
      Datalist.value = Detail;
      params.value = {
        PageNum: PageNum.value,
        Total: Total
      }
    }
    return {
      prefixCls,
      listData,
      Datalist,
      myTotal,
      tabIndex,
      count,
      PageNum,
      params,
      handleClickChange,
      Tab_Click,
      AllRead,
      SeeMore,
      changePage,
      onNoticeClick,
      openFullLoading,
      closeFullLoading,
      numberStyle: {}
    }
  }
})
</script>
<style lang="less" scoped>
.ant-tabs-tabpane {
  height: 400px;
  overflow-y: scroll;
}
</style>
<style lang="less">
@prefix-cls: ~'@{namespace}-header-notify';


.@{prefix-cls} {
  padding-top: 2px;

  &__overlay {
    top: 90px !important;
    width: 350px;
    max-width: 350px;

    .ant-popover-inner-content {
      // padding: 16px 16px 0 16px;
      padding: 0;
    }

    .ant-tabs-nav-wrap {
      padding: 16px 16px 0 16px;

    }

    .ant-list-item-meta {
      padding: 16px 16px 0 16px;
    }

  }

  .ant-tabs-content {
    width: 300px;
  }



  .ant-badge {
    font-size: 18px;

    .ant-badge-multiple-words {
      padding: 0 4px;
      // border: 1px solid #ebe8e8;
    }

    svg {
      width: 0.9em;
    }
  }


}

.btn_container {
  display: flex;

  .btn_1 {
    display: flex;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    text-align: center;
    flex: 1;
    text-align: center;
    height: 40px;
    border-right: 1px solid #ece9e9;
    color: rgb(22, 93, 255);
  }

  .btn_2 {
    display: flex;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    text-align: center;
    flex: 1;
    text-align: center;
    height: 40px;
    color: rgb(22, 93, 255);
  }
}
</style>

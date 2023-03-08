<template>
  <div :class="prefixCls">
    <Popover title="" trigger="click" :overlayClassName="`${prefixCls}__overlay`">
      <Badge :count="count" dot :numberStyle="numberStyle">
        <BellOutlined />
      </Badge>
      <template #content>
        <Tabs @change="Tab_Click">
          <template v-for="item in listData" :key="item.key">
            <TabPane>
              <template #tab>
                {{ item.name }}
              </template>
              <component ref="ListRef" :Datalist="Datalist" :params="params" :Total="myTotal" @changePage="changePage"
                :is="item.component" @title-click="onNoticeClick" />
            </TabPane>
          </template>
        </Tabs>
        <div style="border: 1px solid #ebe8e8;display: flex;">
          <div @click="AllRead"
            style=" display: flex;  cursor: pointer; justify-content: center; align-items: center; text-align: center; flex:1;border:1px solid #ebe8e8;text-align: center;height: 40px;">
            全部已读</div>
          <div @click="SeeMore"
            style="display: flex;  cursor: pointer;justify-content: center; align-items: center; text-align: center; flex:1;border: 1px solid #ebe8e8;text-align: center;height: 40px;;">
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
import { NoticeList, NoticeRead } from '@/api/demo/system';
import { useDesign } from '@/hooks/web/useDesign'
// import { useMessage } from '@/hooks/web/useMessage'
import { useUserStore } from '@/store/modules/user'
import { useGo } from '@/hooks/web/usePage';
// import { NoticeInfo } from '@/api/demo/system';
export default defineComponent({
  components: { Popover, BellOutlined, Tabs, TabPane: Tabs.TabPane, Badge, NoticeLists },
  setup() {
    const { prefixCls } = useDesign('header-notify')
    const go = useGo();
    // const { createMessage } = useMessage()
    const listData = ref(tabListData);
    const Datalist: any = ref([]);
    const tabIndex = ref(0);
    const PageNum = ref(1);
    const params = ref({});
    const myTotal = ref(0);
    const count = computed(() => {

      return params.value?.Total;


    })
    onMounted(async () => {
      const userStore = await useUserStore()
      const { Detail, Total } = await NoticeList({
        Token: userStore.getToken,
        PageNum: PageNum.value,
        PageSize: 4
      })
      Datalist.value = Detail;
      myTotal.value = Total;
      params.value = {
        PageNum: PageNum.value,
        Total: myTotal.value
      }
    })
    function onNoticeClick(record) {
      // createMessage.success('你点击了通知，ID=' + record.id)
      // 可以直接将其标记为已读（为标题添加删除线）,此处演示的代码会切换删除线状态
      // record.titleDelete = !record.titleDelete
    }
    function AllRead() {
      var NoticeId: any = [];
      Datalist.value.forEach((item) => {
        NoticeId.push(item.NoticeId)
      })
      const userStore = useUserStore()
      NoticeRead({
        NoticeId: NoticeId,
        Token: userStore.getToken
      })
    }
    function SeeMore() {
      // 页面跳转
      // messagecenter/msgCenter
      // /facilityset/facilitylist/detail
      go('/messagecenter/msgCenter'); // 设备详情设备

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
      Tab_Click,
      AllRead,
      SeeMore,
      changePage,
      onNoticeClick,
      numberStyle: {}
    }
  }
})
</script>
<style lang="less">
@prefix-cls: ~'@{namespace}-header-notify';

.@{prefix-cls} {
  padding-top: 2px;

  &__overlay {
    max-width: 360px;
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
</style>

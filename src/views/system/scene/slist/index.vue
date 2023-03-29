<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}-top`">
      <a-col class="bg_search" :span="6">
        <!-- 隔代事件传递 -->
        <a-input v-model:value="Name1" @pressEnter="searchScence" placeholder="请输入场景名称" />
        <Button @click="searchScence" type="primary">搜索</Button>
      </a-col>
      <Tabs>
        <template v-for="item in achieveList" :k  ey="item.key">
          <TabPane :tab="item.name">
            <component :is="item.component" :id="item.key" :set="Name2" />
          </TabPane>
        </template>
      </Tabs>
    </div>
  </div>
</template>
<script lang="ts">
import { Tag, Tabs, Row, Col, Button } from 'ant-design-vue';
import { defineComponent, computed, ref, unref } from 'vue';
import { CollapseContainer } from '@/components/Container/index';

import card from './card.vue';
import { achieveList } from './data';

export default defineComponent({
  components: {
    CollapseContainer,
    Button,
    Tag,
    Tabs,
    TabPane: Tabs.TabPane,
    card,
    [Row.name]: Row,
    [Col.name]: Col,
  },
  // emits: ['change'],
  setup(props, { emit }) {
    const tabInfo = ref(null); //获取组件的ref
    const Name1 = ref('');
    const Name2 = ref('');
    async function searchScence(value) {
      Name2.value=Name1.value
    }


    return {
      prefixCls: 'account-center',
      achieveList,
      Name1,
      Name2,
      tabInfo,
      searchScence
    };
  },
});
</script>
<style lang="less" scoped>
.account-center {
  &-col:not(:last-child) {
    padding: 0 10px;

    &:not(:last-child) {
      border-right: 1px dashed rgb(206 206 206 / 50%);
    }
  }

  &-top {
    padding: 10px;
    margin: 16px 16px 12px;
    background-color: @component-background;
    border-radius: 3px;

    .bg_search {
      position: absolute;
      display: flex;
      left: 700px;
      z-index: 9999;
    }

    &__avatar {
      text-align: center;

      img {
        margin: auto;
        border-radius: 50%;
      }

      span {
        display: block;
        font-size: 20px;
        font-weight: 500;
      }

      div {
        margin-top: 3px;
        font-size: 12px;
      }
    }

    &__detail {
      padding-left: 20px;
      margin-top: 15px;
    }

    &__team {
      &-item {
        display: inline-block;
        padding: 4px 24px;
      }

      span {
        margin-left: 3px;
      }
    }
  }

  &-bottom {
    padding: 10px;
    margin: 0 16px 16px;
    background-color: @component-background;
    border-radius: 3px;
  }
}
</style>

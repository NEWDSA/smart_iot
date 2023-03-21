<template>
  <a-list :class="prefixCls">
    <template v-for="item, index in Datalist" :key="index">
      <a-list-item @click="handleTitleClick(item, index)" class="list-item">
        <a-list-item-meta>
          <template #avatar>
            <SvgIcon :size="40" name="msg" />
          </template>
          <template #title>
            <span>{{ item.Type == 1 ? '设备告警' : '工单' }}</span>
            <div class="extra">
              <div class="info">
                <div> {{ item.Content }}</div>
                <div style="display:inline-block;float: right; text-align: right;">
                  <span :class="item?.IsRead == 0 ? 'noread' : 'read'"></span>
                  {{ item?.IsRead == 0 ? '未读' : '已读' }}
                </div>
              </div>
            </div>
          </template>
          <template #description>
            <div class="description">
              {{ filterresult(item.Basic.CreatedAt.seconds) }}
            </div>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </template>
  </a-list>
</template>
<script lang="ts">
import { Progress, Row, Col } from 'ant-design-vue';
import { defineComponent, PropType, ref } from 'vue'
import Icon from '@/components/Icon/index';
import { Button } from '@/components/Button'
import { useDesign } from '@/hooks/web/useDesign';
import { List } from 'ant-design-vue';
import { SvgIcon } from '@/components/Icon';
import { useGo } from '@/hooks/web/usePage';
import dayjs from 'dayjs';
export default defineComponent({
  components: {
    SvgIcon,
    Icon,
    Progress,
    [List.name]: List,
    [List.Item.name]: List.Item,
    AListItemMeta: List.Item.Meta,
    [Row.name]: Row,
    [Col.name]: Col,
    Button
  },
  props: {
    params: {
      type: Object,
      default: () => ({})
    },
    selectedIndex: {
      type: Number,
      default: null
    },
    Datalist: {
      type: Array,
      default: () => [],

    },
    onTitleClick: {
      type: Function
    }
  },
  emits: ['changePage'],
  setup(props, { emit }) {
    const { prefixCls } = useDesign('header-notify-list')
    const { selectedIndex, params } = props;
    const myselectedIndex = ref(null);
    const go = useGo();
    function changePage(e) {
      emit('changePage', e);

    }
    function filterresult(result) {
      return dayjs.unix(result).format('YYYY-MM-DD HH:mm:ss')
    }

    function handleTitleClick(item, index) {
      // 页面跳转
      // go('/messagecenter/msgCenter'); // 设备详情设备
      myselectedIndex.value = index;
      props.onTitleClick && props.onTitleClick(item,index)

    }

    return { prefixCls, selectedIndex, changePage, filterresult, myselectedIndex, handleTitleClick }
  }
})
</script>
<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-header-notify-list';

.@{prefix-cls} {
  &::-webkit-scrollbar {
    display: none;
  }

  ::v-deep(.ant-pagination-disabled) {
    display: inline-block !important;
  }

  &-item {
    padding: 6px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s;

    .title {
      margin-bottom: 8px;
      font-weight: normal;

      .extra {
        float: right;
        margin-top: -1.5px;
        margin-right: 0;
        font-weight: normal;

        .tag {
          margin-right: 0;
        }
      }

      .avatar {
        margin-top: 4px;
      }

      .description {
        font-size: 12px;
        line-height: 18px;
      }

      .datetime {
        margin-top: 4px;
        font-size: 12px;
        line-height: 18px;
      }
    }
  }
}

::v-deep(.ant-list-item) {
  border-bottom: 1px solid #dfcfcf;
  cursor: pointer;

  &:last-child {
    border-bottom: 1px solid #dfcfcf;

  }
}

.noread {
  position: relative;
  top: 5px;
  width: 10px;
  height: 10px;
  background: rgb(255, 205, 45);
  border-radius: 100%;
  float: right;
  left: -50px;
}

.read {
  position: relative;
  top: 5px;
  width: 10px;
  height: 10px;
  background: rgb(82, 196, 26);
  border-radius: 100%;
  float: right;
  left: -50px;
}
</style>

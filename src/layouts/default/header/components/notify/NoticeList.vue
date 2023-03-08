<template>
  <a-list :class="prefixCls" bordered>
    <template v-for="item, index in Datalist" :key="item.id">
      <a-list-item @click="handleTitleClick(item, index)" class="list-item">
        <a-list-item-meta>
          <template #avatar>
            <Icon class="icon" icon="ri:message-2-fill" />
          </template>
          <template #title>
            <span>{{ item.Type == 1 ? '设备告警' : '工单' }}</span>
            <div class="extra">
              <div class="info">
                <div>{{ filterresult(item.Basic.CreatedAt.seconds) }}</div>
                <div class="point"></div>
              </div>
            </div>
          </template>
          <template #description>
            <div class="description">
              {{ item.Content }}
            </div>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </template>
  </a-list>
</template>
<script lang="ts">
import { Progress, Row, Col } from 'ant-design-vue';
import { reactive, defineComponent, PropType, ref, watch, unref } from 'vue'
import Icon from '@/components/Icon/index';
import { Button } from '@/components/Button'
import { useDesign } from '@/hooks/web/useDesign';
import { List } from 'ant-design-vue';
import dayjs from 'dayjs';
export default defineComponent({
  components: {
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
      type: Function as PropType<(Recordable) => void>
    }
  },
  emits: ['changePage'],
  setup(props, { emit }) {
    const { prefixCls } = useDesign('header-notify-list')
    const { selectedIndex, params } = props;
    const myselectedIndex = ref(null);
    // const pagenation = reactive({
    //   current: params?.PageNum,
    //   total: params?.Total,
    //   PageSize: 4,
    //   onChange: changePage
    // })
    // watch(() => props.params, (newValue, oldValue) => {
    //   pagenation.current = newValue.PageNum;
    //   pagenation.total = newValue.Total;
    // })
    function changePage(e) {
      emit('changePage', e);

    }
    function filterresult(result) {
      return dayjs.unix(result).format('YYYY-MM-DD HH:mm:ss')
    }

    function handleTitleClick(item, index) {
      myselectedIndex.value = index;
      props.onTitleClick && props.onTitleClick(item)
    }

    return { prefixCls, selectedIndex, filterresult, myselectedIndex, handleTitleClick }
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
</style>

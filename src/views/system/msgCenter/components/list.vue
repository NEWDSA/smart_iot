<template>
  <div :class="`${prefixCls}__content`">
    <a-list bordered :pagination="pagenation">
      <template v-for="item, index in Datalist" :key="item.id">
        <a-list-item @click="handleTitleClick(item, index)" style="position: relative;"
          :class="{ selected: index == myselectedIndex }">
          <a-list-item-meta>
            <template #avatar>
              <Icon class="icon" icon="ri:message-2-fill" />
            </template>
            <template #title>
              <span>{{ item.Type == 1 ? '设备告警' : '工单' }}</span>
              <div class="extra">
                <div class="info">
                  <div>{{ filterresult(item.Basic.CreatedAt.seconds) }}</div>
                  <div style="text-align: right;">
                    <span :class="item.IsRead == 0 ? 'noread' : 'read'"></span>
                    {{ item.IsRead == 0 ? '未读' : '已读' }}
                  </div>
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
  </div>
</template>
  
<script  lang='ts'>
import { Progress, Row, Col } from 'ant-design-vue';
import { defineComponent, onMounted, ref, reactive, watch } from 'vue';
import Icon from '@/components/Icon/index';
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
      type: Function as PropType<(Recordable) => void>,
    }
  },
  emits: ['changePage'],
  setup(props, { emit }) {
    const { selectedIndex, params } = props;
    const myselectedIndex = ref(null);
    const pagenation = reactive({
      current: 1,
      total: 15,
      PageSize: 8,
      onChange: changePage
    })

    // const selectedIndex = ref(null);
    watch(() => props.params, (newValue, oldValue) => {
      console.log(newValue, '...newValue...?')
      pagenation.current = newValue.PageNum;
      pagenation.total = newValue.Total;
      console.log(oldValue, '...dfdfdf')
    })
    function changePage(e) {
      emit('changePage', e);

    }
    function handleTitleClick(item, index) {

      myselectedIndex.value = index;
      props.onTitleClick && props.onTitleClick(item);
    }
    onMounted(async () => {

    })
    function filterresult(result) {
      return dayjs.unix(result).format('YYYY-MM-DD HH:mm:ss')
    }
    return {
      prefixCls: 'list-basic',
      myselectedIndex,
      changePage,
      handleTitleClick,
      selectedIndex,
      params,
      pagenation,
      filterresult
    };
  },
});
</script>
  
<style lang="less" scoped>
.list-basic {
  &__top {
    padding: 24px;
    text-align: center;
    background-color: @component-background;

    &-col {
      &:not(:last-child) {
        border-right: 1px dashed @border-color-base;
      }

      div {
        margin-bottom: 12px;
        font-size: 14px;
        line-height: 22px;
        color: @text-color;
      }

      p {
        margin: 0;
        font-size: 24px;
        line-height: 32px;
        color: @text-color;
      }
    }
  }

  &__content {
    padding: 24px;
    // margin-top: 12px;
    // background-color: @component-background;

    .list {
      position: relative;
    }

    .icon {
      font-size: 40px !important;
    }

    .extra {
      position: absolute;
      top: 20px;
      right: 15px;
      font-weight: normal;
      text-align: right;
      color: @primary-color;
      cursor: pointer;
    }

    .description {
      display: inline-block;
      width: 40%;
    }

    .info {
      display: flex;
      flex-direction: column;
      text-align: center;

      .point {
        position: relative;

      }

      div {
        display: inline-block;
        // padding: 0 20px;

        span {
          display: block;
        }
      }
    }

    .progress {
      display: inline-block;
      width: 15%;
      vertical-align: top;
    }
  }
}

.selected {
  box-shadow: inset;
  background: #ffff;
}

::v-deep(.ant-list-item) {
  border-bottom: 1px solid #dfcfcf;
}

.noread {
  position: relative;
  top: 5px;
  width: 10px;
  height: 10px;
  background: #dbf306;
  border-radius: 100%;
  float: right;
  left: -50px;
}

.read {
  position: relative;
  top: 5px;
  width: 10px;
  height: 10px;
  background: #51f306;
  border-radius: 100%;
  float: right;
  left: -50px;
}</style>

<template>
  <div :class="`${prefixCls}__content`">
    <a-list>
      <template v-for="item, index in Datalist" :key="index">
        <a-list-item @click="handleTitleClick(item, index)" style="position: relative;"
          :class="{ selected: index == myselectedIndex }">
          <a-list-item-meta>
            <template #avatar>
              <SvgIcon :size="40" name="msg" />
            </template>
            <template #title>
              <span>{{ item?.Type == 1 ? '设备告警' : '工单' }}</span>
              <div class="extra">
                <div class="info">
                  <div>{{ filterresult(item?.Basic.CreatedAt.seconds) }}</div>
                  <div style="text-align: right;">
                    <span :class="item?.IsRead == 0 ? 'noread' : 'read'"></span>
                    {{ item?.IsRead == 0 ? '未读' : '已读' }}
                  </div>
                </div>
              </div>
            </template>
            <template #description>
              <div class="description">
                {{ item?.Content }}
              </div>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
    <Pagination hideOnSinglePage v-model:current="pagenation.current" v-model:pageSize="pagenation.PageSize"
      show-less-items :total="pagenation.total" @change="changePage"></Pagination>
  </div>
</template>
  
<script  lang='ts'>
import { Progress, Row, Col } from 'ant-design-vue';
import { defineComponent, onMounted, ref, reactive, watch } from 'vue';
import { SvgIcon } from '@/components/Icon';
import { List, Pagination } from 'ant-design-vue';
import dayjs from 'dayjs';
export default defineComponent({
  components: {
    SvgIcon,
    Progress,
    [List.name]: List,
    [List.Item.name]: List.Item,
    AListItemMeta: List.Item.Meta,
    [Row.name]: Row,
    [Col.name]: Col,
    Pagination
  },
  props: {
    params: {
      type: Object,
      default: () => ({})
    },
    total: {
      type: Number,
      default: 0
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
      type: Function,
    }
  },
  emits: ['changePage'],
  setup(props, { emit }) {
    const { selectedIndex, params } = props;
    const myselectedIndex: any = ref(null);
    // 
    selectedIndex !== null ? myselectedIndex.value = selectedIndex : ''
    const pagenation = reactive({
      current: params.current,
      total: params.Total,
      PageSize: params.PageSize,
      onChange: changePage
    })
    console.log(myselectedIndex.value,'...myselectedIndex...')
    watch(() => props.params, (newValue, oldValue) => {
      pagenation.current = newValue.current;
      pagenation.PageSize = newValue.PageSize;
      myselectedIndex.value=props.selectedIndex;
      console.log(props,'...change...')
      pagenation.total = newValue.Total;
    })
    function changePage(e) {
      console.log(myselectedIndex.value,selectedIndex,'changepAGE')
      emit('changePage', e);

    }
    function handleTitleClick(item, index) {

      myselectedIndex.value = index;
      props.onTitleClick && props.onTitleClick(item, index);
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
  cursor: pointer;

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
      color: rgb(51, 51, 51);

      .point {
        position: relative;

      }

      div {
        display: inline-block;

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

::v-deep(.ant-pagination) {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translate(-800px);
}
</style>

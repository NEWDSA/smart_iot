<template>
  <List :class="prefixCls">
    <a-row :gutter="16">
      <template v-for="item in list" :key="item.title">
        <a-col :span="6">
          <ListItem>
            <Card :hoverable="true" :class="`${prefixCls}__card`">
              <div :class="`${prefixCls}__card-title`">
                <Icon class="icon" icon="clarity:star-line" />
                {{ item.Name }}
                <Tag
                  :color="item.Status == 1 ? tagColor = '#f50' : item.Status == 2 ? tagColor = '#87d068' : tagColor = ''"
                  class="status_icon">{{ item.Status == 1 ? '离线' : item.Status == 2 ? '在线' : '' }}</Tag>
              </div>
              <div :class="`${prefixCls}__card-num`">
                <span>{{
                  item.TriggerMode == 1 ? '设备触发' : item.TriggerMode == 2 ? '定时触发' : item.TriggerMode == 3 ?
                    '手动触发' : '全部'
                }}</span>
              </div>
              <div :class="`${prefixCls}__card-num`">
                关联设备：<span>{{ item.DeviceIds }}</span>
              </div>
              <div :class="`${prefixCls}__card-num`">
                关联区域：<span>{{ item.RegionIds }}</span>
              </div>
              <Icon :class="`${prefixCls}__card-download`" v-if="item.download" :icon="item.download" />
            </Card>
          </ListItem>
        </a-col>
      </template>
    </a-row>


  </List>
  <a-row :class="`${prefixCls}`">
    <Pagination v-model:current="current" :total="50" show-less-items />
  </a-row>

</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { List, Card, Row, Col, Pagination, Tag } from 'ant-design-vue';
import Icon from '@/components/Icon/index';
import { deviceList, scenceList, regionList } from '@/api/demo/scence';
export default defineComponent({
  props: ['id'],
  components: {
    List,
    ListItem: List.Item,
    Card,
    Tag,
    Icon,
    Pagination,
    [Row.name]: Row,
    [Col.name]: Col,
  },
  setup(props, { slots }) {
    // 定义常量
    const current = ref(2);
    const tagColor = ref('#f50');
    const params = reactive({
      PageNum: 1,
      PageSize: 20,
    })
    const dataList = ref('');
    let param2 = {
      TriggerMode: props.id
    }
    Object.assign(params, param2)
    // 调用接口获取数据
    onMounted(async () => {
      const { List } = await scenceList({
        ...params
      })
      List.map(async (item) => {
        // 调用接口获取区域列表
        if (item?.DeviceIds && item.DeviceIds.lenght > 0) {
          item.DeviceIds.forEach(async (item2) => {
            await deviceList({
              DeviceId: item2
            })
          })
        }
      })

      // 调用接口获取设备列表
      await regionList({

      })
      dataList.value = List;
    })
    return {
      props,
      prefixCls: 'account-center-application',
      list: dataList,
      params,
      current,
      tagColor,
      slots
    };
  },
});
</script>
<style lang="less">
.account-center-application {
  &__card {
    width: 100%;
    margin-bottom: -12px;

    .ant-card-body {
      padding: 16px;
    }

    &-title {
      margin-bottom: 5px;
      font-size: 16px;
      font-weight: 500;

      .icon {
        margin-top: -5px;
        font-size: 22px;
      }
    }

    .status_icon {
      float: right;
    }

    &-num {
      margin-left: 24px;
      line-height: 36px;
      color: @text-color-secondary;

      span {
        margin-left: 5px;
        font-size: 18px;
      }
    }

    &-download {
      float: right;
      font-size: 20px !important;
      color: @primary-color;
    }
  }
}
</style>

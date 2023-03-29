<template>
  <List :class="prefixCls">
    <a-row :gutter="16">
      <template v-for="(item, index) in dataList" :key="item.title">
        <a-col :span="6">
          <ListItem>
            <Card :hoverable="true" :class="`${prefixCls}__card`" @click="pathDetail(item.RuleId)">
              <div :class="`${prefixCls}__card-title`">
                <Icon class="icon" icon="clarity:star-line" />
                {{ item.Name }}
                <Tag
                  :color="item.Status == 1 ? tagColor = '#87d068' : item.Status == 2 ? tagColor = '#f50' : tagColor = ''"
                  class="status_icon">{{ item.Status == 1 ? '在线' : item.Status == 2 ? '离线' : '' }}</Tag>
              </div>
              <div :class="`${prefixCls}__card-num`">
                <span>{{
                  item.TriggerMode == 1 ? '设备触发' : item.TriggerMode == 2 ? '定时触发' : item.TriggerMode == 3 ?
                    '手动触发' : '全部'
                }}</span>
              </div>
              <div v-if="item?.DeviceIds" :class="`${prefixCls}__card-num`">
                关联设备：<div class="w-full truncate ...">{{ item.DeviceNames }}</div>
              </div>
              <div v-if="item?.RegionName" :class="`${prefixCls}__card-num`">
                关联区域：<span>{{ item.RegionName }}</span>
              </div>
              <div class="bottom-but flex items-center mt-2 justify-end">

                <Popconfirm title="确认删除此场景？" ok-text="确认" cancel-text="取消"
                  @confirm="confirm(index)" @cancel="cancel">
                  <div class="bg-gray-100 py-2 px-4 mr-3 rounded" @click.stop="">
                    删除
                  </div>
                </Popconfirm>

                <div class="bg-gray-100 py-2 px-4 mr-3 rounded" @click.stop="pathDetail(index, index2)">
                  编辑</div>
                <div class=" bg-blue-600 text-white py-2 px-4 mr-3 rounded" v-if="item.Status == 2"
                  @click.stop="enableDevice(item.RuleId, index)">启用
                </div>
                <div class="bg-red-600 text-white py-2 px-4 mr-3 rounded" v-if="item.Status == 1"
                  @click.stop="disableDevice(item.RuleId, index)">
                  禁用</div>
              </div>
              <Icon :class="`${prefixCls}__card-download`" v-if="item.download" :icon="item.download" />


            </Card>
          </ListItem>
        </a-col>
      </template>
    </a-row>
  </List>
  <a-row :class="`${prefixCls}`" class="mt-4">
    <Pagination v-model:current="params.PageNum" v-model:pageSize="params.PageSize" :total="toTal" show-less-items
      @change="cutPage" />
  </a-row>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from 'vue';
import { List, Card, Row, Col, Pagination, Tag, message, Popconfirm } from 'ant-design-vue';
import Icon from '@/components/Icon/index';
import { deviceList, scenceList, regionDetail } from '@/api/demo/scence';
import { useGo } from '@/hooks/web/usePage';
import { ruleDeleteApi } from '@/api/visitor/visitor'
import { facilityRuleListApi, ruleEnableApi, ruleDisableApi } from '@/api/facility/facility'
export default defineComponent({
  props: ['id', 'set'],
  components: {
    List,
    ListItem: List.Item,
    Card,
    Tag,
    Icon,
    Pagination,
    [Row.name]: Row,
    [Col.name]: Col,
    Popconfirm
  },
  setup(props, { slots }) {
    const go = useGo();
    // 定义常量
    // const current = ref(1);
    const tagColor = ref('#f50');
    const toTal = ref(0);
    const params = reactive({
      PageNum: 1,
      PageSize: 6,
    })
    const dataList = ref([]);
    let param2 = {
      TriggerMode: props.id,
    }
    Object.assign(params, param2)
    watch(
      () => props.set,
      (value, oldValue) => {
        console.log(value, oldValue, '...打印参数...?')
        if (value !== oldValue) {
          getData(value)
        }

      }, { immediate: true }
    )

    async function getData(value) {
      // 场景
      // console.log(value,'..ddd?')

      Object.assign(params, {
        Name: value
      })
      const { List, Total } = await scenceList({
        ...params
      })
      toTal.value = Total;
      const para: any = [];
      const para3: any = [];
      console.log(List)
      // List.map(async (item) => {
      //   item.DeviceName = []
      //   // 调用接口获取区域列表
      //   if (item?.DeviceIds && item.DeviceIds.length > 0) {
      //     item.DeviceIds.forEach(async (item2) => {
      //       // 设备接口
      //       await deviceList({
      //         Id: item2
      //       }).then((res) => {
      //         para.push(...res.List);
      //       })

      //       // 设备
      //       para.map((parm2) => {
      //         if (parm2.DeviceId == item2) {
      //           item.DeviceName.push(parm2.DeviceName);
      //         }
      //       })

      //     })
      //     //区域
      //     if (item?.RegionIds && item.RegionIds.lenght > 0) {
      //       item.RegionName = [];
      //       item.RegionIds.forEach(async (item3) => {
      //         // 调用接口获取区域列表
      //         await regionDetail({
      //           RegionId: item3
      //         }).then((res) => {
      //           para3.push(...res.Detail)
      //         })

      //         para3.map((para) => {
      //           if (para.RegionId == item3) {
      //             item.RegionName.push(para.RegionName);
      //           }
      //         })
      //       })

      //     }

      //   }
      // })

      dataList.value = List;
    }
    function cutPage(e) {
      // console.log(e)
      // seachObj.PageNum = count
      params.PageNum = e
      getData()
    }

    function enableDevice(id, index) {
      console.log(dataList.value)
      ruleEnableApi({ Id: id }).then(res => {
        if (res == 0) {
          message.success('操作成功')
          dataList.value[index].Status = 1
          console.log(dataList.value)
        } else {
          message.error('操作失败')

        }
      })
    }

    function disableDevice(id, index) {
      ruleDisableApi({ Id: id }).then(res => {
        if (res == 0) {
          message.success('操作成功')
          dataList.value[index].Status = 2
        } else {
          message.error('操作失败')

        }
      })
    }

    const confirm = (index) => {
      ruleDeleteApi({Ids:[dataList.value[index].RuleId]}).then(res=>{
        if(res==0){
          message.success('删除成功');
          dataList.value.splice(index,1)
        }else{
          message.error(res)
        }
      })
    };

    const cancel = (e: MouseEvent) => {
      // console.log(e);
      // message.error('Click on No');
    };

    // 详情、编辑
    function pathDetail(id) {
      go('/scene/linkage/' + id)
    }
    // 调用接口获取数据
    onMounted(async () => {
      await getData()
    })
    return {
      props,
      prefixCls: 'account-center-application',
      dataList,
      getData,
      toTal,
      params,
      // current,
      tagColor,
      slots,
      cutPage,
      pathDetail,
      enableDevice,
      disableDevice,
      confirm,
      cancel
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

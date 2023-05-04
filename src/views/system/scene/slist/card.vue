<template>
  <List :class="prefixCls">
    <a-row :gutter="16">
      <template v-for="(item, index) in dataList" :key="item.title">
        <a-col :span="6">
          <ListItem>
            <Card :hoverable="true" :class="`${prefixCls}__card`" @click="pathDetail(item.RuleId, item.Status)">
              <div :class="`${prefixCls}__card-title flex items-center justify-between`">
                <div class="flex items-center">
                  <img :src="scenesm" alt="">

                  <span class="font-bold truncate ... ml-2 w-full text-lg">{{ item.Name }}</span>
                </div>

                <Tag
                  :color="item.Status == 1 ? tagColor = '#87d068' : item.Status == 2 ? tagColor = '#f50' : tagColor = ''"
                  class="status_icon">{{ item.Status == 1 ? '在线' : item.Status == 2 ? '离线' : '' }}</Tag>
              </div>
              <div :class="`${prefixCls}__card-num`">
                <span>{{
                  item.TriggerMode == 1 ? '条件触发' : item.TriggerMode == 2 ? '定时触发' : item.TriggerMode == 3 ?
                    '手动触发' : '全部'
                }}</span>
              </div>
              <div :class="`${prefixCls}__card-num truncate ...`" style="width: 70%;">
                关联设备 <span class="text-black" v-if="item?.DeviceIds">{{ item.DeviceNames }}</span>
              </div>
              <div :class="`${prefixCls}__card-num truncate ...`" style="width: 70%;">
                关联区域 <span class="text-black" v-if="item?.RegionNames">{{ item.RegionNames || '暂无' }}</span>
              </div>
              <div class="bottom-but flex items-center mt-2 justify-end">

                <Popconfirm title="确认删除此场景？" ok-text="确认" cancel-text="取消" @confirm="confirm(index, item.Status)"
                  @cancel="cancel">
                  <div class="bg-gray-100 py-2 px-4 mr-3 rounded" :class="item.Status == 1 ? 'text-gray-400' : ''" v-if="hasPermission(['scene_Delete_Btn'])"
                    @click.stop="">
                    删除
                  </div>
                </Popconfirm>

                <div class="bg-gray-100 py-2 px-4 mr-3 rounded" :class="item.Status == 1 ? 'text-gray-400' : ''" v-if="hasPermission(['scene_Edit_Btn'])"
                  @click.stop="pathDetail(item.RuleId, item.Status)">
                  编辑</div>
                <div class=" bg-blue-600 text-white py-2 px-4 mr-3 rounded" v-if="item.Status == 2 && hasPermission(['scene_Enable_Btn'])"
                  @click.stop="enableDevice(item.RuleId, index)">启用
                </div>
                <div class="bg-red-600 text-white py-2 px-4 mr-3 rounded" v-if="item.Status == 1 && hasPermission(['scene_Disable_Btn'])"
                  @click.stop="disableDevice(item.RuleId, index)">
                  禁用</div>
                <div class=" bg-blue-600 text-white py-2 px-4 mr-3 rounded"
                  :class="item.Status == 1 ? 'text-gray-400' : ''" v-if="item.TriggerMode == 3 && item.Status == 1 && hasPermission(['scene_execute_Btn'])"
                  @click.stop="executeRule(item.Name, item.Status)">执行
                </div>
              </div>
              <Icon :class="`${prefixCls}__card-download`" v-if="item.download" :icon="item.download" />

              <div style="position: absolute;right: 20px;top:40%">
                <img :src="scenebig" alt="">
              </div>

            </Card>
          </ListItem>
        </a-col>
      </template>
    </a-row>
  </List>
  <a-row :class="`${prefixCls}`" class="mt-4">
    <div v-if="dataList.length == 0" style="height:70vh;" class="flex items-center justify-center w-full">
      <div style="text-align: center;">
        <img :src="forr" alt="">
        <div class="mt-5">暂无联动</div>
      </div>

    </div>
    <Pagination v-model:current="params.PageNum" v-model:pageSize="params.PageSize" :total="toTal" show-less-items
      @change="cutPage" v-if="dataList.length > 0" />
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
import { send_device_command_right_away } from '@/utils/iot'
import forr from '@/assets/images/404.png'
import scenesm from '@/assets/images/sceneSm.png'
import scenebig from '@/assets/images/sceneBig.png'
import { usePermission } from '@/hooks/web/useButtonPermission';

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
    const { hasPermission } = usePermission();
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
          if (value == '') {
            getData(value, 'k')
          } else {
            getData(value)

          }
        }

      }, { immediate: true }
    )

    async function getData(value, type) {
      // 场景
      // console.log(value,'..ddd?')

      Object.assign(params, {
        Name: value
      })
      if (type) {
        params.PageNum = 1
        params.PageSize = 6
        params.Name ? delete params.Name : ''
        // params.TriggerMode ? delete params.TriggerMode : ''
      }
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
      if (List) {
        dataList.value = List;
      } else {
        dataList.value = []
      }
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

    function executeRule(id, status) {
      // if (status == 1) {
      //   message.warn('设备启用中，请禁用后再试。')
      //   return;
      // }
      // console.log(dataList.value)
      send_device_command_right_away(id)
    }

    const confirm = (index, status) => {
      if (status == 1) {
        message.warn('设备启用中，请禁用后再试。')
        return;
      }
      ruleDeleteApi({ Ids: [dataList.value[index].RuleId] }).then(res => {
        if (res == 0) {
          message.success('删除成功');
          dataList.value.splice(index, 1)
        } else {
          message.error(res)
        }
      })
    };

    const cancel = (e: MouseEvent) => {
      // console.log(e);
      // message.error('Click on No');
    };

    // 详情、编辑
    function pathDetail(id, status) {
      if (status == 1) {
        message.warn('设备启用中，请禁用后再试。')
        return;
      } else {
        go('/scene/linkage/' + id)
      }
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
      cancel,
      executeRule,
      forr,
      scenesm,
      scenebig,
      hasPermission
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
      font-size: 14px;
      font-weight: 500;

      .icon {
        margin-top: -5px;
        // font-size: 22px;
      }
    }

    .status_icon {
      float: right;
    }

    &-num {
      // margin-left: 24px;
      line-height: 36px;
      color: @text-color-secondary;

      span {
        // margin-left: 5px;
        font-size: 14px;
      }
    }

    &-download {
      float: right;
      // font-size: 20px !important;
      color: @primary-color;
    }
  }
}
</style>

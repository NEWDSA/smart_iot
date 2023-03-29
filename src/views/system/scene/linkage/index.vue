<template>
  <PageWrapper title="场景联动详情" contentBackground>
    <template #extra>
      <a-button type="primary" @click="saveThings"> 保存设置 </a-button>
    </template>
    <div class="lg:flex">
      <div class="lg:w-7/10 w-full !mr-4 enter-y">
        <span class="flex mb-4">
          <Icon icon="carbon:3d-cursor" color="#888888" size="30" />
          <span class="text-lg ml-4">场景名称</span>
        </span>
        <a-input class="" placeholder="会议室温控场景应用" v-model:value="SceneName" />
        <span class="flex mt-4 mb-4">
          <Icon icon="carbon:3d-cursor" color="#888888" size="30" />
          <span class="text-lg ml-4">触发方式</span>
        </span>
        <!-- 卡片 -->

        <ProjectCard @mychange="myevent" :loading="loading" class="enter-y" :selectedIndexPo="CardType" />
        <!-- 条件触发 -->
        <template v-if="CardType == 0">
          <!-- <evenTrigger/> -->
          <even-trigger ref="child" :InfoObj="InfoObj.Content" />
        </template>
        <!-- 定时触发 -->
        <template v-if="CardType == 1">
          <timing-trigger ref="setTime" :InfoObj="InfoObj.Content" />
        </template>
        <!-- 手动触发 -->
        <template v-if="CardType == 2">
          <hand-trigger ref="hand" :InfoObj="InfoObj.Content" />
        </template>

      </div>
      <div class="lg:w-3/10 w-full enter-y">
        <div class="scroll-wrap">
          <h1>配置说明</h1>
          <ScrollContainer class="mt-4">
            <ul class="p-3">
              <li>1.设备触发</li>
              <li>适用于多个不同设备间执行动作的联动。选择具体设备时支持指定产品下属的固定设备、全部设备或选择产品下属于具体组织的设备</li>
              <li>例如：打开综合办部门房间门的时候，打开电灯、空调。</li>
              <li>2.执行动作: </li>
              <li>支持消息通知、设备输出、延迟执行3种方式，延迟执行只在执行动作为串行时显示。另外串行模式下，多个执行动作间可以通过条件过滤判断时候继续执行后续动作。</li>
              <li>a.消息通知</li>
              <li>
                通过系统外的渠道给相关人员发送对应的通知模板内容。若钉钉消息、微信企业消息的通知模板中没有定义固定通知人，可在当前页面进行配置。同时“收信人”字段支持同步平台与微信、钉钉用户映射关系（对应类型的通知配置列表页配置），实现选择平台用户即可通知到对应的微信、钉钉用户。
                注：只有设备触发时，收信人可选择关系用户。例如：设备下线时，以微信或钉钉的方式通知该“设备负责人”（需管理员先在“关系配置”菜单中定义设备与用户的关系，然后到设备实例信息页面填写值）。 </li>
              <li>b.设备输出: </li>
              <li>联动其他设备进行功能调用、读取属性、设置属性操作。
                选择设备时支持固定设备、按标签（需在设备物模型中自定义配置）、按关系（需管理员先在“关系配置”菜单中定义设备与用户的关系，然后到设备实例信息页面填写值）3种方式。 注：只有设备触发时，被联动设备支持按关系选择。
                例如：温度传感器 > 30度时，与该设备相同“设备负责人”（自定义关系名）的空调执行打开操作。即可实现张三的温度传感器 > 30度时自动打开张三的空调，李四的温度传感器 > 30度时自动打开李四的空调。
              </li>
              <li>c.延迟执行: </li>
              <li>设置延时时间后，设备执行动作将保持当前状态，时间结束后再执行下一条动作。 房间门打开时，摄像头开启录像，延迟执行5s后，停止录像。</li>
              <li>d.条件过滤:</li>
              <li>根据当前动作执行是否成功，判断是否执行后续动作 例如：房间门打开时，执行打开空调，如果打开空调失败，给维修人员发送微信通知。</li>
            </ul>
          </ScrollContainer>
        </div>
      </div>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
import { defineComponent, ref, toRaw, onMounted, nextTick } from 'vue';
import { Description } from '@/components/Description/index';
import { Button, message } from 'ant-design-vue';
import ProjectCard from './components/ProjectCard.vue';
import evenTrigger from './components/evenTrigger.vue';
import timingTrigger from './components/timingTrigger/index.vue';
import handTrigger from './components/handTrigger/index.vue';
import { Icon } from '@/components/Icon';
import { ScrollContainer } from '@/components/Container/index';
import { BasicTable, useTable } from '@/components/Table';
import { PageWrapper } from '@/components/Page';
import { Divider } from 'ant-design-vue';
import { RuleSaveApi, RuleInfoApi, RuleEditApi } from '@/api/sys/scene';
import { BasicForm, useForm } from '@/components/Form/index';
import { useRoute, onBeforeRouteLeave } from 'vue-router';
import { useGo } from '@/hooks/web/usePage';

import {
  refundSchema,
  refundData,
  personSchema,
  personData,
} from './data';
export default defineComponent({
  components: { Description, BasicTable, PageWrapper, [Divider.name]: Divider, ScrollContainer, Icon, ProjectCard, BasicForm, useForm, Button, evenTrigger, timingTrigger, handTrigger },
  setup() {
    const go = useGo();
    const route = useRoute();
    const InfoObj = ref('');
    const resultList: any = ref(null);
    const resultListAct: any = ref(null);
    const top = ref<number>(10);
    const loading = ref(true);
    const CardType = ref(0);
    const child: any = ref(null);
    const setTime: any = ref(null);
    const hand: any = ref(null);
    const SceneName = ref()
    function dd(value) {
      console.log(value, '?...value...?')
    }
    const n = ref(1);
    function myevent(data) {
      CardType.value = data;
    }
    function add() {
      appendSchemaByField(
        {
          field: `field${n.value}a`,
          component: 'Input',
          label: '字段' + n.value,
          colProps: {
            span: 8,
          },
          required: true,
        },
        '',
      );
      appendSchemaByField(
        {
          field: `field${n.value}b`,
          component: 'Input',
          label: '字段' + n.value,
          colProps: {
            span: 8,
          },
          required: true,
        },
        '',
      );

      appendSchemaByField(
        {
          field: `${n.value}`,
          component: 'Input',
          label: ' ',
          colProps: {
            span: 8,
          },
          slot: 'add',
        },
        '',
      );
      n.value++;
    }
    function del(field) {
      removeSchemaByField([`field${field}a`, `field${field}b`, `${field}`]);
      n.value--;
    }
    function saveThings() {
      // console.log(setTime.value.myData.EndData())
      // return;

      // console.log(mergedData, 'mergedDatamergedDatamergedData')
      let EndDD: any = {}
      EndDD.Name = SceneName.value
      // EndDD.TriggerMode = 
      let mergedData: any = {};
      console.log(CardType.value)
      if (CardType.value == 0) {
        if (child.value.myData.EndData().length == 0) {
          message.warn('请选择触发条件');
          return;
        }
        if (child.value.actionData.EndData().length == 0) {
          message.warn('请选择执行动作');
          return;
        }
        mergedData.ConditionItems = child.value.myData.EndData()
        mergedData.ConditionItems.ConditionType = Number(mergedData.ConditionItems.ConditionType)
        mergedData.EchoItems = child.value.myData.EndData()
        mergedData.OperationItems = child.value.actionData.EndData()
        mergedData.OperationItems.OperationType = Number(mergedData.OperationItems.OperationType)

        for (let i = 0; i < mergedData.OperationItems.length; i++) {
          mergedData.OperationItems[i].DeviceParams = {}
          mergedData.OperationItems[i].DeviceParams[mergedData.OperationItems[i].DeviceField] = mergedData.OperationItems[i][mergedData.OperationItems[i].DeviceField]
          // enddata[i].push(FfromArr[i])
        }


        //   console.log(child.value.myData.EndData()
        //     , '..dfdrererEndData()EndData()EndData()...')
        // console.log(child.value.actionData.EndData()
        //   , '..dfdrererEndData()EndData()EndData()...')
        mergedData.TriggerType = child.value.myData.isShake == false ? 1 : 0

        mergedData.OperationMode = child.value.actionData.bcIndex

        mergedData.EntryType = 'trigger'
        EndDD.Content = JSON.stringify(mergedData)
        EndDD.DeviceIds = unique(child.value.myData.DeviceIdArr)
      }
      if (CardType.value == 1) {
        if (setTime.value.myData.EndData().length == 0) {
          message.warn('请选择定时条件');
          return;
        }
        if (setTime.value.actionData.EndData().length == 0) {
          message.warn('请选择执行动作');
          return;
        }

        let obj = setTime.value.myData.EndData()
        console.log(obj)
        mergedData.ConditionItems = null
        mergedData.EchoItems = setTime.value.myData.EndData()
        mergedData.OperationItems = setTime.value.actionData.EndData()
        mergedData.OperationItems.OperationType = Number(mergedData.OperationItems.OperationType)
        if (obj.circulationNum == '2') {
          mergedData.CronDay = obj.ExecuteDateWeek
        } else {
          mergedData.CronDay = obj.ExecuteDate
        }

        mergedData.CronType = Number(obj.ExecuteNum)

        if (obj.ExecuteNum == '1') {
          mergedData.CronTime = obj.ExecuteTime
        } else {
          mergedData.CronTimeBegin = obj.StartTime
          mergedData.CronTimeEnd = obj.EndTime

          if (obj.circulationUnit == '1') {
            mergedData.CronInterval = Number(obj.circulationTime) * 3600
          } else {
            mergedData.CronInterval = Number(obj.circulationTime) * 60
          }
        }

        for (let i = 0; i < mergedData.OperationItems.length; i++) {
          mergedData.OperationItems[i].DeviceParams = {}
          mergedData.OperationItems[i].DeviceParams[mergedData.OperationItems[i].DeviceField] = mergedData.OperationItems[i][mergedData.OperationItems[i].DeviceField]
          // enddata[i].push(FfromArr[i])
        }

        mergedData.OperationMode = setTime.value.actionData.bcIndex

        mergedData.EntryType = 'cron'
        EndDD.Content = JSON.stringify(mergedData)
        EndDD.DeviceIds = unique(setTime.value.actionData.DeviceIdArr)
      }
      if (CardType.value == 2) {
        EndDD.Content = JSON.stringify(mergedData)
        EndDD.DeviceIds = unique(child.value.myData.DeviceIdArr)
      }

      EndDD.VisitorTypeId = 1
      EndDD.RegionIds = []
      EndDD.TriggerMode = CardType.value
      // console.log(InfoObj.value)
      if (InfoObj.value != '' && InfoObj.value != 'I') {
        EndDD.RuleId = InfoObj.value.RuleId

        RuleEditApi(EndDD).then(res => {
          if (res == 0) {
            message.success('修改成功')
            go('/scene/slist')
          } else {
            var a = res.split('=')
            // console.log(a)
            message.error(a[2])
            // message.error()
          }
        })
      } else {
        RuleSaveApi(EndDD).then(res => {
          if (Array.isArray(res)) {
            message.success('新增成功')
            go('/scene/slist')
          } else {
            var a = res.split('=')
            // console.log(a)
            message.error(a[2])
            // message.error()
          }

        })
      }


      // let mergedData = {};
      // resultList.value = child.value.myData.resultList
      // 获取子组件的方法
      // console.log(child.value.actionData.getForm
      //   (), '...myson...方法...');
      // resultList.value.forEach((item) => {
      //   Object.keys(item).forEach((key) => {
      //     const result = item[key].result;
      //     const result2 = item[key].result2;
      //     if (!mergedData[key]) {
      //       mergedData[key] = [result];
      //     } else {
      //       mergedData[key].push(result);
      //     }
      //     if (result2) {
      //       mergedData[key] = mergedData[key].concat(result2);
      //     }
      //   });
      // })
      // mergedData = Object.entries(mergedData).map(([key, value]) => ({ [key]: value }));
      // Object.assign(resultList.value,child.value.myData.add);

      //   console.log(child.value.myData.add, '....rrrrr....')
      //   // debugger
      //   let result = resultList.value.reduce((acc, cur) => {
      //     Object.keys(cur).forEach(key => {
      //       if (!acc.hasOwnProperty(key)) {
      //         acc[key] = {};
      //       }
      //       Object.keys(cur[key]).forEach(subKey => {
      //         if (subKey === 'result2') {
      //           if (!Array.isArray(cur[key][subKey])) {
      //             cur[key][subKey] = [cur[key][subKey]];
      //           }
      //           if (!acc[key].hasOwnProperty(subKey)) {
      //             acc[key][subKey] = [];
      //           }
      //           acc[key][subKey] = acc[key][subKey].concat(cur[key][subKey]);
      //         } else {
      //           acc[key][subKey] = cur[key][subKey];
      //         }
      //       });
      //     });
      //     return acc;
      //   }, {});
      //   var res = child.value.myData.add
      //   Object.keys(result).forEach((key, i, v) => {
      //     res.forEach((item, index) => {
      //       if (key == index && item.hasOwnProperty('checked1')) {
      //         result[key].add = true;
      //         result[key].checked1 = item.checked1;
      //       }
      //     })
      //   })
      //   console.log(result, '...rsult...?')
      //   saveThingsAct()
    }

    // function saveThingsAct() {
    //   console.log(child.value.actionData.setData
    //     , '..dfdrerer...')
    //   // let mergedData = {};
    //   resultListAct.value = child.value.actionData.setData
    //   // 获取子组件的方法
    //   // console.log(child.value.myData.getForm
    //   //   (), '...myson...方法...');
    //   // resultListAct.value.forEach((item) => {
    //   //   Object.keys(item).forEach((key) => {
    //   //     const result = item[key].result;
    //   //     const result2 = item[key].result2;
    //   //     if (!mergedData[key]) {
    //   //       mergedData[key] = [result];
    //   //     } else {
    //   //       mergedData[key].push(result);
    //   //     }
    //   //     if (result2) {
    //   //       mergedData[key] = mergedData[key].concat(result2);
    //   //     }
    //   //   });
    //   // })
    //   // mergedData = Object.entries(mergedData).map(([key, value]) => ({ [key]: value }));
    //   // Object.assign(resultListAct.value,child.value.myData.add);

    //   console.log(child.value.myData.add, '....rrrrr....')
    //   let result = resultListAct.value.reduce((acc, cur) => {
    //     Object.keys(cur).forEach(key => {
    //       if (!acc.hasOwnProperty(key)) {
    //         acc[key] = {};
    //       }
    //       Object.keys(cur[key]).forEach(subKey => {
    //         if (subKey === 'result2') {
    //           if (!Array.isArray(cur[key][subKey])) {
    //             cur[key][subKey] = [cur[key][subKey]];
    //           }
    //           if (!acc[key].hasOwnProperty(subKey)) {
    //             acc[key][subKey] = [];
    //           }
    //           acc[key][subKey] = acc[key][subKey].concat(cur[key][subKey]);
    //         } else {
    //           acc[key][subKey] = cur[key][subKey];
    //         }
    //       });
    //     });
    //     return acc;
    //   }, {});
    //   var res = child.value.actionData.add
    //   Object.keys(result).forEach((key, i, v) => {
    //     res.forEach((item, index) => {
    //       if (key == index && item.hasOwnProperty('checked1')) {
    //         result[key].add = true;
    //         result[key].checked1 = item.checked1;
    //       }
    //     })
    //   })
    //   console.log(result,'16515156156156')
    //   for (let o in result) {
    //     // if (result[o].OperationItems[result[o].OperationItems['DeviceField']] == true || result[o].OperationItems[result[o].OperationItems['DeviceField']] == false) {
    //       result[o].OperationItems.DeviceOperation = 'set-' + result[o].OperationItems.DeviceId + '-' + result[o].OperationItems.DeviceField

    //       result[o].OperationItems.DeviceParams = {}
    //       result[o].OperationItems.DeviceParams[result[o].OperationItems.DeviceField] = result[o].OperationItems[result[o].OperationItems.DeviceField]
    //       // result[o].OperationItems.DeviceParams[result[o].OperationItems.DeviceField] = result[o].OperationItems[result[o].OperationItems.DeviceField]
    //     // } else if (result[o].OperationItems['DeviceField'] == 'switch' && !result[o].OperationItems[result[o].OperationItems['DeviceField']]) {
    //     //   result[o].OperationItems.DeviceOperation = 'set-false'
    //     // } else if (!result[o].OperationItems.equation) {
    //     //   result[o].OperationItems.DeviceOperation = 'set-' + result[o].OperationItems.DeviceId + result[o].OperationItems[result[o].OperationItems['DeviceField']]
    //     // } else {
    //     //   result[o].OperationItems.DeviceOperation = 'value' + result[o].OperationItems.equation + result[o].OperationItems[result[o].OperationItems['DeviceField']]
    //     // }
    //   }

    //     console.log(result, '...Actrsasdasdasdasdasdasdasdasdasdasdult...?')
    // }

    function unique(arr) {
      console.log(arr)
      var newArr = [];
      for (var i = 0; i < arr.length; i++) {
        if (newArr.indexOf(arr[i]) === -1) {
          newArr.push(arr[i]);
        }
      }
      return newArr;
    }
    onMounted(() => {
      // 此处可以得到用户ID
      const sceneId = ref(route.params?.id);
      console.log(sceneId)
      if (sceneId.value) {
        getRuleInfo(sceneId.value);

      }
    })

    async function getRuleInfo(id) {
      await RuleInfoApi({ 'Id': Number(id) }).then(res => {
        // debugger;
        CardType.value = res[0].TriggerMode ? res[0].TriggerMode : 0
        SceneName.value = res[0].Name

        nextTick(() => {

          InfoObj.value = res[0]
          console.log(InfoObj.value)
        })

      })
    }
    setTimeout(() => {
      loading.value = false;
    }, 1500);
    return {
      dd,
      add,
      del,
      myevent,
      saveThings,
      child,
      setTime,
      hand,
      loading,
      refundSchema,
      resultList,
      top,
      CardType,
      refundData,
      personSchema,
      personData,
      // saveThingsAct,
      resultListAct,
      SceneName,
      unique,
      getRuleInfo,
      InfoObj
    };
  },
});
</script>
<style lang="less" scoped>
.desc-wrap {
  padding: 16px;
  background-color: @component-background;
}

.scroll-wrap {
  // width: 50%;
  height: 900px;
  background-color: @component-background;
}

.vben-page-wrapper-content-bg {
  background-color: rgb(238, 28, 28);
}
</style>

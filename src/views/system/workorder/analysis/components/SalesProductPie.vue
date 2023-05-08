<template>
  <div class="md:flex">
    <Card size="default" :loading="loading" title="" class=" w-full !md:mt-0 pppo">

      <div class="flex items-center mb-3" style="justify-content: end;">
        <DatePicker v-model:value="value1" @change="changeData"></DatePicker>
        <div class="px-3"> 至 </div>
        <DatePicker v-model:value="value2" @change="changeDataa"></DatePicker>
        <!-- <Tag color="#222222">{{ 1 }}</Tag> -->
      </div>

      <div class="w-full flex">
        <div class="w-1/4 pl-5" style="border-right:1px solid #eeeeee">
          <div class="text-lg truncate ...">
            {{ deviceRef.title }}
          </div>
          <div class="mt-4 flex items-center ">
            <CountTo :startVal="1" :endVal="deviceRef.value" class="text-4xl" />
            <span class="text-3xl">小时</span>
            <!-- {{ item.value }} -->
          </div>
        </div>

        <div class="w-3/4 pl-5 flex items-center oip">
          <div class="pl-5 flex items-center" v-for="(item) in deviceList" :key="item.title" style="width: 25wh;">
            <Progress :percent="item.percentage" type="circle" stroke-linecap="square" :strokeWidth="12" :width="80"
              :showInfo="false" :strokeColor="item.color" style="display: block;" />
            <div class="pl-5">
              <div class="text-lg text-gray-500">{{ item.title }}</div>
              <div>
                <CountTo :startVal="1" :endVal="item.value" class="text-3xl" />
                <span class="text-2xl"> 单</span>
              </div>
              <div class="text-gray-400">占比 {{ item.percentage }} %</div>
            </div>
          </div>


        </div>

      </div>

    </Card>

  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue';
import { CountTo } from '@/components/CountTo/index'
// import { Icon } from '@/components/Icon
import { Tag, Card, Progress, DatePicker } from 'ant-design-vue'

import dayjs, { Dayjs } from 'dayjs';
import { TicketCountClosedTimeApi } from '@/api/sys/workorder'

const value1 = ref<Dayjs>()
const value2 = ref<Dayjs>()

const value1Time = ref()
const value2Time = ref()

defineProps({
  loading: {
    type: Boolean
  }
})

onMounted(() => {
  value1.value = dayjs(new Date(new Date(new Date().toLocaleDateString()).getTime()).valueOf())
  value2.value = dayjs(new Date(new Date(new Date().toLocaleDateString()).getTime()).valueOf())

  value1Time.value = new Date(new Date(new Date().toLocaleDateString()).getTime()).valueOf() / 1000
  value2Time.value = new Date(new Date(new Date().toLocaleDateString()).getTime()).valueOf() / 1000 + 1000
  getBoardNum()
})

function getBoardNum() {
  let obj = {
    BeginTime: value1Time.value,
    EndTime: value2Time.value
  }

  TicketCountClosedTimeApi(obj).then(res => {
    // if (res.Code == 0) {

    deviceList.value[0].value = res?.OneToThreeDayTotal
    deviceList.value[0].percentage = res?.ThreeDayRatio

    deviceList.value[1].value = res?.ThreeToFiveDayTotal
    deviceList.value[1].percentage = res?.FiveDayRatio

    deviceList.value[2].value = res?.AfterFiveDayTotal
    deviceList.value[2].percentage = res?.AfterFiveDayRatio

    deviceRef.value = res?.AverageTime

    // }
  })
}

function changeData(e, key) {
  value1Time.value = new Date(key).valueOf() / 1000
  getBoardNum()
}

function changeDataa(e, key) {
  value2Time.value = new Date(key).valueOf() / 1000
  getBoardNum()
}

const deviceRef = reactive({
  title: '工单完结平均用时',
  value: 0,
})

const deviceList = ref([
  {
    title: '0~3天',
    value: 0,
    percentage: 0,
    color: '#6FA1FF'
  },
  {
    title: '3~5天',
    value: 0,
    percentage: 0,
    color: '#9DE490'
  },
  {
    title: '5天以上',
    value: 0,
    percentage: 0,
    color: '#657798'
  },
])

</script>
<style lang="less" scoped>
.pppo .ant-card-body {
  padding-top: 15px !important;
}

.oip{
  white-space:nowrap
}
/* // 屏幕宽度小于767个象素时应用的CSS样式 */
@media (max-width: 767px) {

  .oip {
    scale: (0.7);
  }
}

/* // 屏幕宽度在767和991象素之间的CSS样式 */
@media (min-width: 768px) and (max-width: 991px) {
  .oip {
    scale: (0.7);
  }
}

@media (min-width: 992px) and (max-width: 1140px) {
  .oip {
    scale: (0.6);
  }
}

@media (min-width: 1140px) and (max-width: 1190px) {
  .oip {
    scale: (0.7);
  }
}

@media (min-width: 1190px) and (max-width: 1260px) {
  .oip {
    scale: (0.7);
  }
}

@media (min-width: 1260px) and (max-width: 1350px) {
  .oip {
    scale: 0.9;
  }
}
</style>
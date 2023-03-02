<template>
  <div class="md:flex">
    <Card size="default" :loading="loading" title="" class=" w-full !md:mt-0">

      <div class="flex items-center" style="justify-content: end;">
        <Tag color="#222222">{{ 1 }}</Tag>
      </div>

      <div class="w-full flex">
        <div class="w-1/4 pl-5" style="border-right:1px solid #eeeeee">
          <div class="text-lg truncate ...">
            {{ deviceRef.title }}
          </div>
          <div class="mt-4">
            <CountTo :decimals="1" :startVal="1" :endVal="deviceRef.value" class="text-4xl" />
            <!-- {{ item.value }} -->
          </div>
        </div>

        <div class="w-3/4 pl-5 flex items-center">
          <div class="w-1/3 pl-5 flex items-center" v-for="(item) in deviceList" :key="item.title">
            <Progress :percent="item.percentage" type="circle"
              stroke-linecap="square" :strokeWidth="12" :width="80" :strokeColor="item.color" />
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
import { Tag, Card, Progress } from 'ant-design-vue'
import { TicketCountClosedTimeApi } from '@/api/sys/workorder'

defineProps({
  loading: {
    type: Boolean
  }
})

onMounted(() => {
  getBoardNum()
})

function getBoardNum() {

  let obj: any = {
    BeginTime:1676476800, //new Date(new Date(new Date().toLocaleDateString()).getTime()).valueOf()/1000,
    EndTime: 1676646000 //new Date(new Date(new Date().toLocaleDateString()).getTime()).valueOf()/1000 + 1000,
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

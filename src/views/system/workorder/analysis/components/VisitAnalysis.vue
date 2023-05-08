<template>
  <div style="position: absolute;right:30px;top: 4%;z-index: 99999;" class="flex items-center">
    <DatePicker v-model:value="value1" @change="changeData"></DatePicker>
    <div class="px-3"> 至 </div>
    <DatePicker v-model:value="value2" @change="changeDataa"></DatePicker>
  </div>
  <div class="text-lg font-bold">工单优先级占比</div>
  <div ref="chartRef" :style="{ height, width }"></div>
</template>
<script lang="ts">
import { basicProps } from './props'
</script>
<script lang="ts" setup>
import { onMounted, ref, Ref } from 'vue'
import { useECharts } from '@/hooks/web/useECharts'
import { TaskTicketCountPriorityRatioApi } from '@/api/sys/workorder'
import { DatePicker } from 'ant-design-vue'
import dayjs, { Dayjs } from 'dayjs';
  
defineProps({
  ...basicProps
})

const value1 = ref<Dayjs>()
const value2 = ref<Dayjs>()
  
const value1Time = ref()
const value2Time = ref()


const chartRef = ref<HTMLDivElement | null>(null)
const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>)

onMounted(() => {

  value1.value = dayjs(new Date(new Date(new Date().toLocaleDateString()).getTime()).valueOf())
  value2.value = dayjs(new Date(new Date(new Date().toLocaleDateString()).getTime()).valueOf())

  value1Time.value = new Date(new Date(new Date().toLocaleDateString()).getTime()).valueOf() / 1000
  value2Time.value = new Date(new Date(new Date().toLocaleDateString()).getTime()).valueOf() / 1000 + 1000
  getParData()
})

function getParData() {
  let obj = {
    BeginTime: value1Time.value,
    EndTime: value2Time.value
    // AlarmTime: 1673366400,
  }

  TaskTicketCountPriorityRatioApi(obj).then(res => {
    if (res.length == 0) {
      // console.log(456456)
    }
    // console.log(res)
    var num = res.TaskTicketTotal
    setOptions({
      title: {
        text: num,
        left: "center",
        top: "50%",
        textStyle: {
          textAlign: "center",
          fill: "#333",
          fontSize: 30,
          fontWeight: 400,
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"

      },
      legend: {
        bottom: '1%',
        left: 'center'
      },
      graphic: {
        type: "text",
        left: "center",
        top: "40%",
        style: {
          text: "受理工单量",
          // textAlign: "center",
          fill: "#333",
          fontSize: 20,
          fontWeight: 700
        }
      },
      series: [
        {
          color: ['#47C93A', '#4580FF', '#FFBA01', '#FF4957'],
          name: '受理工单量',
          type: 'pie',
          radius: ['40%', '70%'],
          // avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            // borderWidth: 2
          },
          label: {
            show: true,
            formatter: "{c}%",
          },
          labelLine: {
            length: 5
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '12',
              fontWeight: 'bold'
            }
          },
          data: [
            { value: res?.MinimumOccupyRatio || 0, name: '低' },
            { value: res?.NormalOccupyRatio|| 0, name: '一般' },
            { value: res?.UrgentOccupyRatio || 0, name: '紧急' },
            { value: res?.VeryUrgentOccupyRatio || 0, name: '非常紧急' },
          ],
          animationType: 'scale',
          animationEasing: 'exponentialInOut',
          animationDelay: function () {
            return Math.random() * 100
          }
        }
      ]
    })


  })
}

function changeData(e, key) {
  value1Time.value = new Date(key).valueOf() / 1000
  getParData()
}

function changeDataa(e, key) {
  value2Time.value = new Date(key).valueOf() / 1000
  getParData()
}

const height = ref('400px')
</script>

<style lang="less">
  
</style>
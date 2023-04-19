<template>
  <div style="position: absolute;right:30px;">
    <DatePicker v-model:value="value1" @change="changeData"></DatePicker>
  </div>
  <div v-if="show == false">
    <div class="text-lg font-bold">告警类别占比</div>
    <div ref="chartRef" :style="{ height, width }"></div>
  </div>
  <!-- <div > -->
  <div v-else class=" text-2xl text-red-600 font-bold flex justify-center pt-1/2">当日暂无告警</div>
  <!-- </div> -->
</template>
<script lang="ts">
import { basicProps } from './props'
</script>
<script lang="ts" setup>
import { onMounted, ref, Ref } from 'vue'
import {DatePicker} from 'ant-design-vue'
import { useECharts } from '@/hooks/web/useECharts'
import { facilityAlertDataApi } from '@/api/facility/facility'
import dayjs, { Dayjs } from 'dayjs'

defineProps({
  ...basicProps
})
const chartRef = ref<HTMLDivElement | null>(null)
const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>)
const show = ref(false)
const value1 = ref<Dayjs>()

onMounted(() => {
value1.value = dayjs(new Date(new Date(new Date().toLocaleDateString()).getTime()).valueOf())
  getBarData()
})

function getBarData(time) {
  if (time) {
    var obj = {
      AlarmTime:time,
      // AlarmTime: 1673366400,
    }
  } else {
    var obj = {
      AlarmTime: new Date(new Date(new Date().toLocaleDateString()).getTime()).valueOf() / 1000,
      // AlarmTime: 1673366400,
    }
  }


  facilityAlertDataApi(obj).then(res => {
    if (res.length == 0) {
      console.log(456456)
    }
    console.log(res)
    console.log(res.ExceptionAlertTotal,res.FaultAlertTotal)
    console.log(res.ExceptionAlertTotal + res.FaultAlertTotal)
    var a = res.ExceptionAlertTotal ? res.ExceptionAlertTotal : 0
    var b = res.FaultAlertTotal ? res.FaultAlertTotal : 0
    var c = res.OtherAlertTotal ? res.OtherAlertTotal : 0
    var num =  a+b+c
    // console.log(num)
    if (num == 0) {
      show.value = true
    }else{
      show.value = false
    }
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
          text: "告警量",
          // textAlign: "center",
          fill: "#333",
          fontSize: 20,
          fontWeight: 700
        }
      },
      series: [
        {
          color: ['#5ab1ef', '#b6a2de', '#67e0e3'],
          name: '',
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
            formatter: "{d0}%",
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
            { value: res?.ExceptionAlertTotal, name: '异常告警' },
            { value: res?.FaultAlertTotal, name: '故障告警' },
            { value: res?.OtherAlertTotal, name: '其他告警' },
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

  getBarData(new Date(key).valueOf() / 1000)

}

const height = ref('400px')
</script>

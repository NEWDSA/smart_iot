<template>
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
defineProps({
  ...basicProps
})
const chartRef = ref<HTMLDivElement | null>(null)
const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>)

onMounted(() => {
  let obj = {
    BeginTime: 1676476800,//new Date(new Date(new Date().toLocaleDateString()).getTime()).valueOf()/1000,
    EndTime:1676646000
    // AlarmTime: 1673366400,
  }

  TaskTicketCountPriorityRatioApi(obj).then(res => {
    if(res.length == 0){
      // console.log(456456)
    }
    console.log(res)
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
          color: ['#47C93A', '#4580FF', '#FFBA01','#FF4957'],
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
            { value: res?.MinimumOccupyRatio, name: '低' },
            { value: res?.NormalOccupyRatio, name: '一般' },
            { value: res?.UrgentOccupyRatio, name: '紧急' },
            { value: res?.VeryUrgentOccupyRatio, name: '非常紧急' },
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


})
const height = ref('400px')
</script>

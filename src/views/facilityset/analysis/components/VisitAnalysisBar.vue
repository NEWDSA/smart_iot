<template>
  <div ref="chartRef" :style="{ height, width }"></div>
</template>
<script lang="ts">
import { basicProps } from './props'
</script>
<script lang="ts" setup>
import { onMounted, ref, Ref } from 'vue'
import { useECharts } from '@/hooks/web/useECharts'

defineProps({
  ...basicProps
})

const chartRef = ref<HTMLDivElement | null>(null)
const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>)
onMounted(() => {
  setOptions({
    title: {
      text: '用电数据趋势图',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        lineStyle: {
          width: 1,
          color: '#019680'
        }
      }
    },
    grid: { left: '1%', right: '1%', top: '2  %', bottom: 0, containLabel: true },
    xAxis: {
      type: 'category',
      data: [...new Array(12)].map((_item, index) => `${index + 1}月`),
      "axisTick": {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      max: 8000,
      splitNumber: 4,
      "axisLine": {     //x轴坐标轴
        "show": false
      },
      axisLabel: {
        show: false
      },
      axisTick: {		//x轴刻度线
        show: false
      },
      splitLine: {
        show: false
      }

    },
    series: [
      {
        data: [3000, 2000, 3333, 5000, 3200, 4200, 3200, 2100, 3000, 5100, 6000, 3200, 4800],
        type: 'bar',
        barMaxWidth: 80
      }
    ]
  })
})

const height = ref('400px')
</script>

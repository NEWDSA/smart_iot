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
      text: '访问来源'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: '1%',
      left: 'center'
    },
    series: [
      {
        color: ['#5ab1ef', '#b6a2de', '#67e0e3', '#2ec7c9'],
        name: '访问来源',
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
          formatter: "{c}",
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
          { value: 1048, name: '搜索引擎' },
          { value: 735, name: '直接访问' },
          { value: 580, name: '邮件营销' },
          { value: 484, name: '联盟广告' }
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
const height = ref('400px')
</script>

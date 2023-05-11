<template>
  <!-- <Card title="设备列表"> -->
  <div ref="chartRef" :style="{ height, width }"></div>
  <!-- </Card> -->
</template>
<script lang="ts">
import { basicProps } from '../props';
</script>
<script setup lang='ts'>
import '@/utils/lib/flexible';
import { onMounted, ref, Ref } from 'vue';
import { useECharts } from '@/hooks/web/useECharts';
import { Card } from 'ant-design-vue';
defineProps({
  ...basicProps,
});

const chartRef = ref<HTMLDivElement | null>(null);
const { setOptions, resize } = useECharts(chartRef as Ref<HTMLDivElement>);
onMounted(() => {
  setOptions({
    title: {
      text: '设备列表',
      left: 'left',
      // top:30,
      textStyle:{
        color:'#fff'
      }
      
    },
    backgroundColor: '#000416',
    grid: {
      // top: 70
    },
    colors: [
      "#c4ebad",
      "#6be6c1",
      "#a0a7e6",
      "#96dee8",
      "#3fb1e3"],
    xAxis: {
      show: false
    },
    yAxis: [{
      type: 'category',
      offset: -18,
      show: true,
      data: ['空调', '排气扇', '路灯', '广播', '中央空调', '小型发电机', '柴油发电机', '光伏发电机', '巡逻车', '监控', '闸门', '中央空调', '呼吸机'],
      // inverse: true,
      axisLine: { show: false },
      splitLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        align: "left",
        verticalAlign: "bottom",
        fontSize: 14,
        lineHeight: 32,
        color: '#FFFF'
      }
    }, {
      type: 'category',
      show: true,
      inverse: true,
      data: [683, 234, 234, 523, 345, 320, 280, 271, 254, 229, 210, 190, 182],
      axisLabel: {
        color: '#fff',
        align: "right",
        fontSize: 16,
        lineHeight: 32,
        verticalAlign: "bottom",
      },
      axisLine: { show: false },
      splitLine: { show: false },
      axisTick: { show: false },
    }],
    series: [{
      type: 'bar',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(220, 220, 220, 0.5)',
        borderRadius: [20, 20, 20, 20] //半透明灰色
        // barBorderRadius: [20, 20, 20, 20]
      },
      yAxisIndex: 0,
      data: [683, 234, 234, 523, 345, 320, 280, 271, 254, 229, 210, 190, 182],
      barWidth: 7,
      // barOffset: '-50%',
      itemStyle: {

        barBorderRadius: 50,
        color: '#17FEF0', //蓝色
      }
    }]
  })
  resize();
  // height: 1.3125rem
  //  height: 2.8125rem
})
</script>
  
<style></style>

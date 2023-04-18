<template>
  <div class="flex w-full">
    <div ref="chartRef" :style="{ width, height }"></div>
  </div>
</template>
  
<script setup lang='ts'>
import { Ref, ref, watch } from 'vue';
import { useECharts } from '@/hooks/web/useECharts';
const props = defineProps({
  loading: Boolean,
  width: {
    type: String as PropType<string>,
    default: '100%',
  },
  height: {
    type: String as PropType<string>,
    default: '300px',
  },
});
const chartRef = ref<HTMLDivElement | null>(null);
const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);
watch(
  () => props.loading,
  () => {

    if (props.loading) {
      return;
    }
    setOptions({
      tooltip: {},
      title: [{
        top: '30',
        right: '75%',
        text: '电力总负载数2',
        textStyle: {
          fontSize: 12,
        }
      }, {
        top: '30',
        left: '35%',
        text: '电力总负载数',
        textStyle: {
          fontSize: 12
        }
      }],
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Email',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: 'Union Ads',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
          name: 'Video Ads',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: [150, 232, 201, 154, 190, 330, 410]
        }
      ],
    });

  },
  { immediate: true },
);
</script>
  
<style></style>

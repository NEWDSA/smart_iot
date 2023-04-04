<template>
  <div>
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
      series: [
        {
          type: 'pie',
          center: ['50%', '50%'],
          radius: ['70%', '60%'],
          label: {
            position: 'center',
            fontWeight: 'bolder',
            formatter: '',
          },
          data: [
            {
              value: [90],
              name: '访问',
              label: {
                show: true
              },
              itemStyle: {
                color: '#888f96',
              },
            }
          ],
        },
        {
          type: 'pie',
          radius: ['80%', '75%'],
          label: {
            show: false
          },
          data: [
            {
              value: [20],
              name: '访问',
              itemStyle: {
                color: '#F6FFFB',
              }
            },
            {
              value: [80],
              name: '购买',
              itemStyle: {
                color: '#06FFA5',
              },
            },
          ]
        }, {
          type: 'pie',
          radius: ['90%', '88%'],
          label: {
            show: false
          },
          data: [
            {
              value: [80],
              name: '访问',
              itemStyle: {
                color: '#ffffff',
              },
            },
            {
              value: [20],
              name: '购买',
              itemStyle: {
                color: '#888f96',
              },
            },
          ]
        }
      ],
    });
  },
  { immediate: true },
);
</script>
  
<style></style>

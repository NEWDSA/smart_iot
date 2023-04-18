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
const { setOptions, echarts } = useECharts(chartRef as Ref<HTMLDivElement>);

import mapsrc from '@/utils/city/zhuhai.json'
echarts.registerMap('zhuhai', mapsrc); //注册地图
watch(
  () => props.loading,
  () => {
    if (props.loading) {
      return;
    }
    setOptions({
      geo: {
        map: 'zhuhai',
        label: {

        },
        roam: true,
        itemStyle: {

        }
      }
    });

  },
  { immediate: true },
);
</script>
  
<style></style>

<template>
  <div class="flex flex-wrap justify-center w-full">
    <div style="width: 50%;">
      <div ref="chartRef" :style="{ width, height }"></div>
      <div style="border: 1px solid blue;color: #ffffff;">
        10/08/2022 17:00:00
      </div>
    </div>
    <div class="flex" style="width:50%;border: 1px solid blue;">
      <span style="text-align: center;width: 100%;height: 50px;line-height: 50px; border: 1px solid red;" >今日用电情况
        <span class="title_sub">截止当前</span>
        <div style="width:100%;height: 100%; border: 1px solid pink;"></div>
      </span>
    </div>
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
// const chartRef2 = ref<HTMLDivElement | null>(null);
const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);
// const { setOptions: mysetOptions } = useECharts(chartRef2 as Ref<HTMLDivElement>);
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
      series: [
        {
          type: 'pie',
          radius: ['25%', '15%'],
          center: ['13%', '45%'],
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
        }, {
          type: 'pie',
          radius: ['25%', '15%'],
          center: ['45%', '45%'],
          // radius: ['90%', '88%'],
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
  
<style lang="less" scoped>
  .title_sub{

  }
</style>

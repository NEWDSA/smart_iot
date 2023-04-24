<template>
  <div style="display: flex;align-items: center;">
    <div ref="chartRef" :style="{ width, height, flex: 2 }"></div>
    <div style="width: 400px;color: #fffff;">
      <div style="margin: 10px;height:fit-content;">
        <table style="background-color:gray;color: #ffff;width: 100%;" border="1">
          <tr>
            <th style="text-align: left;">25,25</th>
            <th style="text-align: left;">2,22</th>
          </tr>
          <tr>
            <td style="text-align: left;">运行设备一台</td>
            <td style="text-align: left;">离线设备一台</td>
          </tr>
        </table>
      </div>
      <div style="margin: 10px;display: flex;align-items: center;">
        <Progress :width="30" type="circle" :percent="25">
          <template #format="percent">
            <span style="color: #ffff;">{{ percent }}</span>
          </template>
        </Progress>
        <span style="color: #ffff;margin-left: 10px;">空调设备</span>
        <div style="color: #ffff;margin-left: auto;margin-right: 10px;">250/2000</div>
      </div>
      <div style="margin: 10px;display: flex;align-items: center;">
        <Progress :width="30" type="circle" :percent="20">
          <template #format="percent">
            <span style="color: #ffff;">{{ percent }}</span>
          </template>
        </Progress>
        <span style="color: #ffff;margin-left: 10px;">空气净化器</span>
        <div style="color: #ffff;margin-left: auto;margin-right: 10px;">400/2000</div>
      </div>

    </div>
  </div>
</template>
  
<script setup lang='ts'>
import { Ref, ref, watch } from 'vue';
import { Progress } from 'ant-design-vue'
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

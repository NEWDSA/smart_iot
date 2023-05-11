<template>
  <!-- <Card title="设备列表"> -->

  <div class="flex justify-between items-center" style="color: #fff;font-size: .2rem /* 16/80 */;background: rgba(0, 0, 0, 0.4); height: .55rem
  /* 44/80 */
  ;
  font-size: .2rem
  /* 16/80 */
  ; ">
    <span class="flex items-center item_1">
      <img src="@/assets/images/Subtract.png" />
      <span>数据统计</span>
    </span>
    <span>
      <span>天</span>
      <span>/</span>
      <span>周</span>
      <span>/</span>
      <span>月</span>
    </span>

  </div>
  <div class="flex" style="width: 100%;height:.55rem /* 44/80 */; ">
    <!-- rgb(129, 141, 149) -->
    <div class="w-1/3 flex justify-center items-center text-white" style="border: 1px solid #818D95;height: .55rem /* 44/80 */; ">
      <img style="width: .175rem /* 14/80 */;" src="@/assets/images/visitor.png" />
      <span>访客流量</span>
    </div>
    <div class="w-1/3 flex justify-center items-center text-white" style="border: 1px solid #18FEFE; height: .55rem /* 44/80 */; ">
      <img style="width: .175rem /* 14/80 */; " src="@/assets/images/power.png" />
      <span>用电统计</span>
    </div>
    <div class="w-1/3 flex justify-center items-center text-white" style="border: 1px solid #818D95;height: .55rem /* 44/80 */; ">
      <img style="width: .175rem /* 14/80 */;" src="@/assets/images/water.png" />
      <span>用水统计</span>
    </div>
  </div>
  <!-- <div ref="chartRef" :style="{ height, width }"></div> -->
  <div ref="chartRef" style="width: 100%; height:2.5rem /* 200/80 */; " ></div>
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
const { setOptions, echarts, resize } = useECharts(chartRef as Ref<HTMLDivElement>);
onMounted(() => {
  setOptions({
    // backgroundColor: '#0c2d55',
    tooltip: {
      trigger: 'axis',
    },
    color: ['#fcba62', '#69f0ff'],
    legend: {
      show: false
      // x: 'left',
      // top: '11%',
      // left: '15%',
      // textStyle: {
      //   color: '#68a9ff',
      //   fontSize: 14,
      //   padding: [0, 8, 0, 8]
      // }
    },
    grid: {
      // top: '15%',
      // left: '10%',
      // right: '5%',
      // bottom: '15%',
    },
    xAxis: [
      {
        type: 'category',
        axisLine: {
          lineStyle: {
            color: '#425b78'
          }
        },
        axisLabel: {
          color: '#b9bec6',
        },
        splitLine: {
          show: false,
        },
        boundaryGap: false,
        data: ['1', '2', '3', '4', '5', '6', '7'], //this.$moment(data.times).format("HH-mm") ,
      },
    ],

    yAxis: [
      {
        type: 'value',
        min: -2,
        max: 8,
        nameTextStyle: {
          color: "#b9bec6",
          fontSize: 12,
        },
        axisLine: {
          lineStyle: {
            color: '#425b78',
            fontSize: 14
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#587485',
          },
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#b9bec6',

          },
        },
      },
    ],
    series: [
      {
        name: '监测点1',
        type: 'line',
        showSymbol: false,
        lineStyle: {
          normal: {
            color: '#fcba62',
          },
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: 'rgba(223,172,105,0.5)',
                },
                {
                  offset: 1,
                  color: 'rgba(212,190,161,0)',
                },
              ],
              false
            ),
          },
        },
        data: [4, 7, 5, 4, 3, 5, 8], //data.values
      },
      {
        name: '监测点2',
        type: 'line',
        showSymbol: false,
        lineStyle: {
          normal: {
            color: '#69f0ff',
          },
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: 'rgba(107,205,216,0.5)',
                },
                {
                  offset: 1,
                  color: 'rgba(143,192,127,0)',
                },
              ],
              false
            ),
          },
        },
        data: [3, 5, 4, 2, 1, 7, 6], //data.values
      },
      {
        name: '监测点3',
        type: 'line',
        showSymbol: false,
        lineStyle: {
          normal: {
            color: '#69f0ff',
          },
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: 'rgba(143,192,127,0)',
                },
                {
                  offset: 1,
                  color: 'rgba(107,205,216,0.5)',
                },
              ],
              false
            ),
          },
        },
        data: [2, 4, 3, 1, 0, 6, 5], //data.values
      },
    ],
  })
  resize();
  // height: 1.3125rem
  //  height: 2.8125rem
})
</script>
  
<style lang="less" scoped>
.item_1 {
  img {
    width: .25rem
      /* 20/80 */
    ;
    height: .25rem
      /* 20/80 */
    ;
  }
}
</style>

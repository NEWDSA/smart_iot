<template>
  <div class="p-4">
    <div style="height: 300px" ref="chartRef" id="echarts"></div>
    <div class="indoor" id="indoor">
      <div class="block_1">
        <div class="block_contianer">多功能会议室</div>
      </div>
      <div class="block_2">
        <div class="block_contianer">会议室</div>
      </div>
      <div class="block_3">
        <div class="block_contianer">开放办公区</div>
      </div>
      <div class="block_4">
        <SvgIcon class="svg_4" size="50" name="light_on" />
        <div class="block_contianer">直播室</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, Ref } from 'vue'
import { SvgIcon } from '@/components/Icon'

import { useECharts } from '@/hooks/web/useECharts'
import echartUtil from '@/utils/echarts'
const chartRef = ref<HTMLDivElement | null>(null)
let option: any = reactive({})
const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>)
onMounted(() => {
  init()
})
function init() {
  option = echartUtil.getEchartOption()
  //获取数据
  let serieData: any = []
  let xAxisData: any = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  let legendData = ['衣服', '裤子']
  let metaDate = [echartUtil.getRandomArray(7), echartUtil.getRandomArray(7)]

  //处理数据
  for (let i = 0; i < legendData.length; i++) {
    let serie: any = echartUtil.getEchartOption().series
    if (i % 2 === 0) {
      serie.type = 'bar'
    } else {
      serie.type = 'line'
    }
    serie.name = legendData[i]
    serie.data = metaDate[i]
    serieData.push(serie)
    serie.barGap = '0'
  }

  //个性化配置
  option.tooltip.formatter = function (params) {
    params['units'] = ['件', '条']
    return echartUtil.getEchartOption().tooltip.formatter(params)
  }
  option.tooltip.textStyle.color = '#57617B'
  option.yAxis.name = '单位：数量'
  option.xAxis.data = xAxisData
  option.legend.data = legendData
  option.series = serieData
  option.legend = {
    top: 'bottom'
  }
  //图表设置配置
  setOptions({ ...option })
}
</script>
<style lang="less">
.indoor {
  position: relative;
  width: 1000px;
  height: 280px;
  background: url('@/assets/images/indoors.png') no-repeat;
  background-size: contain;

  .block_1 {
    position: absolute;
    width: 170px;
    height: 195px;
    line-height: 195px;
    text-align: center;
    color: #fff;
    background-color: rgba(255, 0, 0, 0.3);
  }

  .block_2 {
    position: absolute;
    left: 275px;
    width: 82px;
    height: 170px;
    line-height: 180px;
    text-align: center;
    color: #fff;
    background-color: rgba(255, 0, 0, 0.3);
  }

  .block_3 {
    position: absolute;
    left: 365px;
    width: 330px;
    height: 195px;
    line-height: 195px;
    text-align: center;
    color: #fff;
    background-color: rgba(255, 0, 0, 0.3);
  }

  .block_4 {
    position: absolute;
    left: 760px;
    width: 100px;
    height: 75px;
    line-height: 75px;
    text-align: center;
    color: #fff;
    background-color: rgba(255, 0, 0, 0.3);

    .svg_4 {
      position: absolute;
      margin: auto;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
}
</style>

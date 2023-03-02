<template>
  <div class="flex justify-between">
    <div class="text-lg font-bold">用电数据趋势图</div>
    <div class="flex text-lg">
      <div class="text-lg mr-1" :class="type == 'day' ? 'text-blue-600' : 'text-black-600'"
        @click="changeCharTime('day')">
        日
      </div> /
      <div class="text-lg mx-1" :class="type == 'week' ? 'text-blue-600' : 'text-black-600'"
        @click="changeCharTime('week')">
        周
      </div> /
      <div class="text-lg ml-1" :class="type == 'month' ? 'text-blue-600' : 'text-black-600'"
        @click="changeCharTime('month')">
        月
      </div>
    </div>

  </div>
  <div ref="chartRef" :style="{ height, width }"></div>
</template>
<script lang="ts">
import { basicProps } from './props'
</script>
<script lang="ts" setup>
import { onMounted, ref, Ref } from 'vue'
import { useECharts } from '@/hooks/web/useECharts'
import { facilityTrendRatioApi } from '@/api/facility/facility'

const props = defineProps({
  ...basicProps,
})

const chartRef = ref<HTMLDivElement | null>(null)
const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>)
onMounted(() => {
  getTrendRatio()
})

const type = ref('day')

function getTrendRatio() {
  let obj = {
    Type: type.value,
    Number: type.value == 'day' ? 30 : type.value == 'week' ? 12 : 12,
    Field: 'electricityConsumption'
  }
  facilityTrendRatioApi(obj).then(res => {
    if (res.Code == 200) {
      let xAxisdata: any = []
      let seriesdata: any = []
      for (let i = res.List.length - 1; i > -1; i--) {
        if(type.value =='day'){
          xAxisdata.push(changeData(res.List[i].StartTime.seconds))
        }else{
          xAxisdata.push(changeData(res.List[i].StartTime.seconds) + '~' + changeData(res.List[i].StopTime.seconds))
        }
        
        seriesdata.push(res.List[i].Num)
      }

      setOptions({
        // title: {
        //   text: '用电数据趋势图',
        // },
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
          data: xAxisdata,
          "axisTick": {
            show: false
          },
          axisLabel: {//坐标轴刻度标签的相关设置。
            interval: 0,
            rotate: -45,
            formatter: function (params: string) {
              var newParamsName = "";
              var paramsNameNumber = params.length;
              if(type.value == 'day'){
                var provideNumber = 10; //一行显示几个字
              }else{
                var provideNumber = 5; //一行显示几个字
              }
              var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
              if (paramsNameNumber > provideNumber) {
                for (var p = 0; p < rowNumber; p++) {
                  var tempStr = "";
                  var start = p * provideNumber;
                  var end = start + provideNumber;
                  if (p == rowNumber - 1) {
                    tempStr = params.substring(start, paramsNameNumber);
                  } else {
                    tempStr = params.substring(start, end) + "\n";
                  }
                  newParamsName += tempStr;
                }
              } else {
                newParamsName = params;
              }
              return newParamsName;
            },
          },
          
        },
        yAxis: {
          type: 'value',
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
            data: seriesdata,
            type: 'bar',
            barMaxWidth: 80
          }
        ]
      })


    }

  })

}

function changeCharTime(ctype: string) {
  type.value = ctype

  getTrendRatio()
}

function changeData(time: number) {
  var date = new Date(time * 1000);
  // var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';

  // var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
  // var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
  // var s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
  var strDate = M + D;
  return strDate
}

const height = ref('400px')
</script>

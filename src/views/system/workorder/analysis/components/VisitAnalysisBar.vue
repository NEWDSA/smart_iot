<template>
  <div class="flex justify-between">
    <div class="text-lg font-bold">工单量数据趋势</div>
    <div class="flex text-lg">
      <div class="text-lg mr-1" :class="type == 1 ? 'text-blue-600' : 'text-black-600'" @click="changeCharTime(1)">
        日
      </div> /
      <div class="text-lg mx-1" :class="type == 2 ? 'text-blue-600' : 'text-black-600'" @click="changeCharTime(2)">
        周
      </div> /
      <div class="text-lg ml-1" :class="type == 3 ? 'text-blue-600' : 'text-black-600'" @click="changeCharTime(3)">
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
import { TaskTicketCountTrendApi } from '@/api/sys/workorder'

const props = defineProps({
  ...basicProps,
})

const chartRef = ref<HTMLDivElement | null>(null)
const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>)
onMounted(() => {
  getTrendRatio()
})

const type = ref(1)

function getTrendRatio() {
  let obj = {
    TypeForTrend: type.value,
  }
  TaskTicketCountTrendApi(obj).then(res => {
    // if (res.Code == 200) {
    let xAxisdata: any = []
    let seriesdata: any = []

    if (type.value == 1) {
      for (let i = res.TrendForDay.length - 1; i > -1; i--) {
        xAxisdata.push(res.TrendForDay[i].TimeAxis)
        seriesdata.push(res.TrendForDay[i].Quantity)
      }
    }
    if (type.value == 2) {
      for (let i = res.TrendForWeek.length - 1; i > -1; i--) {
        xAxisdata.push(res.TrendForWeek[i].TimeAxis)
        seriesdata.push(res.TrendForWeek[i].Quantity)
      }
    }

    if (type.value == 3) {
      for (let i = res.TrendForMonth.length - 1; i > -1; i--) {
        xAxisdata.push(res.TrendForMonth[i].TimeAxis)
        seriesdata.push(res.TrendForMonth[i].Quantity)
      }
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
            if (type.value == 1) {
              var provideNumber = 10; //一行显示几个字
            } else {
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


    // }

  })

}

function changeCharTime(ctype: Number) {
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

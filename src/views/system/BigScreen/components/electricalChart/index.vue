<template>
  <!-- <Card title="设备列表"> -->

  <div class="flex">
    <!-- <div class="flex flex-col text-left"> -->
      <!-- <div style="height: .55rem;background: rgba(0, 0, 0, 0.4);  ">
        <div class="flex">
          <img style="width: .25rem /* 20/80 */;" src="@/assets/images/Subtract.png" />
          <span>电力负载</span>
        </div>

      </div> -->
      <div :style="{ width }" style="width:300px;height: 200px;" ref="chartRef"></div>
    <!-- </div> -->

    <div class="" style="text-align: center;" :style="{ height, width }">
      <div style="margin-top: 20%;">
        今日用电情况
        <span style="color: #18FEFE;">[截止当前]</span>
      </div>

      <div class="flex justify-between" style="">
        <div class="float-left flex flex-col">
          <CountTo style="font-size:30px;display: block;" :color="'#fff'" :startVal="10000" :endVal="500000"
            :duration="8000" />
          <div style="color: #9BA3AA;">今日用电量</div>
        </div>
        <div class="float-right flex flex-col">
          <CountTo style="font-size:30px;" :color="'#fff'" :startVal="10000" :endVal="500000" :duration="8000" />
          <span style="color: #9BA3AA;">昨日用电量</span>
        </div>

      </div>

    </div>
  </div>
  <!-- </Card> -->
</template>
<script lang="ts">
import { basicProps } from '../props';
</script>
<script setup lang='ts'>
import '@/utils/lib/flexible';
import { onMounted, ref, Ref } from 'vue';
import { useECharts } from '@/hooks/web/useECharts';
import { CountTo } from '@/components/CountTo/index';
defineProps({
  ...basicProps,
});

const chartRef = ref<HTMLDivElement | null>(null);
const { setOptions, resize } = useECharts(chartRef as Ref<HTMLDivElement>);
onMounted(() => {
  setOptions({
    // backgroundColor: '#161627',
    title: [
      {
        text: '标题',
        textStyle: {
          fontSize: 12,
          color: 'black'
        },
        left: '2%'
      },
      {
        text: '当前班次' + '\n' + '总用电量',
        subtext: '24678.29',
        textStyle: {
          fontSize: 14,
          color: '#FFA951',
          fontWeight: 'normal'
        },
        subtextStyle: {
          fontSize: 10,
          color: '#fff'
          // fontWeight: 'bold'
        },
        textAlign: 'center',
        x: '48%',
        y: '40%'
      }
    ],

    tooltip: {
      trigger: 'item',
      formatter: function (parms) {
        // var str =  parms.seriesName+"</br>"+
        var str =
          parms.marker +
          '' +
          parms.data.legendname +
          '</br>' +
          '数量：' +
          parms.data.value +
          ' 个</br>' +
          '占比：' +
          parms.percent +
          '%'
        return str
      }
    },

    series: [
      {
        name: '标题',
        type: 'pie',
        center: ['50%', '50%'],
        radius: ['40%', '50%'],
        clockwise: false, //饼图的扇区是否是顺时针排布
        avoidLabelOverlap: false,
        itemStyle: {
          borderColor: '#0d035c',
          borderWidth: 5
        },
        label: {
          show: true,
          normal: {
            fontSize: 14,
            color: '#fff',
            formatter: function (params) {
              console.log(params, 'params')
              var str = ''
              switch (params.name) {
                case '平台运营部':
                  str = '{a|' + params.value + '%' + '}\n' + '美装' + ''
                  break
                case '营销一部':
                  str = '{b|' + params.value + '%' + '}\n' + '环保' + ''
                  break
                case '市场拓展一部':
                  str = '{e|' + params.value + '%' + '}\n' + '焊接' + ''
                  break
                case '市场拓展二部':
                  str = '{d|' + params.value + '%' + '}\n' + '特箱' + ''
                  break
                case '跨境电商部':
                  str = '{c|' + params.value + '%' + '}\n' + '冷作' + ''
                  break
              }
              return str
            },
            rich: {
              a: {
                fontSize: 14,
                color: '#03c781',
                width: 38,
                height: 38,
                lineHeight: 30,
                align: 'left'
              },
              b: {
                fontSize: 14,
                color: '#03acd1',
                width: 38,
                height: 38,
                lineHeight: 30,
                align: 'left'
              },
              c: {
                fontSize: 14,
                color: '#ff7708',
                width: 38,
                height: 38,
                lineHeight: 30,
                align: 'left'
              },
              d: {
                fontSize: 14,
                color: '#0055ff',
                width: 38,
                height: 38,
                lineHeight: 30,
                align: 'left'
              },
              e: {
                fontSize: 14,
                color: '#96b497',
                width: 38,
                height: 38,
                lineHeight: 30,
                align: 'left'
              },
              nameStyle: {
                fontSize: 14,
                color: '#555',
                align: 'left'
              },
              rate: {
                fontSize: 14,
                color: '#1ab4b8',
                align: 'left'
              }
            },
            padding: [0, -10]
            // height: 35
          }
        },
        labelLine: {
          show: true,
          length: 20,
          length2: 35,
          smooth: false
        },
        data: [
          { value: 80, legendname: '营销一部', name: '营销一部', itemStyle: { color: '#03acd1' } },
          { value: 150, legendname: '平台运营部', name: '平台运营部', itemStyle: { color: '#03c781' } },
          { value: 45, legendname: '市场拓展一部', name: '市场拓展一部', itemStyle: { color: '#96b497' } },
          { value: 150, legendname: '市场拓展二部', name: '市场拓展二部', itemStyle: { color: '#0055ff' } },
          { value: 150, legendname: '跨境电商部', name: '跨境电商部', itemStyle: { color: '#ff7708' } }
        ],
        z: 9
      },
      {
        center: ['50%', '50%'], //仪表的位置
        name: '刻度', //仪表的名字
        type: 'gauge', //统计图类型为仪表
        radius: 160, //统计图的半径大小
        min: 0, //最小刻度
        max: 100, //最大刻度
        splitNumber: 9, //刻度数量
        startAngle: 1, //开始刻度的角度
        endAngle: 360, //结束刻度的角度
        axisLine: {
          //设置默认刻度盘上的刻度不显示，重新定义刻度盘
          show: false,
          lineStyle: {
            width: 1,
            color: [[1, 'rgba(255,255,255,0)']]
          }
        }, //仪表盘轴线
        axisLabel: {
          //仪表盘上的数据
          show: false,
          color: '#4d5bd1', //仪表盘上的轴线颜色
          distance: 2 //图形与刻度的间距
        }, //刻度标签。
        axisTick: {
          show: true,
          splitNumber: 6, //刻度的段落数
          lineStyle: {
            color: '#00FCF7',
            width: 1, //刻度的宽度
            shadowColor: '#67FFFC',
            shadowBlur: 2
          },
          length: 8 //刻度的长度
        }, //刻度样式
        pointer: {
          //表盘上的指针
          show: false
        },
        itemStyle: {
          color: '#18c8ff'
        },

        splitLine: {
          //文字和刻度的偏移量
          show: true,
          length: 15, //便宜的长度
          lineStyle: {
            color: '#00FCF7',
            width: 4,
            shadowColor: '#67FFFC',
            shadowBlur: 4
          }
        }, //分隔线样式
        z: 1
      },
      {
        center: ['50%', '50%'], //仪表的位置
        name: '刻度', //仪表的名字
        type: 'gauge', //统计图类型为仪表
        radius: 80, //统计图的半径大小
        min: 0, //最小刻度
        max: 100, //最大刻度
        splitNumber: 9, //刻度数量
        startAngle: 0, //开始刻度的角度
        endAngle: 360, //结束刻度的角度
        axisLine: {
          //设置默认刻度盘上的刻度不显示，重新定义刻度盘
          show: false,
          lineStyle: {
            width: 1,
            color: [[1, 'rgba(255,255,255,0)']]
          }
        }, //仪表盘轴线
        axisLabel: {
          //仪表盘上的数据
          show: false,
          color: '#4d5bd1', //仪表盘上的轴线颜色
          distance: 2 //图形与刻度的间距
        }, //刻度标签。
        axisTick: {
          show: true,
          splitNumber: 6, //刻度的段落数
          lineStyle: {
            color: '#06AEFC',
            width: 2, //刻度的宽度
            shadowColor: '#67FFFC',
            shadowBlur: 2
          },
          length: 8 //刻度的长度
        }, //刻度样式
        pointer: {
          //表盘上的指针
          show: false
        },
        itemStyle: {
          color: '#18c8ff'
        },

        splitLine: {
          //文字和刻度的偏移量
          show: true,
          length: 15, //便宜的长度
          lineStyle: {
            color: '#06AEFC',
            width: 2,
            shadowColor: '#67FFFC',
            shadowBlur: 1
          }
        }, //分隔线样式
        z: 4
      },

    ]
  })
  resize();
  // height: 1.3125rem
  //  height: 2.8125rem
})
</script>
  
<style></style>

<template>
  <!-- <Card title="设备列表"> -->
  <!-- <div ref="chartRef" :style="{ height, width }"></div> -->
  <div ref="chartRef1" :style="{ height, width }"></div>
  <!-- </Card> -->
</template>
<script lang="ts">
import { basicProps } from '../props';
</script>
<script setup lang='ts'>
import '@/utils/lib/flexible';
import { onMounted, ref, Ref } from 'vue';
import { useECharts } from '@/hooks/web/useECharts';
defineProps({
  ...basicProps,
});

const chartRef = ref<HTMLDivElement | null>(null);
const chartRef1 = ref<HTMLDivElement | null>(null);
// const { setOptions, resize } = useECharts(chartRef as Ref<HTMLDivElement>);
const { setOptions: setOptions1, resize: resize1, echarts: echarts1 } = useECharts(chartRef1 as Ref<HTMLDivElement>);
onMounted(() => {
  var msg = {
    data: [25, 35.5, 46.5, 56.5, 63.5, 67.5, 77.5, 90],
    total: 100,
    percentdata: ["32%", "40%", "50%", "65%", "70%", "75%", "80%", "90%"],
    leftname: [
      "古溪镇",
      "分界镇",
      "新街镇",
      "黄桥镇",
      "曲霞镇",
      "虹桥镇",
      "滨江镇",
      "泰州市",
    ],
  };
  var data = [];
  var totaldata = [];
  var percentdata = [];
  // $.each(msg.data, function (key, value) {
  //   totaldata.push(81.3);
  //   data.push((81.3 * value) / 100);
  //   percentdata.push(Math.round((value / msg.total) * 100) + "%");
  // });
  var fillImg =
    "data:image/png;base64,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";
  // setOptions({
  //   grid: {
  //     top: "5.9%",
  //     left: "19.55%",
  //     bottom: 0,
  //   },
  //   xAxis: [
  //     {
  //       show: false,
  //     },
  //   ],
  //   yAxis: [
  //     {
  //       axisTick: "none",
  //       // axisLine: "none",
  //       // offset: "10",
  //       axisLabel: {
  //         margin: 27.5,
  //         // textStyle: {
  //         //   color: "#8aa3b0",
  //         //   fontSize: "14",
  //         // },
  //       },
  //       data: [],
  //     },
  //     {
  //       axisTick: "none",
  //       // axisLine: "none",
  //       type: "category",
  //       // axisLabel: {
  //       //   margin: -31,
  //       //   textStyle: {
  //       //     color: "#d9dddf",
  //       //     fontSize: "16",
  //       //   },
  //       // },
  //       data: percentdata,
  //     },
  //     {
  //       name: "",
  //       // nameGap: "50",
  //       nameTextStyle: {
  //         color: "#000",
  //         fontSize: "16",
  //       },
  //       axisLine: {
  //         lineStyle: {
  //           color: "rgba(0,0,0,0)",
  //         },
  //       },
  //       data: [],
  //     },
  //   ],
  //   series: [
  //     {
  //       name: "", // blue bar
  //       type: "pictorialBar",
  //       symbol: "image://" + fillImg,
  //       barWidth: "100%",
  //       symbolOffset: [5, 0],
  //       itemStyle: {
  //         borderWidth: 5,
  //         // barBorderRadius: 5,
  //         color: "#6DE8FA",

  //       },
  //       symbolSize: ["67%", 13],
  //       symbolBoundingData: 100,
  //       symbolClip: true,
  //       data: data,
  //       label: {

  //         show: false,

  //       },
  //       animationEasing: "elasticOut",
  //     },
  //     {
  //       name: "外框",
  //       type: "bar",
  //       yAxisIndex: 2,
  //       barGap: "-100%",
  //       data: totaldata,
  //       barWidth: 20,
  //       // barCategoryGap:'200',
  //       itemStyle: {
  //         // normal: {
  //         //   color: "#131a27", //填充色
  //         //   barBorderColor: "#c7cad0", //边框色
  //         //   barBorderWidth: 1, //边框宽度
  //         //   barBorderRadius: 0, //圆角半径
  //         //   label: {
  //         //     //标签显示位置
  //         //     show: false,
  //         //     position: "top", //insideTop 或者横向的 insideLeft
  //         //   },
  //         // },
  //       },
  //       z: 0,
  //     },
  //   ],
  // })
  setOptions1({
    // title: {
    //   text: "水量变化",
    //   subtext: "纯属虚构",
    //   textStyle: {
    //     color: "#fff",
    //   },
    // },
    // backgroundColor: "#242842",
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
    },
    color: ["#0080ff", "#4cd5ce"],
    toolbox: {
      // feature: {
      //     saveAsImage: {}
      // }
    },
    grid: {
      left: "5%",
      right: "5%",
      top: "40%",
      bottom: "5%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: ["2019 05/20",
          "2019 05/24",
          "2019 05/27",
          "2019 05/29 ",
          "2019 05/02 ",
          "2019 05/08"],
        axisLabel: {
          show: true,
          textStyle: {
            color: "#6ba1bb",
            fontSize: 12,
          },
          formatter: function (value) {
            //debugger
            var ret = ""; //拼接加\n返回的类目项
            var maxLength = 5; //每项显示文字个数
            var valLength = value.length; //X轴类目项的文字个数
            var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
            if (rowN > 1) {
              //如果类目项的文字大于3,
              for (var i = 0; i < rowN; i++) {
                var temp = ""; //每次截取的字符串
                var start = i * maxLength; //开始截取的位置
                var end = start + maxLength; //结束截取的位置
                //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                temp = value.substring(start, end) + "\n";
                ret += temp; //凭借最终的字符串
              }
              return ret;
            } else {
              return value;
            }
          },
        },
        axisLine: {
          lineStyle: {
            color: "#0a2b52",
            width: 0.5, //这里是为了突出显示加上的
          },
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        axisLine: {
          onZero: false,
          lineStyle: {
            color: "#0a2b52",
            width: 1, //这里是为了突出显示加上的
          },
        },

        axisLabel: {
          formatter: function (val) {
            return val + "";
          },
          show: true,
          textStyle: {
            color: "#6ba1bb", //字体颜色
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            type:'solid',
          },
        },
      },
    ],
    series: [
      {
        name: "最高水量",
        type: "line",
        smooth: true,
        symbol: "none", //去掉折线点
        stack: '100',
        areaStyle: {
          // normal: {
          //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
          color: new echarts1.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "#CB8993", // 0% 处的颜色
            },
            {
              offset: 0.5,
              color: "#CB8993", // 100% 处的颜色
            },
            {
              offset: 1,
              color: "#CC56CB", // 100% 处的颜色
            },
          ]), //背景渐变色
        }, //线条样式
        lineStyle: {
          width: 0.5,
          type: "solid",
          color: "#CC56CB"
        },
        emphasis: {

          lineStyle: {
            width: 0.5,
            type: "dotted",
            color: "#02675f", //折线的颜色
          }
        },
        data: [20, 60, 50, 80, 120, 100],
      },
      {
        name: "最低水量",
        type: "line",
        smooth: true,
        symbol: "none", //去掉折线点
        stack: "100",
        areaStyle: {
          //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
          color: new echarts1.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "#64CAFA", // 0% 处的颜色
            },
            {
              offset: 0.5,
              color: "#64CAFA", // 100% 处的颜色
            },
            {
              offset: 1,
              color: "#0078D7", // 100% 处的颜色
            },
          ]),

        }, //线条样式
        lineStyle: {
          width: 0.5,
          type: "solid",
          color: "#0078D7"
        },
        emphasis: {

          lineStyle: {
            width: 0.5,
            type: "dotted",
            color: "#02675f", //折线的颜色
          }
        },
        symbolSize: 5, //折线点的大小
        data: [20, 70, 60, 80, 100, 90],
      },
      {
        name: '湿度',
        type: 'line',
        stack: '100',
        smooth: true,
        lineStyle: {
          width: 0
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts1.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(55, 162, 255)'
            },
            {
              offset: 1,
              color: 'rgb(116, 21, 219)'
            }
          ])
        },
        emphasis: {
          focus: 'series'
        },
        data: [20, 80, 90, 100, 120, 88]
      }
    ],
  })

  // setOptions({
  //   grid: {
  //     top: '0',
  //     left: '0',
  //     bottom: '0'
  //   },
  //   xAxis: {

  //   },
  //   yAxis: {

  //   }
  // })
  // resize();
  // height: 1.3125rem
  //  height: 2.8125rem
})
</script>
  
<style></style>

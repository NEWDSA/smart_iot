<template>
  <a-layout id="show_screen" class="layout">
    <!-- 头部 -->
    <a-layout-header class="header">
      <div class="brand">
        <img src="@/assets/images/LOGO-title.png" />
      </div>
      <div class="float-right flex items-center mr-2">
        <div class="ml-auto" id="showTime">{{ currentTime }}</div>
        <FullscreenOutlined class="other_brand ml-1" role="close" @click="toggle" />
      </div>

    </a-layout-header>
    <!-- end 头部 -->
    <a-layout class="md:flex my_content">
      <!-- 左侧边栏 -->
      <a-layout-sider style="background: rgb(0, 4, 22);" className="sider">
        <div class="h-1/2">
          <GlobalPreview ref="PlatformSourceRef" />
        </div>
        <div class="h-1/2">
          <StatisticsLine :height="staticHeight" />
        </div>
      </a-layout-sider>
      <!-- end 左侧边栏 -->
      <!-- 中间内容区域 -->
      <a-layout-content id="myboxall" class="md:w-1/3  content">
        <Icon @click="plusIcon('plus')" style="position: absolute; top: .125rem /* 10/80 */;right: 0; z-index: 999; "
          :size="70" color="#fff" icon="ion:md-add-circle" />
        <Icon @click="plusIcon('min')" style="position: absolute; top: 1.75rem /* 140/80 */;right: 0;z-index: 999; "
          :size="70" color="#fff" icon="ion:ios-minus-outline" />
        <div>

        </div>
        <img ref="dragbg" id="dragbg" :style="'width:' + bgimg + '%' + ';' + 'height:' + bgheight + '%'"
          style="position: absolute;top:20%;left: 0;right: 0;" src="@/assets/images/modules1.png" />
      </a-layout-content>
      <!-- end 中间内容区域 -->
      <!-- 右侧边栏 -->
      <a-layout-sider ref="myheight" className="sider" style="background: rgb(0, 4, 22);">

        <div style="position: relative;height: 100%;width: 100%;">

          <VisitRadar :height="sheight" class="w-full h-full" />
        </div>
      </a-layout-sider>
      <!-- end 右侧边栏 -->
    </a-layout>
    <!-- 底部 -->
    <a-layout-footer class="footer">
      <div class="flex">
        <!-- height: 2.7rem; -->
        <VisitorTable style="width: 20%; height:2.7rem /* 170/80 */;" />
        <ElectricalChart style="width: 30%;height:2.7rem /* 170/80 */;" :height="myheights" />
        <EnvironmentData :height="myheights" style="width: 30%;height:2.7rem;" />
        <!-- <ElectricalChart :width="mywidth" :height="myheights" style=" height:2.7rem /* 170/80 */;" />
        <EnvironmentData :height="myheights" style="width:5.5125rem /* 441/80 */;height:2.7rem;" /> -->
        <GpsLocation style="width: 20%; height: 2.7rem;" />
      </div>

    </a-layout-footer>
    <!-- end 底部 -->
  </a-layout>
</template>

<script setup lang="ts">
import { ref, Ref, onMounted, reactive, nextTick } from 'vue';
import dayjs from 'dayjs';
import { Icon } from '@/components/Icon';
import '@/utils/lib/flexible';
import $ from 'jquery';
import { PlusCircleTwoTone, PlusCircleOutlined, MinusSquareOutlined } from '@ant-design/icons-vue'
import { FullscreenExitOutlined, FullscreenOutlined, CloseOutlined } from '@ant-design/icons-vue';
import { api as fullscreen } from 'vue-fullscreen'
import VisitRadar from './components/deviceList/index.vue';
import GlobalPreview from './components/globalPreview/index.vue'
import StatisticsLine from './components/statisticsLine/index.vue'
import VisitorTable from './components/visitorTable/index.vue'
import ElectricalChart from './components/electricalChart/index.vue'
import EnvironmentData from './components/environmentData/index.vue'
import GpsLocation from './components/gpsLocation/index.vue'
import GeoGap from './components/geograp/index.vue'
import { useECharts } from '@/hooks/web/useECharts';
import { Drag } from '@/utils/lib/hammerDrag';
import mapsrc from '@/utils/city/zhuhai.json' //引入珠海市地图数据
// import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons-vue'
import { ECharts } from 'echarts';
const chartRef = ref<HTMLDivElement | null>(null);
const chartRef2 = ref<HTMLDivElement | null>(null);
const chartRef3 = ref<HTMLDivElement | null>(null);
const chartRef4 = ref<HTMLDivElement | null>(null);
const PlatformSourceRef = ref<ChartExpose>();
const sheight = 'clac(100vh - 4.125rem)';
const myheights = 'calc(2.7rem)';
const bgimg = ref(80);
const bgheight = ref(70);
const mywidth = '300px';
const staticHeight = '247px';
// const mylayout = ref();
const dragbg = ref();
const myheight: Ref<HTMLDivElement | null> = ref(null);
const root = ref();
const { setOptions, echarts, resize } = useECharts(chartRef as Ref<HTMLDivElement>);
const { setOptions: setOptions2, echarts: echart2 } = useECharts(chartRef2 as Ref<HTMLDivElement>);
const { setOptions: setOptions3, echarts: echart3 } = useECharts(chartRef3 as Ref<HTMLDivElement>);
const { setOptions: setOptions4, echarts: echart4 } = useECharts(chartRef4 as Ref<HTMLDivElement>);
// 声明echarts实例
interface ChartProps {
  [key: string]: ECharts | null;
}
// const isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen || document.msFullscreenElement
interface ChartExpose {
  initChart: (params: any) => ECharts;
}


// echart2.registerMap('zhuhai', mapsrc); //注册地图

const currentTime = ref(dayjs().format('YYYY/MM/DD HH:mm:ss'));
const collapsed = false;
const theme = 'dark';
const mode = 'inline';
const collapsedWidth = 80;
setOptions2({
  geo: {
    map: 'zhuhai',
    label: {

    },
    roam: true,
    itemStyle: {

    }
  }
});
let platFromData = [
  {
    value: 40,
    name: "智慧文旅平台",
    percentage: "40%"
  },
  {
    value: 10,
    name: "携程",
    percentage: "10%"
  },
  {
    value: 20,
    name: "飞猪",
    percentage: "20%"
  },
  {
    value: 30,
    name: "其他渠道",
    percentage: "30%"
  }
];

const hammer = ref();
const state = reactive({
  fullscreen: false,
  teleport: true,
})
var XData = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月"];
var yData = [1243, 2315, 1164, 3021, 3521, 4121, 2001, 1983, 1432];
var uploadCnt = [];
var updateCnt = [];
var legal_person_data = {
  "uploadData": [{ "count": 630 }, { "count": 986 }, { "count": 792 }, { "count": 642 }, { "count": 521 }, { "count": 573 }
    , { "count": 832 }, { "count": 747 }, { "count": 983 }, { "count": 836 }, { "count": 831 }, { "count": 633 }],
  "updateData": [{ "count": 110 }, { "count": 181 }, { "count": 123 }, { "count": 197 }, { "count": 123 }, { "count": 173 }
    , { "count": 123 }, { "count": 151 }, { "count": 101 }, { "count": 152 }, { "count": 101 }, { "count": 177 }],
  "viewData": [{ "count": 651 }, { "count": 842 }, { "count": 223 }, { "count": 223 }, { "count": 221 }, { "count": 812 }
    , { "count": 928 }, { "count": 219 }, { "count": 613 }, { "count": 254 }, { "count": 981 }, { "count": 301 }]
};
var viewCnt = [];
if (legal_person_data.uploadData != null) {
  for (var i = 0; i < legal_person_data.uploadData.length; i++) {
    uploadCnt.push(legal_person_data.uploadData[i].count);
  }
}
if (legal_person_data.updateData != null) {
  for (var i = 0; i < legal_person_data.updateData.length; i++) {
    updateCnt.push(legal_person_data.updateData[i].count);
  }
}

if (legal_person_data.viewData != null) {
  for (var i = 0; i < legal_person_data.viewData.length; i++) {
    viewCnt.push(legal_person_data.viewData[i].count);
  }
}
setOptions3({
  tooltip: {
    trigger: 'axis',
    formatter: function (params, ticket, callback) {
      var res = '';
      for (var i = 0, l = params.length; i < l; i++) {
        res += '' + params[i].seriesName + ' : ' + params[i].value + '<br>';
      }
      return res;
    },
    transitionDuration: 0,
    backgroundColor: 'rgba(83,93,105,0.8)',
    borderColor: '#535b69',
    borderRadius: 8,
    borderWidth: 2,
    padding: [5, 10],
    axisPointer: {
      type: 'line',
      lineStyle: {
        type: 'dashed',
        color: '#ffff00'
      }
    }
  },
  legend: {
    icon: 'circle',
    itemWidth: 8,
    itemHeight: 8,
    itemGap: 10,
    top: '16',
    right: '10',
    data: ['数据总量', '共享次数', '更新量'],
    textStyle: {
      fontSize: 10,
      color: '#a0a8b9'
    }
  },
  grid: {
    top: '46',
    left: '13%',
    right: '10',
    //bottom: '10%',
    containLabel: false
  },
  xAxis: [{
    type: 'category',
    boundaryGap: false,
    axisLabel: {
      interval: 0,
      fontSize: 10
    },
    axisLine: {
      show: false,
      lineStyle: {
        color: '#a0a8b9'
      }
    },
    axisTick: {
      show: false
    },
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月'],
    offset: 10
  }],
  yAxis: [{
    type: 'value',
    axisLine: {
      show: false,
      lineStyle: {
        color: '#a0a8b9'
      }
    },
    axisLabel: {
      margin: 10,
      textStyle: {
        fontSize: 10
      }
    },
    splitLine: {
      lineStyle: {
        color: '#2b3646'
      }
    },
    axisTick: {
      show: false
    }
  }],
  series: [{
    name: '数据总量',
    type: 'line',
    smooth: true,
    showSymbol: false,
    lineStyle: {
      normal: {
        width: 2
      }
    },
    areaStyle: {
      normal: {
        color: new echart3.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: 'rgba(137, 189, 27, 0.3)'
        }, {
          offset: 0.8,
          color: 'rgba(137, 189, 27, 0)'
        }], false),
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowBlur: 10
      }
    },
    itemStyle: {
      normal: {
        color: '#1cc840'
      }
    },
    data: uploadCnt
  }, {
    name: '共享次数',
    type: 'line',
    smooth: true,
    showSymbol: false,
    lineStyle: {
      normal: {
        width: 2
      }
    },
    areaStyle: {
      normal: {
        color: new echart3.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: 'rgba(219, 50, 51, 0.3)'
        }, {
          offset: 0.8,
          color: 'rgba(219, 50, 51, 0)'
        }], false),
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowBlur: 10
      }
    },
    itemStyle: {
      normal: {
        color: '#eb5690'
      }
    },
    data: viewCnt
  }, {
    name: '更新量',
    type: 'line',
    smooth: true,
    showSymbol: false,
    lineStyle: {
      normal: {
        width: 2
      }
    },
    areaStyle: {
      normal: {
        color: new echart3.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: 'rgba(0, 136, 212, 0.3)'
        }, {
          offset: 0.8,
          color: 'rgba(0, 136, 212, 0)'
        }], false),
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowBlur: 10
      }
    },
    itemStyle: {
      normal: {
        color: '#43bbfb'
      }
    },
    data: updateCnt
  }
  ]
})
// 设置
setOptions4({
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' }
  },
  grid: {
    left: '0%',
    top: '10px',
    right: '0%',
    bottom: '4%',
    containLabel: true
  },
  xAxis: [{
    type: 'category',
    data: ['浙江', '上海', '江苏', '广东', '北京', '深圳', '安徽'],
    axisLine: {
      show: true,
      lineStyle: {
        color: "rgba(255,255,255,.1)",
        width: 1,
        type: "solid"
      },
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      interval: 0,
      // rotate:50,
      show: true,
      splitNumber: 15,
      textStyle: {
        color: "rgba(255,255,255,.6)",
        fontSize: '12',
      },
    },
  }],
  yAxis: [{
    type: 'value',
    axisLabel: {
      //formatter: '{value} %'
      show: true,
      textStyle: {
        color: "rgba(255,255,255,.6)",
        fontSize: '12',
      },
    },
    axisTick: {
      show: false,
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: "rgba(255,255,255,.1	)",
        width: 1,
        type: "solid"
      },
    },
    splitLine: {
      lineStyle: {
        color: "rgba(255,255,255,.1)",
      }
    }
  }],
  series: [
    {

      type: 'bar',
      data: [1500, 1200, 600, 200, 300, 300, 900],
      barWidth: '35%', //柱子宽度
      // barGap: 1, //柱子之间间距
      itemStyle: {
        normal: {
          color: '#27d08a',
          opacity: 1,
          barBorderRadius: 5,
        }
      }
    }

  ]
})
onMounted(async () => {
  // init()
  Drag('#dragbg')
  PlatformSourceRef.value?.initChart({
    data: platFromData,
    colors: ["#078dbc", "#6ad40b", "#6172fc", "#1786ff", "#ffbe2f", "#4dc89d", "#b797df", "#ffd3aa"]
  })
  setOptions({
    grid: {
      top: 30
    },
    colors: [
      "#c4ebad",
      "#6be6c1",
      "#a0a7e6",
      "#96dee8",
      "#3fb1e3"],
    xAxis: {
      show: false
    },
    yAxis: [{
      type: 'category',
      // position: 'left',
      offset: -18,
      show: true,
      data: ['空调', '排气扇', '路灯', '广播', '中央空调', '小型发电机', '柴油发电机', '光伏发电机', '巡逻车', '监控', '闸门', '中央空调', '呼吸机'],
      // inverse: true,
      axisLine: { show: false },
      splitLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        align: "left",
        verticalAlign: "bottom",
        fontSize: 14,
        lineHeight: 32,
        color: '#FFFF'
      }
    }, {
      type: 'category',
      show: true,
      inverse: true,
      data: [683, 234, 234, 523, 345, 320, 280, 271, 254, 229, 210, 190, 182],
      axisLabel: {
        color: '#fff',
        align: "right",
        fontSize: 16,
        lineHeight: 32,
        verticalAlign: "bottom",
        // textStyle: { color: '#fff' }
      },
      axisLine: { show: false },
      splitLine: { show: false },
      axisTick: { show: false },
    }],
    series: [{
      type: 'bar',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(220, 220, 220, 0.5)',
        borderRadius: [20, 20, 20, 20] //半透明灰色
        // barBorderRadius: [20, 20, 20, 20]
      },
      yAxisIndex: 0,
      data: [683, 234, 234, 523, 345, 320, 280, 271, 254, 229, 210, 190, 182],
      barWidth: 7,
      // barOffset: '-50%',
      itemStyle: {

        // barBorderRadius: 50,
        color: '#17FEF0', //蓝色
      },
      // label: {
      //   normal: {
      //     show: true,
      //     position: 'right',
      //     formatter: '{c}',
      //     textStyle: { color: 'rgba(255,255,255,.5)' }
      //   }
      // },
    }]
  })
  await nextTick();
  // 设置初始高度
  updateChartHeight(myheight.value?.$el.clientHeight, myheight.value?.$el.offsetWidth); // 设置初始高度
  // resize();
  // 监听window窗口变化
  window.onresize = async () => {
    // 获取指定元素的高度
    await nextTick(() => {
      console.log(myheight.value?.$el.clientHeight, '...layout...');
      updateChartHeight(myheight.value?.$el.clientHeight, myheight.value?.$el.offsetWidth); // 设置初始高度
      resize();
    });




  }

  // window.addEventListener('resize', handleResize);
  // const handleResize = () => {
  //   setTimeout(() => {
  //     updateChartHeight(myheight.value?.$el.clientHeight);
  //   }, 100);
  // }

  $('.fire1').click(function () {

    if ($("div").find('.device-box2').css('display') == 'none') {
      $('.video-box2').hide();
      $("div").find('.device-box2').show();
    } else {
      $("div").find('.device-box2').hide();
    }
  })

  $('.fire2').click(function () {

    if ($("div").find('.device-box1').css('display') == 'none') {
      $('.video-box1').hide();
      $("div").find('.device-box1').show();
    } else {
      $("div").find('.device-box1').hide();
    }
  })
  setInterval(() => {
    currentTime.value = dayjs().format('YYYY/MM/DD HH:mm:ss');
    // 滚动效果
  })
})
// onUnmounted(() => {
//   window.removeEventListener('resize', handleResize);
// });

// 更新图表高度
const updateChartHeight = (siderHeight, siderWidth) => {
  // chartRef.value.style.height = `calc(${siderHeight}px - 80px)`; // 设置图表容器高度
  // resize()
  // chartRef.value.style.width = `${siderWidth}px`;
  // echarts.resize(); // 调整图表大小以适应新的容器尺寸
};

function init() {
  hammer.value = new Hammer(dragbg.value);
  hammer.value.get('pan').set({ direction: Hammer.DIRECTION_ALL })
}
async function toggle() {
  await fullscreen.toggle(document.querySelector('#show_screen'));
  state.fullscreen = fullscreen.isFullscreen
}
// 显示隐藏内容
function showFire(e) {
  // e?.target.id
  // 进行判断
  console.log(e, '...打印e...详情..');
  // $('.fire1').click(function () {

  //   if ($("div").find('.device-box2').css('display') == 'none') {
  //     $('.video-box2').hide();
  //     $("div").find('.device-box2').show();
  //   } else {
  //     $("div").find('.device-box2').hide();
  //   }
  //   // if ($('.device-box2').css('display') == 'none') {

  //   //   $('.device-box2').show();
  //   // } else {
  //   //   $('.device-box2').hide();
  //   // }
  // })

  // $('.fire2').click(function () {

  //   if ($("div").find('.device-box1').css('display') == 'none') {
  //     $('.video-box1').hide();
  //     $("div").find('.device-box1').show();
  //   } else {
  //     $("div").find('.device-box1').hide();
  //   }
  //   // if ($('.device-box1').css('display') == 'none') {

  //   //   $('.device-box1').show();
  //   // } else {
  //   //   $('.device-box1').hide();
  //   // }
  //   // alert('111')
  // })

  // if ($(this).find('.device-box').css('display') == 'none') {
  //   $('.device-box').hide();
  //   $(this).find('.device-box').show();
  // } else {
  //   $(this).find('.device-box').hide();
  // }
  // debugger
  // switch (e) {

  //   case 1:
  //     // $('.device-box1').show();
  //     $('.fire1').click(function () {
  //       if ($('.device-box1').css('display') == 'none') {
  //         $('.device-box1').hide();
  //         $('.device-box').show();
  //       } else {
  //         $('.device-box1').hide();
  //       }
  //     });
  //     // $('.fire1').stop(true);
  //     // 移除动画
  //     break;
  //   case 2:
  //     $('.device-box2').show();
  //     // 移除动画
  //     // fire1
  //     // $('.fire2').stop(true, true);
  //     // do something
  //     break;
  //   default:

  //     // do something
  //     break;
  // }

}
function plusIcon(type) {
  // if (type == 'plus') {
  //   bgimg.value += 50;
  //   bgheight.value += 50;
  // } else {
  //   bgimg.value -= 50;
  //   bgheight.value -= 50;
  // }

  if (type == 'plus') {
    if (bgimg.value < 400) {
      bgheight.value += 50;
      bgimg.value += 50;
    } else {
      // Toast('已缩放到最大')
    }
  } else if (type == 'minus') {
    if (bgimg.value > 100) {
      bgimg.value -= 50
      bgheight.value -= 50;
      // locationIconSize.value -= 3
    } else {
      // Toast('已缩放到最小')
    }
  } else {
    Drag('#dragbg', { isReset: true })
    bgimg.value = 80
    bgheight.value = 70
  }
  // 放大图像
  // if(bgimg.value<200){


  // }
}
</script>

<style lang="less" scoped>
#show_screen {
  height: calc(100vh - 80px);
}

// 使用媒体查询解决问题
// 屏幕大于 1024px 或小于 1440px 时应用该样式
@media screen and (min-width: 500px) and (max-width: 1685px) {

  // .sider {
  //   max-width: 100% !important;
  //   min-width: 100% !important;
  //   border: 1px solid pink;
  // }
  // .content{

  //   width: 100% !important;
  //   border: 1px solid green;
  // }
  // .footer{
  //   width: 100% !important;
  //   border: 1px solid gold;
  // }
}

// 屏幕大于 1440px 时应用该样式
@media screen and (min-width: 1441px) {}

//屏幕小于 1000px 时应用的样式
// @media screen and (max-width: 1024px) {
//      .sider{
//       border: 1px solid pink;
//      }

// }
// 屏幕大于 1024px 或小于 1440px 时应用该样式
@media screen and (min-width: 1024px) and (max-width: 1440px) {}


.other_left {
  padding-left: .2rem
    /* 16/80 */
  ;
  padding-right: .2rem
    /* 16/80 */
  ;
  width: 20%;
  // style="padding-left: 16px;padding-right: 16px; width: 20%;"
}

.brand {
  position: relative;
  margin-right: auto;
  // margin-left: 0;
  margin-left: .0625rem
    /* 5/80 */
  ;
  // style="position: relative;left: -30px;"
}

.ant-layout-header {
  background: rgb(0, 4, 22);
  padding: 0;
}

#showTime {
  font-size: .225rem
    /* 18/80 */
  ;
}

.alltitle {
  padding: .125rem
    /* 10/80 */
  ;
  text-align: left;
  // padding: 0.25rem;
  color: #ffffff;
}

.topRec_List {
  height: 90%;
}

// .layout {
//   position: relative;
//   // height: 10.975rem
//   height: calc(100% - 48px);
//     /* 878/80 */
//   ;
// }

:v-deep .ayout.ant-layout-has-sider>.ant-layout-content {
  width: 13.3rem
    /* 1064/80 */
  ;
}

.my_setting {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  // box-sizing: border-box;
  // border: 1px solid pink;
}

.header {
  display: flex;
  align-items: center;
  background: rgb(0, 4, 22);
  color: #fff;
  // padding: 0 1.6rem
  /* 16/10 */
  ;
  height: 1.3125rem
    /* 105/80 */
  ;
}

.my_content {
  // height: calc(100% - 11.3125rem);
  height: 6.85rem
    /* 548/80 */
  ;
  // border: 1px solid rgb(243, 20, 57);
}

.count-base,
.count-resource,
.count-share,
.count-topic {
  position: relative;
  padding: 20px;
  margin-top: 10px;
  box-sizing: border-box;
}

.com-count-title {

  color: #1bb4f9;
  font-size: 12px;
  padding: 0;
}

.yq {
  width: 1.25rem
    /* 100/80 */
  ;
  height: 1.25rem
    /* 100/80 */
  ;
  // width: 100px;
  // height: 100px;
  margin: 0 auto .0625rem auto
    /* 5/80 */
  ;
  // margin: 0 auto 5px auto;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  // font-size: 30px;
  font-size: .375rem
    /* 30/80 */
  ;
  font-family: electronicFont;
  // color: #fff32b;
  color: #0e73f7;
}

.yq:before {
  position: absolute;
  width: 100%;
  height: 100%;
  content: '';
  background: url(@/assets/images/img2.png) center center;
  border-radius: 100px;
  background-size: 100% 100%;
  opacity: 0.3;
  left: 0;
  top: 0;
  animation: myfirst2 15s infinite linear;
}

.yq:after {
  position: absolute;
  width: 86%;
  background: url(@/assets/images/img2.png) center center;
  border-radius: 100px;
  background-size: 100% 100%;
  opacity: 0.3;
  height: 86%;
  content: '';
  left: 7%;
  top: 7%;
  animation: myfirst 15s infinite linear;
}

@keyframes myfirst {
  to {
    transform: rotate(-360deg);
  }
}

@keyframes myfirst2 {
  to {
    transform: rotate(360deg);
  }
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #fff;
}

.menu {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.sider {
  width: 20% !important;
  min-width: 20% !important;
  max-width: 20% !important;
  // border: 1px solid rgb(47, 95, 255);
  background: rgb(0, 4, 22);
  padding: 0 .2rem
    /* 16/80 */
    0 .2rem
    /* 16/80 */
  ;
}

::v-deep(.ant-layout-sider) {
  width: 100% !important;
  min-width: 100% !important;
  max-width: 100% !important;
  background: rgb(0, 4, 22);
  padding: 0 .2rem;

}

@media (min-width: 768px) {
  ::v-deep(.ant-layout-sider) {
    width: 20% !important;
    min-width: 20% !important;
    max-width: 20% !important;
    background: rgb(0, 4, 22);
    padding: 0 .2rem;

  }
}

.sider2 {
  width: 20% !important;
  min-width: 20% !important;
  max-width: 20% !important;
  // border: 1px solid greenyellow;
  background: rgb(0, 4, 22);
  padding: 0 .2rem
    /* 16/80 */
    0 .2rem
    /* 16/80 */
  ;
}

.bg-jianzhu {
  position: absolute;
  // top: 0;
  // left: 0;
  // right: 0;
  // bottom: 0;
  width: 13.3rem !important;
  height: 5.75rem
    /* 460/80 */
  ;
  // margin: 0 auto;
  background: url(@/assets/images/modules1.png) no-repeat;


  background-position-x: 1.25rem
    /* 100/80 */
  ;
  background-position-y: .375rem
    /* 30/80 */
  ;
  background-size: 60%;

}

.content {
  position: relative;
  // background: rgb(0, 4, 22);
  // background: #1d1b1b;
  background:#000000;
  width: 13.3rem !important
    /* 1064/80 */
  ;
  overflow: hidden;
}

.footer {
  background: rgb(0, 4, 22);
  // border: 1px solid green;
  color: #fff;
  padding: inherit;
  text-align: center;
  height: 2.8125rem
    /* 225/80 */
  ;
}

.boxall {
  border: .0125rem
    /* 1/80 */
    solid rgba(25, 186, 139, 0.17);
  padding: 0 0.2rem 0.2rem 0.2rem;
  background: rgba(255, 255, 255, 0.04) url(@/assets/images/line.png);
  background-size: 100% auto;
  position: relative;
  margin-bottom: 0.15rem;
  z-index: 10;
  overflow: hidden;
}

.boxall1 {
  border: .0125rem
    /* 1/80 */
    solid rgba(25, 186, 139, 0.17);
  padding: 0 0.2rem 0.2rem 0.2rem;
  background: rgba(255, 255, 255, 0.04) url(@/assets/images/line.png);
  background-size: 100% auto;
  position: relative;
  margin-bottom: 0.15rem;
  z-index: 10;
  // height:2.175rem /* 174/80 */;
  height: 33%;
  overflow: hidden;

}

.boxall2 {
  border: .0125rem
    /* 1/80 */
    solid rgba(25, 186, 139, 0.17);
  padding: 0 0.2rem 0.2rem 0.2rem;
  background: rgba(255, 255, 255, 0.04) url(@/assets/images/line.png);
  background-size: 100% auto;
  position: relative;
  margin-bottom: 0.15rem;
  z-index: 10;
  // height:2.175rem /* 174/80 */;
  height: 30%;
  overflow: hidden;

}


.boxall1:before,
.boxall2::before,
.boxfoot:before {
  border-left: .025rem
    /* 2/80 */
    solid #02a6b5;
  left: 0;
}

.boxall:before,
.boxfoot:before {
  border-left: .025rem
    /* 2/80 */
    solid #02a6b5;
  left: 0;
}

.boxall:before {
  position: absolute;
  width: .125rem
    /* 10/80 */
  ;
  height: .125rem;
  content: '';
  border-top: .025rem
    /* 2/80 */
    solid #02a6b5;
  top: 0;
}

.topRec_List dl,
.maquee {
  width: 90%;
  overflow: hidden;
  margin: 0 auto;
  color: #f0ece2
}

.topRec_List dd {
  float: left;
  text-align: left;
  border-bottom: 1px solid #1B96EE;
  color: #1B96EE;
  font-size: 10px;
}

.topRec_List dl dd:nth-child(1) {
  width: 50%;
  height: 40px;
  line-height: 40px;
}

.topRec_List dl dd:nth-child(2) {
  width: 30%;
  height: 40px;
  line-height: 40px;
}

.topRec_List dl dd:nth-child(3) {
  width: 20%;
  height: 40px;
  line-height: 40px;
}

.maquee {
  // height: 195px;
  height: 90%;
}


.topRec_List ul {
  width: 100%;
  height: 90%;
  // height: 195px;
  animation: marquee 10s linear infinite;
  overflow: hidden;
}


@keyframes marquee {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(-100%);
  }
}

.topRec_List li {
  width: 100%;
  height: 28px;
  line-height: 38px;
  text-align: left;
  font-size: 10px;
  color: #76dbd1
}

/*.topRec_List li:nth-child(2n){ background:#077cd0}*/
.topRec_List li div {
  float: left;
}

.topRec_List li div:nth-child(1) {
  width: 50%;
}

.topRec_List li div:nth-child(2) {
  width: 30%;
}

.topRec_List li div:nth-child(3) {
  width: 20%;
}

.reception {
  width: 100%;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  padding: 5px 20px;
  text-align: center;
}

.recetit {
  float: left;
  width: 88px;
  float: left;
  margin-right: 15px;
}

.recetit:nth-last-child(1) {
  margin-right: 0px;
}

.recetit strong {
  color: #f5f77c;
  font-size: 15px;
}

.recetit span {
  display: block;
  text-align: center;
  margin-bottom: 6px;
  width: 72px;
  height: 8px;
  -webkit-border-radius: 6px;
  -moz-border-radius: 6px;
  border-radius: 6px;
  background-color: #0b4e78;
  margin-left: 8px;
}

.recetit .changecolor {
  background-color: #05fff9;
}

.recetit p {
  color: #fff;
  font-size: 12px;
}

.fire {
  width: 1.66rem;
  height: 1.66rem;
  position: absolute;

  cursor: pointer;
  // 使用动画实现效果
  // animation: jump 0.5s infinite alternate ease-in-out;

}

@keyframes jump {
  from {
    top: 480px;
  }

  to {
    top: 490px;
  }
}

.fire img {
  width: .375rem
    /* 30/80 */
  ;
  height: .375rem
    /* 30/80 */
  ;
  // width: 100%;
  // height: 100%;
}

.fire1 {
  top: 1.75rem
    /* 140/80 */
  ;
  right: 7.375rem
    /* 590/80 */
  ;
  animation: jump1 0.5s infinite alternate ease-in-out;
  // top: 480px;
  // right: 670px;
  // animation: jump 0.5s infinite alternate ease-in-out;
  // top: 400px;
  // right: 36.82rem;
  // bottom: 10.18rem;
}

@keyframes jump1 {
  from {
    top: 1.75rem;
    /* 140/80 */
    ;
  }

  to {
    top: 2rem
      /* 160/80 */
    ;
  }
}

.fire2 {
  top: 3.5rem
    /* 280/80 */
  ;
  right: 5.5rem
    /* 440/80 */
  ;
  animation: jump2 0.5s infinite alternate ease-in-out;
}

.file2_animate {}

@keyframes jump2 {
  from {
    top: 3.5rem
      /* 280/80 */
    ;
  }

  to {
    top: 3.625rem
      /* 290/80 */
  }
}

.device-box1 {
  width: 1.5rem
    /* 120/80 */
  ;
  height: 1.5rem
    /* 120/80 */
  ;
  font-size: .2rem
    /* 16/80 */
  ;
  background: url("@/assets/images/device-box.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: 1.875rem
    /* 150/80 */
  ;
  left: 4.875rem
    /* 390/80 */
  ;
  // left: -7.4rem;
  z-index: 9999;
  display: none;
}

.device-box2 {

  // right: 7.375rem;
  width: 1.5rem
    /* 120/80 */
  ;
  height: 1.5rem
    /* 120/80 */
  ;
  font-size: .2rem
    /* 16/80 */
  ;
  background: url("@/assets/images/device-box.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: .375rem
    /* 30/80 */
  ;
  left: 3rem
    /* 240/80 */
  ;
  z-index: 9999;
  display: none;
}

.device-title {
  font-size: .2rem;
  font-weight: bold;
  color: #fff;
  // padding-top: 0.6rem;
  // line-height: 0.8rem;
  text-align: center;
}

.device-con {
  font-size: .2rem;
  color: #fff;
  letter-spacing: 0;
  // line-height: 0.6rem;
  // padding: 0 0.4rem;
  text-align: left;
}

@media screen and (max-width: 768px) {
  /* 在屏幕宽度小于等于 768px 时应用的样式 */
}

/*屏幕大于等于 768px */
@media screen and (min-width: 1020px) {

  // 1000 * 568
  .bg-jianzhu {
    // border: 4px solid yellow;

  }

  // .fire2 {
  //   top: 3.5rem
  //     /* 280/80 */
  //   ;
  //   right: 5.5rem
  //     /* 440/80 */
  //   ;
  //   box-sizing: border-box;
  //   border: 1px solid pink;
  //   animation: jump2 0.5s infinite alternate ease-in-out;
  // }
}
</style>

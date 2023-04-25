<template>
  <!-- <PageWrapper  fixedHeight> -->
  <v-scale-screen width="1920" fullScreen height="1080">
    <a-layout class="layout">
      <a-layout-sider width="20%" class="sider" :collapsed-width="collapsedWidth" :trigger="null" :collapsible="true"
        v-model:collapsed="collapsed">
        <img src="@/assets/images/LOGO-title.png" />
        <ul style="height: 100%">
          <li style="height: 33%">
            <div class="boxall" style="height: 100%">
              <div class="alltitle"> 全局预览 </div>
              <!--  -->
              <div class="yq" id="yq">2634</div>
              <!-- 设备运行负载 -->
            </div>
          </li>
          <li style="height: 33%">
            <div class="boxall" style="height: 100%">
              <div class="alltitle"> 数据统计 </div>
            </div>
          </li>
          <li style="height: calc(33% - 70px)">
            <div class="boxall" style="height: 100%">
              <div class="alltitle"> 访客信息 </div>
              <div class="topRec_List">
                <dl>
                  <dd>资源名称</dd>
                  <dd>调用方</dd>
                  <dd>调用时间</dd>
                </dl>
                <div class="maquee">
                  <ul>
                    <li>
                      <div>审计局主要职责</div>
                      <div>审计局</div>
                      <div>08:20:26</div>
                    </li>
                    <li>
                      <div>残联主要职责</div>
                      <div>残联</div>
                      <div>08:20:36</div>
                    </li>
                    <li>
                      <div>委老干部局主要职责</div>
                      <div>老干部局</div>
                      <div>08:20:46</div>
                    </li>
                    <li>
                      <div>公安局主要职责</div>
                      <div>公安局</div>
                      <div>08:20:56</div>
                    </li>
                    <li>
                      <div>更多精美大屏</div>
                      <div>关注公众号</div>
                      <div>DreamCoders</div>
                    </li>
                    <li>
                      <div>交通运输局主要职责</div>
                      <div>完全免费分享</div>
                      <div>08:21:07</div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </a-layout-sider>
      <a-layout>
        <a-layout-header style="height: 11%" class="header">
          <div class="ml-auto" id="showTime">{{ currentTime }}</div>
        </a-layout-header>
        <a-layout-content class="content">
          <div class="bg-jianzhu"></div>
        </a-layout-content>
        <a-layout-footer class="footer" style="height: 20%; padding: 10px 0px 2px">
          <ul>
            <li class="float-left w-1/2">
              <div class="boxall" style="height: 160px">
                <div class="alltitle"> 负载信息 </div>
              </div>
            </li>
            <li class="float-left w-1/2">
              <div class="boxall" style="height: 160px">
                <div class="alltitle"> 环境数据监测 </div>
                <div style="width:100%;height: 100%;" ref="chartRef3"></div>
              </div>
            </li>
          </ul>
        </a-layout-footer>
      </a-layout>
      <a-layout-sider width="20%" class="sider" :collapsed-width="collapsedWidth" :trigger="null" :collapsible="true"
        v-model:collapsed="collapsed">
        <div style="height: 80px"> </div>
        <ul style="height: 100%">
          <li style="height: calc(50% - 20px)">
            <div class="boxall" style="height: 100%">
              <div class="alltitle"> 设备列表 </div>
              <div class="boxnav" style="height: ">
                <div class="" ref="chartRef" style="height: 406px" id="echart2"></div>
              </div>
            </div>
          </li>
          <li style="height: calc(50% - 50px)">
            <div class="boxall" style="height: 100%">
              <div class="alltitle"> GPS地理位置分析 </div>
              <div style="width: 100%; height: 100%" ref="chartRef2"></div>
            </div>
          </li>
        </ul>
      </a-layout-sider>
    </a-layout>
  </v-scale-screen>
</template>

<script setup lang="ts">
import { ref, Ref, onMounted } from 'vue';
import dayjs from 'dayjs';
// import VScaleScreen from 'v-scale-screen';
// import autofit from 'vue-autofit'
import { useECharts } from '@/hooks/web/useECharts';
import mapsrc from '@/utils/city/zhuhai.json' //引入珠海市地图数据
const chartRef = ref<HTMLDivElement | null>(null);
const chartRef2 = ref<HTMLDivElement | null>(null);
const chartRef3 = ref<HTMLDivElement | null>(null);

const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);
const { setOptions: setOptions2, echarts: echart2 } = useECharts(chartRef2 as Ref<HTMLDivElement>);
const { setOptions: setOptions3, echarts: echart3 } = useECharts(chartRef3 as Ref<HTMLDivElement>);
echart2.registerMap('zhuhai', mapsrc); //注册地图

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
setOptions({
  grid: {
    left: '0',
    top: '0',
    right: '0',
    bottom: '0%',
    containLabel: true
  },
  xAxis: {
    show: false
  },
  yAxis: [{
    show: true,
    data: ['空调', '排气扇', '路灯', '广播', '中央空调', '小型发电机', '柴油发电机', '光伏发电机', '巡逻车', '监控', '闸门', '中央空调', '呼吸机'],
    inverse: true,
    axisLine: { show: false },
    splitLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      textStyle: {
        color: '#fff'
      },
    },

  }, {
    show: false,
    inverse: true,
    data: [683, 234, 234, 523, 345, 320, 280, 271, 254, 229, 210, 190, 182],
    axisLabel: { textStyle: { color: '#fff' } },
    axisLine: { show: false },
    splitLine: { show: false },
    axisTick: { show: false },
  }],
  series: [{
    name: '条',
    type: 'bar',
    yAxisIndex: 0,
    data: [683, 234, 234, 523, 345, 320, 280, 271, 254, 229, 210, 190, 182],
    barWidth: 15,
    itemStyle: {
      normal: {
        barBorderRadius: 50,
        color: '#1089E7',
      }
    },
    label: {
      normal: {
        show: true,
        position: 'right',
        formatter: '{c}',
        textStyle: { color: 'rgba(255,255,255,.5)' }
      }
    },
  }]
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

onMounted(() => {


  setInterval(() => {
    currentTime.value = dayjs().format('YYYY/MM/DD HH:mm:ss');
    // 滚动效果


  })
})
</script>

<style lang="less" scoped>
.layout {
  position: relative;
  /* top: -20px; */
  /* min-height: 100vh; */
  height: calc(100vh - 80px);
}

.header {
  display: flex;
  align-items: center;
  background-color: #001529;
  color: #fff;
  padding: 0 16px;
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
  width: 100px;
  height: 100px;
  margin: 0 auto 5px auto;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  font-family: electronicFont;
  color: #fff32b;
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
  background-color: #001529;
  padding: 16px;
}

.bg-jianzhu {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0 auto;
  // background: url(../img/bg.png) no-repeat;
  background: url(@/assets/images/bg.png) no-repeat;
  background-position: 21rem;
  background-size: 58%;
}

.content {
  background-color: #fff;
  padding: 16px;
}

.footer {
  background-color: #001529;
  color: #fff;
  // padding: 50 50px;
  text-align: center;
}

.boxall {
  border: 1px solid rgba(25, 186, 139, 0.17);
  padding: 0 0.2rem 0.2rem 0.2rem;
  background: rgba(255, 255, 255, 0.04) url(@/assets/images/line.png);
  background-size: 100% auto;
  position: relative;
  margin-bottom: 0.15rem;
  z-index: 10;
}

.boxall:before,
.boxfoot:before {
  border-left: 2px solid #02a6b5;
  left: 0;
}

.boxall:before,
.boxall:after {
  position: absolute;
  width: 0.5rem;
  height: 0.5rem;
  content: '';
  border-top: 2px solid #02a6b5;
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
  height: 195px;
}


.topRec_List ul {
  width: 100%;
  height: 195px;
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
</style>

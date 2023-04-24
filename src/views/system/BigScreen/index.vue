
<template>
  <!-- <PageWrapper  fixedHeight> -->
  <v-scale-screen width="1920" fullScreen height="1080">
    <a-layout class="layout">
      <a-layout-sider width="20%" class="sider" :collapsed-width="collapsedWidth" :trigger="null" :collapsible="true"
        v-model:collapsed="collapsed">
        <img src="@/assets/images/LOGO-title.png" />
        <ul style="height: 100%;">
          <li style="height:33%;">
            <div class="boxall" style="height: 100%;">
              <div class="alltitle" style="height: 100%;">
                全局预览
              </div>
              <!--  -->
              <div class="" style="height: 406px" id="echart2"></div>
            </div>
          </li>
          <li style="height: 33%;">
            <div class="boxall" style="height:100%;">
              <div class="alltitle">
                数据统计
              </div>
            </div>
          </li>
          <li style="height: calc(33% - 70px);">
            <div class="boxall" style="height:100%;">
              <div class="alltitle">
                访客信息
              </div>
            </div>
          </li>
        </ul>
      </a-layout-sider>
      <a-layout>
        <a-layout-header style="height: 11%;" class="header">
          <div class="ml-auto" id="showTime">{{ currentTime }}</div>
        </a-layout-header>
        <a-layout-content class="content">
          <div class="bg-jianzhu"></div>
        </a-layout-content>
        <a-layout-footer class=" footer" style="height: 20%;padding:  10px 0px 2px;">
          <ul>
            <li class="float-left w-1/2">
              <div class="boxall" style="height:160px;">
                <div class="alltitle">
                  负载信息
                </div>
              </div>
            </li>
            <li class="float-left w-1/2">
              <div class="boxall" style="height:160px;">
                <div class="alltitle">
                  负载信息
                </div>
              </div>
            </li>
          </ul>
        </a-layout-footer>
      </a-layout>
      <a-layout-sider width="20%" class="sider" :collapsed-width="collapsedWidth" :trigger="null" :collapsible="true"
        v-model:collapsed="collapsed">
        <div style="height: 80px;">
        </div>
        <ul style="height: 100%;">
          <li style="height:calc(50% - 20px)">
            <div class="boxall" style="height: 100%;">
              <div class="alltitle">
                设备列表
              </div>
            </div>
          </li>
          <li style="height:calc(50% - 50px)">
            <div class="boxall" style="height:100%;">
              <div class="alltitle">
                GPS地理位置分析
              </div>
            </div>
          </li>
        </ul>
      </a-layout-sider>
    </a-layout>
  </v-scale-screen>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import dayjs from 'dayjs';
// import VScaleScreen from 'v-scale-screen';
import autofit from 'vue-autofit'
const currentTime = ref(dayjs().format('YYYY/MM/DD HH:mm:ss'));
const collapsed = false;
const theme = 'dark';
const mode = 'inline';
const collapsedWidth = 80;
onMounted(() => {
  setInterval(() => {
    currentTime.value = dayjs().format('YYYY/MM/DD HH:mm:ss');
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
  content: "";
  border-top: 2px solid #02a6b5;
  top: 0;
}
</style>

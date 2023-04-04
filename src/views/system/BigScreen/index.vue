<template>
  <div class="h_container">
    <div class="h_header">
      <div class="h_logo">
        <img src="@/assets/images/LOGO-title.png" />
      </div>
      <div class="h_time_now">
        <Time :value="now" mode="datetime" />
      </div>
    </div>
    <div class="l_layout">
      <div class="layout_container">
        <div class="container_one">
          <div style="position: relative;margin: 5px; display:flex;border: 1px solid yellow;height: fit-content;">
            <SvgIcon size="20" name="Subtract" />
            <div style="color: #ffff;">全局预览</div>
          </div>
          <div style="width: 100%;border: 1px solid goldenrod;">
            <equipment :width="width" :height="height" />
            <div class="menu_title">
              <div style="text-align: left;border: 1px solid green;width: 50%;">
                数据统计
              </div>
              <div style="text-align: right;border: 1px solid green;width: 50%;">
                天/周/月
              </div>
            </div>
            <div class="other_settings">

              <div class="tab_1">
                访客流量
              </div>
              <div class="tab_2">
                用电统计
              </div>
              <div class="tab_3">
                用水统计
              </div>
            </div>
            <div style="border: 1px solid goldenrod;">
              <statistics />
            </div>
          </div>
        </div>
        <div class="container_two">
          2222
        </div>
        <div class="container_three">
          2222
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup lang='ts'>
// import { Ref, ref, watch } from 'vue';
import { Time } from '@/components/Time';
import { SvgIcon } from '@/components/Icon';
import equipment from './components/equipment/index.vue'
import statistics from './components/Statistics/index.vue'
// import { useECharts } from '@/hooks/web/useECharts';
const now = new Date().getTime();
const width = '165px';
const height = '165px';
</script>
  
<style lang="less" scoped>
.h_container {
  position: relative;
  width: 100%;
  height: 100%;
  background: #090909;
}

.h_header {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  border: 1px solid pink;

  .h_logo {
    img {
      width: 386px;
    }
  }

  .h_time_now {
    margin-left: auto;
    margin-right: 60px;
    color: #ffffff;
  }
}

.l_layout {
  position: relative;
  width: 100%;
  height: calc(100% - 110px);
  border: 1px solid green;

  .layout_container {
    position: relative;
    display: flex;
    justify-content: center;
    align-content: center;
    width: 100%;
    height: 100%;

    .container_one {
      position: relative;
      display: flex;
      align-content: baseline;
      flex: 1;
      width: 10%;
      flex-wrap: wrap;
      border: 1px solid blue;

      .menu_title {
        position: relative;
        display: flex;
        color: #ffffff;
        justify-content: space-around;
        border: 1px solid #cf4040;
      }

      .other_settings {
        position: relative;
        width: 100%;
        display: flex;
        justify-content: space-around;
        border: 1px solid blueviolet;
        color: #ffffff;

        .tab_1 {
          width: 33.3%;
          text-align: center;
          border: 1px solid gray;
        }

        .tab_2 {
          width: 33.3%;
          text-align: center;
          border: 1px solid gray;
        }

        .tab_3 {
          width: 33.3%;
          text-align: center;
          border: 1px solid gray;
        }
      }
    }

    .container_two {
      flex: 3;
      border: 1px solid orange;
      color: #ffffff;
    }

    .container_three {
      flex: 1;
      border: 1px solid salmon;
      color: #ffffff;
    }
  }
}
</style>

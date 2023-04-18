<template>
  <PageWrapper contentFullHeight fixedHeight class="h_container">
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
              <div style="border: 1px solid red;display: flex;justify-content: space-around;color: #ffff;">
                <div style="border: 1px solid green;flex: 1;">访客信息</div>
                <div style="border: 1px solid green;flex: 1;">合计：233</div>
              </div>
              <div class="other_title">
                <div class="flex">
                  <span class="text-cool-gray-100 flex w-1/3" style="align-items: center;border: 1px solid blue;">
                    <img src="@/assets/svg/组合 123.png" />
                    60
                  </span>
                  <span class="text-cool-gray-100 flex w-1/3" style="align-items: center;border: 1px solid orangered;">
                    <img src="@/assets/svg/组合 124.png" />
                    999
                  </span>
                  <span class="text-cool-gray-100 flex w-1/3" style="align-items: center;border: 1px solid orangered;">
                    <img src="@/assets/svg/组合 127.png" />
                    666
                  </span>
                </div>
              </div>
              <table style="color: #ffff;width: 100%;" border="1">
                <tr style="text-align: center; background:rgba(70, 69, 69, 0.35);height: 32px;">
                  <th>访客</th>
                  <th>事由</th>
                  <th>预约时间</th>
                  <th>状态</th>
                </tr>
                <tr style="text-align: center;">
                  <td>张三</td>
                  <td>面试</td>
                  <td>15:00</td>
                  <td>18:00已到访</td>
                </tr>
                <tr style="text-align: center;">
                  <td>张三</td>
                  <td>面试</td>
                  <td>15:00</td>
                  <td>18:00已到访</td>
                </tr>
                <tr style="text-align: center;">
                  <td>张三</td>
                  <td>面试</td>
                  <td>15:00</td>
                  <td>18:00已到访</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <div class="container_two">

          <div class="container_two_footer">
            <div class="footer_left">
              <div style="display: flex;align-items: center; border: 1px solid blue;width: 100%;font-size: 16px;">
                <div>
                  <SvgIcon name="Subtract" />
                  负载信息
                </div>
                <div style="margin-left: auto;">
                  总功率:<span style="font-size: 20px;">20,00</span> W
                </div>
              </div>
              <loadData :width="width1" />
            </div>
            <div class="footer_right">
              <environmetData :width="mywidth" />
            </div>
          </div>
        </div>
        <div class="container_three flex flex-wrap">
          <PageWrapper class="w-full h-2/3  overflow-y-scroll">
            <div class="text-lg">设备列表</div>
            <div class="flex w-full" v-for="item in result" :key="item">
              <div class="w-2/3">
                <Tag color="green">{{ item.DeviceName }}</Tag>
                <Progress :percent="30" />
              </div>
            </div>
          </PageWrapper>
          <PageWrapper fixedHeight class="w-full">
            <div class="w-full" style="color: #ffff;">
              <geograp :width="width2" />
            </div>
          </PageWrapper>
        </div>
      </div>
    </div>
  </PageWrapper>
</template>
  
<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { Time } from '@/components/Time';
import { SvgIcon } from '@/components/Icon';
import equipment from './components/equipment/index.vue';
import statistics from './components/Statistics/index.vue';
import loadData from './components/load/index.vue';
import environmetData from './components/environment/index.vue';
import geograp from './components/geograp/index.vue';
import { PageWrapper } from '@/components/Page';
import { Progress, Tag } from 'ant-design-vue';

import { DeviceList } from '@/api/demo/system';
const now = new Date().getTime();
const width = '165px';
const mywidth = '100%';
const width1 = '400px';
const width2 = '100%';
const height = '165px';
const result: any = ref('');
// 初始化百度地图（需要引入地图jsapi）
onMounted(async () => {
  result.value = await DeviceList();
})
</script>
  
<style lang="less" scoped>
.h_container {
  position: relative;
  width: 100%;
  // height: 100%;
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
      height: 100%;

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
        // height: 100%;
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
      position: relative;
      flex: 3;
      border: 1px solid orange;
      color: #ffffff;

      // width: 100%;
      .container_two_footer {
        position: absolute;
        display: flex;
        width: 100%;
        bottom: 0;
        border: 1px solid greenyellow;

        .footer_left {
          display: flex;
          flex-wrap: wrap;
          width: 40%;
        }

        .footer_right {
          display: flex;
          width: 60%;
          border: 1px solid pink;
        }
      }
    }

    .container_three {
      flex: 1;
      border: 1px solid salmon;
      color: #ffffff;
    }
  }
}

::v-deep(.vben-page-wrapper-content) {
  margin: 0;

}
</style>

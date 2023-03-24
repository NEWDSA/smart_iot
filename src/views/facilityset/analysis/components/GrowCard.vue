<template>
  <div class="md:flex">
    <Card size="default" style="" :loading="loading" title="设备数据" class=" w-full !md:mt-0">
      <template #extra>
        <DatePicker v-model:value="value1"></DatePicker>
        <!-- <Tag color="#222222">{{ 1 }}</Tag> -->
      </template>

      <div class="w-full flex">
        <div class="w-1/4 pl-5" :style="index != deviceList.length - 1 ? 'border-right:1px solid #eeeeee' : ''"
          v-for="(item, index) in deviceList" :key="item.title">
          <div class="text-lg truncate ...">
            {{ item.title }}
          </div>
          <div class="">
            <CountTo :startVal="1" :endVal="item.value" class="text-4xl" />
            <!-- {{ item.value }} -->
          </div>
          <div class="flex fu-box mt-3 items-center truncate ..." v-if="item.fuTitle">
            <div>
              {{ item.fuTitle }}
            </div>
            <div class="pl-5 text-green-500 ">
              <CountTo :startVal="1" :endVal="item.fuValue" class="text-lg" />
              <span v-if="index == 3" class="text-lg"> %</span>
            </div>
          </div>
        </div>
      </div>

    </Card>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { CountTo } from '@/components/CountTo/index'
import { facilityDataApi } from '@/api/facility/facility'
// import { Icon } from '@/components/Icon'
import { Tag, Card, DatePicker } from 'ant-design-vue'
// import { TreeSelect,  } from 'ant-design-vue';

defineProps({
  loading: {
    type: Boolean
  }
})

onMounted(() => {
  getfacilityData()
})

// StartTime:new Date(new Date(new Date().toLocaleDateString()).getTime()).valueOf(),
//     EndTime:new Date(new Date().getTime()).valueOf(),

function getfacilityData() {
  var AlarmTime = new Date(new Date(new Date().toLocaleDateString()).getTime()).valueOf();
  facilityDataApi({ 'AlarmTime': AlarmTime }).then(res => {
    deviceList.value[0].value = res?.DeviceTotal || 0
    deviceList.value[0].fuValue = res?.OffLineDeviceTotal || 0

    deviceList.value[1].value = res?.OnlineDeviceTotal || 0
    deviceList.value[1].fuValue = res?.OnlineDeviceTotal || 0

    deviceList.value[2].value = res?.GatewayDeviceTotal || 0

    deviceList.value[3].value = res?.DeviceAlertTotal || 0
    deviceList.value[3].fuValue = res?.AlertGrowthRate || 0

  })
}

const deviceList = ref([
  {
    title: '设备数量',
    value: 0,
    fuTitle: '离线设备',
    fuValue: 0,
  },
  {
    title: '当前运行',
    value: 0,
    fuTitle: '在线设备',
    fuValue: 0,
  },
  {
    title: '网关设备数量',
    value: 0,
  },
  {
    title: '今日告警数量',
    value: 0,
    fuTitle: '同比前一日',
    fuValue: 0,
  }
])

const value1 = ref('')

</script>

<template>
  <div>
  <div class="px-5">
    <div class="flex justify-between items-center">
      <div class="text-lg">关联设备详情</div>
      <!-- <Icon icon="heroicons:pencil-square-solid" size="24"></Icon> -->
    </div>

    <div class="centents" v-if="props.DeviceId != null">
      <div class="flex items-center my-5">
        <div class="w-3/10 text-gray-400">设备ID：</div>
        <div class="w-6/10 text-gray-400">{{ infoFacility?.DeviceId }}</div>
      </div>
      <div class="flex items-center my-5">
        <div class="w-3/10 text-gray-400">设备名称：</div>
        <div class="w-6/10 text-gray-400">{{ infoFacility?.DeviceName }}</div>
      </div>
      <div class="flex items-center my-5">
        <div class="w-3/10 text-gray-400">设备类型：</div>
        <div class="w-6/10 text-gray-400">{{ facilityType || '暂无' }}</div>
      </div>
      <div class="flex items-center my-5">
        <div class="w-3/10 text-gray-400">所在区域：</div>
        <div class="w-6/10 text-gray-400">{{ RegionDataName || '暂无' }}</div>
      </div>
      <!-- <div class="flex items-center my-5">
        <div class="w-3/10 text-gray-400">说明：</div>
        <div class="w-6/10 text-gray-400">{{ infoFacility?.Explain || '暂无' }}</div>
      </div> -->
      <div class="flex items-center my-5">
        <div class="w-3/10 text-gray-400">创建时间：</div>
        <div class="w-6/10 text-gray-400">{{ infoFacility?.Basic?.CreatedAt.seconds ? dayjs.unix(infoFacility?.Basic.CreatedAt.seconds).format('YYYY-MM-DD HH:mm:ss') : '暂无' }}</div>
      </div>
      <div class="flex items-center my-5">
        <div class="w-3/10 text-gray-400">设备位置：</div>
        <div class="w-6/10 text-gray-400">{{
          infoFacility?.Latitude && infoFacility?.Longitude ?
          infoFacility?.Latitude + ',' + infoFacility?.Longitude : ''
          || '暂无' }}
        </div>
      </div>

    </div>

    <div class="centents" v-else>
      暂无设备关联
    </div>
  </div>
</div>
</template>

<script setup>
import Icon from '@/components/Icon';
import { ref, onMounted, watch } from 'vue';
import { facilityDetailApi, facilityRegionInfoApi, facilityTypeInfoApi } from '@/api/facility/facility'
import dayjs from 'dayjs'

const props = defineProps({
  // 工单ID
  DeviceId: { type: Number || String, default: 1000025128043 },
})

const infoFacility = ref()

const RegionDataName = ref()
const facilityType = ref()
watch(() => props.DeviceId, () => {
  console.log(props.DeviceId, 'props.DeviceId')
  if (props.DeviceId != null) {
    getTaskTicketInfo()
  }
  // props.DeviceId != null ?  : ''
})

onMounted(() => {
  if (props.DeviceId != null) {
    getTaskTicketInfo()
  }
  // getTaskTicketInfo()
})

const getTaskTicketInfo = () => {
  console.log('dev')
  facilityDetailApi({ Id: Number(props.DeviceId) }).then(res => {
    infoFacility.value = res[0]
    // console.og
    GetfacilityRegioninfo()
    checkType()
  })
}

// 区域详情
function GetfacilityRegioninfo() {
  facilityRegionInfoApi({ RegionId: infoFacility.value.RegionId }).then(res => {
    // RegionData.value = res.Detail
    // console.log(res)
    RegionDataName.value = res.Detail.RegionName
    // console.log(RegionDataName.value)
  })
}
const checkType = () => {
  facilityTypeInfoApi({ Id: infoFacility.value.TypeId }).then(res => {
    facilityType.value = res[0].TypeName
  })
  // console.log(id)

}
const timeZ = (time) => {
  var date = new Date(time * 1000);
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';

  var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
  var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
  var s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
  var strDate = Y + M + D + h + m + s;
  return strDate
  //   console.log('输出内容:', strDate)

}

defineExpose({
	getTaskTicketInfo
})

</script>

<style lang="less"></style>
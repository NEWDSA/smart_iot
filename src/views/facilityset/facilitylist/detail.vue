<template>
  <PageWrapper :title="infoFacility ? infoFacility.DeviceName : '设备详情'" contentBackground
    @back="goBack">
    <div class="p-5 bg-white">
      <div class="text-lg font-bold">设备列表</div>

      <div class="my-4 flex items-center justify-between">
        <div class="flex">
          <div class="px-3 py-1 mr-2" v-for="(item, index) in facilityDetailTab" :key="item.id"
            :class="facilityDetailTabIndex == index ? 'bg-gray-100 sp-blue-text rounded-2xl' : ''"
            @click="cutTab(index)">
            {{ item.title }}
          </div>
        </div>
      </div>

      <info v-if="facilityDetailTabIndex == '0'" :infoFacility="infoFacility" @ingoEdit="getfacilityId" :NetworkStatus="infoFacility.NetworkStatus"></info>
      <log v-if="facilityDetailTabIndex == '1'" :DeviceName="infoFacility.DeviceName" :NetworkStatus="infoFacility.NetworkStatus"></log>
      <control v-if="facilityDetailTabIndex == '2'" :DeviceModel="infoFacility.DeviceModel" :DeviceId="infoFacility.DeviceSerial" :ModelId="infoFacility.DeviceModelId" :NetworkStatus="infoFacility.NetworkStatus"></control>
      <warn v-if="facilityDetailTabIndex == '3'" :DeviceSerial="infoFacility.DeviceSerial" :NetworkStatus="infoFacility.NetworkStatus"></warn>

    </div>
  </PageWrapper>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { PageWrapper } from '@/components/Page';
import info from './components/detailCom/info.vue'
import control from './components/detailCom/control.vue'
import warn from './components/detailCom/warn.vue'
import log from './components/detailCom/log.vue'
import { facilityDetailApi } from '@/api/facility/facility'
import { useGo } from '@/hooks/web/usePage';
import { useRoute } from 'vue-router';
const route = useRoute();
const go = useGo();
const infoFacility = ref()

onMounted(() => {
  // 此处可以得到用户ID
  const facilityId = ref(route.params?.id);
  getfacilityId(facilityId.value);
})

const getfacilityId = (id) => {
  console.log('id',id)
  facilityDetailApi({ 'Id': id }).then(res => {
    console.log('res',res)
    infoFacility.value = res[0]
    facilityDetailTabIndex.value = '0'
  })

}


const facilityDetailTabIndex = ref('5')
const facilityDetailTab = reactive([
  {
    id: 1,
    title: '设备信息'
  },
  {
    id: 2,
    title: '日志管理'
  },
  {
    id: 3,
    title: '设备控制'
  },
  {
    id: 4,
    title: '告警状态'
  }
])
const cutTab = (index) => {
  facilityDetailTabIndex.value = index
}

const goBack = () => {
  // 本例的效果时点击返回始终跳转到账号列表页，实际应用时可返回上一页
  go('/facilityset/facilitylist')
}
</script>

<style lang="less">
body {
  font-family: 'Alibaba PuHuiTi';
}

.sp-blue-text {
  color: rgb(22, 100, 255);
}

.sp-blue-bg {
  background: rgb(22, 100, 255);
}
</style>
<template>
  <div class="md:flex">
    <Card size="default" style="" :loading="loading" title="设备数据" class=" w-full !md:mt-0">
      <template #extra>
        <!-- <Tag color="#222222">{{ 1 }}</Tag> -->
      </template>

      <div class="w-full flex">
        <div class="w-1/4 pl-5" :style="index != deviceList.length-1 ? 'border-right:1px solid #eeeeee' : ''" v-for="(item, index) in deviceList" :key="item.title">
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
            </div>
          </div>
        </div>
      </div>

    </Card>
  </div>
</template>
<script lang="ts" setup>
import { ref,onMounted } from 'vue';
import { CountTo } from '@/components/CountTo/index'
import { TaskTicketCountDataApi } from '@/api/sys/workorder'
// import { Icon } from '@/components/Icon'
import { Tag, Card } from 'ant-design-vue'

defineProps({
  loading: {
    type: Boolean
  }
})

onMounted(()=>{
  getfacilityData()
})

// StartTime:new Date(new Date(new Date().toLocaleDateString()).getTime()).valueOf(),
//     EndTime:new Date(new Date().getTime()).valueOf(),

function getfacilityData(){
  var NoticeTime = new Date(new Date(new Date().toLocaleDateString()).getTime()).valueOf()/1000;
  TaskTicketCountDataApi({'NoticeTime':NoticeTime}).then(res=>{
    deviceList.value[0].value = res?.TaskTicketTotal || 0

    deviceList.value[1].value = res?.CloseTaskTicketTotal || 0

    deviceList.value[2].value = res?.UrgentTaskTicketTotal || 0

    deviceList.value[3].value = res?.TaskTicketTotal || 0 - res?.CloseTaskTicketTotal || 0
    
  })
}

const deviceList = ref([
  {
    title: '新建工单量',
    value: 0,
  },
  {
    title: '完结工单量',
    value: 0,
  },
  {
    title: '紧急工单量',
    value: 0,
  },
  {
    title: '受理中工单量',
    value: 0,
  }
])


</script>

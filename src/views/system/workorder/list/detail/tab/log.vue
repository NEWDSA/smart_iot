<template>
  <div>
    <div class="px-5">
      <div class="flex justify-between items-center">
        <div class="text-lg">工单操作日志</div>
      </div>

      <div class="centents mt-5">
        <div class="" style="border:1px solid #eeeeee;" v-for="(item, index) in logList" :key="index">
          <div class="bg-gray-200 p-3 flex items-center">
            <div class="mr-3">{{ item?.CreatorName }}</div>

            <div class="mr-3">{{ dayjs.unix(item.Basic?.CreatedAt.seconds).format('YYYY-MM-DD HH:mm:ss') }}</div>
            <div class="mr-3">{{ item.Type == 1 ? '更新工单' : '新建工单' }}</div>
          </div>
          <div class="p-3 flex items-center" v-for="(item2, index2) in item.items">
            <div class="w-1 h-4 bg-blue-600 mr-1"></div>
            <div class="mr-3">{{ item2?.Key }}</div>
            <div class="mr-3">{{ item2?.Operation }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Icon from '@/components/Icon';
import { ref, onMounted, watch } from 'vue';
import { TaskTicketLogListApi } from '@/api/sys/workorder'
// import { log } from 'util';
import dayjs from 'dayjs'

const props = defineProps({
  // 工单ID
  DeviceId: { type: Number || String, default: 1000025128043 },
  workOrderId: { type: Number || String, default: null },
  workTitle: { type: String, default: null },
  workContent: { type: String, default: null },
  mySelf: { type: Number || String, default: 1 }
})

const logList = ref()

onMounted(() => {
  getTaskTicketInfo()
})

const getTaskTicketInfo = (idd) => {
  console.log('log')
  TaskTicketLogListApi({ TaskTicketId: idd ? idd : props.workOrderId }).then(res => {
    logList.value = res
    // console.log(res)
  })
}

defineExpose({
  getTaskTicketInfo
})
</script>

<style lang="less"></style>
<template>
  <div class="md:flex">
    <Card size="default" style="" :loading="loading" title="设备数据" class=" w-full !md:mt-0">
      <template #extra>
        <Tag color="#222222">{{ 1 }}</Tag>
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
import { ref } from 'vue';
import { CountTo } from '@/components/CountTo/index'
// import { Icon } from '@/components/Icon'
import { Tag, Card } from 'ant-design-vue'

defineProps({
  loading: {
    type: Boolean
  }
})

const deviceList = ref([
  {
    title: '设备数量',
    value: 200,
    fuTitle: '离线设备',
    fuValue: 23,
  },
  {
    title: '设备数量',
    value: 200,
  },
  {
    title: '设备数量',
    value: 200,
    fuTitle: '离线设备',
    fuValue: 23,
  },
  {
    title: '设备数量',
    value: 200,
    fuTitle: '离线设备',
    fuValue: 23,
  }
])


</script>

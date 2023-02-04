<template>
  <div class="md:flex">
    <Card size="default" :loading="loading" title="" class=" w-full !md:mt-0">

      <div class="flex items-center" style="justify-content: end;">
        <Tag color="#222222">{{ 1 }}</Tag>
      </div>

      <div class="w-full flex">
        <div class="w-1/4 pl-5" style="border-right:1px solid #eeeeee" v-for="(item) in deviceList"
          :key="item.title">
          <div class="text-lg truncate ...">
            {{ item.title }}
          </div>
          <div class="mt-4">
            <CountTo :startVal="1" :endVal="item.value" class="text-4xl" />
            <!-- {{ item.value }} -->
          </div>
        </div>

        <div class="w-1/4 pl-5 flex items-center">
          <div class="w-1/3 pl-5">
            <Progress :percent="percentList[0].value" type="circle" stroke-linecap="square" :strokeWidth="12" :width="80" strokeColor="#6FA1FF"/>
          </div>
          <div class="w-1/3 pl-5">
            <Progress :percent="percentList[0].value" type="circle" stroke-linecap="square" :strokeWidth="12" :width="80" strokeColor="#9DE490"/>
          </div>
          <div class="w-1/3 pl-5">
            <Progress :percent="percentList[0].value" type="circle" stroke-linecap="square" :strokeWidth="12" :width="80" strokeColor="#657798"/>
          </div>

        </div>

      </div>

    </Card>
    
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { CountTo } from '@/components/CountTo/index'
// import { Icon } from '@/components/Icon
import { Tag, Card,Progress } from 'ant-design-vue'

defineProps({
  loading: {
    type: Boolean
  }
})

const deviceList = ref([
  {
    title: '当日用电量（KW/H）',
    value: 13714,
  },
])

const percentList = ref([
  {
    value: 61,
  },
])

</script>

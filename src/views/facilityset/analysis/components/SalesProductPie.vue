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
import { ref,onMounted } from 'vue';
import { CountTo } from '@/components/CountTo/index'
// import { Icon } from '@/components/Icon
import { Tag, Card,Progress } from 'ant-design-vue'
import { facilityBoardNumApi } from '@/api/facility/facility'

defineProps({
  loading: {
    type: Boolean
  }
})

onMounted(()=>{
  getBoardNum()
})

function getBoardNum(){
  let obj = {
    StartTime:new Date(new Date(new Date().toLocaleDateString()).getTime()).valueOf(),
    EndTime:new Date(new Date().getTime()).valueOf(),
    Field:'power',
    TypeId:1
  }
  facilityBoardNumApi(obj).then(res=>{
    if(res.Code == 200){
      deviceList.value[0].value = res.Data
    }
  })
}
const deviceList = ref([
  {
    title: '当日用电量（KW/H）',
    value: '',
  },
])

const percentList = ref([
  {
    value: 61,
  },
])

</script>

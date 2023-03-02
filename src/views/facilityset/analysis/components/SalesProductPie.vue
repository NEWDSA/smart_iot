<template>
  <div class="md:flex">
    <Card size="default" :loading="loading" title="" class=" w-full !md:mt-0">

      <div class="flex items-center" style="justify-content: end;">
        <Tag color="#222222">{{ 1 }}</Tag>
      </div>

      <div class="w-full flex">
        <div class="w-1/4 pl-5" style="border-right:1px solid #eeeeee">
          <div class="text-lg truncate ...">
            {{ deviceRef.title }}
          </div>
          <div class="mt-4">
            <CountTo :decimals="1" :startVal="1" :endVal="deviceRef.value" class="text-4xl" />
            <!-- {{ item.value }} -->
          </div>
        </div>

        <div class="w-3/4 pl-5 flex items-center">
          <div class="w-1/3 pl-5 flex items-center" v-for="(item) in deviceList" :key="item.title">
            <Progress :percent="Number(((item.value / deviceRef.value) * 100).toFixed(2))" type="circle"
              stroke-linecap="square" :strokeWidth="12" :width="80" :strokeColor="item.color" />
            <div class="pl-5">
              <div class="text-lg text-gray-500">{{ item.title }}</div>
              <div>
                <CountTo :decimals="1" :startVal="1" :endVal="item.value" class="text-3xl" />
                <span class="text-2xl"> Kw/h</span>
              </div>
              <div class="text-gray-400">占比 {{ ((item.value / deviceRef.value) * 100).toFixed(2) }} %</div>
            </div>
          </div>


        </div>

      </div>

    </Card>

  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue';
import { CountTo } from '@/components/CountTo/index'
// import { Icon } from '@/components/Icon
import { Tag, Card, Progress } from 'ant-design-vue'
import { facilityBoardNumApi } from '@/api/facility/facility'

defineProps({
  loading: {
    type: Boolean
  }
})

onMounted(() => {
  getBoardNum(null, null)
  getBoardNum(-2, '0')
  getBoardNum(-3, '1')
})

function getBoardNum(type, index) {

  let obj: any = {
    StartTime: new Date(new Date(new Date().toLocaleDateString()).getTime()).valueOf(),
    EndTime: new Date(new Date().getTime()).valueOf(),
    Field: 'electricityConsumption',
    // TypeId: 1
  }

  if (type) {
    obj.TypeId = type
  }

  facilityBoardNumApi(obj).then(res => {
    if (res.Code == 200) {

      if (index) {
        let Tindex = Number(index)
        deviceList.value[Tindex].value = res.Data
        // return;
      } else {
        deviceRef.value = res.Data
      }

      deviceList.value[2].value = deviceRef.value - deviceList.value[0].value - deviceList.value[1].value


    }
  })
}

const deviceRef = reactive({
  title: '当日用电量（KW/H）',
  value: 0,
})

const deviceList = ref([
  {
    title: '空调',
    value: 0,
    percentage: 0,
    color: '#6FA1FF'
  },
  {
    title: '照明',
    value: 0,
    percentage: 0,
    color: '#9DE490'
  },
  {
    title: '其他',
    value: 0,
    percentage: 0,
    color: '#657798'
  },
])

</script>

<template>
  <div class="md:flex">
    <Card size="default" :loading="loading" title="" class=" w-full !md:mt-0 pppo">

      <div class="flex items-center mb-3" style="justify-content: end;">
        <DatePicker v-model:value="value1" @change="changeData"></DatePicker>
        <!-- <Tag color="#222222">{{ 1 }}</Tag> -->
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
            <!-- :format="(percent) => percent == 100 ? '100%' : `${percent} %`" -->
            <Progress
              :percent="Number.isNaN(item.value / deviceRef.value) ? 0 : ((item.value / deviceRef.value) * 100).toFixed(2)"
              type="circle" :show-info="false" stroke-linecap="square" :strokeWidth="12" :width="80"
              :strokeColor="item.color" />
            <div class="pl-5">
              <div class="text-lg text-gray-500">{{ item.title }}</div>
              <div>
                <CountTo :decimals="1" :startVal="1" :endVal="item.value" class="text-3xl" />
                <span class="text-2xl"> Kw/h</span>
              </div>
              <div class="text-gray-400">占比 {{ Number.isNaN(item.value / deviceRef.value) ? 0 : ((item.value /
                deviceRef.value) * 100).toFixed(2) }} %</div>
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
import { Tag, Card, Progress, DatePicker } from 'ant-design-vue'

import dayjs, { Dayjs } from 'dayjs';
import { facilityBoardNumApi } from '@/api/facility/facility'

defineProps({
  loading: {
    type: Boolean
  }
})

onMounted(() => {
  value1.value = dayjs(new Date(new Date(new Date().toLocaleDateString()).getTime()).valueOf())

  getBoardNum(null, null)
  getBoardNum(-2, '1')
  getBoardNum(-3, '0')
})

function getBoardNum(type, index, pp) {
  console.log(pp)
  var obj
  if (pp) {
    obj = {
      StartTime: pp,
      EndTime: pp +86400,
      Field: 'electricityConsumption',
      // TypeId: 1
    }
  } else {
    obj = {
      StartTime: new Date(new Date(new Date().toLocaleDateString()).getTime()).valueOf()/1000,
      EndTime: (new Date(new Date(new Date().toLocaleDateString()).getTime()).valueOf()/1000)+86400,
      Field: 'electricityConsumption',
      // TypeId: 1
    }
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

function changeData(e, key) {
  getBoardNum(null, null,new Date(key+' 00:00').valueOf() / 1000)
  getBoardNum(-2, '0',new Date(key+' 00:00').valueOf() / 1000)
  getBoardNum(-3, '1',new Date(key+' 00:00').valueOf() / 1000)

}

const deviceRef = reactive({
  title: '今日用电量（KW/H）',
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

const value1 = ref<Dayjs>()

</script>
<style lang="less" scoped>
.pppo .ant-card-body{
  padding-top:15px !important;
}

@media  (max-width: 768px) {
  body {
    font-size: 14px !important;
  }
}

@media  (min-width: 769px) and (max-width: 1024px) {
  body {
    font-size: 16px !important;
  }
}

@media  (min-width: 1025px) {
  body {
    font-size: 18px !important;
  }
}
</style>
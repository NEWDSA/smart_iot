<template>
  <Modal v-model:visible="visible" @ok="handleOk" @cancel="handleClock" :closable="closable" :centered="centered">
    <div class="text-center">
      <div class="title text-2xl py-4">创建分类</div>
      <div class="">
        <!-- 父级 -->
        <div class="w-7/12 flex items-center m-auto mb-5 " v-for="(item, index) in parentSelect" :key="index"
          v-if="parent == true">
          <div class="label mr-4 w-1/3" style="text-align: left;">
            <span :class="item.type == 'mast' ? 'text-red-400' : 'text-white'">*</span>
            {{ item.title }}
          </div>
          <div class="select">
            <Select v-model:value="item.selectValue" class="w-45" @change="SelectCut">
              <div :value="item2.TypeName" v-for="(item2, index2) in item.select" :key="item2.TypeId">
                {{ item2.TypeName }}
              </div>
            </Select>
          </div>
        </div>

        <div class="w-7/12 m-auto mb-5 " v-for="(item, index) in from" :key="index" >
          <div v-if="index == 0 || ClassType" class="flex items-center">
            <div class="label mr-4 w-1/3" style="text-align: left;">
            <span :class="item.type == 'mast' ? 'text-red-400' : 'text-white'">*</span>
            {{ item.title }}
          </div>
          <div class="input">
            <Input v-model:value="item.value" :placeholder="item.placeholder" />
          </div>
          </div>
          
        </div>

      </div>
    </div>
  </Modal>
</template>
<script lang="ts" setup>
import { ref, reactive, nextTick, watch } from 'vue';
import { Modal, Input } from 'ant-design-vue';
import { Select } from 'ant-design-vue';
import { facilityTypeTreeApi } from '@/api/facility/facility'
// import { object } from '_vue-types@3.0.2@vue-types';
// import { emit } from 'process';

let emit = defineEmits(['ok','close'])


const ClassType = ref()

const parentSelect = reactive([
  {
    title: '上级分类',
    type: 'mast',
    select: [],
    selectId: '',
    selectValue: '',
    placeholder: '请输入分类名称'
  },
])

const from = reactive([
  {
    title: '分类名称',
    type: 'mast',
    value: '',
    placeholder: '请输入分类名称'
  },
  // {
  //   title: '分类说明',
  //   type: 'nomast',
  //   value: '',
  //   placeholder: '请输入分类说明'
  // },
  {
    title: '排序',
    type: 'mast',
    value: '',
    placeholder: '请输入排序'
  }
])

const deviceid = ref<string>('')
const parent = ref<boolean>(false)
const parentClass = ref<string>('')
const visible = ref<boolean>(false)
const closable = ref<boolean>(false)
const centered = ref<boolean>(true)

const handleOk = () => {

  if (ClassType.value == 'edit') {
    emit('ok', 'edit', from,parentSelect,deviceid.value)
  } else if (ClassType.value == 'add') {
    emit('ok', 'add', from,parentSelect)
  } else {
    emit('ok', null, from)

  }
}

// 初始化
// const getTypeList = () => {

//   facilityTypeTreeApi().then(res => {
//     for (let i = 0, val; val = res[i++];) {
//       // 暂存
//       parentSelect[0].select.push(val.SelfData) //push设备类别的tab栏
//     }
//   })
//   console.log(parentSelect)
// }
// getTypeList()

// 关闭后
const handleClock = () => {
  visible.value = false
  parentClass.value = ''
  parent.value = false
  parentSelect[0].selectId = ''
  parentSelect[0].selectValue = ''
  parentSelect[0].select = []
  from[0].value = ''
  from[1].value = ''
  // from[2].value = ''
  deviceid.value = ''

  emit('close')
}


const SelectCut = (index, ex) => {
  parentSelect[0].selectId = ex.key
  parentSelect[0].selectValue = index

}

// 抛出
defineExpose({
  visible,
  parent,
  parentClass,
  from,
  parentSelect,
  deviceid,
  ClassType,
  handleClock
})

</script>

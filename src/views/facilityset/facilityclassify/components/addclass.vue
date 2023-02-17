<template>
  <Modal v-model:visible="visible" style="width: 400px;" @ok="handleOk" @cancel="handleClock" :closable="closable" :centered="centered" :body-style="{'text-align':'left'}"
    class="addclass">
    <div class="">
      <div class=" text-xl py-4 pl-5">{{ ClassType != 'edit' ? '添加设备分类' : '编辑设备分类'}}</div>
      <div class="">
        <!-- 父级 -->
        <div class="pl-5 flex items-center m-auto mb-5 " v-for="(item, index) in parentSelect" :key="index"
          v-if="parent == true">
          <div class="label mr-4 w-2/10" style="text-align: left;">
            <span :class="item.type == 'mast' ? 'text-red-400' : 'text-white'">*</span>
            {{ item.title }}
          </div>
          <div class="select">
            <Select v-model:value="item.selectValue" class="w-45 text-left" @change="SelectCut">
              <div :value="item2.TypeName" v-for="(item2, index2) in item.select" :key="item2.TypeId">
                {{ item2.TypeName }}
              </div>
            </Select>
          </div>
        </div>

        <div class="pl-5 m-auto mb-5 " v-for="(item, index) in from" :key="index">
          <div class="flex items-center">
            <div class="label mr-4 w-2/10" style="text-align: left;">
              <span :class="item.type == 'mast' ? 'text-red-400' : 'text-white'">*</span>
              {{ item.title }}
            </div>
            <div class="input">
              <Input v-model:value="item.value" :placeholder="item.placeholder" />
            </div>
          </div>
          <!-- <div style="text-align: right;color: red;">*{{ item.placeholder }}</div> -->
        </div>

        <div class="pl-5 m-auto mb-5" >
          <div class="flex items-center">
            <div class="label mr-4 w-2/10" style="text-align: left;">
              <span class="text-red-400">*</span>
              状态
            </div>
            <div class="radio">
              <RadioGroup v-model:value="RadioVal" :options="[
                { label: '正常', value: 1 },
                { label: '停用', value: 2 }
              ]"></RadioGroup>
            </div>
          </div>
          <!-- <div style="text-align: right;color: red;">*{{ item.placeholder }}</div> -->
        </div>

      </div>
    </div>
  </Modal>
</template>
<script lang="ts" setup>
import { ref, reactive, nextTick, watch } from 'vue';
import { Modal, Input } from 'ant-design-vue';
import { Select, RadioGroup } from 'ant-design-vue';
// import RadioGroup from 'ant-design-vue';
// import { object } from '_vue-types@3.0.2@vue-types';
// import { emit } from 'process';

let emit = defineEmits(['ok', 'close'])


const ClassType = ref<any>()

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
    placeholder: '请输入分类名称',
    typeio: 'input'
  },
  {
    title: '排序',
    type: 'mast',
    value: '',
    placeholder: '请输入排序',
    typeio: 'input'
  }
])

const deviceid = ref<string>('')
const parent = ref<boolean>(false)
const parentClass = ref<string>('')
const visible = ref<boolean>(false)
const closable = ref<boolean>(false)
const centered = ref<boolean>(true)
const RadioVal = ref<number>(1)
// watch(()=>ClassType.value,(newval,objval)=>{
//   console.log('ClassType.value',ClassType.value)
// })
const handleOk = () => {
  // console.log(RadioVal)
  if (ClassType.value == 'edit') {
    emit('ok', 'edit', from, parentSelect, deviceid.value,RadioVal)
  } else if (ClassType.value == 'add') {
    emit('ok', 'add', from, parentSelect, null, RadioVal)
  } else {
    emit('ok', null, from, null, null, RadioVal)
  }
}

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
  RadioVal.value = 1
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
  handleClock,
  RadioVal
})

</script>
<style>
.addclass .ant-modal-content {
  border-radius: 10px !important;
}
.ant-modal-footer{
  border: 0;
}
</style>

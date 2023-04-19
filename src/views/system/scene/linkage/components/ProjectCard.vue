<template>
  <div style="display: flex;" class="!md:w-1/3 !w-full">
    <template v-for="item, index in items" :key="item.title">
      <div class="typep" style="width:150px;height: 70px;margin: 10px;">
        <div @click="tabChange(index + 1)" class="tabCss" :class="index + 1 == selectedIndex ? 'selected' : 'selectedT'"
          style="position: relative; width:150px;height: 70px;display: flex;justify-content: center;align-items: center;"
          iconSize="30px">
          <Icon :icon="item.icon" size="30" class="mr-2"></Icon>

          {{ item.title }}
        </div>
      </div>
    </template>
  </div>

  <Modal v-model:visible="sceneStopModal" title="系统提示" :footer="null" style="top: 30vh">
    <div class="p-5">
      <div class="text-base">切换场景触发方式，将清空当前场景数据，是否切换？</div>
      <div class="flex mt-3" style="justify-content: center;">
        <div class="bg-blue-600 text-white rounded px-4 py-1 mr-2 mr-5" @click="checkClick">
          确认</div>
        <div class="text-blue-600 rounded px-4 py-1" style="border:1px solid rgba(37, 99, 235,1)" @click="stopClock">
          取消</div>
      </div>
    </div>

  </Modal>
</template>
<script lang="ts">
import { defineComponent, ref, defineExpose, watch } from 'vue';
import { Card, CardGrid, Modal } from 'ant-design-vue';
import { Icon } from '@/components/Icon';
import { groupItems } from './data';

export default defineComponent({
  components: { Card, CardGrid, Icon, Modal },
  props: {
    selectedIndexPo: {
      type: Number || String,
      default: 1
    },
  },
  emits: ['mychange'],
  setup(props, { emit }) {
    // console.log(props.selectedIndexPo)
    const selectedIndex = ref(1);
    watch(() => props.selectedIndexPo, (newValue, oldValue) => {
      selectedIndex.value = newValue
      console.log(selectedIndex.value)

    }, { deep: true }) // 开启深度监视才行

    const sceneStopModal = ref(false)
    const sceneStopIndex = ref(0)

    function tabChange(value) {
      console.log(sceneStopIndex.value, value)
      if (selectedIndex.value !== value) {
        sceneStopIndex.value = value
        sceneStopModal.value = !sceneStopModal.value
      }


    }
    function checkClick() {
      sceneStopModal.value = !sceneStopModal.value
      selectedIndex.value = sceneStopIndex.value
      // console.log('rrrr')
      emit('mychange', sceneStopIndex.value);
    }
    function stopClock() {
      sceneStopModal.value = !sceneStopModal.value
    }

    defineExpose({ selectedIndex })

    return { items: groupItems, selectedIndex, tabChange, sceneStopModal, checkClick, stopClock };
  },
});
</script>
<style lang="less" scoped>
.mygrid {
  position: relative;
  border: 1px solid pink;
}

.selected {
  //  border-color: aqua;
  border-color: #2a7dc9;
  color: #2a7dc9;
}
.selectedT{
  border-color: #d9d9d9;
  color: rgba(0, 0, 0, 0.85);
}
.selectedT:hover{
  transition: .3s all;
  border-color: #2a7dc9;
  color: #2a7dc9;
}
.tabCss {
  border-style: solid;
  border-width: 1px;
  border-radius: 2px;
  background: #fff;
  cursor: pointer;
}

.typep .ant-btn .ant-btn:focus {
  // color: none !important;
  // border-color: none !important;
  // background: none !important;
}
</style>
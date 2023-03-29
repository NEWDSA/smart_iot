<template>
  <div style="display: flex;" class="!md:w-1/3 !w-full">
    <template v-for="item, index in items" :key="item.title">
      <div style="width:150px;height: 70px;margin: 10px;">
        <a-button @click="tabChange(index)" :class="{ selected: index == selectedIndex }"
          style="position: relative; width:150px;height: 70px;" :preIcon="item.icon">{{ item.title }}</a-button>
      </div>
    </template>
  </div>

  <Modal v-model:visible="sceneStopModal" title="系统提示" :footer="null">
    <div class="p-5">
      <div class="text-base">切换方式当前方式的数据会被清空，是否要切换触发方式？</div>
      <div class="flex mt-3" style="justify-content: end;">
        <div class="bg-blue-600 text-white rounded px-4 py-1 mr-2" @click="checkClick">
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
      default: 0
    },
  },
  emits: ['mychange'],
  setup(props, { emit }) {
    // console.log(props.selectedIndexPo)
    const selectedIndex = ref(0);
    watch(() => props.selectedIndexPo, (newValue, oldValue) => {
      selectedIndex.value = newValue
    }, { deep: true }) // 开启深度监视才行

    const sceneStopModal = ref(false)
    const sceneStopIndex = ref()

    function tabChange(value) {
      sceneStopIndex.value = value
      sceneStopModal.value = !sceneStopModal.value

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
}
</style>

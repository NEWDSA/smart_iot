<template>
  <div style="display: flex;" class="!md:w-1/3 !w-full">
    <template v-for="item, index in items" :key="item.title">
      <div style="width:150px;height: 70px;margin: 10px;">
        <a-button @click="selectedIndex = index,tabChange(index)" :class="{ selected: index == selectedIndex }" style="position: relative; width:150px;height: 70px;"
          :preIcon="item.icon">{{ item.title }}</a-button>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Card, CardGrid } from 'ant-design-vue';
import { Icon } from '@/components/Icon';
import { groupItems } from './data';

export default defineComponent({
  components: { Card, CardGrid, Icon },
  emits: ['mychange'],
  setup(_,{emit}) {
    const selectedIndex = ref(0);
    function tabChange(value) {
      console.log('rrrr')
      emit('mychange',value);
    }

    return { items: groupItems, selectedIndex, tabChange };
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

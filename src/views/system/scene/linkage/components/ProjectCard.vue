<template>
  <div style="display: flex;" class="!md:w-1/3 !w-full">
    <template v-for="item in items" :key="item.title">
      <div style="width:150px;height: 70px;margin: 10px;">
        <a-button style="position: relative; width:150px;height: 70px;" :preIcon="item.icon">{{ item.title }}</a-button>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { Card, CardGrid } from 'ant-design-vue';
import { Icon } from '@/components/Icon';
import { groupItems } from './data';

export default defineComponent({
  components: { Card, CardGrid, Icon },
  setup() {
    function tabChange(value) {
      console.log(value, '?...value...?');
    }
    return { items: groupItems, tabChange };
  },
});
</script>
<style lang="less" scoped>
.mygrid {
  position: relative;
  border: 1px solid pink;
}
</style>

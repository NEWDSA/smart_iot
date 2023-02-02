<template>
  <Card  v-bind="$attrs">
    <CardGrid @click="tabChange(item)" v-for="item in items" :key="item.title" class="!md:w-1/3 !w-full mygrid">
      <span class="flex">
        <Icon :icon="item.icon" :color="item.color" size="30" />
        <span class="text-lg ml-4">{{ item.title }}</span>
      </span>
    </CardGrid>
  </Card>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Card, CardGrid } from 'ant-design-vue';
  import { Icon } from '@/components/Icon';
  import { groupItems } from './data';

  export default defineComponent({
    components: { Card, CardGrid, Icon },
    setup() {
      function tabChange(value){
         console.log(value,'?...value...?');
      }
      return { items: groupItems,tabChange };
    },
  });
</script>
<style lang="less" scoped>
 .mygrid{
  position: relative;
  border: 1px solid pink;
 }
</style>

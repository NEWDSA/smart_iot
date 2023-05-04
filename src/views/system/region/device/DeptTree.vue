<template>
  <div class="m-4 mr-0 overflow-hidden bg-white">
    <BasicTree title="区域列表" :selectedKeys="selectedKeys" toolbar search
      treeWrapperClassName="h-[calc(100%-35px)] overflow-auto" :clickRowToExpand="false" :treeData="treeData"
      :fieldNames="{ key: 'RegionId', title: 'RegionName' }" @select="handleSelect" />
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

import { BasicTree, TreeItem } from '@/components/Tree';
import { getReginList } from '@/api/demo/region';


export default defineComponent({
  name: 'DeptTree',
  components: { BasicTree },

  emits: ['select'],
  setup(_, { emit }) {
    const treeData = ref<TreeItem[]>([]);
    const selectedKeys = ref();
    // 获取部门数据
    async function fetch() {
      // treeData.value = (await getReginList()) as unknown as TreeItem[];
      const { Detail } = await getReginList()
      const myDetail=Detail.filter(item => item.Status == '1');
      selectedKeys.value = [myDetail[0].RegionId];
      emit('select', myDetail[0].RegionId);
      treeData.value = myDetail;
    }



    function handleSelect(RegionId) {
      emit('select', RegionId[0]);
    }

    onMounted(() => {
      fetch();
    });
    return { treeData, selectedKeys, handleSelect };
  },
});
</script>

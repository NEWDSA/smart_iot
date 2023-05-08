<template>
  <div class="m-4 mr-0 overflow-hidden bg-white">
    <BasicTree title="部门列表" :selectedKeys="selectedKeys" toolbar search
      treeWrapperClassName="h-[calc(100%-35px)] overflow-auto" :clickRowToExpand="false" :treeData="treeData"
      :fieldNames="{ key: 'DeptId', title: 'DeptName' }" @select="handleSelect" />
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

import { BasicTree, TreeItem } from '@/components/Tree';
import { getReginList } from '@/api/demo/region';
import { getDeptList, DelDept } from '@/api/demo/system';

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
      const res: any = [];
      const { List } = await getDeptList()

      const myDetail = List.filter(item => item.Status == '0');
      selectedKeys.value = [myDetail[0].DeptId];
      emit('select', myDetail[0].DeptId);
      // treeData.value = myDetail;

      treeData.value = afterFetch(myDetail)
    }

    function afterFetch(res) {
      let result = res;
      function listToTreeSimple(data) {
        const res: any = [];
        data.forEach((item) => {
          const parent = data.find((node) => node.DeptId === item.ParentId);
          if (parent) {
            parent.children = parent.children || [];
            parent.children.push(item);
          } else {
            // * 根节点
            res.push(item);
          }
        });
        return res;
      }
      let datas = listToTreeSimple(result);
      return datas
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

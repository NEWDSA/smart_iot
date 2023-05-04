<template>
  <div class="m-4 mr-0 overflow-hidden bg-white">
    <BasicTree title="部门列表" :selectedKeys="selectedKeys" toolbar search ref="treeRef"
      treeWrapperClassName="h-[calc(100%-35px)] overflow-auto" :clickRowToExpand="false" :treeData="treeData"
      :fieldNames="{ key: 'DeptId', title: 'DeptName' }" @select="handleSelect" />
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, unref } from 'vue';

import { BasicTree, TreeItem, TreeActionType } from '@/components/Tree';
import { getDeptList } from '@/api/demo/system';

export default defineComponent({
  name: 'DeptTree',
  components: { BasicTree },

  emits: ['select'],
  setup(_, { emit }) {
    const treeData = ref<TreeItem[]>([]);
    const selectedKeys = ref();
    const lastSelectedKey = ref();
    // 获取部门数据
    async function fetch() {
      // const { List } = await getDeptList();
      // selectedKeys.value = [List[0].DeptId];
      // emit('select', List[0].DeptId
      // );
      // treeData.value = List;

      treeData.value = (await getDeptList()) as unknown as TreeItem[];
      // 组装后端数据
      function listToTreeSimple(data) {
        const res: any = [];
        data.List.forEach((item) => {
          const parent = data.List.find((node) => node.DeptId === item.ParentId);
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
      let datas = listToTreeSimple(treeData.value);
      treeData.value = datas;
      return treeData

    }

    function handleSelect(keys) {
      emit('select', keys[0]);
    }
    onMounted(() => {
      fetch();
    });
    return { treeData, selectedKeys, lastSelectedKey, handleSelect };
  },
});
</script>

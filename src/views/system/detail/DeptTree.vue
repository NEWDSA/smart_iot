<template>
  <div class="m-4 mr-0 overflow-hidden bg-white">
      <BasicTree
      title="角色列表"
      toolbar
      search
      v-model:selectedKeys="selectedKeys"
      treeWrapperClassName="h-[calc(100%-35px)] overflow-auto"
      :clickRowToExpand="false"
      :treeData="treeData"
      :fieldNames="{ key: 'RoleId', title: 'RoleName' }"
      @select="handleSelect"
    />
      
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, unref } from 'vue';

import { BasicTree, TreeItem, TreeActionType } from '@/components/Tree';
import { getAllRoleList } from '@/api/demo/system';

export default defineComponent({
  name: 'DeptTree',
  components: { BasicTree },
  props: ['RoleId'],
  emits: ['select'],
  setup(props, { emit }) {
    const treeRef = ref<Nullable<TreeActionType>>(null);
    // const checkedKeys: any = ref(['1']);
    const a = [props.RoleId];
    // const  selectedKeys=ref(['0'])
   const selectedKeys=ref([props.RoleId]);
    console.log(a, '...props...?')
    const treeData = ref<TreeItem[]>([]);
    function getTree() {
      const tree = unref(treeRef);
      if (!tree) {
        throw new Error('tree is null!');
      }
      return tree;
    }
    
    
    // 获取部门数据
    async function fetch() {
      const { List } = await getAllRoleList()
      treeData.value = await List as unknown as TreeItem[];
    }

    function handleSelect(keys) {
      emit('select', keys[0]);
    }
    onMounted(() => {
      fetch();
    });
    return { treeData,selectedKeys, treeRef, handleSelect,getTree };
  },
});
</script>

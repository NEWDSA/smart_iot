<template>
  <div>
    <BasicTable @register="registerTable" @fetch-success="onFetchSuccess">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增菜单 </a-button>
        <a-button @click="changeexpandAll(), checkAll = !checkAll" class="mr-2"> 展开/折叠全部 </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="[
            {
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              popConfirm: {
                title: '是否确认删除',
                placement: 'left',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]" />
        </template>
      </template>
    </BasicTable>
    <MenuDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
import { defineComponent, nextTick, ref } from 'vue';

import { BasicTable, useTable, TableAction } from '@/components/Table';
import { getMenuList, DelMenuList } from '@/api/demo/system';

import { useDrawer } from '@/components/Drawer';
import MenuDrawer from './MenuDrawer.vue';

import { columns, searchFormSchema } from './menu.data';

export default defineComponent({
  name: 'MenuManagement',
  components: { BasicTable, MenuDrawer, TableAction },
  setup() {
    const [registerDrawer, { openDrawer }] = useDrawer();
    const checkAll = ref(true);
    const [registerTable, { reload, expandAll, collapseAll }] = useTable({
      title: '菜单列表',
      // api: getData,
      api: async (p) => {
        // 对数据进行特殊处理
        const { List } = await getMenuList(p);

        return List;

      },
      afterFetch(res) {
        let result = res;
        function listToTreeSimple(data) {
          const res: any = [];
          data.forEach((item) => {
            const parent = data.find((node) => node.MenuId === item.ParentId);
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
      },
      columns,
      formConfig: {
        labelWidth: 120,
        schemas: searchFormSchema,
      },
      isTreeTable: true,
      pagination: false,
      striped: false,
      useSearchForm: true,
      showTableSetting: true,
      bordered: true,
      showIndexColumn: false,
      canResize: false,
      actionColumn: {
        width: 80,
        title: '操作',
        dataIndex: 'action',
        fixed: undefined,
      },
    });
    function handleCreate() {
      openDrawer(true, {
        isUpdate: false,
      });
    }
    function handleEdit(record: Recordable) {
      openDrawer(true, {
        record,
        isUpdate: true,
      });
    }

    function handleDelete(record: Recordable) {

      try {
        DelMenuList({ MenuId: record.MenuId });
      } finally {
        reload();
      }
      // 删除菜单

    }

    function handleSuccess() {
      reload();
    }

    function onFetchSuccess() {
      // 演示默认展开所有表项
      nextTick(expandAll);
    }
    function changeexpandAll() {
      checkAll.value ? expandAll() : collapseAll();

    }

    return {
      registerTable,
      registerDrawer,
      handleCreate,
      handleEdit,
      handleDelete,
      handleSuccess,
      onFetchSuccess,
      changeexpandAll,
      checkAll
    };
  },
});
</script>

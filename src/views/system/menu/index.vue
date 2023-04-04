<template>
  <div>
    <BasicTable @register="registerTable" @fetch-success="onFetchSuccess">
      <template #toolbar>
        <a-button v-if="hasPermission(['AddBtn_Menu'])" type="primary" @click="handleCreate"> 新增菜单 </a-button>
        <a-button @click="changeexpandAll(), checkAll = !checkAll" class="mr-2"> 展开/折叠全部 </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="[
            {
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
              ifShow: hasPermission(['handleEdit_Menu'])
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              ifShow: hasPermission(['handleDelete_Menu']),
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
    <MenuModal @register="registerMenuModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
import { defineComponent, nextTick, ref } from 'vue';

import { BasicTable, useTable, TableAction } from '@/components/Table';
import { getMenuList, DelMenuList } from '@/api/demo/system';
import MenuModal from './MenuModal.vue';
import { columns } from './menu.data';
import { useModal } from '@/components/Modal';
import { usePermission } from '@/hooks/web/useButtonPermission';
export default defineComponent({
  name: 'MenuManagement',
  components: { BasicTable, MenuModal, TableAction },
  setup() {
    const { hasPermission } = usePermission();
    const [registerMenuModal, { openModal }] = useModal();
    const checkAll = ref(true);
    const [registerTable, { reload, expandAll, collapseAll }] = useTable({
      title: '菜单列表',
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
      isTreeTable: true,
      pagination: false,
      striped: false,
      useSearchForm: false,
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
      openModal(true, {
        isUpdate: false,
      });
    }
    function handleEdit(record: Recordable) {
      openModal(true, {
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
      registerMenuModal,
      handleCreate,
      handleEdit,
      handleDelete,
      handleSuccess,
      onFetchSuccess,
      changeexpandAll,
      hasPermission,
      checkAll
    };
  },
});
</script>

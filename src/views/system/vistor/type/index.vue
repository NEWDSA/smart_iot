<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增角色 </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="[
            {
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'mdi:account-plus-outline',
              onClick: handleDetail.bind(null, record),
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
    <RoleDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import { BasicTable, useTable, TableAction } from '@/components/Table';
import { getVisitorTypeList } from '@/api/demo/visitor';
import { useDrawer } from '@/components/Drawer';
import RoleDrawer from './RoleDrawer.vue';
import { columns, searchFormSchema } from './type.data';
import { useGo } from '@/hooks/web/usePage';
export default defineComponent({
  name: 'RoleManagement',
  components: { BasicTable, RoleDrawer, TableAction },
  setup() {
    const [registerDrawer, { openDrawer }] = useDrawer();
    const go = useGo();
    const [registerTable, { reload, deleteTableDataRecord }] = useTable({
      title: '访客类型管理',
      api: getData,
      columns,
      formConfig: {
        labelWidth: 120,
        schemas: searchFormSchema,
      },
      useSearchForm: true,
      showTableSetting: true,
      bordered: true,
      showIndexColumn: false,
      actionColumn: {
        width: 80,
        title: '操作',
        dataIndex: 'action',
        // slots: { customRender: 'action' },
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
    async function getData() {
      const {Detail} = await getVisitorTypeList();
      return Detail

    }
    async function handleDelete(record: Recordable) {
      await deleteTableDataRecord(record.RoleId);
      try {
        await DelRole({
          RoleId: record.RoleId
        })
      } finally {
        reload();
      }
    }
    function handleDetail() {
      go('/system/detail')
    }
    function handleSuccess() {
      reload();
    }

    return {
      registerTable,
      registerDrawer,
      handleCreate,
      handleEdit,
      handleDelete,
      handleSuccess,
      handleDetail,
      getData
    };
  },
});
</script>

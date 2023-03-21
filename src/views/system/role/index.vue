<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button v-if="hasPermission(['AddRole_Role'])" type="primary" @click="handleCreate"> 新增角色 </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="[
            {
              ifShow: hasPermission(['handleEdit_Role']),
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
            },
            {
              ifShow: hasPermission(['handleDetail_Role']),
              icon: 'mdi:account-plus-outline',
              onClick: handleDetail.bind(null, record),
            },
            {
              ifShow: hasPermission(['handleDelete_Role']),
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
import { getRoleListByPage, DelRole } from '@/api/demo/system';
import { useDrawer } from '@/components/Drawer';
import RoleDrawer from './RoleDrawer.vue';
import { columns } from './role.data';
import { useGo } from '@/hooks/web/usePage';
import { useMessage } from '@/hooks/web/useMessage';
import { usePermission } from '@/hooks/web/useButtonPermission';
export default defineComponent({
  name: 'RoleManagement',
  components: { BasicTable, RoleDrawer, TableAction },
  setup() {
    const { hasPermission } = usePermission();
    const [registerDrawer, { openDrawer }] = useDrawer();
    const { createMessage } = useMessage();
    const go = useGo();
    const [registerTable, { reload, deleteTableDataRecord }] = useTable({
      title: '角色列表',
      api: async (p) => {
        const { List } = await getRoleListByPage(p);
        return new Promise((resolve) => {
          resolve([...List])
        })
      },
      columns,
      useSearchForm: false,
      showTableSetting: true,
      bordered: true,
      showIndexColumn: false,
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

    async function handleDelete(record: Recordable) {
      await deleteTableDataRecord(record.RoleId);

      try {
        const {Data,Msg}= await DelRole({
          RoleId: await record.RoleId 
        })
  
        // 弹窗提示
        Msg=='fail'? createMessage.error(Data):createMessage.success('删除角色成功');
      } finally {
        reload();
      }
    }
    function handleDetail(record) {
      go(`/system/detail/${record.RoleId}`)
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
      hasPermission
    };
  },
});
</script>

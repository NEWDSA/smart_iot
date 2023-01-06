<template>
  <PageWrapper contentFullHeight title="部门管理">
    <BasicTable :canResize="true" @register="registerTable">
      <template #tableTitle>
        <a-button preIcon="mdi:plus" @click="handleCreate" type="primary">创建部门</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="[
  {
    icon: 'clarity:note-edit-line',
    onClick: handleEdit.bind(null, record),
  },
  {
    icon: 'ion:add-circle-outline',
    popConfirm: {
      title: '添加',
      placement: 'left',
      confirm: handleCreate.bind(null),
    }
  },
  {
    icon: 'ant-design:delete-outlined',
    color: 'error',
    popConfirm: {
      title: '是否确认删除',
      placement: 'left',
      confirm: handleDelete.bind(null, record),
    },
  }
]" />
        </template>
      </template>
    </BasicTable>
    <DeptModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import { BasicTable, useTable, TableAction } from '@/components/Table';
import { getDeptList, DelDept } from '@/api/demo/system';
import { PageWrapper } from '@/components/Page';
import { useModal } from '@/components/Modal';
import DeptModal from './DeptModal.vue';
import { getBasicColumns, searchFormSchema } from './dept.data';
export default defineComponent({
  name: 'DeptManagement',
  components: { PageWrapper, BasicTable, DeptModal, TableAction },
  setup() {

    const [registerModal, { openModal }] = useModal();
    let source = 0;
    let target = 0;
    const [registerTable, { reload, deleteTableDataRecord }] = useTable({
      title: '部门列表',
      isTreeTable: true,
      columns: getBasicColumns(),
      formConfig: {
        labelWidth: 120,
        schemas: searchFormSchema,
      },
      api: getDeptList,
      afterFetch(res) {
        let result = res;
        console.log(result,'ddd')
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
      },
      pagination: false,
      striped: false,
      useSearchForm: false,
      showTableSetting: true,
      bordered: true,
      showIndexColumn: false,
      actionColumn: {
        width: 80,
        title: '操作',
        dataIndex: 'action',
        // slots: { customRender: 'action' },
        fixed: undefined,
      }
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

    async function handleDelete(record: Recordable) {
      await deleteTableDataRecord(record.RoleId);
      await DelDept({ DeptId: record.DeptId })
      reload();
    }

    function handleSuccess() {
      reload();
    }
    function getData() {
      getDeptList().then(res => {
        return res
      })
    }
    return {
      registerTable,
      registerModal,
      handleCreate,
      handleEdit,
      handleDelete,
      handleSuccess,
      getData,
      source,
      target
    };
  },
});
</script>

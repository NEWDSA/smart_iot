<template>
  <PageWrapper contentFullHeight title="区域列表">
    <BasicTable :canResize="true" @register="registerTable">
      <template #tableTitle>
        <a-button v-if="hasPermission(['createNewArea_RegionList'])" preIcon="mdi:plus" @click="handleCreate" type="primary">创建新区域</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="[
            {
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
              ifShow:  hasPermission(['handleEdit_RegionList'])
            },
            {
              icon: 'ion:add-circle-outline',
              onClick:handleAdd.bind(null,record),
              ifShow:  hasPermission(['handleAdd_RegionList'])
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              ifShow:  hasPermission(['handleDelete_RegionList']),
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
    <DeptModal :okText="okTitle" @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
import { defineComponent,ref } from 'vue';
import { BasicTable, useTable, TableAction } from '@/components/Table';
import {getReginList,delRegion} from '@/api/demo/region';
import { PageWrapper } from '@/components/Page';
import { useModal } from '@/components/Modal';
import DeptModal from './DeptModal.vue';
import { getBasicColumns, searchFormSchema } from './dept.data';
import {usePermission} from '@/hooks/web/useButtonPermission';
export default defineComponent({
  name: 'DeptManagement',
  components: { PageWrapper, BasicTable, DeptModal, TableAction },
  setup() {
    const { hasPermission } = usePermission();
    const [registerModal, { openModal }] = useModal();
    const ischildren=true;
    const okTitle=ref('添加');
    let source = 0;
    let target = 0;
    const [registerTable, { reload, deleteTableDataRecord }] = useTable({
      title: '区域列表',
      isTreeTable: true,
      columns: getBasicColumns(),
      formConfig: {
        labelWidth: 120,
        schemas: searchFormSchema,
      },
      api: async (p) => {
        const { Detail } = await getReginList(p);
        return new Promise((resolve) => {
          resolve([...Detail]);
        })
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
        fixed: undefined,
      }
    });
    function handleCreate() {
      openModal(true, {
        isModifiy:0,
        isUpdate: false,
      });

    }

    function handleAdd(record:Recordable){
      openModal(true, {
        record,
        isModifiy:1,
        isUpdate: false,
      });
    }

    function handleEdit(record: Recordable) {
      okTitle.value='确定'
      openModal(true, {
        record,
        isModifiy:2,
        isUpdate: true,
      });
    }

    async function handleDelete(record: Recordable) {
      await deleteTableDataRecord(record.RegionId);
      await delRegion({ RegionId: record.RegionId })
      reload();
    }

    function handleSuccess() {
      reload();
    }
    return {
      registerTable,
      registerModal,
      handleCreate,
      handleEdit,
      handleDelete,
      handleSuccess,
      handleAdd,
      hasPermission,
      source,
      target,
      ischildren,
      okTitle
    };
  },
});
</script>

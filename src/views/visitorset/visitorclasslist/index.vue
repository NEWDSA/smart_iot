<template>
  <PageWrapper contentFullHeight title="访客类型列表">
    <div>
      <div class="p-2 bg-white">
        <div>
          <!-- <BasicForm @register="register"></BasicForm> -->
        </div>
        <div>
          <a-button v-if="hasPermission(['handleAdd_visitorclasslist'])" type="primary" preIcon="ic:baseline-plus" @click="handleAdd()">
            添加访客类型
          </a-button>
        </div>
      </div>
      <BasicTable @register="registertab">
        <!-- <template #toolbar>
        <a-button type="primary" @click="expandAll">展开全部</a-button>
        <a-button type="primary" @click="collapseAll">折叠全部</a-button>
      </template> -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <TableAction :actions="createActions(record, column)" />
          </template>
        </template>
      </BasicTable>

      <addModel @register="registerModal" @success="handleSuccess"></addModel>

    </div>
  </PageWrapper>
</template>

<script>
import { ref, defineComponent } from 'vue';
import { BasicTable, TableAction, useTable } from '/@/components/Table'
import { visitorTypeListApi, visitorTypeDeleteApi } from '@/api/visitor/visitor'
import { TabColumns } from './visitorData'
import { useModal } from '@/components/Modal';
import addModel from './addClassModal.vue'
import { message } from 'ant-design-vue';
import { PageWrapper } from '@/components/Page';
import {usePermission} from '@/hooks/web/useButtonPermission';
export default defineComponent({
  components: { BasicTable, TableAction, addModel,PageWrapper },
  setup() {
    const [registerModal, { openModal }] = useModal();
    const { hasPermission } = usePermission();
    // 表格数据
    const [registertab, { reload, deleteTableDataRecord }] = useTable({
      api: visitorTypeListApi,
      columns: TabColumns(),
      showIndexColumn: false,
      striped: false,
      actionColumn: {
        width: 80,
        title: '操作',
        dataIndex: 'action',
        // slots: { customRender: 'action' },
        fixed: undefined
      },
    })


    // 操作
    function createActions(record) {
      return [
        {
          label: '修改',
          ifShow:  hasPermission(['handleEdit_visitorlist']),
          onClick: handleEdit.bind(null, record)
        },
        {
          label: '删除',
          ifShow:  hasPermission(['handleDelete_visitorlist']),
          popConfirm: {
            title: '是否确认删除',
            placement: 'left',
            confirm: handleDelete.bind(null, record),
          },
        }
      ]
    }

    function handleAdd() {
      openModal(true, {
        isUpdate: false,
      });
    }

    function handleEdit(record) {
      openModal(true, {
        isUpdate: true,
        record
      });
    }

    async function handleDelete(record) {
      await deleteTableDataRecord(record.VisitorTypeId);
      await visitorTypeDeleteApi({ VisitorTypeId: record.VisitorTypeId })
      reload();
    }

    function handleSuccess() {
      message.success('操作成功')
      reload();
    }

    return {
      registertab,
      handleAdd,
      hasPermission,
      registerModal,
      handleSuccess,
      createActions,
      handleEdit,
      handleDelete
    };
  },
});



</script>

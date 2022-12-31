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

import { columns, searchFormSchema } from './dept.data';

export default defineComponent({
  name: 'DeptManagement',
  components: { PageWrapper, BasicTable, DeptModal, TableAction },
  setup() {
    const [registerModal, { openModal }] = useModal();
    let source = 0;
    let target = 0;
    const [registerTable, { reload,deleteTableDataRecord,getDataSource }] = useTable({
      title: '部门列表',
      api: getDeptList,
      columns,
      formConfig: {
        labelWidth: 120,
        schemas: searchFormSchema,
      },
      customRow: customRow,
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
      },
    });
    function customRow(record, index) {

      console.log(record, index); // 这里输出是表格全部的数据
      return {
        props: {
          // draggable: 'true'
        },
        style: {
          cursor: 'pointer',
        },
        // 鼠标移入
        onMouseenter: (event) => {
          // 兼容IE
          let ev = event || window.event;
          ev.target.draggable = true; // 让你要拖动的行可以拖动，默认不可以
        },
        // 开始拖拽
        onDragstart: (event) => {
          // 兼容IE
          let ev = event || window.event;
          // 阻止冒泡
          ev.stopPropagation();
          // 得到源目标数据序号
          source = index;
          console.log(record, index, 'source');
        },
        // 拖动元素经过的元素
        onDragover: (event) => {
          // 兼容 IE
          let ev = event || window.event;
          // 阻止默认行为
          ev.preventDefault();
        },
        // 鼠标松开
        onDrop: (event) => {
          // 兼容IE
          let ev = event || window.event;
          // 阻止冒泡
          ev.stopPropagation();
          // 得到目标数据序号
          target = index;
          // 这里就是让数据位置互换，让视图更新 你们可以看record，index的输出，看是什么
          [record[source], record[target]] = [record[target], record[source]];
          console.log(record, index, 'target', source, target);
          console.log(getDataSource(), '...getDataSource')

        },
      };
    }
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
      await DelDept({DeptId:record.DeptId})
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
      customRow,
      source,
      target
    };
  },
});
</script>

<template>
  <PageWrapper contentFullHeight title="组织架构管理">
    
    <BasicTable @register="registerTable" @fetch-success="onFetchSuccess">
      <template #tableTitle>
        <a-button preIcon="mdi:plus" @click="handleCreate" type="primary">创建部门</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
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
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <MenuDrawer @register="registerDrawer" @success="handleSuccess" />
    <Model :height="modelHeight" class="titleTest"  @register="registerModel"></Model>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, nextTick } from 'vue';
  import { PageWrapper } from '@/components/Page';
  import Model from './modal/index.vue'
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { getMenuList } from '@/api/demo/system';
  import { useModal } from '@/components/Modal';  //外部组件调用
  import { useDrawer } from '@/components/Drawer';
  import MenuDrawer from './MenuDrawer.vue';

  import { columns, searchFormSchema } from './menu.data';

  export default defineComponent({
    name: 'MenuManagement',
    components: {Model,PageWrapper, BasicTable, MenuDrawer, TableAction },
    setup() {
      const modelHeight=200;
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerModel, { openModal }] = useModal();   //外部组件调用
      const [registerTable, { reload, expandAll }] = useTable({
        // title: '菜单列表',
        api: getMenuList,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
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
          // slots: { customRender: 'action' },
          fixed: undefined,
        },
      });

      function handleCreate() {
        openModal(true, {
          isUpdate: false,
        });
      }

      function handleEdit(record: Recordable) {
        openModal(true,{
          record,
          isUpdate: true,
        })
        // openDrawer(true, {
        //   record,
        //   isUpdate: true,
        // });
      }

      function handleDelete(record: Recordable) {
        console.log(record);
      }

      function handleSuccess() {
        reload();
      }

      function onFetchSuccess() {
        // 演示默认展开所有表项
        nextTick(expandAll);
      }

      return {
        registerTable,
        registerDrawer,
        registerModel,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        onFetchSuccess,
        modelHeight
      };
    },
  });
</script>

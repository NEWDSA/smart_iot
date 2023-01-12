<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <DeptTree class="w-1/4 xl:w-1/5" @select="handleSelect" />
    <BasicTable :dataSource="dataSource" @register="registerTable" class="w-3/4 xl:w-4/5" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button type="primary" @click="handleBulk">批量设置权限</a-button>
        <a-button type="primary" @click="handleout">批量移出</a-button>
        <a-button type="primary" @click="handleCreate">添加设备</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="[
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              tooltip: '删除此账号',
              popConfirm: {
                title: '是否确认删除',
                placement: 'left',
                confirm: handleDelete.bind(null, record),
              },
            },
            {
              icon: 'ri:lock-password-fill',
              tooltip: '修改密码',
              onClick: handleEditPwd.bind(null, record)
            },
            {
              icon: 'clarity:note-edit-line',
              tooltip: '编辑用户资料',
              onClick: handleEdit.bind(null, record),
            }
          ]" />
        </template>
      </template>
    </BasicTable>
    <component :is="currentModal" v-model:visible="modalVisible" @success="Dat" :isUpdate="true" />
    <AccountModal @register="registerModal" @success="handleSuccess" />
    <AccountTable @register="registerMyTable" @success="Dat" />
  </PageWrapper>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, toRaw, shallowRef, ComponentOptions, nextTick, onMounted } from 'vue';
import { BasicTable, useTable, TableAction } from '@/components/Table';
import { useMessage } from '@/hooks/web/useMessage';
import { getReginDevice } from '@/api/demo/region';
import { PageWrapper } from '@/components/Page';
import DeptTree from './DeptTree.vue';

import { useModal } from '@/components/Modal';
import AccountModal from './AccountModal.vue';
import AccountTable from './AccountTable.vue'

import { columns, searchFormSchema } from './account.data';
import { useGo } from '@/hooks/web/usePage';
export default defineComponent({
  name: 'AccountManagement',
  components: { BasicTable, PageWrapper, DeptTree, AccountModal, AccountTable, TableAction },
  setup() {
    const go = useGo();
    const data = ref([]);
    const [registerModal, { openModal }] = useModal();
    const [registerMyTable, { openModal: openModal2 }] = useModal(); let searchInfo = reactive<Recordable>({});
    const checkedKeys = ref<Array<string | number>>([]);
    const currentModal = shallowRef<Nullable<ComponentOptions>>(null);
    const dataSource: any = ref([]);
    const modalVisible = ref<Boolean>(false);
    const params = {
      TypeId: 2,
      Sort: 0,
      RegionId: 1,
      PageNum: 1,
      PageSize: 10
    }
    const {
      createConfirm
    } = useMessage();
    const [registerTable, { reload, updateTableDataRecord, getSelectRowKeys }] = useTable({
      title: '区域设备管理',
      rowSelection: {
        type: 'checkbox',
        selectedRowKeys: checkedKeys,
        onChange: onSelectChange,
      },
      rowKey: 'DeviceId',
      columns,
      formConfig: {
        labelWidth: 120,
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
      },
      pagination: true,
      useSearchForm: true,
      showTableSetting: true,
      showIndexColumn: false,
      bordered: true,
      handleSearchInfoFn(info) {
        console.log('handleSearchInfoFn', info);
        return info;
      },
      actionColumn: {
        width: 120,
        title: '操作',
        dataIndex: 'action'
      },
    });
    onMounted(() => {
      getData(params)
    })
    function handleCreate() {
      openModal(true, {
        isUpdate: false,
      });
    }
    function onSelectChange(selectedRowKeys: (string | number)[]) {
      console.log(selectedRowKeys);
      checkedKeys.value = selectedRowKeys;
      console.log(checkedKeys.value, '...dddd...')
    }
    function handleout(){

    }
    function handleBulk(record: Recordable) {
      if (getSelectRowKeys().length > 0) {
        currentModal.value = AccountTable;
        nextTick(() => {
          modalVisible.value = true;
        })
      } else {
        createConfirm({
          iconType: 'info',
          title: '提示',
          content: '至少选择一项',
        });

      }

    }
    // 编辑用户
    function handleEdit(record: Recordable) {
      openModal(true, {
        record,
        isUpdate: true,
      });
    }
    // 删除账号
    function handleDelete(record: Recordable) {

      try {
        delAccount({ UserId: record.UserId });
      } finally {
        reload();
      }

    }
    // 获取table数据
    async function getData(params) {
      //  获取数据
      const { Page } = await getReginDevice(params)
      dataSource.value = Page.List
    }
    function handleSuccess({ isUpdate, values }) {
      if (isUpdate) {
        // 演示不刷新表格直接更新内部数据。
        // 注意：updateTableDataRecord要求表格的rowKey属性为string并且存在于每一行的record的keys中
        const result = updateTableDataRecord(values.id, values);
        console.log(result);
      } else {
        reload();
      }
    }
    function handleEditPwd(record: Recordable) {

      console.log(record, '...record...')
    }
    function handleSelect(RegionId = '') {

      params.RegionId = Number(RegionId)
      searchInfo = {
        ...params
      }
      getData({ ...searchInfo })
      // 通过区域ID显示数据
      reload();
    }
    return {
      registerTable,
      registerMyTable,
      registerModal,
      handleCreate,
      handleEdit,
      handleDelete,
      handleSuccess,
      handleSelect,
      handleEditPwd,
      handleBulk,
      onSelectChange,
      openModal2,
      handleout,
      dataSource,
      params,
      modalVisible,
      currentModal,
      checkedKeys,
      searchInfo,
      getData
    };
  },
});
</script>

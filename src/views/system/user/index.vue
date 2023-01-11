<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <DeptTree class="w-1/4 xl:w-1/5" @select="handleSelect" />
    <BasicTable :dataSource="dataSource" @register="registerTable" class="w-3/4 xl:w-4/5" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button type="primary" @click="handleBulk">批量调动</a-button>
        <a-button type="primary" @click="handleCreate">新增账号</a-button>
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
import { onMounted, defineComponent, reactive, ref, toRaw, shallowRef, ComponentOptions, nextTick, getCurrentInstance, ComponentInternalInstance } from 'vue';
import { BasicTable, useTable, TableAction } from '@/components/Table';
import { useMessage } from '@/hooks/web/useMessage';
import { getAccountList, getDeptList, BulkDept, delAccount } from '@/api/demo/system';
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
    const dataSource: any = ref([]);
    const update = getCurrentInstance() as ComponentInternalInstance | null
    const [registerModal, { openModal }] = useModal();
    const [registerMyTable, { openModal: openModal2 }] = useModal();
    const searchInfo = reactive<Recordable>({});
    const checkedKeys = ref<Array<string | number>>([]);
    const currentModal = shallowRef<Nullable<ComponentOptions>>(null);
    const basicData: any = ref('');
    const modalVisible = ref<Boolean>(false);
    const {
      createConfirm
    } = useMessage();
    const internalInstance = getCurrentInstance()
    const params = {
      page: 1,
      pageSize: 10
    }
    const [registerTable, { reload, updateTableDataRecord, getSelectRowKeys }] = useTable({
        title: '用户列表',
        rowKey: 'DeptName',
        rowSelection: {
          type: 'checkbox',
          selectedRowKeys: checkedKeys,
          onChange: onSelectChange,
        },
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          autoSubmitOnEnter: true,
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        handleSearchInfoFn(info) {
          console.log('handleSearchInfoFn', info);
          return info;
        },
        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          // slots: { customRender: 'action' },
        },
      });
    onMounted(() => {

      getData(params);


    })
    function handleCreate() {
      openModal(true, {
        isUpdate: false,
      });
    }
    // 获取table数据
    function getData(params) {
      dataSource.value = [];
      getAccountList({
        ...params
      }).then(async res => {
        const result = res;
        result.map(async item => {
          const deptList = await getDeptList();

          item.DeptName = deptList.find(item1 => item1.DeptId == item.DeptId)?.DeptName
          dataSource.value.push(item)
        })
      });
    }
    function onSelectChange(selectedRowKeys: (string | number)[]) {
      checkedKeys.value = selectedRowKeys;
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
    function Dat(values) {
      let Detp = toRaw(values).join();
      let user = toRaw(checkedKeys.value)
      try {
        BulkDept({
          UserIds: user,
          DeptId: Number(Detp)
        })
      } finally {
        reload();
      }



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
    function handleSelect(DeptId = '') {
      searchInfo.DeptId = DeptId;
      // 调用接口进行处理
      let param = {
        ...params,
        ...searchInfo
      }
      getData({
        ...param
      })
      reload();
    }
    // 页面跳转
    // function handleView(record: Recordable) {
    //   go('/system/account_detail/' + record.id);
    // }

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
      getData,
      onSelectChange,
      openModal2,
      Dat,
      internalInstance,
      modalVisible,
      currentModal,
      checkedKeys,
      searchInfo,
      basicData,
      dataSource,
      update,
      params
    };
  },
});
</script>

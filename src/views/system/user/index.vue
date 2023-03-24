<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <DeptTree class="w-1/4 xl:w-1/5" @select="handleSelect" />
    <BasicTable :dataSource="dataSource" @register="registerTable" :clickToRowSelect="clickToRowSelect"
      class="w-3/4 xl:w-4/5" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button type="primary" @click="handleBulk">批量调动</a-button>
        <a-button type="primary" @click="handleCreate">新增账号</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'DeptName'">
          {{ record.DeptName }}
        </template>
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
              icon: 'clarity:note-edit-line',
              tooltip: '编辑用户资料',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ri:lock-password-fill',
              tooltip: '修改密码',
              onClick: handleEditPwd.bind(null, record)
            }
          ]" />
        </template>
      </template>
    </BasicTable>
    <component :is="currentModal" v-model:visible="modalVisible" :data="myData" @success="Dat" :isUpdate="true" />
    <AccountModal @register="registerModal" @success="handleSuccess" />
    <AccountTable @register="registerMyTable" @success="Dat" />
    <pwdModal @register="registerpwdModal" @success="pwdSuccess" />
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
import AccountTable from './AccountTable.vue';
import pwdModal from './pwdModal.vue';
import { columns, searchFormSchema } from './account.data';
import { useGo } from '@/hooks/web/usePage';
export default defineComponent({
  name: 'AccountManagement',
  components: { BasicTable, PageWrapper, DeptTree, AccountModal, AccountTable, TableAction, pwdModal },
  setup() {
    const go = useGo();
    const dataSource: any = ref([]);
    const myData: any = ref('');
    const update = getCurrentInstance() as ComponentInternalInstance | null
    const [registerModal, { openModal }] = useModal();
    const [registerpwdModal, { openModal: openModal3 }] = useModal();
    const [registerMyTable, { openModal: openModal2 }] = useModal();
    const searchInfo = reactive<Recordable>({});
    const checkedKeys = ref<Array<string | number>>([]);
    const currentModal = shallowRef<Nullable<ComponentOptions>>(null);
    const basicData: any = ref('');
    const modalVisible = ref<Boolean>(false);
    const clickToRowSelect = ref(false);
    const {
      createConfirm
    } = useMessage();
    function onChange() {
    }
    var pagination = reactive({ PageNum: 1, PageSize: 10 })
    const internalInstance = getCurrentInstance()
    const [registerTable, { reload, updateTableDataRecord, getSelectRowKeys, deleteTableDataRecord }] = useTable({
      title: '用户列表',
      rowKey: 'UserId',
      onChange,
      api: async (p) => {
        const { List, Total } = await getAccountList(p);
        List?.map(async item => {
          const result = await getDeptList();
          item.DeptName = result.List.find(item1 => item1.DeptId == item.DeptId).DeptName
        })
        return {
          Total,
          List
        }
      },
      rowSelection: {
        type: 'checkbox',
        selectedRowKeys: checkedKeys,
        onChange: onSelectChange,
      },
      columns,
      fetchSetting: {
        pageField: 'PageNum',
        // 传给后台的每页显示多少条的字段
        sizeField: 'PageSize',
        // 接口返回表格数据的字段
        listField: 'List',
        // 接口返回表格总数的字段
        totalField: 'Total'
      },
      formConfig: {
        labelWidth: 120,
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
      },
      useSearchForm: true,
      showTableSetting: true,
      bordered: true,
      handleSearchInfoFn(info) {
      },
      actionColumn: {
        width: 120,
        title: '操作',
        dataIndex: 'action'
      },
    });
    function handleCreate() {
      openModal(true, {
        isUpdate: false,
      });
    }
    function pwdSuccess() {
      reload();
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
    async function handleDelete(record: Recordable) {
      await deleteTableDataRecord(record.UserId);
      try {
        await delAccount({ UserId: record.UserId });
      } finally {
        reload();
      }

    }
    onMounted(() => {
      // getData()
    })
    function Dat(values) {
      if (values) {
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
      } else {
        reload();
      }




    }

    async function handleSuccess({ isUpdate, values }) {
      if (isUpdate) {
        // 演示不刷新表格直接更新内部数据。
        // 注意：updateTableDataRecord要求表格的rowKey属性为string并且存在于每一行的record的keys中
        await updateTableDataRecord(values.RoleId, values);
      } else {
        await reload();
      }
    }
    function handleEditPwd(record: Recordable) {
      // 弹出修改用户密码框
      currentModal.value = pwdModal;
      myData.value = record;
      nextTick(() => {
        modalVisible.value = true;
      })
    }
    function handleSelect(DeptId = '') {
      searchInfo.DeptId = DeptId;
      reload();
    }
    return {
      registerTable,
      registerMyTable,
      registerModal,
      registerpwdModal,
      handleCreate,
      handleEdit,
      handleDelete,
      handleSuccess,
      handleSelect,
      handleEditPwd,
      handleBulk,
      onSelectChange,
      onChange,
      openModal2,
      openModal3,
      Dat,
      pwdSuccess,
      clickToRowSelect,
      pagination,
      internalInstance,
      modalVisible,
      currentModal,
      checkedKeys,
      searchInfo,
      basicData,
      dataSource,
      myData,
      update
    };
  },
});
</script>

<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <DeptTree class="w-1/4 xl:w-1/5" @select="handleSelect" />
    <BasicTable @register="registerTable" :clickToRowSelect="clickToRowSelect" class="w-3/4 xl:w-4/5"
      :searchInfo="searchInfo">
      <template #toolbar>
        <a-button v-if="hasPermission(['BatchMob_User'])"  type="primary" @click="handleBulk">批量调动</a-button>
        <a-button v-if="hasPermission(['AddUser_User'])" type="primary" @click="handleCreate">添加用户</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'DeptName'">
          {{ record.DeptName }}
        </template>
        <template v-if="column.key === 'action' && record.UserId !== 1
          ">
          <TableAction :actions="[
              {
                ifShow: hasPermission(['handleDelete_User']),
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
                ifShow: hasPermission(['handleEdit_User']),
                icon: 'clarity:note-edit-line',
                tooltip: '编辑用户资料',
                onClick: handleEdit.bind(null, record),
              },
              {
                ifShow: hasPermission(['handleEditPwd_User']),
                icon: 'ri:lock-password-fill',
                tooltip: '修改密码',
                onClick: handleEditPwd.bind(null, record)
              }
            ]
            " />
        </template>
      </template>
    </BasicTable>
    <!-- 编辑用户资料 -->
    <AccountModal @register="registerModal" @success="handleSuccess" />
    <AccountTable @register="registerMyTable" @success="handleSuccess" />
    <pwdModal @register="registerpwdModal" @success="pwdSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, toRaw, shallowRef, ComponentOptions, nextTick, getCurrentInstance, ComponentInternalInstance, watchEffect } from 'vue';
import { BasicTable, useTable, TableAction } from '@/components/Table';
import { useMessage } from '@/hooks/web/useMessage';
import { getAccountList, delAccount } from '@/api/demo/system';
import { PageWrapper } from '@/components/Page';
import DeptTree from './DeptTree.vue';
import { usePermission } from '@/hooks/web/useButtonPermission';
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
    const { hasPermission } = usePermission();
    const myData: any = ref('');
    const lastSelectedKey = ref();
    const update = getCurrentInstance() as ComponentInternalInstance | null
    const [registerModal, { openModal }] = useModal();
    const [registerpwdModal, { openModal: openModal3 }] = useModal();
    const [registerMyTable, { openModal: openModal2 }] = useModal();

    const searchInfo = reactive<Recordable>({});
    const checkedKeys = ref<Array<string | number>>([]);
    const currentModal = shallowRef<Nullable<ComponentOptions>>(null);
    const modalVisible = ref<Boolean>(false);
    const clickToRowSelect = ref(false);
    const {
      createConfirm
    } = useMessage();
    function onChange() {
    }
    var pagination = reactive({ PageNum: 1, PageSize: 10 })
    const internalInstance = getCurrentInstance()
    const [registerTable, { reload, getSelectRowKeys, deleteTableDataRecord, clearSelectedRowKeys }] = useTable({
      title: '用户列表',
      rowKey: 'UserId',
      onChange,
      api: async (p) => {
        const { List, Total } = await getAccountList(p);
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
        return info
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
        DeptId: searchInfo.DeptId
      })

    }
    function pwdSuccess() {
      reload();
    }
    function onSelectChange(selectedRowKeys: (string | number)[]) {
      checkedKeys.value = selectedRowKeys;
    }
    function handleBulk(record: Recordable) {
      if (getSelectRowKeys().length > 0) {
        openModal2(true, {
          user: toRaw(checkedKeys.value),
          isUpdate: true
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
    // 批量调动
    async function handleSuccess() {
      await reload();
      // 清空table 选中状态
      await clearSelectedRowKeys();
    }
    function handleEditPwd(record: Recordable) {
      openModal3(true, {
        record,
        isUpdate: true
      })
      // 弹出修改用户密码框
      // currentModal.value = pwdModal;
      // myData.value = record;
      // nextTick(() => {
      //   modalVisible.value = true;
      // })
    }
    async function handleSelect(DeptId) {
      console.log(DeptId, '...DeptId...')
      searchInfo.DeptId = DeptId;
      await reload();
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
      pwdSuccess,
      hasPermission,
      lastSelectedKey,
      clickToRowSelect,
      pagination,
      internalInstance,
      modalVisible,
      currentModal,
      checkedKeys,
      searchInfo,
      myData,
      update
    };
  },
});
</script>

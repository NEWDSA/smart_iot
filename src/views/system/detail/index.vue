<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <DeptTree :RoleId="RoleId" class="w-1/4 xl:w-1/5" @select="handleSelect" />
    <BasicTable :dataSource="dataSource" @register="registerTable" class="w-3/4 xl:w-4/5" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button v-if="hasPermission(['BatchAuthCancel_RoleDetail'])" type="primary" @click="handleBulk">批量取消授权</a-button>
        <a-button v-if="hasPermission(['AddUserMenu_RoleDetail'])" type="primary" @click="handleCreate">添加用户</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="[
            {
              ifShow:hasPermission(['CancelAuth_RoleDetail']),
              icon: 'icon-park-outline:delete-five',
              tooltip: '取消授权',
              onClick: handleEdit.bind(null, record)
            }
          ]" />
        </template>
      </template>
    </BasicTable>
    <AccountModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
import { onMounted, defineComponent, reactive, ref, toRaw, shallowRef, ComponentOptions, getCurrentInstance, ComponentInternalInstance } from 'vue';
import { BasicTable, useTable, TableAction } from '@/components/Table';
import { delAuthUser, BulkDept, delAccount, RoleUserList, delAuthUserList } from '@/api/demo/system';
import { PageWrapper } from '@/components/Page';
import DeptTree from './DeptTree.vue';
import { useMessage } from '@/hooks/web/useMessage';
import { useModal } from '@/components/Modal';
import AccountModal from './AccountModal.vue';
import { columns, searchFormSchema } from './account.data';
import { useRoute } from 'vue-router';
import { useGo } from '@/hooks/web/usePage';
import {usePermission} from '@/hooks/web/useButtonPermission';
export default defineComponent({
  name: 'AccountManagement',
  components: { BasicTable, PageWrapper, DeptTree, AccountModal, TableAction },
  setup() {
    const { hasPermission } = usePermission();
    const route = useRoute();
    const go = useGo();
    const treeRef = ref('');
    const dataSource: any = ref([]);
    const RoleId = ref(Number(route.params?.RoleId))
    const {
      createConfirm
    } = useMessage();
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
    function onChange() {
      pagination.PageNum = arguments[0].current;
      roleAccount()
    }
    var pagination = reactive({ PageNum: 1, PageSize: 10 })
    const internalInstance = getCurrentInstance()
    const [registerTable, { reload, getSelectRowKeys, setPagination, deleteTableDataRecord,clearSelectedRowKeys }] = useTable({
      title: '用户列表',
      rowKey: 'UserId',
      onChange,
      rowSelection: {
        type: 'checkbox',
        selectedRowKeys: checkedKeys,
        onChange: onSelectChange,
      },
      columns,
      showIndexColumn: false,
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
        // 接入接口进行数据查询
        Object.assign(pagination, info)
        // getData();
        roleAccount()
        return info;
      },
      actionColumn: {
        width: 120,
        title: '操作',
        dataIndex: 'action'
      },
    });
    function handleCreate() {
      openModal(true, {
        RoleId: RoleId.value,
        isUpdate: false
      });
    }
    async function roleAccount() {
      dataSource.value=[];
      searchInfo.RoleId = RoleId.value;
      Object.assign(pagination, searchInfo);
      const { List, Total } = await RoleUserList(pagination);
      setPagination({
        total: Total
      })
      dataSource.value = List;
    }
    function onSelectChange(selectedRowKeys: (string | number)[]) {
      checkedKeys.value = selectedRowKeys;
    }
    async function handleBulk(record: Recordable) {
      console.log(getSelectRowKeys().length, 'your en')
      if (getSelectRowKeys().length <= 0) {
        createConfirm({
          iconType: 'info',
          title: '提示',
          content: '至少选择一项',
        });
        return
      }
      try {
        await delAuthUserList({
          RoleId: RoleId.value,
          UserIds: toRaw(checkedKeys.value)
        })
      } finally {
        roleAccount();
      }


    }
    // 取消授权
    async function handleEdit(record: Recordable) {
      try {
        await deleteTableDataRecord(record.UserId);
        // await bulkDeviceOut(param)
       await delAuthUser({ UserId: record.UserId, RoleId: RoleId.value })

      } finally {
        // reload();
        roleAccount();

      }

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
      roleAccount()
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

    async function handleSuccess() {
       await roleAccount()
       clearSelectedRowKeys();
    //  await reload();
    }
    function handleSelect(params = '') {
      console.log(params, '压缩')
      searchInfo.RoleId = Number(params);
      RoleId.value = Number(params);
      Object.assign(pagination, searchInfo);
      roleAccount();
      // 
      // getData()
      // reload();
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
      handleBulk,
      onSelectChange,
      onChange,
      openModal2,
      openModal3,
      Dat,
      roleAccount,
      hasPermission,
      RoleId,
      treeRef,
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

<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <DeptTree ref="treeRef" class="w-1/4 xl:w-1/5" @select="handleSelect" />
    <BasicTable class="w-3/4 xl:w-4/5" :clickToRowSelect="clickToRowSelect" @register="registerTable"
      :searchInfo="searchInfo">
      <template #toolbar>
        <a-button v-if="hasPermission(['BatchAuth_RegionDevice'])" type="primary" @click="handleBulk">批量设置权限</a-button>
        <a-button v-if="hasPermission(['BatchOut_RegionDevice'])" type="primary" @click="handleout">批量移出</a-button>
        <a-button v-if="hasPermission(['AddDevice_RegionDevice'])" type="primary" @click="handleCreate">添加设备</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="[
              {
                label: '移出',
                ifShow: hasPermission(['moveOut_RegionDevice']),
                popConfirm: {
                  title: '是否确认移出',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
              {
                label: '权限设置',
                ifShow: hasPermission(['AuthSetting_RegionDevice']),
                onClick: handleEditPwd.bind(null, record)
              }
            ]" />
        </template>
      </template>
    </BasicTable>
    <AccountModal @register="registerModal" @success="handleSuccess" />
    <AccountTable @register="registerMyTable" @success="bulkPermission" />
  </PageWrapper>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, toRaw, shallowRef, ComponentOptions } from 'vue';
import { BasicTable, useTable, TableAction } from '@/components/Table';
import { useMessage } from '@/hooks/web/useMessage';
import { getReginDevice, getDeviceType, bulkDeviceOut } from '@/api/demo/region';
import { PageWrapper } from '@/components/Page';
import DeptTree from './DeptTree.vue';

import { useModal } from '@/components/Modal';
import AccountTable from './AccountTable.vue';
import AccountModal from './AccountModal.vue';
import { columns, searchFormSchema } from './account.data';
import { useGo } from '@/hooks/web/usePage';
import { usePermission } from '@/hooks/web/useButtonPermission';
export default defineComponent({
  name: 'AccountManagement',
  components: { BasicTable, PageWrapper, DeptTree, AccountModal, AccountTable, TableAction },
  setup() {
    const { hasPermission } = usePermission();
    const go = useGo();
    const searchInfo = reactive<Recordable>({});
    const treeRef = ref(null);
    const [registerModal, { openModal }] = useModal();
    const [registerMyTable, { openModal: openModal2 }] = useModal();
    const checkedKeys = ref<Array<string | number>>([]);
    const clickToRowSelect = ref(false);
    const currentModal = shallowRef<Nullable<ComponentOptions>>(null);
    const areaId = ref();
    const PermisionList = reactive({
      DeviceId: [],
      DepartmentId: []
    })
    const dataSource: any = ref([]);
    const modalVisible = ref<Boolean>(false);
    var pagination = reactive({ TypeId: 2, Sort: 0, RegionId: 1, PageNum: 1, PageSize: 10 })
    const {
      createConfirm,
      createMessage
    } = useMessage();
    function onChange() {
    }
    const [registerTable, { reload, getSelectRowKeys, setSelectedRowKeys, deleteTableDataRecord }] = useTable({
      title: '区域设备管理',
      onChange,
      rowSelection: {
        type: 'checkbox',
        selectedRowKeys: checkedKeys,
        onChange: onSelectChange,
        preserveSelectedRowKeys: true
      },
      rowKey: 'DeviceId',
      columns,
      api: async (p) => {
        const { Detail, Total } = await getReginDevice(p);
        return {
          Detail,
          Total
        }
      },
      immediate: false,
      fetchSetting: {
        pageField: 'PageNum',
        // 传给后台的每页显示多少条的字段
        sizeField: 'PageSize',
        // 接口返回表格数据的字段
        listField: 'Detail',
        // 接口返回表格总数的字段
        totalField: 'Total'
      },

      formConfig: {

        layout: 'horizontal',
        labelWidth: 120,
        actionColOptions:{
          span:3
        },
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
      },
      useSearchForm: true,
      showTableSetting: true,
      showIndexColumn: false,
      bordered: true,
      handleSearchInfoFn(info) {
        return info;
      },
      actionColumn: {
        width: 120,
        title: '操作',
        dataIndex: 'action'
      },
    });
    async function handleCreate() {
      if (searchInfo.RegionId) {
        let params = searchInfo.RegionId
        openModal(true, {
          params,
          isUpdate: false
        });
      } else {
        createConfirm({
          iconType: 'info',
          title: '提示',
          content: '至少选择一项区域',
        });
      }

    }
    function onSelectChange(selectedRowKeys: []) {
      checkedKeys.value = selectedRowKeys;
      PermisionList.DeviceId = Object.values(selectedRowKeys);
    }
    async function handleout() {
      // 请选择需要移出的设备、
      if (toRaw(checkedKeys.value).length > 0) {
        let param = {
          DeviceId: toRaw(checkedKeys.value),
          RegionId: 0
        }
        try {
          await bulkDeviceOut(param)
        } finally {
          reload()
        }


      } else {
        createConfirm({
          iconType: 'info',
          title: '提示',
          content: '请至少选择一项进行移出',
        });
      }
    }
    async function bulkPermission() {
      await reload()
      // you don't flush the data

    }
    function handleBulk(record: Recordable) {
      if (getSelectRowKeys().length > 0) {
        openModal2(true, {
          DeviceId: checkedKeys.value,
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
    function handleEdit(e, record: Recordable) {
      e.stopPropagation();
      openModal(true, {
        record,
        isUpdate: true,
      });
    }
    async function handleDelete(record: Recordable) {
      try {
        let param = {
          DeviceId: [record.DeviceId],
          RegionId: 0
        }
        await deleteTableDataRecord(record.DeviceId);
        await bulkDeviceOut(param)


      } finally {
        reload();
      }

    }
    async function handleSuccess() {
      await reload();
    }
    // 权限设置
    function handleEditPwd(record: Recordable) {
      setSelectedRowKeys([record.DeviceId]);
      if (getSelectRowKeys().length > 0 && getSelectRowKeys().length <= 1) {
        openModal2(true, {
          DeviceId: checkedKeys.value,
          isUpdate: true
        })
      } else {
        createMessage.info({
          content: '请检查是否勾选内容',
        });

      }
    }
    function handleSelect(RegionId = '') {

      // 请选择区域
      searchInfo.RegionId = Number(RegionId);
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
      bulkPermission,
      hasPermission,
      treeRef,
      clickToRowSelect,
      areaId,
      dataSource,
      modalVisible,
      currentModal,
      checkedKeys,
      searchInfo,
      pagination,
      PermisionList
    };
  },
});
</script>

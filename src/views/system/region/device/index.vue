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
              label:'移出',
              popConfirm: {
                title: '是否确认移出',
                placement: 'left',
                confirm: handleDelete.bind(null, record),
              },
            },
            {
              label:'权限设置',
              onClick: handleEditPwd.bind(null, record)
            },
            {
              label:'更多',
              onClick: handleEdit.bind(null, record),
            }
          ]" />
        </template>
      </template>
    </BasicTable>
    <component :is="currentModal" v-model:visible="modalVisible" @success="bulkPermission" :isUpdate="true" />
    <AccountModal @register="registerModal" @success="handleSuccess" />
    <AccountTable @register="registerMyTable" @success="bulkPermission" />
  </PageWrapper>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, toRaw, shallowRef, ComponentOptions, nextTick, onMounted } from 'vue';
import { BasicTable, useTable, TableAction } from '@/components/Table';
import { useMessage } from '@/hooks/web/useMessage';
import { getReginDevice, getDeviceType, devicePermission, bulkDeviceOut } from '@/api/demo/region';
import { PageWrapper } from '@/components/Page';
import DeptTree from './DeptTree.vue';

import { useModal } from '@/components/Modal';
import AccountTable from './AccountTable.vue';
import AccountModal from './AccountModal.vue';
import { columns, searchFormSchema } from './account.data';
import { useGo } from '@/hooks/web/usePage';
export default defineComponent({
  name: 'AccountManagement',
  components: { BasicTable, PageWrapper, DeptTree, AccountModal, AccountTable, TableAction },
  setup() {
    const go = useGo();
    const searchInfo = reactive<Recordable>({});
    const [registerModal, { openModal }] = useModal();
    const [registerMyTable, { openModal: openModal2 }] = useModal();
    const checkedKeys = ref<Array<string | number>>([]);
    const currentModal = shallowRef<Nullable<ComponentOptions>>(null);
    const PermisionList = reactive({
      DeviceId: [],
      DepartmentId: []
    })
    const dataSource: any = ref([]);
    const modalVisible = ref<Boolean>(false);
    var pagination = reactive({ TypeId: 2, Sort: 0, RegionId: 1, PageNum: 1, PageSize: 10 })
    const {
      createConfirm
    } = useMessage();
    function onChange() {
      pagination.PageNum = arguments[0].current;
      getData()


    }
    const [registerTable, { reload, updateTableDataRecord, getSelectRowKeys, setPagination }] = useTable({
      title: '区域设备管理',
      onChange,
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
        Object.assign(pagination, info);
        getData()
      },
      actionColumn: {
        width: 120,
        title: '操作',
        dataIndex: 'action'
      },
    });
    onMounted(() => {
      getData()
    })
    function handleCreate() {
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
    function handleout() {
      // 请选择需要移出的设备
      if (toRaw(checkedKeys.value)) {
        let param = {
          DeviceId: toRaw(checkedKeys.value),
          RegionId: 0
        }
        try {
          bulkDeviceOut(param)
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
    // 
    function bulkPermission(params) {
      PermisionList.DepartmentId = Object.values(params);
      // 调用接口进行处理
      devicePermission({ DeviceId: PermisionList.DeviceId, DepartmentId: PermisionList.DepartmentId })
      reload()

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
    async function getData() {
      //  获取区域设备
      dataSource.value = [];
      const { Page } = await getReginDevice(pagination)
      const result = Page.List;
      const TypeList: any = [];
      setPagination({
        total: Page.Total
      })
      result.map(async (item) => {
        const DeviceList = await getDeviceType({
          Id: item.TypeId
        })

        TypeList.push(...DeviceList)
        item.typeName = TypeList.find(item1 => item1.TypeId == item.TypeId)?.TypeName;
        dataSource.value.push(item)
      })


      // dataSource.value.push(result)
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

      console.log(RegionId)
      // 请选择区域

      searchInfo.RegionId = Number(RegionId);
      // 和并数据处理
      Object.assign(pagination, searchInfo);
      getData()
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
      bulkPermission,
      getData,
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

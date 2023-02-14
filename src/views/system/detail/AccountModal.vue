<template>
  <BasicModal @visible-change="ModelStatus" width="70%" v-bind="$attrs" @register="registerModal" :title="getTitle"
    @ok="handleSubmit">
    <BasicTable :dataSource="dataSource" @register="registerTable" class="w-3/4 xl:w-4/5" :searchInfo="searchInfo">
    </BasicTable>
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref, computed, unref, reactive, toRaw } from 'vue';
import { BasicModal, useModalInner } from '@/components/Modal';
import { BasicForm, useForm } from '@/components/Form/index';
import { RoleUnUserList, buckPermissionUser } from '@/api/demo/system';
import { BasicTable, useTable, TableAction } from '@/components/Table';
import { columns, searchFormSchema } from './accountModel.data';
export default defineComponent({
  name: 'AccountModal',
  props: ['Device'],
  components: { BasicModal, BasicForm, BasicTable, TableAction },
  emits: ['success', 'register'],
  setup(_, { emit }) {
    const isUpdate = ref(true);
    const searchInfo = reactive<Recordable>({});
    const TreeTableData: any = reactive([]);
    const dataSource: any = ref([]);
    const checkedKeys = ref<Array<string | number>>([]);
    var pagination = reactive({ PageNum: 1, PageSize: 10, Sort: 2 })
    const RoleId: any = ref();
    function onChange() {
    }
    const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
      console.log(data, '大于')
      RoleId.value = data.RoleId;
      // paramList.value = data.params
      setModalProps({ confirmLoading: false });
      isUpdate.value = !!data?.isUpdate;

    });

    const [registerTable, { reload, updateTableDataRecord, getSelectRowKeys, setPagination, getForm }] = useTable({
      title: '',
      onChange,
      rowSelection: {
        type: 'checkbox',
        selectedRowKeys: checkedKeys,
        onChange: onSelectChange,
      },
      rowKey: 'UserId',
      formConfig: {
        labelWidth: 100,
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
      },
      columns,
      pagination: true,
      useSearchForm: true,
      showTableSetting: true,
      showIndexColumn: false,
      bordered: true,
      handleSearchInfoFn(info) {
        Object.assign(pagination, info);
        getData()
      }
    });
    const getTitle = computed(() => (!unref(isUpdate) ? '添加角色用户' : '编辑账号'));
    function onSelectChange(selectedRowKeys: []) {

      checkedKeys.value = selectedRowKeys;
      console.log(checkedKeys.value, '选中了多项!!!!')
    }
    function ModelStatus(isOpen) {
      isOpen ? getData() : ''
    }
    // 获取table数据
    async function getData() {
      dataSource.value = [];
      const { List, Total } = await RoleUnUserList(pagination)
      dataSource.value = List;

      setPagination({
        total: Total
      })
    }

    async function handleSubmit() {
      try {
        const params = {
          RoleId: RoleId.value,
          UserIds: toRaw(checkedKeys.value)
        }
        setModalProps({ confirmLoading: true });
        !unref(isUpdate) ? await buckPermissionUser(params) : ''
        closeModal();
        await reload();
        await emit('success');
      } finally {

        setModalProps({ confirmLoading: false });
      }
    }

    return { registerModal, registerTable, handleSubmit, onSelectChange, getData, ModelStatus, RoleId, checkedKeys, getTitle, searchInfo, dataSource };
  },
});
</script>

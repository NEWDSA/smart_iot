<template>
  <BasicModal width="70%" :height="700" v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicTable @register="registerTable" :max-height="400" :searchInfo="searchInfo">
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
    const checkedKeys = ref<Array<string | number>>([]);
    const RoleId: any = ref();
    function onChange() {
    }
    const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
      RoleId.value = data.RoleId;
      setModalProps({ confirmLoading: false });
      isUpdate.value = !!data?.isUpdate;
      checkedKeys.value = [];
      // 清空Table分页信息
      reload()
    });

    const [registerTable, { reload }] = useTable({
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
      api: RoleUnUserList,
      beforeFetch: (p) => {
        p.RoleId = RoleId.value
        return p
      },
      fetchSetting: {
        // 传给后台的当前页字段
        pageField: 'PageNum',
        // 传给后台的每页显示多少条的字段
        sizeField: 'PageSize',
        // 接口返回表格数据的字段
        listField: 'List',
        // 接口返回表格总数的字段
        totalField: 'Total'
      },
      columns,
      pagination: true,
      useSearchForm: true,
      showTableSetting: true,
      showIndexColumn: false,
      handleSearchInfoFn(info) {
      }
    });
    const getTitle = computed(() => (!unref(isUpdate) ? '添加角色用户' : '编辑账号'));
    function onSelectChange(selectedRowKeys: []) {

      checkedKeys.value = selectedRowKeys;
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

    return { registerModal, registerTable, handleSubmit, onSelectChange, RoleId, checkedKeys, getTitle, searchInfo };
  },
});
</script>

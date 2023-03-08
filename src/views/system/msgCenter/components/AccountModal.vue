<template>
  <BasicModal width="70%" v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicTable :maxHeight="300" @register="registerTable" :searchInfo="searchInfo">
    </BasicTable>
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref, computed, unref, reactive, toRaw } from 'vue';
import { BasicModal, useModalInner } from '@/components/Modal';
import { BasicForm, useForm } from '@/components/Form/index';
import { getAccountList, NoticeTransfer } from '@/api/demo/system';
import { BasicTable, useTable, TableAction } from '@/components/Table';
import { useMessage } from '@/hooks/web/useMessage';
import { columns, searchFormSchema } from './accountModel.data';
export default defineComponent({
  name: 'AccountModal',
  props: ['Device'],
  components: { BasicModal, BasicForm, BasicTable, TableAction },
  emits: ['success', 'register'],
  setup(_, { emit }) {
    const {
      createMessage,
    } = useMessage();
    const { info } = createMessage;
    const isUpdate = ref(true);
    const searchInfo = reactive<Recordable>({});
    const checkedKeys = ref<Array<string | number>>([]);
    const NoticeId: any = ref();

    function onChange() {
    }
    const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
      NoticeId.value = data.NoticeId
      setModalProps({ confirmLoading: false });
      isUpdate.value = !!data?.isUpdate;

    });

    const [registerTable, { reload, updateTableDataRecord, getSelectRowKeys, setPagination, getForm }] = useTable({
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
        actionColOptions: {
          span: 4
        }
      },
      api: getAccountList,
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
      bordered: true,
      handleSearchInfoFn(info) {
      }
    });
    const getTitle = computed(() => (!unref(isUpdate) ? '选择用户' : '编辑账号'));
    function onSelectChange(selectedRowKeys: []) {
      checkedKeys.value = selectedRowKeys;
    }
    // 获取table数据
    async function handleSubmit() {
      if (toRaw(checkedKeys.value).length > 0) {
        try {
          setModalProps({ confirmLoading: true });
          NoticeTransfer({
            NoticeId:NoticeId.value,
            UserId:toRaw(checkedKeys.value)
          })
          closeModal();
          emit('success');
        } finally {
          setModalProps({ confirmLoading: false });
        }

      } else {
        info('请至少选择一项');
      }

      // console.log(checkedKeys.value, '?...checkedKeys...?');

      // console.log('你好开心哦!!!');
      // try {
      //   const params = {
      //     DeviceId: toRaw(checkedKeys.value),
      //     RegionId: paramList.value

      //   }
      //   setModalProps({ confirmLoading: true });
      //   // !unref(isUpdate) ? await editDeviceArea(params) : ''
      //   closeModal();
      //   emit('success');
      // } finally {
      //   setModalProps({ confirmLoading: false });
      // }
    }

    return { registerModal, registerTable, handleSubmit, onSelectChange, checkedKeys, getTitle, searchInfo, info };
  },
});
</script>

<template>
  <BasicModal @visible-change="ModelStatus" width="70%" v-bind="$attrs" @register="registerModal" :title="getTitle"
    @ok="handleSubmit">
    <BasicTable ref="tableRef" @register="registerTable" :searchInfo="searchInfo">
    </BasicTable>
    <!-- footer -->
    <template #insertFooter>
      <!-- 插入分页 -->
      <Pagination class="mr-1" hideOnSinglePage v-model:current="pagenation.current"
        v-model:pageSize="pagenation.PageSize" show-less-items :total="pagenation.total" @change="changePage">
      </Pagination>
    </template>
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref, computed, unref, reactive, toRaw } from 'vue';
import { BasicModal, useModalInner } from '@/components/Modal';
import { BasicForm, useForm } from '@/components/Form/index';
import { editDeviceArea } from '@/api/demo/region';
import { deviceTree, getReginDevice } from '@/api/demo/region'
import { BasicTable, useTable, TableActionType, TableAction } from '@/components/Table';
import { Pagination } from 'ant-design-vue';
import { columns, searchFormSchema } from './accountModel.data';
export default defineComponent({
  name: 'AccountModal',
  props: ['Device'],
  components: { BasicModal, BasicForm, BasicTable, TableAction, Pagination },
  emits: ['success', 'register'],
  setup(_, { emit }) {
    const isUpdate = ref(true);
    const height = 300;
    const searchInfo = reactive<Recordable>({});
    const TreeTableData: any = reactive([]);
    const dataSource: any = ref([]);
    const checkedKeys = ref<Array<string | number>>([]);
    const paramList: any = ref();
    const params=ref({});
    const PageNum = ref(1);
    const PageSize = ref(10);
    const pagenation = reactive({
      current: 1,
      total: 0,
      PageSize: 10,
      Sort: 2
    })
    const tableRef = ref<Nullable<TableActionType>>(null);
    function getTableAction() {
      const tableAction = unref(tableRef);
      if (!tableAction) {
        throw new Error('tableAction is null');
      }
      return tableAction;
    }
    function onChange(e) {
    }
    async function changePage(index) {
      pagenation.current = index;
      let myparams = {
        PageNum: pagenation.current,
        PageSize: pagenation.PageSize,
        Sort: pagenation.Sort
      }
      Object.assign(myparams,getForm().getFieldsValue());
      const { Detail, Total } = await getReginDevice(myparams);
      getTableAction().setTableData(Detail);
      pagenation.total = Total;
    }
    const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
      paramList.value = data.params
      checkedKeys.value = [];
      setModalProps({ confirmLoading: false });
      isUpdate.value = !!data?.isUpdate;
      // 获取设备分类
      await deviceTree().then((res) => {
        for (let i = 0; i < res.length; i++) {
          TreeTableData.push(res[i].SelfData);
          if (res[i].SonData) {
            TreeTableData[i].children = []
            for (let y = 0; y < res[i].SonData.length; y++) {

              TreeTableData[i].children.push(res[i].SonData[y].SelfData)
              if (res[i].SonData[y].SonData) {
                TreeTableData[i].children[y].children = []
                for (let x = 0; x < res[i].SonData[y].SonData.length; x++) {
                  TreeTableData[i].children[y].children.push(res[i].SonData[y].SonData[x].SelfData)
                }
              }
            }
          }
        }
        return res;
      });
      getForm().updateSchema({
        field: 'TypeId',
        componentProps: { treeData: TreeTableData },
      })

    });

    const [registerTable, { getForm,reload }] = useTable({
      title: '',
      onChange,
      rowSelection: {
        type: 'checkbox',
        selectedRowKeys: checkedKeys,
        onChange: onSelectChange,
      },
      rowKey: 'DeviceId',
      api: async (p) => {
        const { Total
          , Detail
        } = await getReginDevice(p);
        pagenation.total = Total;
        return new Promise((resolve) => {
          resolve([...Detail])
        })
      },
      beforeFetch: (p) => {
        p.PageNum = PageNum.value;
        p.PageSize = 10;
      },
      formConfig: {
        labelWidth: 100,
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
        actionColOptions: {
          span: 3
        }
      },
      columns,
      pagination: false,
      useSearchForm: true,
      showTableSetting: false,
      showIndexColumn: false,
      bordered: true,
      async handleSearchInfoFn(info) {
        pagenation.current = 1;
        pagenation.PageSize = 10;
        pagenation.Sort = info.Sort;
        let params={
          PageNum: pagenation.current,
          PageSize:pagenation.PageSize
        }
        Object.assign(params,info);
        return info;
      }
    });
    const getTitle = computed(() => (!unref(isUpdate) ? '选择添加设备' : '编辑账号'));
    function onSelectChange(selectedRowKeys: []) {
      checkedKeys.value = selectedRowKeys;
    }
    function ModelStatus(isOpen) {
      console.log(isOpen);
      reload()
    }
    async function handleSubmit() {
      try {
        const params = {
          DeviceId: toRaw(checkedKeys.value),
          RegionId: paramList.value

        }
        setModalProps({ confirmLoading: true });
        !unref(isUpdate) ? await editDeviceArea(params) : ''
        closeModal();
        emit('success');
      } finally {
        setModalProps({ confirmLoading: false });
      }
    }

    return { registerModal, registerTable, handleSubmit, onSelectChange, ModelStatus, changePage, getTableAction,params, tableRef, pagenation, PageNum, PageSize, height, paramList, checkedKeys, getTitle, searchInfo, dataSource };
  },
});
</script>
<style lang="less" scoped>
.ant-pagination {
  margin-right: 2rem;
}
</style>

<template>
  <BasicModal @visible-change="ModelStatus" width="70%" v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicTable :dataSource="dataSource" @register="registerTable" class="w-3/4 xl:w-4/5" :searchInfo="searchInfo">
    </BasicTable>
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref, computed, unref, reactive, toRaw } from 'vue';
import { BasicModal, useModalInner } from '@/components/Modal';
import { BasicForm, useForm } from '@/components/Form/index';
import { editDeviceArea } from '@/api/demo/region';
import { deviceTree, getReginDevice, getDeviceType } from '@/api/demo/region'
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
    const paramList: any = ref();
    function onChange() {
    }
    const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
      paramList.value = data.params
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

    const [registerTable, { reload, updateTableDataRecord, getSelectRowKeys, setPagination, getForm }] = useTable({
      title: '区域设备管理',
      onChange,
      rowSelection: {
        type: 'checkbox',
        selectedRowKeys: checkedKeys,
        onChange: onSelectChange,
      },
      rowKey: 'DeviceId',
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
    const getTitle = computed(() => (!unref(isUpdate) ? '选择添加设备' : '编辑账号'));
    function onSelectChange(selectedRowKeys: []) {
      checkedKeys.value = selectedRowKeys;
    }
    function ModelStatus(isOpen){
       isOpen?getData():''
    }
    // onMounted(() => {
    // })
    // 获取table数据
    async function getData() {
      //  获取区域设备
      dataSource.value = [];
      const { Page } = await getReginDevice(pagination)
      const result = Page.List;
      const TypeList: any = [];
      result.map(async (item) => {
        const DeviceList = await getDeviceType({
          Id: item.TypeId
        })
        TypeList.push(...DeviceList)
        item.typeName = TypeList.find(item1 => item1.TypeId == item.TypeId)?.TypeName;
        dataSource.value.push(item)
      })
      setPagination({
        total: Page.Total
      })
    }

    async function handleSubmit() {
      try {
        // const values = await validate();
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

    return { registerModal, registerTable, handleSubmit, onSelectChange, getData,ModelStatus, paramList, checkedKeys, getTitle, searchInfo, dataSource };
  },
});
</script>

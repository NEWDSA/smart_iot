<template>
  <BasicModal @visible-change="ModelStatus" width="70%" v-bind="$attrs" @register="registerModal" :title="getTitle"
    @ok="handleSubmit">
    <template #default>
      <BasicTable :maxHeight="300" :dataSource="dataSource" @register="registerTable" :searchInfo="searchInfo">
      </BasicTable>
    </template>
    <!-- <template #footer>
       <div>3333</div>
    </template> -->
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref, computed, unref, reactive, toRaw } from 'vue';
import { BasicModal, useModalInner } from '@/components/Modal';
import { BasicForm, useForm } from '@/components/Form/index';
import { editDeviceArea } from '@/api/demo/region';
import { deviceTree, getReginDevice, getDeviceType, getReginList } from '@/api/demo/region'
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
    const checkedKeys = ref<string | number>('');
    const rowselection = ref<any>('');
    var pagination = reactive({ PageNum: 1, PageSize: 10, Sort: 0 })
    const paramList: any = ref();
    const ParamItem: any = ref({});
    function onChange() {
    }
    const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
      console.log(data.item, '?...AccountTable...?')
      paramList.value = data.params
      setModalProps({ confirmLoading: false });
      isUpdate.value = !!data?.isUpdate;
      if (unref(isUpdate)) {
        ParamItem.value = data
        console.log(data.itemindex,'....index...?...index...2222')
        // rowId.value = data.record.id;
        // setFieldsValue({
        //   ...data.record,
        // });
      }
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
      // 接入区域列表
      const { Detail } = await getReginList();
      getForm().updateSchema({
        field: 'TypeId',
        componentProps: { treeData: TreeTableData },
      })
      getForm().updateSchema({
        field: 'RegionId',
        componentProps: { treeData: Detail },
      })

    });

    const [registerTable, { getSelectRows, reload, setPagination, getForm }] = useTable({
      onChange,
      rowSelection: {
        type: 'radio',
        onChange: onSelectChange,
      },
      rowKey: 'DeviceId',
      formConfig: {
        labelWidth: 100,
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
        actionColOptions: {
          span: 4
        },
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
    const getTitle = computed(() => (!unref(isUpdate) ? '' : '选择设备'));
    function onSelectChange(selectedRowKeys) {
      console.log(getSelectRows(), '...获取选中项...?')
      rowselection.value = getSelectRows();
      checkedKeys.value = toRaw(selectedRowKeys);
      console.log(toRaw(checkedKeys.value), '?...selectedRowKeys...?')
    }
    function ModelStatus(isOpen) {
      isOpen ? getData() : ''
    }

    // 获取table数据
    async function getData() {
      //  获取区域设备
      dataSource.value = [];
      const { Detail,Total } = await getReginDevice(pagination)
      const result = Detail;
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
        total: Total
      })
    }

    async function handleSubmit() {
      try {
        setModalProps({ confirmLoading: true });
        closeModal();
        // Object.assign(getSelectRows(), {},ParamItem.value);

        console.log(getSelectRows(),'...getSelectRows...?')
        let params=[getSelectRows(),ParamItem.value]
        emit('success', params);
      } finally {
        setModalProps({ confirmLoading: false });
      }
    }
    return { registerModal, registerTable, handleSubmit, onSelectChange, getData, ModelStatus, paramList, ParamItem, checkedKeys, getTitle, searchInfo, dataSource };
  },
});
</script>

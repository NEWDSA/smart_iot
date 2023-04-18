<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="选择设备" @ok="handleSubmit" width="800px">
    <BasicTable @register="registerTab" :maxHeight="420">
      <!-- <template #toolbar>
    <a-button type="primary" @click="expandAll">展开全部</a-button>
    <a-button type="primary" @click="collapseAll">折叠全部</a-button>
  </template> -->
    </BasicTable>
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref, computed, unref, onMounted, reactive } from 'vue';
import { useMessage } from '@/hooks/web/useMessage';
import { BasicModal, useModalInner } from '@/components/Modal';
import { BasicTable, useTable, TableAction } from '@/components/Table';
import { columns, searchFormSchema } from './accountModel.data';
import { deviceTree, getReginDevice, getDeviceType, getReginList } from '@/api/demo/region'
// import { BasicTree, TreeItem, TreeActionType } from '@/components/Tree';
import { BasicTree, TreeItem, TreeActionType } from '@/components/Tree/index';
import { facilityListApi } from '@/api/facility/facility';
export default defineComponent({
  name: 'AccountModal',
  components: { BasicModal, BasicTree, BasicTable },
  emits: ['success', 'register', 'select','successFF'],
  setup(_, { emit }) {
    const isUpdate = ref(true);
    const checkedKeys = ref<Array<string | number>>([]);
    const { createConfirm } = useMessage();
    const checkData: any = ref();
    const DataType = ref(false);
    const TreeTableData: any = reactive([]);
        const ParamItem: any = ref({});
    const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
      // console.log(data,4564564)
      DataType.value = data?.type

      checkedKeys.value = []
      checkedKeys.value = data.data

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

    const [registerTab, { reload, getForm, updateTableDataRecord, getSelectRowKeys, getSelectRows, deleteTableDataRecord }] = useTable({
      api: facilityListApi,
      title: '设备列表',
      rowKey: 'DeviceId',
      rowSelection: {
        type: 'radio',
        selectedRowKeys: checkedKeys,
        onChange: onSelectChange,
      },
      columns: columns,
      fetchSetting: {
        pageField: 'PageNum',
        // 传给后台的每页显示多少条的字段
        sizeField: 'PageSize',
        // 接口返回表格数据的字段
        listField: 'List',
        // 接口返回表格总数的字段
        totalField: 'Total'
      },
      showIndexColumn: false,
      formConfig: {
        labelWidth: 120,
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
      },
      useSearchForm: true,
      showTableSetting: true,
      bordered: true,
    });

    function onSelectChange(selectedRowKeys: (string | number)[]) {
      // console.log(selectedRowKeys,'selectedRowKeys')
      checkedKeys.value = selectedRowKeys;
    }

    async function handleSubmit() {
      try {
        checkData.value = getSelectRows()
        console.log(checkData.value)

        var data: any = []
        var dataW: any = []

        data.push(checkData.value[0].DeviceId)
        dataW.push(checkData.value[0].DeviceName)

        // 将数据传递给接口
        setModalProps({ confirmLoading: true });
        closeModal();
        let params = [getSelectRows(), ParamItem.value]
        if(DataType.value == 1){
          emit('successFF', params);
        }else{
        emit('success', params);

        }
      } finally {
        setModalProps({ confirmLoading: false });
      }
    }

    return { checkData, DataType, registerModal, onSelectChange, handleSubmit, registerTab, checkedKeys };
  },
});
</script>
<style>
.ant-modal {
  top: 30px;
}
</style>

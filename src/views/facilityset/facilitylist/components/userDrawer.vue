<template>
    <BasicModal v-bind="$attrs" @register="registerModal" title="选择可控设备的成员分组" @ok="handleSubmit" width="800px">
        <BasicTable @register="registerTab">
            <!-- <template #toolbar>
      <a-button type="primary" @click="expandAll">展开全部</a-button>
      <a-button type="primary" @click="collapseAll">折叠全部</a-button>
    </template> -->
        </BasicTable>
    </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref, computed, unref, onMounted } from 'vue';
import { useMessage } from '@/hooks/web/useMessage';
import { BasicModal, useModalInner } from '@/components/Modal';
import { BasicTable, useTable, TableAction } from '@/components/Table';
import { columns, searchFormSchema } from '@/views/system/user/account.data';
// import { BasicTree, TreeItem, TreeActionType } from '@/components/Tree';
import { BasicTree, TreeItem, TreeActionType } from '@/components/Tree/index';
import { getAccountList } from '@/api/demo/system';
export default defineComponent({
    name: 'AccountModal',
    components: { BasicModal, BasicTree, BasicTable },
    emits: ['success', 'register', 'select'],
    setup(_, { emit }) {
        const checkedKeys = ref<Array<string | number>>([]);
        const {
            createConfirm
        } = useMessage(); 
        const checkData = ref('');
        const DataType = ref('');
        const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
            DataType.value = data.type
            // console.log(data)
        });

        const [registerTab, { reload, updateTableDataRecord, getSelectRowKeys, setPagination, deleteTableDataRecord }] = useTable({
            api: getAccountList,
            title: '用户列表',
            rowKey: 'UserId',
            rowSelection: {
                type: 'checkbox',
                selectedRowKeys: checkedKeys,
                onChange: onSelectChange,
            },
            columns,
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
        });

        function onSelectChange(selectedRowKeys: (string | number)[]) {
            checkedKeys.value = selectedRowKeys;
        }

        async function handleSubmit() {
            try {
                checkData.value = getSelectRowKeys()
                // 将数据传递给接口
                setModalProps({ confirmLoading: true });
                closeModal();
                emit('success', checkData.value,DataType.value);
            } finally {
                setModalProps({ confirmLoading: false });
            }
        }

        return { checkData,DataType, registerModal, onSelectChange, handleSubmit, registerTab, checkedKeys };
    },
});
</script>

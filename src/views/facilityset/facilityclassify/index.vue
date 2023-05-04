<template>
  <PageWrapper contentFullHeight title="设备分类">
    <div class="">
      <div class="p-2 bg-white">
        <div>
          <!-- <BasicForm @register="register"></BasicForm> -->
        </div>
        <div>
          <a-button v-if="hasPermission(['openModal_Device'])" type="primary" preIcon="ic:baseline-plus"
            @click="openModal(null, null)">
            创建新的分类
          </a-button>
        </div>
      </div>

      <div>
        <BasicTable @register="registertab" @edit-change="onEditChange" :dataSource="[...TreeTableData]">
          <!-- <template #toolbar>
        <a-button type="primary" @click="expandAll">展开全部</a-button>
        <a-button type="primary" @click="collapseAll">折叠全部</a-button>
      </template> -->
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <TableAction :actions="createActions(record, column)" />
            </template>
          </template>
        </BasicTable>
        <!-- </div> -->
      </div>

      <addclass ref="addmodel" @ok="ClassOK" @close="ClassClose"></addclass>

    </div>
  </PageWrapper>
</template>
<script lang="ts">
import { ref, reactive, nextTick, defineComponent, onMounted, } from 'vue';
// import { Button } from '@/components/Button';
import { BasicTable, useTable, TableAction, BasicColumn, EditRecordRow, ActionItem } from '@/components/Table';
import { getBasicColumns, } from './tableData';
import { PageWrapper } from '@/components/Page';
import { facilityTypeTreeApi, facilityTypeSaveApi, facilityTypeSameGradeApi, facilityTypeDeleteApi, facilityTypeEditApi } from '@/api/facility/facility'
import { usePermission } from '@/hooks/web/useButtonPermission';
import addclass from './components/addclass.vue';
import { message } from 'ant-design-vue';

// const openModal = ref({false,1});

export default defineComponent({
  name: 'AccountDetail',
  components: { BasicTable, TableAction, addclass, PageWrapper },
  setup() {
    const { hasPermission } = usePermission();
    onMounted(() => {
      FengfacilityTypeTree();
    })
    // 获取data
    const TreeTableData: any = reactive([])
    // 获取树状列表，自己封装
    function FengfacilityTypeTree() {
      TreeTableData.length = 0

      facilityTypeTreeApi().then(res => {
        console.log(res)
        for (let i = 0; i < res.length; i++) {
          // console.log(tree(res[i])[0])
          TreeTableData.push(tree([res[i]])[0])
          // TreeTableData.push(res[i].SelfData)

          // if (res[i].SonData) {
          //   TreeTableData[i].children = []
          //   // console.log('res[i].SonData',res[i].SonData)
          //   for (let y = 0; y < res[i].SonData.length; y++) {
          //     TreeTableData[i].children.push(res[i].SonData[y].SelfData)

          //     if (res[i].SonData[y].SonData) {
          //       // console.log(res[i].SonData[y].SonData)
          //       TreeTableData[i].children[y].children = []
          //       // console.log('res[i].SonData',TreeTableData)
          //       for (let x = 0; x < res[i].SonData[y].SonData.length; x++) {
          //         res[i].SonData[y].SonData[x].SelfData.ceng = 3
          //         // TreeTableData[i].children[y].children.push(res[i].SonData[y].SonData[x].SelfData)
          //         TreeTableData[i].children[y].children.push(res[i].SonData[y].SonData[x].SelfData)
          //       }
          //     }
          //   }
          // }

        }
        // 完成后自动展开
        nextTick(expandAll);
        console.log('TreeTableData', TreeTableData)
      })

    }

    function tree(data) {
      // debugger;
      console.log('data', data)
      let Array = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].SonData) {

          let obj = data[i].SelfData
          obj.children = tree(data[i].SonData)

          Array.push(obj)
        } else {
          let obj = data[i].SelfData
          Array.push(obj)
        }
        // Array.push(obj)
      }
      return Array;

    }


    // const TreeTabColumns = ref()
    const [registertab, { expandAll, deleteTableDataRecord, reload }] = useTable({
      // title: '树形表格',
      // api:FengfacilityTypeTreeApi,
      isTreeTable: true,
      // canRowDrag: true
      actionColumn: {
        width: 80,
        title: '操作',
        dataIndex: 'action',
        // slots: { customRender: 'action' },
        fixed: undefined,
      },
      // titleHelpMessage: '树形组件不能和序列号列同时存在',
      columns: getBasicColumns(),
      indentSize: 80,
      pagination: false
      // dataSource: toRaw(TreeTableData),
      // rowKey: 'id',
    })

    const addmodel = ref() //获取子组件

    // 打开弹窗
    function openModal(type, data) {
      console.log('45', type)
      // 编辑
      if (type) {
        addmodel.value.parent = true
        if (type == 'edit') {
          // 如果是edit添加数据到弹窗里面
          if (!data.ParentId) {
            addmodel.value.parent = false
          } else {
            addmodel.value.parentSelect[0].selectId = data.ParentId
            addmodel.value.parentSelect[0].selectValue = checkSlectVlaue(data.ParentId)
            console.log(checkSlectVlaue(data.ParentId))
            getSelect(data.ParentId)
            // console.log(addmodel.value.parentSelect[0].select)
            // addmodel.value.parentSelect[0].select = checkAddSlect('TOP')
            // console.log( addmodel.value.parentSelect[0].selectValue)
          }
          addmodel.value.deviceid = data.TypeId
          addmodel.value.from[1].value = data.SortPosition
          addmodel.value.from[0].value = data.TypeName
          addmodel.value.RadioVal = data.Status
        }

        if (type == 'add') {
          // 如果是add添加数据到弹窗里面
          addmodel.value.parentSelect[0].selectId = data.TypeId
          addmodel.value.parentSelect[0].selectValue = data.TypeName
          getSelect(data.TypeId)
        }
      }

      // addmodel.value.parentSelect[0].value = data.
      addmodel.value.ClassType = type
      addmodel.value.visible = true
    }

    // 点击确定后
    function ClassOK(type, from, parentFrom, deviceid, RadioVal) {
      console.log(type, from, parentFrom, deviceid, RadioVal)

      if (from[0].value == '') { message.error('请输入分类名称'); return }
      // if (from[1].value == '') { message.error('请输入分类排序'); return }
      if (from[1].value == '') { from[1].value = 0 }

      if (type == 'edit') {
        let obj = {
          TypeId: deviceid,
          TypeName: from[0].value,
          SortPosition: Number(from[1].value),
          ParentId: Number(parentFrom[0].selectId),
          Status: RadioVal.value
        }

        facilityTypeEditApi(obj).then(res => {
          if (typeof (res) == 'string') {
            var a = res.split('=')
            // console.log(a)
            message.error(a[2])
          } else {
            message.error('修改成功')
            FengfacilityTypeTree();

            addmodel.value.handleClock()
            addmodel.value.visible = false
          }
          // reload()
        })
      } else if (type == 'add') {
        let obj = {
          // TypeId: deviceid,
          TypeName: from[0].value,
          SortPosition: Number(from[1].value),
          ParentId: Number(parentFrom[0].selectId),
          Status: RadioVal.value
        }
        if (RadioVal.value == '') { message.error('请选择分类状态'); return }

        facilityTypeSaveApi(obj).then(res => {
          if (typeof (res) == 'string') {
            var a = res.split('=')
            // console.log(a)
            message.error(a[2])
          } else {
            message.error('新增成功')
            FengfacilityTypeTree();

            addmodel.value.handleClock()
            addmodel.value.visible = false
          }
          // reload()
        })
      } else {
        let obj = {
          TypeName: from[0].value,
          SortPosition: Number(from[1].value),
          ParentId: 0,
          Status: RadioVal.value
        }
        if (RadioVal.value == '') { message.error('请选择分类状态'); return }

        facilityTypeSaveApi(obj).then(res => {
          if (typeof (res) == 'string') {
            var a = res.split('=')
            // console.log(a)
            message.error(a[2])
          } else {
            message.error('新增成功')
            FengfacilityTypeTree();

            addmodel.value.handleClock()
            addmodel.value.visible = false
          }
          // reload()
        })
      }

      // message.success('操作成功')


    }

    // 取消?关闭弹窗
    function ClassClose() {

      addmodel.value.ClassType = ''
      // console.log(editClassType.value, addClassType.value)
    }

    // 操作
    const editableData = ref('');

    function createActions(record: EditRecordRow, column: BasicColumn): ActionItem[] {
      // console.log(record)
      return [
        {
          icon: 'ic:baseline-plus',
          disabled: record.Inherent == 1 ? true : false,
          ifShow: hasPermission(['handleAdd_Device']),
          onClick: handleAdd.bind(null, record),
        },
        {
          icon: 'clarity:note-edit-line',
          ifShow: hasPermission(['handleEdit_Device']),
          disabled: record.Inherent == 1 ? true : false,
          // disabled: editableData.value ? editableData.value !== record.key : false,
          onClick: handleEdit.bind(null, record),
        },
        {
          icon: 'ant-design:delete-outlined',
          ifShow: hasPermission(['handleDelete_Device']),
          color: 'error',
          disabled: record.Inherent == 1 ? true : false,
          popConfirm: {
            title: '是否确认删除',
            placement: 'left',
            confirm: handleDelete.bind(null, record),
          },
        },
      ];
    }


    function onEditChange({ column, value, record }) {
      // 本例
      if (column.dataIndex === 'id') {
        record.editValueRefs.name4.value = `${value}`;
      }
      console.log(column, value, record);
    }


    async function handleDelete(record: Recordable) {
      // debugger
      // await deleteTableDataRecord(record.TypeId)
      await facilityTypeDeleteApi({ 'Ids': [record.TypeId] }).then(res => {
        if (res != 0) {
          var a = res.split('=')
          // console.log(a)
          message.error(a[2])
          return;
        } else {
          FengfacilityTypeTree();
        }
      })

      console.log(TreeTableData);
    }


    function handleEdit(record: Recordable) {
      // editableData.value = record.key;
      // editClassType.value = true
      openModal('edit', record);
      // console.log(record.key)
    }

    function handleAdd(record: Recordable) {
      // console.log(addClassType.value,editClassType.value)
      openModal('add', record);

    }

    function checkSlectVlaue(id) {
      // console.log(id)
      for (var i = 0; i < TreeTableData.length; i++) {
        if (TreeTableData[i].TypeId == id) {
          return TreeTableData[i].TypeName
        }
        if (TreeTableData[i].children) {
          for (var y = 0; y < TreeTableData[i].children.length; y++) {
            if (TreeTableData[i].children[y].TypeId == id) {
              return TreeTableData[i].children[y].TypeName
            }
          }
        }
      }
    }

    function getSelect(id) {
      facilityTypeSameGradeApi({ 'ParentId': id }).then(res => {
        addmodel.value.parentSelect[0].select = res
        //   let obj=[]
        //   for(let i=0;i<res.length){
        //     obj.push(item)
        //   }
        //   console.log(obj)
        //  return res
      })
    }


    return {
      hasPermission,
      TreeTableData,
      FengfacilityTypeTree,
      registertab,
      addmodel,
      openModal,
      ClassOK,
      ClassClose,
      editableData,
      createActions,
      onEditChange,
      handleDelete,
      handleEdit,
      handleAdd,
      checkSlectVlaue,
      getSelect,
      tree
    };
  },
});
</script>


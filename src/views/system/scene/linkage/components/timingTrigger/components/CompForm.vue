<template>
  <PageWrapper>
    <BasicForm @register="register">
    </BasicForm>
    <Modal v-model:visible="dialogVisible" title="选择日期">
      <div class="number-picker-body">
        <div v-for="n in 31" :key="n" class="number-picker-item" :class="{ selected: isSelected(n) }"
          @click="toggleSelect(n)">
          {{ n }}
        </div>
      </div>
      <template #footer>
        <a-button type="primary" @click="handleConfirm">确定</a-button>
        <a-button @click="dialogVisible = false, selectedNumbers = []">取消</a-button>
      </template>
    </Modal>

  </PageWrapper>
</template>
<script lang="tsx">
import { defineComponent, defineExpose, watch, onMounted, ref, toRefs, reactive } from 'vue';
import { Modal } from 'ant-design-vue'
import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
import { CollapseContainer } from '@/components/Container/index';
import { PageWrapper } from '@/components/Page';
import { Icon } from '@/components/Icon';
import AccountTable from './AccountTable.vue';
const state = reactive({
  dialogVisible: false,
  selectedDates: [],
})
const selectedNumbers = ref([])
const cselectedNumbers = ref([])
const schemas: FormSchema[] = [{
  field: 'ConditionItems',
  component: 'Select',
  label: '',
  colProps: {
    span: 3
  },
  componentProps: {
    placeholder: '请选择',
    options: [{
      label: '按周',
      value: 1,
      key: 1
    }, {
      label: '按月',
      value: 2,
      key: 2
    }]
  }
},
{
  field: 'ExecuteDate',
  label: ' ',
  labelWidth: '10px',
  component: 'Select',
  componentProps: {
    mode: 'multiple',
    placeholder: '请选择时间',
    options: [
      {
        label: '每天',
        value: null,
      },
      {
        label: '周一',
        value: '1',
      },
      {
        label: '周二',
        value: '2',
      },
      {
        label: '周三',
        value: '3',
      },
      {
        label: '周四',
        value: '4',
      },
      {
        label: '周五',
        value: '5',
      },
      {
        label: '周六',
        value: '6',
      },
      {
        label: '周日',
        value: '7',
      }
    ],
    maxTagCount: 2,
  },
  colProps: { span: 8 },
  ifShow: ({ values }) => {
    return values.ConditionItems == 1;
  }
},
{
  field: 'ExecuteDateWeek',
  label: ' ',
  labelWidth: '10px',
  // component: 'DatePicker',
  // componentProps: {

  //   format: 'DD',
  //   valueFormat: 'DD',
  //   // placeholder: ['开始时间', '结束时间'],
  //   // showTime: { format: 'HH:mm:ss' },
  //   placeholder: '请选择11时间',
  // },
  component: 'Select',
  componentProps: {
    placeholder: '请选择时间',
    mode: 'multiple',
    onClick: (value) => {
      // console.log(cselectedNumbers.value)
      state.dialogVisible = true
      selectedNumbers.value = cselectedNumbers.value
    },
    maxTagCount: 2,
    // options: [
    //   {
    //     label: '1',
    //     value: '1',
    //   },
    //   {
    //     label: '2',
    //     value: '2',
    //   },
    //   {
    //     label: '3',
    //     value: '3',
    //   },
    // ]
  },
  colProps: { span: 5 },
  ifShow: ({ values }) => {
    return values.ConditionItems == 2;
  }
},
{
  field: 'ExecuteNum',
  component: 'Select',
  label: ' ',
  labelWidth: '10px',
  colProps: {
    span: 5
  },
  componentProps: {
    placeholder: '请选择',
    options: [{
      label: '执行一次',
      value: '1'
    }, {
      label: '周期执行',
      value: '2'
    }]
  },
  show: ({ values }) => {
    return values.ConditionItems == 2 || values.ConditionItems == 1;
  }
},
{
  field: 'ExecuteTime',
  component: 'TimePicker',
  label: ' ',
  labelWidth: '10px',
  colProps: {
    span: 4
  },
  componentProps: {
    format: 'HH:mm',
    valueFormat: 'HH:mm',
    placeholder: '请选择时间',
  },
  show: ({ values }) => {
    return (values.ConditionItems == 2 || values.ConditionItems == 1) && values.ExecuteNum == 1;
  }
},
{
  field: 'StartTime',
  component: 'TimePicker',
  label: ' ',
  labelWidth: '10px',
  colProps: {
    span: 4
  },
  componentProps: {
    format: 'HH:mm',
    valueFormat: 'HH:mm',
    placeholder: '请选择开始时间',
  },
  show: ({ values }) => {
    return (values.ConditionItems == 2 || values.ConditionItems == 1) && values.ExecuteNum == 2;
  }
},
{
  field: 'EndTime',
  component: 'TimePicker',
  label: '~',
  labelWidth: '10px',
  colProps: {
    span: 4
  },
  componentProps: {
    format: 'HH:mm',
    valueFormat: 'HH:mm',
    placeholder: '请选择结束时间',
  },
  show: ({ values }) => {
    return (values.ConditionItems == 2 || values.ConditionItems == 1) && values.ExecuteNum == 2;
  }
},
{
  field: 'circulationTime',
  component: 'Input',
  label: '每',
  labelWidth: '20px',
  colProps: {
    span: 3
  },
  componentProps: {
    placeholder: '请输入时间',
  },
  show: ({ values }) => {
    return (values.ConditionItems == 2 || values.ConditionItems == 1) && values.ExecuteNum == 2;
  }
},
{
  field: 'circulationUnit',
  component: 'Select',
  label: ' ',
  labelWidth: '10px',
  colProps: {
    span: 3
  },
  componentProps: {
    placeholder: '请选择',
    options: [{
      label: '时',
      value: 1,
      key: '1'
    }, {
      label: '分',
      value: 2,
      key: '2'
    }]
  },
  show: ({ values }) => {
    return (values.ConditionItems == 2 || values.ConditionItems == 1) && values.ExecuteNum == 2;
  }
},
{
  field: 'circulationNum',
  component: 'Select',
  label: ' ',
  labelWidth: '10px',
  defaultValue: '1',
  colProps: {
    span: 5
  },
  componentProps: {
    placeholder: '请选择',
    options: [{
      label: '执行一次',
      value: '1',
      key: '1'
    },
      //  {
      //   label: '执行两次',
      //   value: '2',
      //   key: '2'
      // },
      // {
      //   label: '执行三次',
      //   value: '3',
      //   key: '3'
      // }
    ]
  },
  show: ({ values }) => {
    return (values.ConditionItems == 2 || values.ConditionItems == 1) && values.ExecuteNum == 2;
  }
},

];

export default defineComponent({
  components: { BasicForm, CollapseContainer, PageWrapper, Icon, AccountTable, Modal },
  props: {
    CompObj: {
      type: Object,
      default: []
    }
  },
  setup(props) {
    const [register, { setProps, getFieldsValue, setFieldsValue, updateSchema }] =
      useForm({
        labelWidth: 0,
        schemas: schemas,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 6,
        },
      });
    watch(() => props.CompObj, (newValue, oldValue) => {

      if (props.CompObj.length != 0) {
        console.log(props.CompObj, "4546as4d6as4d65as4d5a4s5d5a6sd")

        // debugger;
        huix()
        // bcIndex.value = props.OperationMode
      }
    }, { deep: true }) // 开启深度监视才行
    function appendField() {
    }
    function deleteField() {
      // removeSchemaByField('field11');
    }
    function handleSuccess() {

    }
    onMounted(() => {
      selectedNumbers.value = []
      cselectedNumbers.value = []
      // let arr: any = []
      // for (let i = 1; i <= 31; i++) {
      //   let obj = {
      //     label: i,
      //     value: i
      //   }
      //   arr.push(obj)
      // }
      // updateSchema({
      //   field: 'ExecuteDateWeek',
      //   componentProps: { options: arr },
      // });
    })
    function huix() {
      // console.log(props.CompObj,'props.setObjprops.setObjprops.setObj')

      // var a = { "ConditionItems": "2", "ExecuteDate": "1", "ExecuteNum": "2", "ExecuteTime": "00:05", "ExecuteDateWeek": 8, "StartTime": "14:00", "EndTime": "14:00", "circulationTime": "10", "circulationUnit": "1", "circulationNum": "2" }
      var a = props.CompObj
      setFieldsValue({
        ...a
      });
    }
    function EndData() {
      const values = getFieldsValue()
      if (values.ConditionItems == 1) {
        if (!values.ExecuteDate) {
          return 1
        }
      } else {
        if (!values.ExecuteDateWeek) {
          return 1
        }
      }

      if (!values.ExecuteNum) {
        return 1
      }

      if (values.ExecuteNum == 1) {
        if (!values.ExecuteTime) {
          return 1
        }
      } else if (values.ExecuteNum == 2) {
        if (!values.StartTime || !values.EndTime || !values.circulationTime ||
          !values.circulationUnit) {
          return 1
        }
      }
      
      return values
      // return values
      // let Str: String;
      // if (values.ConditionItems == 1) {

      //   if (values.ExecuteDate) {
      //     if (values.ExecuteDate == 7) {
      //       Str = "*"
      //     } else {
      //       Str = values.ExecuteDate
      //     }
      //   }

      //   if (values.ExecuteNum) {
      //     if (values.ExecuteNum == 1) {
      //       if (values.ExecuteTime) {
      //         let arr = values.ExecuteTime.split(':')
      //         Str = arr[0] + ' ' + arr[1] + ' ' + '*' + ' ' + '*' + ' ' + Str
      //       }
      //     }
      //   }

      // } else {

      //   if (values.ExecuteDateWeek) {
      //     Str = values.ExecuteDateWeek
      //   }

      //   if (values.ExecuteTime) {
      //     let arr = values.ExecuteTime.split(':')
      //     Str = arr[0] + ' ' + arr[1] + ' ' + Str + ' ' + '*' + ' ' + '*'
      //   }
      // }


      // console.log(values, Str)

    }

    const showDatePicker = () => {
      state.dialogVisible = true
    }

    const handleConfirm = () => {
      state.dialogVisible = false
      cselectedNumbers.value = [...selectedNumbers.value]
      setFieldsValue({
        ExecuteDateWeek: cselectedNumbers
      });
      selectedNumbers.value = []
    }

    const toggleSelect = (n) => {
      // console.log(cselectedNumbers.value)
      if (selectedNumbers.value.includes(n)) {
        // 如果已经选择了该数字，则取消选择
        selectedNumbers.value = selectedNumbers.value.filter((x) => x !== n)
      } else {
        // 如果还没有选择该数字，则添加到已选择数组中
        selectedNumbers.value.push(n)
      }
    }

    const isSelected = (n) => {
      // 判断数字是否已选择
      return selectedNumbers.value.includes(n)
    }

    defineExpose({ EndData });
    // 添加规则
    return {
      register,
      schemas,
      setProps,
      appendField,
      deleteField,
      handleSuccess,
      EndData,
      huix,
      selectedNumbers,
      cselectedNumbers,
      toggleSelect,
      isSelected,
      confirm,
      ...toRefs(state),
      showDatePicker,
      handleConfirm,
    };
  }
});
</script>
<style lang="less" scoped>
::v-deep(.ant-page-header-heading) {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.col_flex {
  display: flex;
  align-items: center;
}

.item_felx {
  position: relative;
  display: flex;
  align-items: flex-end;
}

.number-picker {
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  font-size: 0;
}

.number-picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.number-picker-title {
  font-size: 14px;
}

.number-picker-body {
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
}

.number-picker-item {
  display: inline-block;
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 8px;
  margin-bottom: 8px;
  cursor: pointer;
}

.number-picker-item.selected {
  background-color: #1890ff;
  color: #fff;
}

// .overflow-hidden
// ::v-deep(.overflow-hidden) {
//   overflow: inherit;
// }
</style>

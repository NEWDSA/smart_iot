<template>
  <PageWrapper title="执行动作">
    <template #extra>
      <Form :model="RuleForm">
        <Row :gutter="5" class="enter-x col_flex">
          <Col>
          <a-button @click="bcIndex = 1" :type="bcIndex == 1 ? 'primary' : ''">串行</a-button>
          </Col>
          <Col>
          <a-button @click="bcIndex = 2" :type="bcIndex == 2 ? 'primary' : ''">并行</a-button>
          </Col>
        </Row>
      </Form>
    </template>
    <div ref="container" class="rounded-md pt-5 pl-5 border">
      <draggable class="list-group" @update="onUpdate" :animation="0" itemKey="index" :disabled="!enabled" :list="add"
        @start="dragging = true" @end="dragging = false" @change="logddd">
        <template #item="{ element, index }">

          <div class="list-group-item" :class="{ 'not-draggable': !enabled }">
            {{ index }}-333
            <BasicForm draggable="true" v-if="element.schemas_normal" :ref="setItemRef" @get-form="formvalue(arg, index)"
              :schemas="element.schemas_normal" @register="register">
              <template #customSlot="{ model, field }">
                <a-input placeholder="请选择设备" v-model:value="model[field]" @click="e_Device(index)">
                  <template #suffix>
                    <Icon icon="carbon:logo-github" />
                  </template>
                </a-input>
              </template>
              <template #deleteSlot="{ model, field }">
                <Icon @click="delete_rule(index)" icon="ant-design:delete-outlined" />
              </template>

            </BasicForm>
          </div>
        </template>
      </draggable>
      <!-- 引入模态框 -->
      <AccountTable @register="registerMyTable" @success="handleSuccess" />
      <a-button type="primary" class="my-4" @click="handel_Add">
        添加动作
      </a-button>
    </div>
  </PageWrapper>
</template>
<script lang="tsx">
import { defineComponent, reactive, ref, onMounted, toRaw, nextTick, defineExpose, unref, watch } from 'vue';
import { Switch, Form, Input, Row, Col, InputNumber, Select, message } from 'ant-design-vue';
import { BasicForm, FormSchema, useForm, FormActionType } from '@/components/Form/index';
import { CollapseContainer } from '@/components/Container/index';
import { PageWrapper } from '@/components/Page';
import draggable from "vuedraggable";
import { Icon } from '@/components/Icon';
import AccountTable from './AccountTable.vue';
import { useModal } from '@/components/Modal';
import SelectItem from '@/layouts/default/setting/components/SelectItem.vue';
import { deviceInfo } from '@/api/demo/scence'
import { error } from '@/utils/log'
// import { nextTick } from 'process';
const [registerMyTable, { openModal }] = useModal();
const schemas: FormSchema[] = [];
const dragging = ref(false)
const myArray: any = ref('');
const schemas_normal: FormSchema[] = [
  {
    field: 'OperationType',
    component: 'Select',
    label: '',
    colProps: {
      span: 4,
    },
    componentProps: {
      options: [{
        label: '设备',
        value: '1',
        key: '1'
      }, {
        label: '访客类型',
        value: '2',
        key: '2'
      }, {
        label: '参数',
        value: '3',
        key: '3'
      }, {
        label: '日期',
        value: '4',
        key: '4'
      }, {
        label: '系统时间',
        value: '5',
        key: '5'
      }, {
        label: '工单创建',
        value: '6',
        key: '6'
      }, {
        label: '工单更新',
        value: '7',
        key: '7'
      }]
    }
  },
  // 设备
  {
    field: 'DeviceId',
    label: '',
    component: 'Input',
    slot: 'customSlot',
    colProps: {
      span: 4,
    },
    // 判断显示隐藏
    show: ({ values }) => {
      return values.OperationType == '1';
    }
  },
  // 设备参数
  // {
  //   field: 'Gvalparams',
  //   component: 'Select',
  //   label: '',
  //   colProps: {
  //     span: 3,
  //   },
  //   show: ({ values }) => {
  //     return values.DeviceId && values.OperationType == '1';
  //   },
  //   componentProps: {
  //     placeholder: '请选择设备参数',
  //     options: [{
  //       label: '环境温度',
  //       value: '0',
  //       key: '0'
  //     }, {
  //       label: '时间点',
  //       value: '1',
  //       key: '1'
  //     }, {
  //       label: '关机',
  //       value: '2',
  //       key: '2'
  //     }, {
  //       label: '开机',
  //       value: '3',
  //       key: '3'
  //     }]
  //   }
  // },
  // 设备参数环境温度参数
  {
    field: 'Gval1',
    component: 'Select',
    label: '',
    colProps: {
      span: 3,
    },
    show: ({ values }) => {
      return values.Gvalparams == 0 && values.OperationType == '1';
    },
    componentProps: {
      placeholder: '请选择设备条件',
      options: [{
        label: '大于',
        value: '>',
        key: '>'
      }, {
        label: '小于',
        value: '<',
        key: '<'
      }, {
        label: '大于等于',
        value: '>=',
        key: '>='
      }, {
        label: '小于等于',
        value: '<=',
        key: '<='
      }]
    }
  },
  {
    field: 'GvalparamsInp',
    component: 'InputNumber',
    label: '',
    colProps: {
      span: 3,
    },
    show: ({ values }) => {
      return values.Gvalparams == 0 && values.OperationType == '1';
    }
  },
  // 工单
  {
    field: 'field3',
    component: 'Select',
    label: '',
    colProps: {
      span: 4,
    },
    show: ({ values }) => {
      return values.field1 == '6' || values.field1 == '7';
    },
    componentProps: {
      placeholder: '请选择参数',
      options: [{
        label: '工单状态',
        value: '0',
        key: '0'
      }, {
        label: '优先级',
        value: '1',
        key: '1'
      }, {
        label: '受理组',
        value: '2',
        key: '2'
      }, {
        label: '受理人',
        value: '3',
        key: '3'
      }]
    }
  },
  {
    field: 'gStatus',
    component: 'Select',
    label: '',
    colProps: {
      span: 8,
    },
    show: ({ values }) => {
      return values.field1 == '6' || values.field1 == '7';
    },
    componentProps: {
      options: [
        {
          label: '已更改',
          value: '1',
          key: '1',
        },
        {
          label: '更改为',
          value: '2',
          key: '2',
        },
        {
          label: '更改为',
          value: '2',
          key: '2',
        }, {
          label: '未更改为',
          value: '3',
          key: '3',
        }
      ],
    },
  },
  // 紧急程度
  {
    field: 'urgent',
    component: 'Select',
    label: '',
    colProps: {
      span: 3,
    },
    show: ({ values }) => {
      return values.field1 == '6' || values.field1 == '7';
    },
    componentProps: {
      options: [{
        label: '一般',
        value: '1',
        key: '1'
      }, {
        label: '紧急',
        value: '2',
        key: '2'
      }, {
        label: '非常紧急',
        value: '3',
        key: '3'
      }]
    }
  },
  {
    field: 'delete',
    label: '',
    component: 'Input',
    slot: 'deleteSlot',
    colProps: {
      span: 3
    }
  }
];
const add: any = ref([]);
const DeviceIdArr: any = ref([]);
const xformElRef: any = ref([]);
const setItemRef = (el) => {
  console.log(el)
  xformElRef.value.push(el);
};
const bcIndex = ref(1)
const TIndex = ref()
const showForm = ref(false);
const enabled = true
const schemas2: FormSchema[] = [
  {
    field: 'filed1',
    label: '',
    component: 'Switch',
    slot: 'switchSlot'
  },
  {
    field: 'field',
    component: 'Input',
    label: '',
    colProps: {
      span: 3,
    },
    componentProps: {
      placeholder: '自定义placeholder',
      onChange: (e) => {
        console.log(e);
      },
    },
  },
];
const FormAdd: any = reactive([]);
const FormItem = Form.Item;
const options1 = ref([{
  value: 'jack',
  label: 'jack'
}])
const options2 = ref([{
  value: '1',
  label: '温度'
}, {
  value: '2',
  label: '时间'
}, {
  value: '3',
  label: '光照'
}, {
  value: '4',
  label: '系统时间'
}])
const options3 = ref([{
  value: '>',
  label: '大于'
}, {
  value: '>=',
  label: '大于等于'
}, {
  value: '<',
  label: '小于'
}, {
  value: '<=',
  label: '小于等于'
}])
const isShake = ref(false);
const RuleForm = reactive([{
  switch: '',

}]);
const setData: any = ref([]);
const index: any = ref(0);
const container = ref(null);
export default defineComponent({
  components: { BasicForm, CollapseContainer, PageWrapper, Icon, Switch, AccountTable, InputNumber, Input, Row, Col, Select, SelectItem, draggable },
  props: {
    setObj: {
      type: Object,
      default: []
    },
    OperationMode: {
      type: Number,
      default: 0
    },
  },
  setup(props, { emit }) {
    const [register, { appendSchemaByField, setProps, updateSchema, setFieldsValue, getFieldsValue }] =
      useForm({
        labelWidth: 0,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 6,
          style: {
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }
        },
      });

    watch(() => props.setObj, (newValue, oldValue) => {

      if (props.setObj.length != 0) {
        console.log(props.setObj, "4546as4d6as4d65as4d5a4s5d5a6sd")

        // debugger;
        huix()
        bcIndex.value = props.OperationMode
      }
    }, { deep: true }) // 开启深度监视才行

    function ActionType(type) {
      console.log(xformElRef.value)
    }
    function formvalue(arg, index1) {
      console.log(arg, '...arg...?')
      const values = getFieldsValue()
      console.log(values, '...values2...?')
      console.log(index1, '...index3...?')
      if (setData.value.length == 0) {
        setData.value.push({
          [index1]: {
            OperationItems: {
              ...values
            }
          }
        }
        )
      }


      // 判断数组是否有下标相同项
      // setData.forEach
      setData.value.forEach((item, index) => {
        Object.keys(item).forEach((key) => {
          console.log(key, index1, '?...key...?')
          if (key == index1) {
            console.log(setData.value, '...setData.value...?123')
            setData.value[index] = {
              [index1]: {
                OperationItems: {
                  ...values
                }
              }
              // OperationItems: {
              //   ...values
              // }
            }
          } else {
            setData.value.push({
              [index1]: {
                OperationItems: {
                  ...values
                }
              }
            }
            )
          }
        })
      })


      console.log(setData.value, '...setData.value...?')
    }
    function onUpdate(event) {
      // console.log(add.value[event.oaldIndex].schemas_norml=,'...333...');
      nextTick(() => {
        add.value[event.newIndex].schemas_norml = add.value[event.oldIndex].schemas_norml;
        let n = xformElRef.value[event.newIndex]
        let o = xformElRef.value[event.oldIndex]

        xformElRef.value[event.oldIndex] = n
        xformElRef.value[event.newIndex] = o
      })

      // const item = add.value.splice(event.oldIndex, 1)[0];
      // 处理拖拽排序问题

      // add.value.splice(event.newIndex, 0, item);
    }
    function handel_Add() {
      add.value.push({
        schemas_normal: schemas_normal,
        index: add.value.length
      })
      xformElRef.value = []
      console.log(toRaw(add), 'ddd?')
    }
    async function handleSuccess(params) {
      // console.log(getFieldsValue(), '?...getFieldsValue...?')
      // console.log(params, '?...params...?')
      // const obj = params[0]
      // // DeviceName
      // console.log(obj[0].DeviceName, '...obj...?')

      // setFieldsValue({
      //   DeviceId: obj[0].DeviceId,
      // });
      const obj = { ...params }
      // 根据所选择的设备进行设备id查询
      const result = await deviceInfo({
        Id: obj[0].DeviceId
      })

      let FormSchema = JSON.parse(result[0]?.DeviceModel)
      xformElRef.value[Number(TIndex.value)].setFieldsValue({
        DeviceId: obj[0].DeviceId,
      })
      let myobj: any = [];
      FormSchema.forEach(async (item, index) => {
        myobj.push({
          name: item.model.name,
          value: item.model.field,
        })
      })
      xformElRef.value[Number(TIndex.value)].appendSchemaByField({
        field: 'DeviceField',
        component: 'Select',
        label: '',
        colProps: {
          span: 4
        },
        componentProps: {
          fieldNames: {
            label: 'name',
            key: 'value',
            value: 'value'
          },
          options: myobj
        },
        ifShow: ({ values }) => {
          return values.OperationType == '1'
        }
      }, 'DeviceId')
      FormSchema.forEach((item, index) => {
        // 使用updateSchema添加

        // slide
        if (item.model.view == 'slide') {

          xformElRef.value[Number(TIndex.value)].appendSchemaByField({
            field: item.model.field,
            component: 'Slider',
            label: '',
            defaultValue: item.model['default-value'],
            colProps: {
              span: 5
            },
            componentProps: {
              placeholder: item.model.name,
              fieldNames: {
                label: 'name',
                key: 'value',
                value: 'value'
              },
              options: item.model['select-item']
            },
            ifShow: ({ values }) => {
              console.log(values)
              return values.DeviceField == item.model.field && values.OperationType == '1'
            }
          }, 'DeviceField')

          // 大于小于
          // appendSchemaByField({
          //   field: 'equation',
          //   component: 'Select',
          //   label: '',
          //   colProps: {
          //     span: 5
          //   },
          //   componentProps: {
          //     options: [
          //       { label: '>', value: '>' },
          //       { label: '<', value: '<' },
          //       { label: '=', value: '=' },
          //       { label: '<=', value: '<=' },
          //       { label: '>=', value: '>=' }
          //     ]
          //   },
          //   ifShow: ({ values }) => {
          //     // console.log(values,'DeviceFieldDeviceFieldDeviceField')
          //     return values.DeviceField == item.model.field && values.OperationType == '1'
          //   }
          // }, 'DeviceField')


        } else {
          xformElRef.value[Number(TIndex.value)].appendSchemaByField({
            field: item.model.field,
            component: item.model.view.charAt(0).toUpperCase() + item.model.view.slice(1),
            label: '',
            defaultValue: item.model['default-value'],
            colProps: {
              span: 5
            },
            componentProps: {
              placeholder: item.model.name,
              fieldNames: {
                label: 'name',
                key: 'value',
                value: 'value'
              },
              options: item.model['select-item']
            },
            ifShow: ({ values }) => {
              return values.DeviceField == item.model.field
            }
          }, 'DeviceField')
        }

        // appendSchemaByField(
        //   {
        //     field: item.model.field,
        //     component: item.model.view.charAt(0).toUpperCase() + item.model.view.slice(1),
        //     label: '',
        //     defaultValue: item.model['default-value'],
        //     colProps: {
        //       span: 3
        //     },
        //     componentProps: {
        //       placeholder: item.model.name,
        //       fieldNames: {
        //         label: 'name',
        //         key: 'value',
        //         value: 'value'
        //       },
        //       options: item.model['select-item']
        //     },
        //     ifShow: ({ values }) => {
        //       return values.DeviceField == index
        //       // return values.OperationType == index
        //     }
        //   },
        //   'DeviceField'
        // )
      })

    }
    function changeLabel3() {
      updateSchema({
        field: 'field3',
        label: '字段3 New',
      });
    }
    function changeLabel34() {
      updateSchema([
        {
          field: 'field3',
          label: '字段3 New++',
        },
        {
          field: 'field4',
          label: '字段4 New++',
        },
      ]);
    }
    function remove_attach(index, cindex) {
      delete add.value[index].FormAdd[cindex];
    }
    function appendField() {
    }
    function deleteField() {
      // removeSchemaByField('field11');
    }
    // 选择设备
    function e_Device(index) {
      TIndex.value = index
      //  打开弹窗
      openModal(true, {
        isUpdate: true
      });
    }
    // 添加规则
    function addRule(index1) {
      console.log(index1)
      const values: any = getFieldsValue();
      console.log(Object.keys(values), '?...values...?')
      add.value.map((item, index) => {
        if (index == index1) {
          item.FormAdd.push({
            Op: '',
            item1: '',
            item2: '',
            item3: '',
            Gval: ''
          })
        }
        return item;

      })
      console.log(add.value, '?...item...?')
    }
    function handleSubmit() {

    }

    async function delete_rule(index) {
      // delete add.value[index].checked1

      add.value.splice(index, 1)
      // add.value[index].FormAdd = []
    }
    function logddd(evt) {
      console.log(evt)
    }

    // async function getForm() {
    //   const form = unref(xformElRef)
    //   if (!form) {
    //     error(
    //       'The form instance has not been obtained, please make sure that the form has been rendered when performing the form operation!'
    //     )
    //   }
    //   await nextTick()
    //   return form as FormActionType
    // }

    function EndData() {
      DeviceIdArr.value = []
      console.log(xformElRef.value, 'EndDataEndData')
      const form = unref(xformElRef)
      let fromArr: any = []
      // console.log(add.value)
      if (form != null) {
        for (let i = 0; i < xformElRef.value.length; i++) {
          if (JSON.stringify(xformElRef.value[i].getFieldsValue()) === '{}') {
            message.warn('请选择完整条件');
            return false
          }
          if (xformElRef.value[i].getFieldsValue().OperationType == '1') {
            DeviceIdArr.value.push(Number(xformElRef.value[i].getFieldsValue().DeviceId))
          }
          console.log(DeviceIdArr.value)
          fromArr.push(xformElRef.value[i].getFieldsValue())
        }
      }

      let enddata: any = []
      for (let i = 0; i < add.value.length; i++) {
        fromArr[i].OperationType = Number(fromArr[i].OperationType)
        enddata.push(fromArr[i])
        // enddata[i].push(FfromArr[i])
      }

      console.log(add.value)
      return enddata

    }

    onMounted(()=>{
      add.value = []
    })

    function huix() {
      add.value = []
      xformElRef.value = []
      // let a = [
      //   {
      //     "DeviceField": "switch",
      //     "DeviceId": "1000025128043",
      //     "OperationType": "1",
      //     "switch": true
      //   },
      //   {
      //     "DeviceField": "percentage",
      //     "DeviceId": "1000025128043",
      //     "OperationType": "1",
      //     "percentage": 55,
      //   }

      // ]

      let aobj: any = props.setObj
      // console.log(aobj)
      let a: any = []
      for (let k in aobj) {
        console.log(aobj[k])

        a.push(aobj[k])
      }

      for (let i = 0; i < a.length; i++) {
        add.value.push({
          schemas_normal: schemas_normal,
          index: i
        })

      }
      // console.log(xformElRef.value)
      // debugger
      nextTick(async () => {
        //    console.log(xformElRef.value)
        // debugger
        for (let i = 0; i < xformElRef.value.length; i++) {
          xformElRef.value[i].setFieldsValue({
            ...a[i],
          });

          // debugger
          let obj = [
            // [
              {
                DeviceId: a[i].DeviceId
              }
            // ]
          ]
          TIndex.value = i
          await handleSuccess(obj)

          xformElRef.value[i].setFieldsValue({
            ...a[i],
          });
        }
      })

    }

    defineExpose({ EndData, bcIndex, DeviceIdArr });

    return {
      register,
      schemas,
      schemas_normal,
      xformElRef,
      setItemRef,
      schemas2,
      showForm,
      FormItem,
      FormAdd,
      RuleForm,
      options1,
      options2,
      options3,
      isShake,
      add,
      myArray,
      setProps,
      container,
      setData,
      enabled,
      changeLabel3,
      onUpdate,
      changeLabel34,
      appendField,
      deleteField,
      e_Device,
      addRule,
      formvalue,
      remove_attach,
      handleSubmit,
      registerMyTable,
      handel_Add,
      handleSuccess,
      ActionType,
      dragging,
      logddd,
      EndData,
      TIndex,
      bcIndex,
      delete_rule,
      huix,
      DeviceIdArr
      // getForm
    };
  }
});
</script>
<style lang="less" scoped>
::v-deep(.ant-form-item) {
  padding: 10px;
  background: #F3F3F3;
}


.col_flex {
  display: flex;
  align-items: center;
}

.not-draggable {
  cursor: no-drop;
}
</style>

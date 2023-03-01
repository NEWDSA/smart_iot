<template>
  <PageWrapper title="触发条件">
    <template #extra>
      <Form :model="RuleForm">
        <Row class="enter-x col_flex">
          <Col :span="4">
          <FormItem name="switch" class="enter-x">
            <Switch v-model:checked="isShake" checked-children="边缘触发" un-checked-children="水平触发" />
          </FormItem>
          </Col>
        </Row>
      </Form>
    </template>
    <div class="rounded-md pt-5 pl-5 border">
      <template v-for="(item, index) in add" :key="index">
        <div class="flex justify-center items-center lc_liner" v-if="index > 0 && item.hasOwnProperty('checked1')">
          <div
            style="position: relative;display:flex;height: 35px;align-items: center;justify-content: center;width: 50px;">
            <svg style="position:absolute;" width="50" height="35">
              <line x1="50" y1="50" x2="50" y2="0" style="stroke:rgb(0,155,5);stroke-width:3" />
            </svg>
            <Switch style="position:absolute;left:50%;" checkedChildren="AND" v-model:checked="item.checked1"
              unCheckedChildren="OR"></Switch>
          </div>
        </div>
        <div v-if="item && item.schemas_normal.length > 0" id="schemas" class="border bg-light-100 p-4 lc_liner">
          <BasicForm v-if="item && item.schemas_normal.length > 0" :schemas="item.schemas_normal" @register="register">
            <template #customSlot="{ model, field }">
              <a-input @click="e_Device" placeholder="请选择设备" v-model:value="model[field]">
                <template #suffix>
                  <Icon icon="carbon:logo-github" />
                </template>
              </a-input>
            </template>
            <template v-if="item.FormAdd.length <= 0" #deleteSlot="{ model, field }">
              <Icon @click="delete_rule(index)" icon="ant-design:delete-outlined" />
            </template>
          </BasicForm>
          <template v-if="Object.keys(item.FormAdd) && item">
            <BasicForm v-for="(itemr, cindex) in item.FormAdd" id="filter_form" @get-form="formvalue(arg, index, cindex)"
              ref="formElRef" :schemas="itemr.schemas_normal" :key="itemr" @register="registerForm">
              <template #customSlot2="{ model, field }">
                <a-input @click="filter_Device(item, index)" placeholder="请选择设备" v-model:value="model[field]">
                  <template #suffix>
                    <Icon icon="carbon:logo-github" />
                  </template>
                </a-input>
              </template>
              <!-- 显示删除按钮 -->
              <template v-if="item.FormAdd.length > 0" #deleteSlot="{ model, field }">
                <Icon @click="delete_rule(index)" icon="ant-design:delete-outlined" />
              </template>
            </BasicForm>
          </template>
          <!-- 添加过滤条件 -->
          <div v-if="item && item.schemas_normal.length > 0" class="p-1 relative" @click="addRule(index)">
            <Icon icon="bi:plus" size="14" />
            添加过滤条件
          </div>
        </div>
      </template>
      <!-- 引入模态框 -->
      <AccountTable @register="registerMyTable" @success="handleSuccess" />
      <a-button type="primary" class="my-4" @click="handel_Add"> 添加条件 </a-button>
    </div>
  </PageWrapper>
</template>
<script lang="tsx">
import { defineComponent, reactive, ref, unref, nextTick, toRaw, watch } from 'vue'
import { Switch, Form, Input, Row, Col, InputNumber, Select } from 'ant-design-vue'
import { BasicForm, FormSchema, useForm, FormActionType } from '@/components/Form/index'
import { CollapseContainer } from '@/components/Container/index'
import { PageWrapper } from '@/components/Page'
import { Icon } from '@/components/Icon'
import AccountTable from './AccountTable.vue'
import { useModal } from '@/components/Modal'
import SelectItem from '@/layouts/default/setting/components/SelectItem.vue'
import { deviceInfo } from '@/api/demo/scence'
const [registerMyTable, { openModal }] = useModal()
import { error } from '@/utils/log'
const schemas: FormSchema[] = []
const add: any = ref([])
const params: any = ref([])
const result1: any = ref([])
const schemas_normal: FormSchema[] = [
  {
    field: 'ConditionItems',
    component: 'Select',
    label: '',
    colProps: {
      span: 3
    },
    componentProps: {
      options: [
        {
          label: '设备',
          value: '1',
          key: '1'
        },
        {
          label: '访客类型',
          value: '2',
          key: '2'
        },
        {
          label: '参数',
          value: '3',
          key: '3'
        },
        {
          label: '日期',
          value: '4',
          key: '4'
        },
        {
          label: '系统时间',
          value: '5',
          key: '5'
        },
        {
          label: '工单创建',
          value: '6',
          key: '6'
        },
        {
          label: '工单更新',
          value: '7',
          key: '7'
        }
      ]
    }
  },
  // 设备
  {
    field: 'device',
    label: '',
    component: 'Input',
    slot: 'customSlot',
    colProps: {
      span: 3
    },
    // 判断显示隐藏
    show: ({ values }) => {
      return values.ConditionItems == '1'
    }
  },
  // 工单
  {
    field: 'field3',
    component: 'Select',
    label: '',
    colProps: {
      span: 3
    },
    show: ({ values }) => {
      return values.field1 == '6' || values.field1 == '7'
    },
    componentProps: {
      placeholder: '请选择参数',
      options: [
        {
          label: '工单状态',
          value: '0',
          key: '0'
        },
        {
          label: '优先级',
          value: '1',
          key: '1'
        },
        {
          label: '受理组',
          value: '2',
          key: '2'
        },
        {
          label: '受理人',
          value: '3',
          key: '3'
        }
      ]
    }
  },
  {
    field: 'gStatus',
    component: 'Select',
    label: '',
    colProps: {
      span: 8
    },
    show: ({ values }) => {
      return values.field1 == '6' || values.field1 == '7'
    },
    componentProps: {
      options: [
        {
          label: '已更改',
          value: '1',
          key: '1'
        },
        {
          label: '更改为',
          value: '2',
          key: '2'
        },
        {
          label: '更改为',
          value: '2',
          key: '2'
        },
        {
          label: '未更改为',
          value: '3',
          key: '3'
        }
      ]
    }
  },
  // 紧急程度
  {
    field: 'urgent',
    component: 'Select',
    label: '',
    colProps: {
      span: 3
    },
    show: ({ values }) => {
      return values.field1 == '6' || values.field1 == '7'
    },
    componentProps: {
      options: [
        {
          label: '一般',
          value: '1',
          key: '1'
        },
        {
          label: '紧急',
          value: '2',
          key: '2'
        },
        {
          label: '非常紧急',
          value: '3',
          key: '3'
        }
      ]
    }
  }
]
const resultList: any = ref([]);
const formElRef = ref<Nullable<FormActionType>>(null);
const schemas_normal2: FormSchema[] = [
  {
    field: 'Op',
    component: 'Switch',
    defaultValue: false,
    label: '',
    colProps: {
      span: 2
    },
    componentProps: {
      checked: false,
      checkedChildren: 'And',
      unCheckedChildren: "OR"
    }
  },
  {
    field: 'ConditionItems',
    component: 'Select',
    label: '',
    colProps: {
      span: 3
    },
    componentProps: {
      onChange: (e) => {
        console.log(e, '333333333?')
      },
      options: [
        {
          label: '设备',
          value: '1',
          key: '1'
        },
        {
          label: '访客类型',
          value: '2',
          key: '2'
        },
        {
          label: '参数',
          value: '3',
          key: '3'
        },
        {
          label: '日期',
          value: '4',
          key: '4'
        },
        {
          label: '系统时间',
          value: '5',
          key: '5'
        },
        {
          label: '工单创建',
          value: '6',
          key: '6'
        },
        {
          label: '工单更新',
          value: '7',
          key: '7'
        }
      ]
    }
  },
  // 设备
  {
    field: 'device',
    label: '',
    component: 'Input',
    slot: 'customSlot2',
    colProps: {
      span: 3
    },
    // 判断显示隐藏
    show: ({ values }) => {
      return values.ConditionItems == '1'
    }
  },
  // 工单
  {
    field: 'field3',
    component: 'Select',
    label: '',
    colProps: {
      span: 3
    },
    show: ({ values }) => {
      return values.field1 == '6' || values.field1 == '7'
    },
    componentProps: {
      placeholder: '请选择参数',
      options: [
        {
          label: '工单状态',
          value: '0',
          key: '0'
        },
        {
          label: '优先级',
          value: '1',
          key: '1'
        },
        {
          label: '受理组',
          value: '2',
          key: '2'
        },
        {
          label: '受理人',
          value: '3',
          key: '3'
        }
      ]
    }
  },
  {
    field: 'gStatus',
    component: 'Select',
    label: '',
    colProps: {
      span: 8
    },
    show: ({ values }) => {
      return values.field1 == '6' || values.field1 == '7'
    },
    componentProps: {
      options: [
        {
          label: '已更改',
          value: '1',
          key: '1'
        },
        {
          label: '更改为',
          value: '2',
          key: '2'
        },
        {
          label: '更改为',
          value: '2',
          key: '2'
        },
        {
          label: '未更改为',
          value: '3',
          key: '3'
        }
      ]
    }
  },
  // 紧急程度
  {
    field: 'urgent',
    component: 'Select',
    label: '',
    colProps: {
      span: 3
    },
    show: ({ values }) => {
      return values.field1 == '6' || values.field1 == '7'
    },
    componentProps: {
      options: [
        {
          label: '一般',
          value: '1',
          key: '1'
        },
        {
          label: '紧急',
          value: '2',
          key: '2'
        },
        {
          label: '非常紧急',
          value: '3',
          key: '3'
        }
      ]
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
]
const showForm = ref(false)
const schemas2: FormSchema[] = [
  {
    field: 'filed1',
    label: '',
    component: 'Switch',
    slot: 'switchSlot'
  },
  {
    field: 'field3',
    component: 'Input',
    label: '',
    colProps: {
      span: 3
    },
    componentProps: {
      placeholder: '自定义placeholder',
      onChange: (e) => {
        console.log(e)
      }
    }
  }
]
const FormAdd: any = reactive([])
const FormItem = Form.Item
const options1 = ref([
  {
    value: 'jack',
    label: 'jack'
  }
])
const fApi: any = ref({})
const value: any = ref({})
const options: any = {
  onSubmit: (formData) => {
    alert(JSON.stringify(formData))
  },
  submitBtn: false
}
const ruler: any = [
  {
    type: 'input',
    title: 'col24',
    field: 'col24_1',
    width: '100px',
    col: {
      "span": 4
    }
  },
  {
    type: 'input',
    title: 'col12',
    field: 'col12_1',
    col: {
      md: {
        span: 6
      }
    }
  },
  // {
  //   type: 'object',
  //   field: 'object',
  //   title: 'object',
  //   value: {
  //     field1: 'aaa', field2: 'sss', col: {
  //       span: 8
  //     }
  //   },
  //   props: {
  //     rule: [
  //       {
  //         type: 'input', field: 'field1', title: 'field1', col: {
  //           span: 8
  //         }
  //       },
  //       {
  //         type: 'input', field: 'field2', title: 'field2', col: {
  //           span: 8
  //         }
  //       }
  //     ]
  //   }
  // }
]
const options2 = ref([
  {
    label: '设备',
    value: '1',
    key: '1'
  },
  {
    label: '访客类型',
    value: '2',
    key: '2'
  },
  {
    label: '参数',
    value: '3',
    key: '3'
  },
  {
    label: '日期',
    value: '4',
    key: '4'
  },
  {
    label: '系统时间',
    value: '5',
    key: '5'
  },
  {
    label: '工单创建',
    value: '6',
    key: '6'
  },
  {
    label: '工单更新',
    value: '7',
    key: '7'
  }
])
const options3 = ref([
  {
    value: '>',
    label: '大于'
  },
  {
    value: '>=',
    label: '大于等于'
  },
  {
    value: '<',
    label: '小于'
  },
  {
    value: '<=',
    label: '小于等于'
  }
])
const isShake = ref(false)
const RuleForm = reactive([
  {
    switch: ''
  }
])
const formData: any = ref({})
const formConfig: any = ref({
  formItems: [
    {
      type: 'input',
      label: '姓名',
      field: 'name',
      span: 24,
      props: {
        type: 'text'
      }
    }
  ]
})
export default defineComponent({
  components: {
    BasicForm,
    CollapseContainer,
    PageWrapper,
    Icon,
    Switch,
    AccountTable,
    InputNumber,
    Input,
    Row,
    Col,
    Select,
    SelectItem
  },
  setup(_, { emit }) {
    const [
      register,
      { appendSchemaByField, setProps, updateSchema, setFieldsValue, getFieldsValue, validate: validateTaskForm }
    ] = useForm({
      labelWidth: 0,
      showActionButtonGroup: false,
      actionColOptions: {
        span: 6
      }
    })
    watch(add, (newValue, oldValue) => {
      console.log('person的值变化了', newValue, oldValue)
      if (newValue !== oldValue) {

      }
    }, { deep: true }) // 开启深度监视才行
    const [
      registerForm,
      {
        validate,
        appendSchemaByField: appendMySchemaByField,
        setFieldsValue: setMyFieldsValue,
        getFieldsValue: getMyFieldsValue
      }
    ] = useForm({
      labelWidth: 0,
      showActionButtonGroup: false,
      actionColOptions: {
        span: 6
      }
    })
    async function formvalue(arg, index, cindex) {
      console.log(cindex, 'eeee')
      console.log(arg, index, cindex, '...value..232.?');
      console.log(cindex, 'cindex', index, 'index', resultList.value, 'rrrr')
      // const result = getFieldsValue();
      const result2 = getMyFieldsValue();
      // var index=index+1;
      resultList.value[cindex][index].result2 = {
        ...result2
      }


      // 如果不存在这个属性则
      console.log(resultList.value[index], '...dfdfdfdf')
      // }



    }
    async function getForm() {
      const form = unref(formElRef)
      if (!form) {
        error(
          'The form instance has not been obtained, please make sure that the form has been rendered when performing the form operation!'
        )
      }
      await nextTick()
      return form as FormActionType
    }
    async function filter_Device(item, index) {
      openModal(true, {
        item: item,
        itemindex: index,
        isUpdate: true
      })
    }

    function handel_Add() {

      // 
      if (add.value.length > 0) {
        console.log(add.value, '..2223333...?')
        add.value.push({
          FormAdd: [],
          checked1: false,
          schemas_normal: schemas_normal
        })
      } else {
        add.value.push({
          FormAdd: [],
          schemas_normal: schemas_normal
        })
      }
    }
    async function delete_rule(index) {
      delete add.value[index].checked1

      add.value[index].schemas_normal = []
      add.value[index].FormAdd = []
    }
    async function handleSuccess(params) {
      const obj = { ...params }
      // 根据所选择的设备进行设备id查询
      const result = await deviceInfo({
        Id: obj[0][0].DeviceId
      })

      // 判断对象是否包含该属性
      // Reflect.has(obj[1], 'itemindex')
      if (obj[1].hasOwnProperty('itemindex')) {
        let FormSchema = JSON.parse(result[0]?.DeviceModel)
        console.log(FormSchema, '?...FormSchema...?')
        setMyFieldsValue({
          device: obj[0][0].DeviceName
        })
        let myobj: any = [];
        FormSchema.forEach(async (item, index) => {
          myobj.push({
            name: item.model.name,
            value: index
          })
        })
        appendMySchemaByField({
          field: 'myfiled',
          component: 'Select',
          label: '',
          colProps: {
            span: 3
          },
          componentProps: {
            fieldNames: {
              label: 'name',
              key: 'value',
              value: 'value'
            },
            options: myobj
          },
          show: ({ values }) => {
            return values.ConditionItems == '1'
          }
        }, 'device')
        FormSchema.forEach(async (item, index) => {
          
          // slide
          if (item.model.view == 'slide') {
            appendMySchemaByField({
              field: item.model.field,
              component: 'Slider',
              label: '',
              defaultValue: item.model['default-value'],
              colProps: {
                span: 3
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
              show: ({ values }) => {
                return values.myfiled == index
              }
            }, 'myfiled')
          } else {
            appendMySchemaByField({
              field: item.model.field,
              component: item.model.view.charAt(0).toUpperCase() + item.model.view.slice(1),
              label: '',
              defaultValue: item.model['default-value'],
              colProps: {
                span: 3
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
              show: ({ values }) => {
                return values.myfiled == index
              }
            }, 'myfiled')
          }

        })
      }
      else if (typeof result[0]?.DeviceModel !== 'undefined' && !Reflect.has(obj[1], 'item')) {
        let FormSchema = JSON.parse(result[0]?.DeviceModel)
        setFieldsValue({
          device: obj[0][0].DeviceName
        })
        FormSchema.forEach((item, index) => {
          // 使用updateSchema添加
          appendSchemaByField(
            {
              field: item.model.field,
              component: item.model.view.charAt(0).toUpperCase() + item.model.view.slice(1),
              label: '',
              defaultValue: item.model['default-value'],
              colProps: {
                span: 3
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
              show: ({ values }) => {
                return values.ConditionItems == index
              }
            },
            'device'
          )
        })
      } else {
        console.log('1111')
      }
    }
    function changeLabel3() {
      updateSchema({
        field: 'field3',
        label: '字段3 New'
      })
    }
    function changeLabel34() {
      updateSchema([
        {
          field: 'field3',
          label: '字段3 New++'
        },
        {
          field: 'field4',
          label: '字段4 New++'
        }
      ])
    }
    function remove_attach(index, cindex) {
      delete add.value[index].FormAdd[cindex]
    }
    function appendField() { }
    function deleteField() {
      // removeSchemaByField('field11');
    }
    // 选择设备
    function e_Device(record) {
      //  打开弹窗
      openModal(true, {
        isUpdate: true
      })
    }
    // 添加规则
    async function addRule(index1) {
      add.value.map((item, index) => {
        if (index == index1) {
          item.FormAdd.push({ schemas_normal: schemas_normal2 })
        }
        return item
      })
      const result = getFieldsValue();
      const result2 = getMyFieldsValue();
      resultList.value.push({
        [index1]: {
          result,
          result2
        }
      }
      )
      // 添加过滤规则获取当前下标
      console.log(resultList, '..dd')
    }
    // function getfileData() {
    //   const result = getFieldsValue();
    //   const result2 = getMyFieldsValue();
    //   resultList.value.push({
    //     [index1]: {
    //       result,
    //       result2
    //     }
    //   }
    //   )
    // }
    function handleSubmit(values: any) {
      console.log(values, '?...values...?')
    }
    return {
      formData,
      formConfig,
      register,
      registerForm,
      schemas,
      fApi,
      value,
      ruler,
      options,
      schemas_normal,
      schemas_normal2,
      schemas2,
      showForm,
      FormItem,
      formElRef,
      FormAdd,
      RuleForm,
      options1,
      options2,
      options3,
      isShake,
      add,
      formvalue,
      filter_Device,
      getForm,
      delete_rule,
      setProps,
      changeLabel3,
      changeLabel34,
      appendField,
      deleteField,
      e_Device,
      addRule,
      resultList,
      result1,
      params,
      remove_attach,
      handleSubmit,
      registerMyTable,
      handel_Add,
      handleSuccess
    }
  }
})
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

.lc_liner {
  position: relative;
  width: 85%;
}
</style>

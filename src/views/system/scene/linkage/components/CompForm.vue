<template>
  <PageWrapper title="触发条件">
    <template #extra>
      <Form :model="RuleForm">
        <Row class="enter-x col_flex">
          <Col :span="4">
          <FormItem name="switch" class="enter-x pp">
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
            <!-- <svg style="position:absolute;" width="50" height="35">
              <line x1="50" y1="50" x2="50" y2="0" style="stroke:rgb(0,155,5);stroke-width:3" />
            </svg> -->
            <Switch style="position:absolute;left:50%;" checkedChildren="AND" v-model:checked="item.checked1"
              unCheckedChildren="OR"></Switch>
          </div>
        </div>
        <div v-if="item && item.schemas_normal.length > 0" id="schemas" class="border bg-light-100 p-4 lc_liner">

          <BasicForm v-if="item && item.schemas_normal.length > 0" :schemas="item.schemas_normal" @register="register"
            ref="FformElRef" @get-form="formvalueFF(arg, index)" class="m l-10">
            <template #deleteSlot="{ model, field }">
              <div class="w-8 h-8 mr-2 flex justify-center items-center"
                style="border-radius: 50%;border:3px solid black;">
                {{ index + 1 }}
              </div>
            </template>
            <template #customSlot="{ model, field }">
              <a-input @click="e_Device(index)" placeholder="请选择设备" v-model:value="model[field]">
                <!-- <template #suffix>
                  <Icon icon="carbon:logo-github" />
                </template> -->
              </a-input>
            </template>
            <template #customSlot11="{ model, field }">
              <a-input @click="e_Device(index, 1)" placeholder="请选择设备" v-model:value="model[field]">
                <!-- <template #suffix>
                  <Icon icon="carbon:logo-github" />
                </template> -->
              </a-input>
            </template>
          </BasicForm>
          <template v-if="Object.keys(item.FormAdd) && item">
            <BasicForm v-for="(itemr, cindex) in item.FormAdd" id="filter_form" @get-form="formvalue(arg, index, cindex)"
              ref="formElRef" :schemas="itemr.schemas_normal" :key="itemr" @register="registerForm">
              <template #customSlot2="{ model, field }">
                <a-input @click="filter_Device(item, index, cindex)" placehol der="请选择设备" v-model:value="model[field]">
                  <!-- <template #suffix>
                    <Icon icon="carbon:logo-github" />
                  </template> -->
                </a-input>
              </template>
              <template #customSlot22="{ model, field }">
                <a-input @click="filter_Device(item, index, cindex, 1)" placehol der="请选择设备" v-model:value="model[field]">
                  <!-- <template #suffix>
                    <Icon icon="carbon:logo-github" />
                  </template> -->
                </a-input>
              </template>
              <!-- 显示删除按钮 -->
              <template v-if="item.FormAdd.length > 0" #deleteSlot="{ model, field }">
                <Icon @click="delete_rule_zi(index, cindex)" class="ml-2" icon="ant-design:delete-outlined" />
              </template>
            </BasicForm>
          </template>
          <!-- 添加过滤条件 -->
          <div v-if="item && item.schemas_normal.length > 0" class="p-1 relative flex items-center justify-between">
            <div @click="addRule(index)">
              <Icon icon="bi:plus" size="14" />
              添加过滤条件
            </div>

            <Icon @click="delete_rule(index)" icon="ant-design:delete-outlined" color="red" size="20px" />
          </div>
        </div>

      </template>
      <!-- 引入模态框 -->
      <AccountTable @register="registerMyTable" @success="handleSuccess" @successFF="handleSuccessFK" />
      <a-button type="primary" class="my-4" @click="handel_Add"> 添加条件 </a-button>
    </div>
  </PageWrapper>
</template>
<script lang="tsx">
import { defineComponent, reactive, onMounted, onUpdated, ref, unref, nextTick, toRaw, watch, defineExpose } from 'vue'
import { Switch, Form, Input, Row, Col, InputNumber, Select, message } from 'ant-design-vue'
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
import { visitorTypeListApi } from '@/api/visitor/visitor';
import { on } from 'events'
import { Item } from 'ant-design-vue/lib/menu'
import { filterOption } from 'ant-design-vue/lib/vc-mentions/src/util'
const schemas: FormSchema[] = []
const FformArr: any = ref([])
const formArr: any = ref([])
const add: any = ref([])
const params: any = ref([])
const result1: any = ref([])
const FIndex = ref()
const ZIndex = ref()
const DeviceIdArr: any = ref([])
const VisitorIdArr: any = ref([])
const RegionIdArr:any = ref([])
const VisitorTypeArr = ref([])
visitorTypeListApi().then(res => {
  VisitorTypeArr.value = res.Detail
})
// console.log(VisitorTypeArr,'VisitorTypeArr')

const schemas_normal: FormSchema[] = [
  {
    field: 'delete',
    label: '',
    component: 'Input',
    slot: 'deleteSlot',
    colProps: {
      span: 1
    }
  },
  {
    field: 'ConditionType',
    component: 'Select',
    label: '',
    colProps: {
      span: 4
    },
    componentProps: {
      options: [
        {
          label: '设备',
          value: 1,
          key: '1'
        },
        {
          label: '访客',
          value: 2,
          key: '2'
        },
        {
          label: '参数',
          value: 3,
          key: '3'
        },
        {
          label: '日期',
          value: 4,
          key: '4'
        },
        {
          label: '时间',
          value: 5,
          key: '5'
        },
        {
          label: '工单创建',
          value: 6,
          key: '6'
        },
        {
          label: '工单更新',
          value: 7,
          key: '7'
        }
      ]
    }
  },
  // 设备
  {
    field: 'DeviceId',
    label: '',
    component: 'Input',
    slot: 'customSlot',
    colProps: {
      span: 8
    },
    // 判断显示隐藏
    ifShow: ({ values }) => {
      return false
    }
  },
  {
    field: 'DeviceName',
    label: '',
    component: 'Input',
    slot: 'customSlot',
    colProps: {
      span: 8
    },
    // 判断显示隐藏
    ifShow: ({ values }) => {
      return values.ConditionType == '1'
    }
  },
  {
    field: 'DeviceSerial',
    label: '',
    component: 'Input',
    slot: 'customSlot',
    colProps: {
      span: 8
    },
    // 判断显示隐藏
    ifShow: ({ values }) => {
      return false
    }
  },
  {
    field: 'RegionId',
    label: '',
    component: 'Input',
    slot: 'customSlot',
    colProps: {
      span: 8
    },
    // 判断显示隐藏
    ifShow: ({ values }) => {
      return false
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
    ifShow: ({ values }) => {
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
    ifShow: ({ values }) => {
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
    ifShow: ({ values }) => {
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
  // 时间5
  {
    field: 'checkTime',
    label: '',
    component: 'Select',
    colProps: {
      span: 4,
    },
    componentProps: {
      options: [
        {
          label: '上报时间',
          value: 1,
          key: '1'
        },
        {
          label: '系统时间',
          value: 2,
          key: '2'
        },
      ]
    },
    // 判断显示隐藏
    ifShow: ({ values }) => {
      return values.ConditionType == '5'
    }
  },
  {
    field: 'checkTimeSymbol',
    label: '',
    component: 'Select',
    colProps: {
      span: 4,
    },
    componentProps: {
      options: [
        {
          value: '==',
          label: '等于'
        },
        {
          value: '!=',
          label: '不等于'
        },
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
        },
        {
          value: 'between',
          label: '在...之间'
        }
      ]
    },
    // 判断显示隐藏
    ifShow: ({ values }) => {
      return values.ConditionType == '5'
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
      return values.ConditionType == '5' && values.checkTimeSymbol != 'between';
    }
  },
  {
    field: 'StartTime',
    component: 'TimePicker',
    label: ' ',
    labelWidth: '10px',
    colProps: {
      span: 3
    },
    componentProps: {
      format: 'HH:mm',
      valueFormat: 'HH:mm',
      placeholder: '请选择开始时间',
    },
    show: ({ values }) => {
      return values.ConditionType == '5' && values.checkTimeSymbol == 'between';
    }
  },
  {
    field: 'EndTime',
    component: 'TimePicker',
    label: '~',
    labelWidth: '20px',
    colProps: {
      span: 3
    },
    componentProps: {
      format: 'HH:mm',
      valueFormat: 'HH:mm',
      placeholder: '请选择结束时间',
    },
    show: ({ values }) => {
      return values.ConditionType == '5' && values.checkTimeSymbol == 'between';
    }
  },
  // 日期4
  {
    field: 'checkTime',
    label: '',
    component: 'Select',
    colProps: {
      span: 4,
    },
    componentProps: {
      options: [
        {
          label: '上报时间',
          value: 1,
          key: '1'
        },
        {
          label: '系统时间',
          value: 2,
          key: '2'
        },
      ]
    },
    // 判断显示隐藏
    ifShow: ({ values }) => {
      return values.ConditionType == '4'
    }
  },
  {
    field: 'checkTimeSymbol',
    label: '',
    component: 'Select',
    colProps: {
      span: 4,
    },
    componentProps: {
      options: [
        {
          value: '==',
          label: '等于'
        },
        {
          value: '!=',
          label: '不等于'
        },
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
        },
        {
          value: 'between',
          label: '在...之间'
        }
      ]
    },
    // 判断显示隐藏
    ifShow: ({ values }) => {
      return values.ConditionType == '4'
    }
  },
  {
    field: 'checkDateRange',
    component: 'RangePicker',
    label: ' ',
    labelWidth: '10px',
    colProps: {
      span: 10
    },
    componentProps: {
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      // placeholder: '请选择结束时间',
    },
    show: ({ values }) => {
      return values.ConditionType == '4' && values.checkTime == 2 && values.checkTimeSymbol == 'between';
    }
  },
  {
    field: 'checkDate',
    component: 'DatePicker',
    label: ' ',
    labelWidth: '10px',
    colProps: {
      span: 6
    },
    componentProps: {
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      placeholder: '请选择结束时间',
    },
    show: ({ values }) => {
      return values.ConditionType == '4' && values.checkTime == 2 && values.checkTimeSymbol != 'between';
    }
  },
  // {
  //   field: 'checkDateWeek',
  //   component: 'Select',
  //   label: ' ',
  //   labelWidth: '10px',
  //   colProps: {
  //     span: 7
  //   },
  //   componentProps: {
  //     mode: 'multiple',
  //     placeholder: '请选择日期',
  //     maxTagCount: 2,
  //     options: [
  //       {
  //         label: '星期一',
  //         value: 1
  //       },
  //       {
  //         label: '星期二',
  //         value: 2
  //       },
  //       {
  //         label: '星期三',
  //         value: 3
  //       },
  //       {
  //         label: '星期四',
  //         value: 4
  //       },
  //       {
  //         label: '星期五',
  //         value: 5
  //       },
  //       {
  //         label: '星期六',
  //         value: 6
  //       },
  //       {
  //         label: '星期日',
  //         value: 7
  //       }
  //     ]
  //   },

  //   show: ({ values }) => {
  //     return values.ConditionType == 4 && values.checkTime == 1 && values.checkTimeSymbol != 'between';
  //   }
  // },
  // {
  //   field: 'StartTimeWeek',
  //   component: 'Select',
  //   label: ' ',
  //   labelWidth: '10px',
  //   colProps: {
  //     span: 5
  //   },
  //   componentProps: {
  //     // componentProps: {
  //     placeholder: '请选择日期',
  //     options: [
  //       {
  //         label: '星期一',
  //         value: 1
  //       },
  //       {
  //         label: '星期二',
  //         value: 2
  //       },
  //       {
  //         label: '星期三',
  //         value: 3
  //       },
  //       {
  //         label: '星期四',
  //         value: 4
  //       },
  //       {
  //         label: '星期五',
  //         value: 5
  //       },
  //       {
  //         label: '星期六',
  //         value: 6
  //       },
  //       {
  //         label: '星期日',
  //         value: 7
  //       }
  //     ]
  //     // },
  //     // placeholder: '请选择开始时间',

  //   },
  //   show: ({ values }) => {
  //     return values.ConditionType == 4 && values.checkTime == 1 && values.checkTimeSymbol == 'between';
  //   }
  // },
  // {
  //   field: 'EndTimeWeek',
  //   component: 'Select',
  //   label: '~',
  //   labelWidth: '13px',
  //   colProps: {
  //     span: 5
  //   },
  //   componentProps: {
  //     // componentProps: {
  //     placeholder: '请选择日期',
  //     options: [
  //       {
  //         label: '星期一',
  //         value: 1
  //       },
  //       {
  //         label: '星期二',
  //         value: 2
  //       },
  //       {
  //         label: '星期三',
  //         value: 3
  //       },
  //       {
  //         label: '星期四',
  //         value: 4
  //       },
  //       {
  //         label: '星期五',
  //         value: 5
  //       },
  //       {
  //         label: '星期六',
  //         value: 6
  //       },
  //       {
  //         label: '星期日',
  //         value: 7
  //       }
  //     ]
  //     // },
  //     // placeholder: '请选择结束时间',

  //   },
  //   show: ({ values }) => {
  //     return values.ConditionType == 4 && values.checkTime == 1 && values.checkTimeSymbol == 'between';
  //   }
  // },
  // 工单创建 6
  {
    field: 'workOrderSet',
    label: '',
    component: 'Select',
    colProps: {
      span: 4,
    },
    componentProps: {
      options: [
        {
          value: 'status',
          label: '工单状态'
        },
        {
          value: 'priority',
          label: '优先级'
        },
        {
          value: 'AcceptanceGroup',
          label: '受理组'
        },
        {
          value: 'Acceptor',
          label: '受理人'
        },
      ]
    },
    // 判断显示隐藏
    ifShow: ({ values }) => {
      return values.ConditionType == '6'
    }
  },
  {
    field: 'workOrderStatus',
    label: '',
    component: 'Select',
    colProps: {
      span: 4,
    },
    componentProps: {
      options: [
        {
          value: '1',
          label: '已完结'
        },
        {
          value: '2',
          label: '受理中'
        },
      ]
    },
    // 判断显示隐藏
    ifShow: ({ values }) => {
      return values.ConditionType == '6' && values.workOrderSet == 'status'
    }
  },
  {
    field: 'workOrderPriority',
    label: '',
    component: 'Select',
    colProps: {
      span: 4,
    },
    componentProps: {
      options: [
        {
          value: '1',
          label: '底'
        },
        {
          value: '2',
          label: '一般'
        },
        {
          value: '3',
          label: '紧急'
        },
        {
          value: '4',
          label: '非常紧急'
        },
      ]
    },
    // 判断显示隐藏
    ifShow: ({ values }) => {
      return values.ConditionType == '6' && values.workOrderSet == 'priority'
    }
  },
  {
    field: 'workOrderPriority',
    label: '',
    component: 'Select',
    colProps: {
      span: 4,
    },
    componentProps: {
      mode: 'multiple',
      options: [
        {
          value: '1',
          label: '底'
        },
        {
          value: '2',
          label: '一般'
        },
        {
          value: '3',
          label: '紧急'
        },
        {
          value: '4',
          label: '非常紧急'
        },
      ]
    },
    // 判断显示隐藏
    ifShow: ({ values }) => {
      return values.ConditionType == '6' && values.workOrderSet == 'priority'
    }
  },
  {
    field: 'workOrderAcceptanceGroup',
    label: '',
    component: 'Input',
    slot: 'customSlotAcceptanceGroup',
    colProps: {
      span: 8
    },
    // 判断显示隐藏
    ifShow: ({ values }) => {
      return values.ConditionType == '6' && values.workOrderSet == 'AcceptanceGroup'
    }
  },
  {
    field: 'workOrderAcceptor',
    label: '',
    component: 'Input',
    slot: 'customSlotAcceptor',
    colProps: {
      span: 8
    },
    // 判断显示隐藏
    ifShow: ({ values }) => {
      return values.ConditionType == '6' && values.workOrderSet == 'Acceptor'
    }
  },
  // 访客 2
  // 设备
  {
    field: 'DeviceId',
    label: '',
    component: 'Input',
    slot: 'customSlot11',
    colProps: {
      span: 8
    },
    // 判断显示隐藏
    ifShow: ({ values }) => {
      return false
    }
  },
  {
    field: 'DeviceName',
    label: '',
    component: 'Input',
    slot: 'customSlot11',
    colProps: {
      span: 8
    },
    // 判断显示隐藏
    ifShow: ({ values }) => {
      return values.ConditionType == 2
    }
  },
  {
    field: 'DeviceSerial',
    label: '',
    component: 'Input',
    slot: 'customSlot11',
    colProps: {
      span: 8
    },
    // 判断显示隐藏
    ifShow: ({ values }) => {
      return false
    }
  },
  {
    field: 'RegionId',
    label: '',
    component: 'Input',
    slot: 'customSlot11',
    colProps: {
      span: 8
    },
    // 判断显示隐藏
    ifShow: ({ values }) => {
      return false
    }
  },
  {
    field: 'visitor',
    label: '',
    component: 'Select',
    colProps: {
      span: 4,
    },
    componentProps: {
      options: [
        {
          value: 1,
          label: '访客类型'
        },
        {
          value: 2,
          label: '车牌号'
        },
      ],
    },
    // 判断显示隐藏
    ifShow: ({ values }) => {
      return values.ConditionType == 2
    }
  },
  {
    field: 'VisitorType',
    label: '为',
    component: 'Select',
    colProps: {
      span: 4,
    },
    componentProps: {
      showSearch: true,
      options: VisitorTypeArr,
      fieldNames: {
        label: 'VisitorTypeName', value: 'VisitorTypeId'
      }
    },
    // 判断显示隐藏
    ifShow: ({ values }) => {
      return values.ConditionType == 2 && values.visitor == 1
    }
  },
  {
    field: 'plateNumber',
    label: '',
    component: 'Input',
    colProps: {
      span: 4,
    },
    componentProps: {
    },
    // 判断显示隐藏
    ifShow: ({ values }) => {
      return values.ConditionType == 2 && values.visitor == 2
    }
  },
]
const resultList: any = ref([]);
const formElRef: any = ref<Nullable<FormActionType>>(null);
const FformElRef: any = ref<Nullable<FormActionType>>(null);

const schemas_normal2: FormSchema[] = [
  {
    field: 'Option',
    component: 'Switch',
    defaultValue: false,
    label: '',
    colProps: {
      span: 2
    },
    componentProps: {
      checked: false,
      checkedChildren: 'AND',
      unCheckedChildren: "OR"
    }
  },
  {
    field: 'ConditionType',
    component: 'Select',
    label: '',
    colProps: {
      span: 4
    },
    componentProps: {
      onChange: (e) => {
        console.log(e, '333333333?')
      },
      options: [
        {
          label: '设备',
          value: 1,
          key: '1'
        },
        {
          label: '访客',
          value: 2,
          key: '2'
        },
        {
          label: '参数',
          value: 3,
          key: '3'
        },
        {
          label: '日期',
          value: 4,
          key: '4'
        },
        {
          label: '系统时间',
          value: 5,
          key: '5'
        },
        {
          label: '工单创建',
          value: 6,
          key: '6'
        },
        {
          label: '工单更新',
          value: 7,
          key: '7'
        }
      ]
    }
  },
  // 设备
  {
    field: 'DeviceId',
    label: '',
    component: 'Input',
    slot: 'customSlot2',
    colProps: {
      span: 8
    },
    // 判断显示隐藏
    ifShow: ({ values }) => {
      return false
    }
  },
  {
    field: 'DeviceName',
    label: '',
    component: 'Input',
    slot: 'customSlot2',
    colProps: {
      span: 8
    },
    // 判断显示隐藏
    ifShow: ({ values }) => {
      return values.ConditionType == '1'
    }
  },
  {
    field: 'DeviceSerial',
    label: '',
    component: 'Input',
    slot: 'customSlot2',
    colProps: {
      span: 8
    },
    // 判断显示隐藏
    ifShow: ({ values }) => {
      return false
    }
  },
  {
    field: 'RegionId',
    label: '',
    component: 'Input',
    slot: 'customSlot2',
    colProps: {
      span: 8
    },
    // 判断显示隐藏
    ifShow: ({ values }) => {
      return false
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
    ifShow: ({ values }) => {
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
    ifShow: ({ values }) => {
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
    ifShow: ({ values }) => {
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
  // 访客 2
  // 设备
  {
    field: 'DeviceId',
    label: '',
    component: 'Input',
    slot: 'customSlot22',
    colProps: {
      span: 8
    },
    // 判断显示隐藏
    ifShow: ({ values }) => {
      return false
    }
  },
  {
    field: 'DeviceName',
    label: '',
    component: 'Input',
    slot: 'customSlot22',
    colProps: {
      span: 8
    },
    // 判断显示隐藏
    ifShow: ({ values }) => {
      return values.ConditionType == 2
    }
  },
  {
    field: 'DeviceSerial',
    label: '',
    component: 'Input',
    slot: 'customSlot22',
    colProps: {
      span: 8
    },
    // 判断显示隐藏
    ifShow: ({ values }) => {
      return false
    }
  },
  {
    field: 'RegionId',
    label: '',
    component: 'Input',
    slot: 'customSlot22',
    colProps: {
      span: 8
    },
    // 判断显示隐藏
    ifShow: ({ values }) => {
      return false
    }
  },
  {
    field: 'visitor',
    label: '',
    component: 'Select',
    colProps: {
      span: 4,
    },
    componentProps: {
      options: [
        {
          value: 1,
          label: '访客类型'
        },
        {
          value: 2,
          label: '车牌号'
        },
      ],
    },
    // 判断显示隐藏
    ifShow: ({ values }) => {
      return values.ConditionType == 2
    }
  },
  {
    field: 'VisitorType',
    label: '为',
    component: 'Select',
    colProps: {
      span: 4,
    },
    componentProps: {
      showSearch: true,
      options: VisitorTypeArr,
      fieldNames: {
        label: 'VisitorTypeName', value: 'VisitorTypeId'
      }
    },
    // 判断显示隐藏
    ifShow: ({ values }) => {
      return values.ConditionType == 2 && values.visitor == 1
    }
  },
  {
    field: 'plateNumber',
    label: '',
    component: 'Input',
    colProps: {
      span: 4,
    },
    componentProps: {
    },
    // 判断显示隐藏
    ifShow: ({ values }) => {
      return values.ConditionType == 2 && values.visitor == 2
    }
  },
  // 时间5
  {
    field: 'checkTime',
    label: '',
    component: 'Select',
    colProps: {
      span: 4,
    },
    componentProps: {
      options: [
        {
          label: '上报时间',
          value: 1,
          key: '1'
        },
        {
          label: '系统时间',
          value: 2,
          key: '2'
        },
      ]
    },
    // 判断显示隐藏
    ifShow: ({ values }) => {
      return values.ConditionType == '5'
    }
  },
  {
    field: 'checkTimeSymbol',
    label: '',
    component: 'Select',
    colProps: {
      span: 4,
    },
    componentProps: {
      options: [
        {
          value: '==',
          label: '等于'
        },
        {
          value: '!=',
          label: '不等于'
        },
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
        },
        {
          value: 'between',
          label: '在...之间'
        }
      ]
    },
    // 判断显示隐藏
    ifShow: ({ values }) => {
      return values.ConditionType == '5'
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
      return values.ConditionType == '5' && values.checkTimeSymbol != 'between';
    }
  },
  {
    field: 'StartTime',
    component: 'TimePicker',
    label: ' ',
    labelWidth: '10px',
    colProps: {
      span: 3
    },
    componentProps: {
      format: 'HH:mm',
      valueFormat: 'HH:mm',
      placeholder: '请选择开始时间',
    },
    show: ({ values }) => {
      return values.ConditionType == '5' && values.checkTimeSymbol == 'between';
    }
  },
  {
    field: 'EndTime',
    component: 'TimePicker',
    label: '~',
    labelWidth: '20px',
    colProps: {
      span: 3
    },
    componentProps: {
      format: 'HH:mm',
      valueFormat: 'HH:mm',
      placeholder: '请选择结束时间',
    },
    show: ({ values }) => {
      return values.ConditionType == '5' && values.checkTimeSymbol == 'between';
    }
  },
  // 日期4
  {
    field: 'checkTime',
    label: '',
    component: 'Select',
    colProps: {
      span: 4,
    },
    componentProps: {
      options: [
        // {
        //   label: '按周',
        //   value: 1,
        //   key: '1'
        // },
        {
          label: '系统时间',
          value: 2,
          key: '2'
        },
      ]
    },
    // 判断显示隐藏
    ifShow: ({ values }) => {
      return values.ConditionType == '4'
    }
  },
  {
    field: 'checkTimeSymbol',
    label: '',
    component: 'Select',
    colProps: {
      span: 4,
    },
    componentProps: {
      options: [
        {
          value: '==',
          label: '等于'
        },
        {
          value: '!=',
          label: '不等于'
        },
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
        },
        {
          value: 'between',
          label: '在...之间'
        }
      ]
    },
    // 判断显示隐藏
    ifShow: ({ values }) => {
      return values.ConditionType == '4'
    }
  },
  {
    field: 'checkDateRange',
    component: 'RangePicker',
    label: ' ',
    labelWidth: '10px',
    colProps: {
      span: 12
    },
    componentProps: {
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      // placeholder: '请选择结束时间',
    },
    show: ({ values }) => {
      return values.ConditionType == '4' && values.checkTime == 2 && values.checkTimeSymbol == 'between';
    }
  },
  {
    field: 'checkDate',
    component: 'DatePicker',
    label: ' ',
    labelWidth: '10px',
    colProps: {
      span: 6
    },
    componentProps: {
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      placeholder: '请选择结束时间',
    },
    show: ({ values }) => {
      return values.ConditionType == '4' && values.checkTime == 2 && values.checkTimeSymbol != 'between';
    }
  },
  // {
  //   field: 'checkDateWeek',
  //   component: 'Select',
  //   label: ' ',
  //   labelWidth: '10px',
  //   colProps: {
  //     span: 7
  //   },
  //   componentProps: {
  //     mode: 'multiple',
  //     placeholder: '请选择日期',
  //     maxTagCount: 2,
  //     options: [
  //       {
  //         label: '星期一',
  //         value: 1
  //       },
  //       {
  //         label: '星期二',
  //         value: 2
  //       },
  //       {
  //         label: '星期三',
  //         value: 3
  //       },
  //       {
  //         label: '星期四',
  //         value: 4
  //       },
  //       {
  //         label: '星期五',
  //         value: 5
  //       },
  //       {
  //         label: '星期六',
  //         value: 6
  //       },
  //       {
  //         label: '星期日',
  //         value: 7
  //       }
  //     ]
  //   },

  //   show: ({ values }) => {
  //     return values.ConditionType == 4 && values.checkTime == 1 && values.checkTimeSymbol != 'between';
  //   }
  // },
  // {
  //   field: 'StartTimeWeek',
  //   component: 'Select',
  //   label: ' ',
  //   labelWidth: '10px',
  //   colProps: {
  //     span: 5
  //   },
  //   componentProps: {
  //     // componentProps: {
  //     placeholder: '请选择日期',
  //     options: [
  //       {
  //         label: '星期一',
  //         value: 1
  //       },
  //       {
  //         label: '星期二',
  //         value: 2
  //       },
  //       {
  //         label: '星期三',
  //         value: 3
  //       },
  //       {
  //         label: '星期四',
  //         value: 4
  //       },
  //       {
  //         label: '星期五',
  //         value: 5
  //       },
  //       {
  //         label: '星期六',
  //         value: 6
  //       },
  //       {
  //         label: '星期日',
  //         value: 7
  //       }
  //     ]
  //     // },
  //     // placeholder: '请选择开始时间',

  //   },
  //   show: ({ values }) => {
  //     return values.ConditionType == 4 && values.checkTime == 1 && values.checkTimeSymbol == 'between';
  //   }
  // },
  // {
  //   field: 'EndTimeWeek',
  //   component: 'Select',
  //   label: '~',
  //   labelWidth: '13px',
  //   colProps: {
  //     span: 5
  //   },
  //   componentProps: {
  //     // componentProps: {
  //     placeholder: '请选择日期',
  //     options: [
  //       {
  //         label: '星期一',
  //         value: 1
  //       },
  //       {
  //         label: '星期二',
  //         value: 2
  //       },
  //       {
  //         label: '星期三',
  //         value: 3
  //       },
  //       {
  //         label: '星期四',
  //         value: 4
  //       },
  //       {
  //         label: '星期五',
  //         value: 5
  //       },
  //       {
  //         label: '星期六',
  //         value: 6
  //       },
  //       {
  //         label: '星期日',
  //         value: 7
  //       }
  //     ]
  //     // },
  //     // placeholder: '请选择结束时间',

  //   },
  //   show: ({ values }) => {
  //     return values.ConditionType == 4 && values.checkTime == 1 && values.checkTimeSymbol == 'between';
  //   }
  // },
  {
    field: 'delete',
    label: '',
    component: 'Input',
    slot: 'deleteSlot',
    colProps: {
      span: 1
    }
  },
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
  props: {
    CompObj: {
      type: Object,
      default: []
    },
    TriggerType: {
      type: Number,
      default: 0
    },
  },
  setup(props, { emit }) {
    // const { CompObj } = props;
    const [
      register,
      { appendSchemaByField, setProps, updateSchema, setFieldsValue, getFieldsValue, validate: validateTaskForm, removeSchemaByFiled, resetFields }
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

    watch(() => props.CompObj, (newValue, oldValue) => {

      if (props.CompObj.length != 0) {
        console.log(props.CompObj, "4546as4d6as4d65as4d5a4s5d5a6sd")

        // debugger;
        huix()
        console.log(props.TriggerType, 'props.TriggerType')
        isShake.value = props.TriggerType == 1 ? false : true
      }
    }, { deep: true }) // 开启深度监视才行

    const [
      registerForm,
      {
        validate,
        appendSchemaByField: appendMySchemaByField,
        setFieldsValue: setMyFieldsValue,
        getFieldsValue: getMyFieldsValue,
        removeSchemaByFiled: removeMySchemaByFiled,
        resetFields: resetMyFields
      }
    ] = useForm({
      labelWidth: 0,
      showActionButtonGroup: false,
      actionColOptions: {
        span: 6
      }
    })
    async function formvalueFF(arg, index) {
      // debugger
      // console.log(cindex, 'eeee')
      // console.log(arg, index, cindex, '...value..232.?');
      console.log('cindex', index, 'index', resultList.value, 'rrrr')
      // const result = getFieldsValue();
      const result = getFieldsValue();
      // var index=index+1;
      console.log(result, 'resultresultresultresultresultresult')
      if (resultList.value.length == 0) {
        resultList.value.push({
          [index]: {
            result
          }
        })
      } else {
        resultList.value[index][0].result = {
          ...result
        }
      }

      // 如果不存在这个属性则
      console.log(result, '...dfdfdfdf')
      // }



    }
    async function formvalue(arg, index, cindex) {
      console.log(cindex, 'eeee')
      console.log(arg, index, cindex, '...value..232.?');
      console.log(cindex, 'cindex', index, 'index', resultList.value, 'rrrr')
      // const result = getFieldsValue();
      const result2 = getMyFieldsValue();
      // var index=index+1;
      resultList.value[index][cindex].result2 = {
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
    async function filter_Device(item, index, cindex, type) {
      FIndex.value = index
      let m = 0
      for (let i = 0; i < add.value.length; i++) {
        // m += 1
        if (add.value[i].FormAdd.length > 0) {
          for (let x = 0; x < add.value[i].FormAdd.length; x++) {
            m += 1
            if (index == i && cindex == x) {
              ZIndex.value = m - 1
            }

          }
        }
      }
      console.log(ZIndex.value, FIndex.value)
      if (type) {
        openModal(true, {
          item: item,
          itemindex: index,
          isUpdate: true,
          type: 1
        })
      } else {
        openModal(true, {
          item: item,
          itemindex: index,
          isUpdate: true
        })
      }

    }

    function handel_Add() {
      // const form = unref(FformElRef)
      // console.log(add.value)
      // if (form != null) {
      //   for(let i=0;i<FformElRef.value.length;i++){
      //     console.log(FformElRef.value[i].getFieldsValue())
      //   }

      // }
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
      // delete add.value[index].checked1

      // add.value[index].schemas_normal = []
      // add.value[index].FormAdd = []
      add.value.splice(index, 1)
    }
    async function delete_rule_zi(index, index2) {
      console.log(add.value)
      // delete add.value[index].checked1.splice(index2,1)

      // add.value[index].schemas_normal.splice(index2,1)
      add.value[index].FormAdd.splice(index2, 1)
    }
    // function callback(id){
    //   return do(){
    //     console.log(id)
    //   }
    // }
    // callbackFunc = callback(3)
    async function handleSuccess(params, type) {
      console.log(params, 'paramsparamsparamsparams')
      console.log(resultList.value, '4564575645645645646545')
      const obj = { ...params }
      // 根据所选择的设备进行设备id查询
      const result = await deviceInfo({
        Id: obj[0][0].DeviceId
      })

      if (result[0]?.DeviceModel == 'null') {
        return;
      }
      // 判断对象是否包含该属性
      // Reflect.has(obj[1], 'itemindex')
      if (obj[1].hasOwnProperty('itemindex')) {
        // debugger;
        let FormSchema = JSON.parse(result[0]?.DeviceModel)
        console.log(FormSchema, '?...FormSchema...?')
        console.log(formElRef)
        var pp = 0
        if (formElRef.value[Number(ZIndex.value)].getFieldsValue().DeviceId !== obj[0][0].DeviceId) {
          pp = 1
        }
        if (!formElRef.value[Number(ZIndex.value)].getFieldsValue().DeviceId) {
          pp = 0
        }

        if (type) {
          // console.log(result)
          // debugger;
          pp = 3
          formElRef.value[Number(ZIndex.value)].setFieldsValue(
            {
              DeviceName: result[0].DeviceName,
              DeviceId: result[0].DeviceId,
              DeviceSerial: result[0].DeviceSerial,
              RegionId:result[0].RegionId
            }
            // [
            //   {
            //     field: 'DeviceName',
            //     defaultValue: result[0].DeviceName,
            //   },
            //   {
            //     field: 'DeviceId',
            //     defaultValue: result[0].DeviceId,
            //   },
            //   {
            //     field: 'DeviceSerial',
            //     defaultValue: result[0].DeviceSerial,
            //   },
            // ]
          );
        } else {
          formElRef.value[Number(ZIndex.value)].setFieldsValue({
            DeviceName: obj[0][0].DeviceName,
            DeviceId: obj[0][0].DeviceId,
            DeviceSerial: obj[0][0].DeviceSerial,
            RegionId:obj[0][0].RegionId
          })
        }


        let myobj: any = [];
        FormSchema.forEach(async (item, index) => {
          myobj.push({
            name: item.model.name,
            value: item.model.field
          })
        })

        if (pp == 1) {
          // debugger;
          const aa: any = []
          aa.push({
            ConditionType: formElRef.value[Number(ZIndex.value)].getFieldsValue().ConditionType
          })
          aa.push({
            DeviceId: formElRef.value[Number(ZIndex.value)].getFieldsValue().DeviceId
          })
          aa.push({
            DeviceName: formElRef.value[Number(ZIndex.value)].getFieldsValue().DeviceName
          })
          // aa.push({
          //   DeviceSerial: formElRef.value[Number(ZIndex.value)].getFieldsValue().DeviceSerial
          // })
          formElRef.value[Number(ZIndex.value)].resetFields()
          // formElRef.value[Number(ZIndex.value)].resetFields()
          // debugger;

          formElRef.value[Number(ZIndex.value)].setFieldsValue({
            ConditionType: aa[0].ConditionType,
            // DeviceName: aa[2].DeviceName,
            // DeviceId: aa[1].DeviceId,
            // DeviceSerial: aa[3].DeviceSerial,
          });
          let objj = [
            [
              {
                DeviceId: aa[1].DeviceId
              }
            ],
            {
              itemindex: 1
            }

          ]
          await handleSuccess(objj, 1)
          return;
        } else if (pp == 3) {

          formElRef.value[Number(ZIndex.value)].updateSchema({
            field: 'DeviceField',
            componentProps: { options: myobj },
          });
        } else {
          formElRef.value[Number(ZIndex.value)].appendSchemaByField({
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
              return values.ConditionType == '1'
            }
          }, 'DeviceName')
        }


        FormSchema.forEach(async (item, index) => {

          // slide
          if (item.model.view == 'slide' || item.model.view == 'label') {

            formElRef.value[Number(ZIndex.value)].appendSchemaByField({
              field: item.model.field,
              component: 'InputNumber',
              label: '',
              // defaultValue: item.model['default-value'],
              colProps: {
                span: 4
              },
              componentProps: {
                placeholder: item.model.name,
                // fieldNames: {
                //   label: 'name',
                //   key: 'value',
                //   value: 'value'
                // },
                // options: item.model['select-item']
              },
              ifShow: ({ values }) => {
                console.log(values)
                return values.DeviceField == item.model.field && values.ConditionType == 1
              }
            }, 'DeviceField')

            // 大于小于
            formElRef.value[Number(ZIndex.value)].appendSchemaByField({
              field: item.model.field + 'equation',
              component: 'Select',
              label: '',
              colProps: {
                span: 3
              },
              // defaultValue:'=',
              componentProps: {
                defaultValue: '=',
                options: [
                  { label: '>', value: '>' },
                  { label: '<', value: '<' },
                  { label: '=', value: '=' },
                  { label: '<=', value: '<=' },
                  { label: '>=', value: '>=' }
                ]
              },
              ifShow: ({ values }) => {

                console.log(item, 'DeviceFieldDeviceFieldDeviceField')
                return values.DeviceField == item.model.field && values.ConditionType == 1
              }
            }, 'DeviceField')
          } else {
            formElRef.value[Number(ZIndex.value)].appendSchemaByField({
              field: item.model.field,
              component: item.model.view.charAt(0).toUpperCase() + item.model.view.slice(1),
              label: '',
              defaultValue: item.model['default-value'],
              colProps: {
                span: 4
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
                return values.DeviceField == item.model.field && values.ConditionType == 1
              }
            }, 'DeviceField')
          }

        })
      }
      // 父
      else if (typeof result[0]?.DeviceModel !== 'undefined' && !Reflect.has(obj[1], 'item')) {
        let FormSchema = JSON.parse(result[0]?.DeviceModel)
        // console.log(FformElRef.value[Number(FIndex.value)].getFieldsValue().device,obj[0][0].DeviceId)
        var pp = 0
        if (FformElRef.value[Number(FIndex.value)].getFieldsValue().DeviceId !== obj[0][0].DeviceId) {
          pp = 1
        }
        if (!FformElRef.value[Number(FIndex.value)].getFieldsValue().DeviceId) {
          pp = 0
        }

        if (type) {
          // console.log(result)
          // debugger;
          pp = 3
          FformElRef.value[Number(FIndex.value)].setFieldsValue(
            {
              DeviceName: result[0].DeviceName,
              DeviceId: result[0].DeviceId,
              DeviceSerial: result[0].DeviceSerial,
              RegionId:result[0].RegionId
            }
            // [
            //   {
            //     field: 'DeviceName',
            //     defaultValue: result[0].DeviceName,
            //   },
            //   {
            //     field: 'DeviceId',
            //     defaultValue: result[0].DeviceId,
            //   },
            //   {
            //     field: 'DeviceSerial',
            //     defaultValue: result[0].DeviceSerial,
            //   },
            // ]
          );
        } else {
          FformElRef.value[Number(FIndex.value)].setFieldsValue({
            DeviceName: obj[0][0].DeviceName,
            DeviceId: obj[0][0].DeviceId,
            DeviceSerial: obj[0][0].DeviceSerial,
            RegionId:obj[0][0].RegionId
          })
        }


        let myobj: any = [];
        FormSchema.forEach(async (item, index) => {
          myobj.push({
            name: item.model.name,
            value: item.model.field,
          })
        })
        console.log(FformElRef.value[Number(FIndex.value)].getFieldsValue().DeviceId, 'FformElRef.value[Number(FIndex.value)].getFieldsValue().DeviceField')
        if (pp == 1) {
          // debugger;
          const aa: any = []
          aa.push({
            ConditionType: FformElRef.value[Number(FIndex.value)].getFieldsValue().ConditionType
          })
          aa.push({
            DeviceId: FformElRef.value[Number(FIndex.value)].getFieldsValue().DeviceId
          })
          aa.push({
            DeviceName: FformElRef.value[Number(FIndex.value)].getFieldsValue().DeviceName
          })
          // aa.push({
          //   DeviceSerial: FformElRef.value[Number(FIndex.value)].getFieldsValue().DeviceSerial
          // })
          FformElRef.value[Number(FIndex.value)].resetFields()
          // FformElRef.value[Number(FIndex.value)].resetFields()
          // debugger;

          FformElRef.value[Number(FIndex.value)].setFieldsValue({
            ConditionType: aa[0].ConditionType,
            // DeviceName: aa[2].DeviceName,
            // DeviceId: aa[1].DeviceId,
            // DeviceSerial: aa[3].DeviceSerial,
          });
          let objj = [
            [
              {
                DeviceId: aa[1].DeviceId
              }
            ],
            [
              {
                // itemindex: 0
              }
            ]
          ]
          await handleSuccess(objj, 1)
          return;
        } else if (pp == 3) {

          FformElRef.value[Number(FIndex.value)].updateSchema({
            field: 'DeviceField',
            componentProps: { options: myobj },
          });
        } else {
          FformElRef.value[Number(FIndex.value)].appendSchemaByField({
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
              return values.ConditionType == '1'
            }
          }, 'DeviceName')
        }

        for (let i = 0, item; item = FormSchema[i++];) {
          // 使用updateSchema添加
          console.log(item)
          // slide
          if (item.model.view == 'slide' || item.model.view == 'label') {

            FformElRef.value[Number(FIndex.value)].appendSchemaByField({
              field: item.model.field,
              component: 'InputNumber',
              label: '',
              // defaultValue: item.model['default-value'],
              colProps: {
                span: 3
              },
              componentProps: {
                placeholder: item.model.name,
                // fieldNames: {
                //   label: 'name',
                //   key: 'value',
                //   value: 'value'
                // },
                // options: item.model['select-item']
              },
              ifShow: ({ values }) => {
                console.log(values)
                return values.DeviceField == item.model.field && values.ConditionType == '1'
              }
            }, 'DeviceField')

            // 大于小于
            FformElRef.value[Number(FIndex.value)].appendSchemaByField({
              field: item.model.field + 'equation',
              component: 'Select',
              label: '',
              colProps: {
                span: 3
              },
              // defaultValue:'=',
              componentProps: {
                defaultValue: '=',
                options: [
                  { label: '>', value: '>' },
                  { label: '<', value: '<' },
                  { label: '=', value: '=' },
                  { label: '<=', value: '<=' },
                  { label: '>=', value: '>=' }
                ]
              },
              ifShow: ({ values }) => {

                console.log(item, 'DeviceFieldDeviceFieldDeviceField')
                return values.DeviceField == item.model.field && values.ConditionType == '1'
              }
            }, 'DeviceField')


          } else {
            if (item.model.view) {
              FformElRef.value[Number(FIndex.value)].appendSchemaByField({
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
                ifShow: ({ values }) => {
                  return values.DeviceField == item.model.field && values.ConditionType == 1
                }
              }, 'DeviceField')
            }

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
          //       // return values.ConditionType == index
          //     }
          //   },
          //   'DeviceField'
          // )
        }
      } else {
        console.log('1111')
      }
    }

    async function handleSuccessFK(params) {
      // console.log(params, 'paramsparamsparamsparams')
      // console.log(resultList.value, '4564575645645645646545')
      const obj = { ...params }
      // 根据所选择的设备进行设备id查询
      const result = await deviceInfo({
        Id: obj[0][0].DeviceId
      })
      // 判断对象是否包含该属性
      // Reflect.has(obj[1], 'itemindex')
      if (obj[1].hasOwnProperty('itemindex')) {
        // debugger;

        formElRef.value[Number(ZIndex.value)].setFieldsValue(
          {
            DeviceName: result[0].DeviceName,
            DeviceId: result[0].DeviceId,
            DeviceSerial: result[0].DeviceSerial,
            RegionId:result[0].RegionId
          }
        )
      }
      // 父
      else if (!Reflect.has(obj[1], 'item')) {

        FformElRef.value[Number(FIndex.value)].setFieldsValue(
          {
            DeviceName: result[0].DeviceName,
            DeviceId: result[0].DeviceId,
            DeviceSerial: result[0].DeviceSerial,
            RegionId:result[0].RegionId
          }
        )
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
    function e_Device(index, type) {
      FIndex.value = index
      ZIndex.value = ''
      if (type) {
        //  打开弹窗
        openModal(true, {
          isUpdate: true,
          type: 1
        })
      } else {
        //  打开弹窗
        openModal(true, {
          isUpdate: true
        })
      }

    }
    // 添加规则
    async function addRule(index1) {
      add.value.map((item, index) => {
        if (index == index1) {
          item.FormAdd.push({ schemas_normal: schemas_normal2 })
        }
        return item
      })
      // const result = getFieldsValue();
      const result2 = getMyFieldsValue();
      resultList.value.push({
        [index1]: {
          // result,
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

    function EndData() {
      DeviceIdArr.value = []
      VisitorIdArr.value = []
      RegionIdArr.value = []
      console.log(FformElRef.value)
      const Fform = unref(FformElRef)
      let FfromArr: any = []
      console.log(FformElRef)
      if (Fform != null) {
        for (let i = 0; i < FformElRef.value.length; i++) {
          if (JSON.stringify(FformElRef.value[i].getFieldsValue()) === '{}') {
            // message.warn('请完善条件配置');
            return 1;
          }
          if (FformElRef.value[i].getFieldsValue().ConditionType == 1 || FformElRef.value[i].getFieldsValue().ConditionType == 2) {
            DeviceIdArr.value.push(Number(FformElRef.value[i].getFieldsValue().DeviceId))
            console.log('FformElRef.value[i].getFieldsValue().RegionId',FformElRef.value[i].getFieldsValue().RegionId)
            RegionIdArr.value.push(Number(FformElRef.value[i].getFieldsValue().RegionId))
          }
          FfromArr.push(FformElRef.value[i].getFieldsValue())
        }
      }

      const form = unref(formElRef)
      let fromArr: any = []
      console.log(add.value)
      if (form != null) {
        for (let i = 0; i < formElRef.value.length; i++) {
          if (JSON.stringify(formElRef.value[i].getFieldsValue()) === '{}') {
            // message.warn('请完善条件配置');
            return 1
          }
          if (formElRef.value[i].getFieldsValue().ConditionType == 1 || formElRef.value[i].getFieldsValue().ConditionType == 2) {
            DeviceIdArr.value.push(Number(formElRef.value[i].getFieldsValue().DeviceId))
            RegionIdArr.value.push(Number(formElRef.value[i].getFieldsValue().RegionId))
          }
          fromArr.push(formElRef.value[i].getFieldsValue())
        }
      }
      // console.log(FfromArr, fromArr, 'EndDataEndData')
      let ziIndex = 0;
      let enddata: any = []
      for (let i = 0; i < add.value.length; i++) {
        enddata.push([])
        enddata[i].push(FfromArr[i])
        if (i >= 1) {
          if (add.value[i].checked1 == true || add.value[i].checked1 == false) {
            console.log(add.value[i].checked1)
            enddata[i][0].Op = add.value[i].checked1 == false ? 'or' : 'and'
          }
        }


        if (add.value[i].FormAdd.length > 0) {
          for (let x = 0; x < add.value[i].FormAdd.length; x++) {
            enddata[i].push(fromArr[ziIndex])
            ziIndex += 1
          }

        }
      }

      for (let o = 0; o < enddata.length; o++) {
        for (let p = 0; p < enddata[o].length; p++) {
          if (enddata[o][p].ConditionType == 1) {
            if (!enddata[o][p].DeviceField) {
              // message.warn('请选择完整条件')
              return 1;
            }
            var str = enddata[o][p]['DeviceField'].substr(0, 6)

            if (!enddata[o][p][enddata[o][p]['DeviceField']] && str !== 'switch') {
              // message.warn('请选择完整条件')
              return 1;
            }

            // console.log(enddata[o][p]['DeviceField']+'equation')
            if (enddata[o][p][enddata[o][p]['DeviceField']] === true || enddata[o][p][enddata[o][p]['DeviceField']] === false) {
              enddata[o][p].Gval = 'value==' + enddata[o][p][enddata[o][p]['DeviceField']]
            } else if (!enddata[o][p][enddata[o][p]['DeviceField']] && str == 'switch') {
              enddata[o][p].Gval = 'value==false'
            } else if (!enddata[o][p][enddata[o][p]['DeviceField'] + 'equation']) {
              enddata[o][p].Gval = 'value==' + enddata[o][p][enddata[o][p]['DeviceField']]
            } else {
              enddata[o][p].Gval = 'value' + enddata[o][p][enddata[o][p]['DeviceField'] + 'equation'] + enddata[o][p][enddata[o][p]['DeviceField']]
            }

            enddata[o][p].ConditionType = Number(enddata[o][p].ConditionType)
          } else if (enddata[o][p].ConditionType == 2) {
            if (!enddata[o][p].DeviceName) {
              // message.warn('请选择完整条件')
              return 1;
            }
            if (!enddata[o][p].visitor) {
              // message.warn('请选择完整条件')
              return 1;
            }
            if (enddata[o][p].visitor == 1 && !enddata[o][p].VisitorType) {
              // message.warn('请选择完整条件')
              return 1;
            } else if (enddata[o][p].visitor == 2 && !enddata[o][p].plateNumber) {
              // message.warn('请选择完整条件')
              return 1;
            }

            if (enddata[o][p].visitor == 1) {
              VisitorIdArr.value.push(enddata[o][p].VisitorType)
            }
          } else if (enddata[o][p].ConditionType == 4) {
            if (!enddata[o][p].checkTime) {
              // message.warn('请选择完整条件')
              return 1;
            }
            if (!enddata[o][p].checkTimeSymbol) {
              // message.warn('请选择完整条件')
              return 1;
            }

            if (enddata[o][p].checkTime == 1) {
              if (enddata[o][p].checkTimeSymbol !== 'between') {
                if (!enddata[o][p].checkDateWeek) {
                  // message.warn('请选择完整条件')
                  return 1;
                }
              } else {
                if (!enddata[o][p].StartTimeWeek || !enddata[o][p].EndTimeWeek) {
                  // message.warn('请选择完整条件')
                  return 1;
                }
              }
            } else {
              if (enddata[o][p].checkTimeSymbol !== 'between') {
                if (!enddata[o][p].checkDate) {
                  // message.warn('请选择完整条件')
                  return 1;
                }
              } else {
                if (!enddata[o][p].checkDateRange) {
                  // message.warn('请选择完整条件')
                  return 1;
                }
              }
            }

            if (enddata[o][p].checkTimeSymbol !== 'between' && enddata[o][p].checkTimeSymbol !== '==' && enddata[o][p].checkTimeSymbol !== '<=') {
              enddata[o][p].Gval = 'value' + enddata[o][p].checkTimeSymbol + Date.parse(enddata[o][p].checkDate + ' 00:00').valueOf() / 1000
            } else if (enddata[o][p].checkTimeSymbol == '==') {
              enddata[o][p].Gval = 'value<=' + ((Date.parse(enddata[o][p].checkDate + ' 00:00').valueOf() / 1000) + 86399) + '&&' + 'value>=' + Date.parse(enddata[o][p].checkDate + ' 00:00').valueOf() / 1000
            }else if(enddata[o][p].checkTimeSymbol == '<='){
              enddata[o][p].Gval = 'value<=' + ((Date.parse(enddata[o][p].checkDate + ' 00:00').valueOf() / 1000) + 86399)
            }
            else {
              // console.log(enddata[o][p].checkDateRange[1])
              enddata[o][p].Gval = 'value<=' + ((Date.parse(enddata[o][p].checkDateRange[1]).valueOf() / 1000) + 86399) + '&&' + 'value>=' + Date.parse(enddata[o][p].checkDateRange[0]).valueOf() / 1000
            }

          } else if (enddata[o][p].ConditionType == 5) {
            if (!enddata[o][p].checkTime) {
              // message.warn('请选择完整条件')
              return 1;
            }
            if (!enddata[o][p].checkTimeSymbol) {
              // message.warn('请选择完整条件')
              return 1;
            }
            // checkTime
            // if (enddata[o][p].checkTime == 1) {
            //   if (enddata[o][p].checkTimeSymbol !== 'between') {
            //     if (!enddata[o][p].checkDateWeek) {
            //       message.warn('请选择完整条件')
            //       return;
            //     }
            //   } else {
            //     if (!enddata[o][p].StartTimeWeek || !enddata[o][p].EndTimeWeek) {
            //       message.warn('请选择完整条件')
            //       return;
            //     }
            //   }
            // } else {
            //   if (enddata[o][p].checkTimeSymbol !== 'between') {
            //     if (!enddata[o][p].checkDate) {
            //       message.warn('请选择完整条件')
            //       return;
            //     }
            //   } else {
            //     if (!enddata[o][p].checkDateRange) {
            //       message.warn('请选择完整条件')
            //       return;
            //     }
            //   }
            // }
            if (enddata[o][p].checkTimeSymbol !== 'between' && enddata[o][p].checkTimeSymbol !== '==') {
              if (!enddata[o][p].ExecuteTime) {
                // message.warn('请选择完整条件')
                return 1;
              }
              enddata[o][p].Gval = 'value' + enddata[o][p].checkTimeSymbol + Date.parse('2006-01-02 ' + enddata[o][p].ExecuteTime).valueOf() / 1000
            } else if (enddata[o][p].checkTimeSymbol == '==') {
              enddata[o][p].Gval = 'value<=' + ((Date.parse('2006-01-02 ' + enddata[o][p].ExecuteTime).valueOf() / 1000) + 5) + '&&' + 'value>=' + (Date.parse('2006-01-02 ' + enddata[o][p].ExecuteTime).valueOf() / 1000)
            } else {
              if (!enddata[o][p].EndTime || !enddata[o][p].StartTime) {
                // message.warn('请选择完整条件')
                return 1;
              }
              enddata[o][p].Gval = 'value<' + Date.parse('2006-01-02 ' + enddata[o][p].EndTime).valueOf() / 1000 + '&&' + 'value>' + Date.parse('2006-01-02 ' + enddata[o][p].StartTime).valueOf() / 1000
            }


          }


          if (p == 0) {

          } else {
            console.log(enddata[o][p].Op)
            enddata[o][p].Op = enddata[o][p].Option == false ? 'or' : 'and'
          }

        }
      }

      console.log(enddata)

      return enddata

    }

    onMounted(() => {
      add.value = []
    })

    // onMounted(() => {
    function huix() {
      // setFieldsValue({
      //   ...data.obj,
      // });
      add.value = []
      FformArr.value = []
      formArr.value = []
      DeviceIdArr.value = []
      RegionIdArr.value = []
      // console.log(add.value )
      // console.log(EndData())
      // let a = [
      //   [
      //     {
      //       "ConditionType": "1",
      //       "DeviceId": "1000025128043",
      //       "DeviceField": "switch",
      //       "switch": true,
      //       "Gval": "value=true"
      //     },
      //     {
      //       "ConditionType": "1",
      //       "DeviceField": "percentage",
      //       "DeviceId": "1000025128043",
      //       "Gval": "value<46",
      //       "Op": false,
      //       "equation": "<",
      //       "percentage": 46,
      //     }
      //   ],
      //   [
      //     {
      //       "ConditionType": "1",
      //       "DeviceId": "1000025128043",
      //       "DeviceField": "switch",
      //       "Op": "OR",
      //       "Gval": "value=false"
      //     }
      //   ]
      // ]
      let aobj: any = props.CompObj
      console.log(props.CompObj, 'props.CompObjprops.CompObjprops.CompObjprops.CompObj')
      let a: any = []
      for (let k in aobj) {
        console.log(aobj[k])

        a.push(aobj[k])
      }

      for (let i = 0; i < a.length; i++) {
        console.log(a, '5465465456456456465')
        if (a[i].length >= 1) {
          add.value.push({
            FormAdd: [],
            checked1: a[i][0].Op ? a[i][0].Op == "or" ? false : true : false,
            schemas_normal: schemas_normal
          })
          // add.value.push(a[i][0])
          for (let o = 1; o < a[i].length; o++) {
            // add.value[i].FormAdd = []
            // add.value[i].FormAdd.push(a[i][o])
            add.value[i].FormAdd.push({ schemas_normal: schemas_normal2 })
          }
        }
      }



      for (let i = 0; i < a.length; i++) {
        if (a[i].length > 1) {
          console.log(a[i].length, 'iiiiiiii')
          FformArr.value.push(a[i][0])
          // add.value.push(a[i][0])
          for (let o = 1; o < a[i].length; o++) {
            // add.value[i].FormAdd = []
            // add.value[i].FormAdd.push(a[i][o])
            formArr.value.push(a[i][o])
            console.log(formArr.value)
          }
        } else {
          FformArr.value.push(a[i][0])
        }
      }
      console.log(FformArr.value, formArr.value, 'FformArrFformArrFformArrFformArr')

      nextTick(async () => {
        console.log(FformElRef.value, 'FformElRefFformElRefFformElRef')

        for (let i = 0; i < FformElRef.value.length; i++) {
          FformElRef.value[i].setFieldsValue({
            ...FformArr.value[i],
          });
          let obj = [
            [
              {
                DeviceId: FformArr.value[i].DeviceId
              }
            ],
            [
              {
                // itemindex: 0
              }
            ]
          ]
          FIndex.value = i
          await handleSuccess(obj)

          FformElRef.value[i].setFieldsValue({
            ...FformArr.value[i],
          });
        }

        if (formElRef.value) {
          for (let o = 0; o < formElRef.value.length; o++) {
            console.log(formElRef.value)
            formElRef.value[o].setFieldsValue({
              ...formArr.value[o],
            });

            let objj = [
              [
                {
                  DeviceId: formArr.value[o].DeviceId
                }
              ],
              {
                itemindex: 1
              }

            ]
            console.log(objj[1].hasOwnProperty('itemindex'), '156456456456')
            ZIndex.value = o
            // debugger;
            await handleSuccess(objj)

            // setTimeout(() => {
            formElRef.value[o].setFieldsValue({
              ...formArr.value[o],
            });
            // }, 500)

          }
        }




      })
    }
    // })


    // onUpdated(() => {
    //   console.log(11111)

    // })

    function filterOption(input: string, option: any) {
      console.log(option, input)
      return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }

    defineExpose({ EndData, isShake, DeviceIdArr, VisitorIdArr,RegionIdArr });

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
      FformElRef,
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
      handleSuccess,
      delete_rule_zi,
      formvalueFF,
      EndData,
      FIndex,
      ZIndex,
      DeviceIdArr,
      VisitorIdArr,
      RegionIdArr,
      FformArr,
      formArr,
      huix,
      filterOption,
      handleSuccessFK
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

::v-deep(.ant-form-item) {
  padding: 5px;
  background: #F3F3F3;
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
  width: 95%;
}

.pp .ant-switch {
  // background-color: none !important;
  background-color: rgba(1, 1, 1, 0) !important;
  border: 3px solid #0960bd !important;
  line-height: 2px;

  ::v-deep(.ant-switch-handle) {
    width: 12px;
    height: 12px;
  }

  ::v-deep(.ant-switch-handle::before) {
    background-color: #0960bd !important;
  }

  ::v-deep(.ant-switch-inner) {
    color: #0960bd !important;
  }
}

</style>

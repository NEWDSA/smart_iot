<template>
  <PageWrapper title="执行动作">
    <template #extra>
      <Form :model="RuleForm">
        <Row :gutter="5" class="enter-x col_flex">
          <Col>
          <a-button @click="ActionType" type="primary">串行</a-button>
          </Col>
          <Col>
          <a-button @click="ActionType" type="primary">并行</a-button>
          </Col>
        </Row>
      </Form>
    </template>
    <div ref="container" class="rounded-md pt-5 pl-5 border">
      <draggable class="list-group" @update="onUpdate" :animation="0" itemKey="index" :disabled="!enabled" v-model="add">
        <template #item="{ element, index }">
          <div class="list-group-item" :class="{ 'not-draggable': !enabled }">
            {{ index }}-333
            <BasicForm draggable="true" v-if="element.schemas_normal" @get-form="formvalue(arg, index)"
              @start="dragging = true" @end="dragging = false" :schemas="element.schemas_normal" @register="register">
              <template #customSlot="{ model, field }">
                <a-input placeholder="请选择设备" v-model:value="model[field]">
                  <template #suffix>
                    <Icon icon="carbon:logo-github" />
                  </template>
                </a-input>
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
import { defineComponent, reactive, ref, toRaw } from 'vue';
import { Switch, Form, Input, Row, Col, InputNumber, Select } from 'ant-design-vue';
import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
import { CollapseContainer } from '@/components/Container/index';
import { PageWrapper } from '@/components/Page';
import draggable from "vuedraggable";
import { Icon } from '@/components/Icon';
import AccountTable from './AccountTable.vue';
import { useModal } from '@/components/Modal';
import SelectItem from '@/layouts/default/setting/components/SelectItem.vue';
const [registerMyTable, { openModal }] = useModal();
const schemas: FormSchema[] = [];

const myArray: any = ref('');
const schemas_normal: FormSchema[] = [
  {
    field: 'ConditionItems',
    component: 'Select',
    label: '',
    colProps: {
      span: 2,
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
    field: 'device',
    label: '',
    component: 'Input',
    slot: 'customSlot',
    colProps: {
      span: 3,
    },
    // 判断显示隐藏
    show: ({ values }) => {
      return values.ConditionItems == '1';
    }
  },
  // 设备参数
  {
    field: 'Gvalparams',
    component: 'Select',
    label: '',
    colProps: {
      span: 3,
    },
    show: ({ values }) => {
      return values.device && values.ConditionItems == '1';
    },
    componentProps: {
      placeholder: '请选择设备参数',
      options: [{
        label: '环境温度',
        value: '0',
        key: '0'
      }, {
        label: '时间点',
        value: '1',
        key: '1'
      }, {
        label: '关机',
        value: '2',
        key: '2'
      }, {
        label: '开机',
        value: '3',
        key: '3'
      }]
    }
  },
  // 设备参数环境温度参数
  {
    field: 'Gval1',
    component: 'Select',
    label: '',
    colProps: {
      span: 3,
    },
    show: ({ values }) => {
      return values.Gvalparams == 0 && values.ConditionItems == '1';
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
    field: 'Gvalparams',
    component: 'InputNumber',
    label: '',
    colProps: {
      span: 3,
    },
    show: ({ values }) => {
      return values.Gvalparams == 0 && values.ConditionItems == '1';
    }
  },
  // 工单
  {
    field: 'field3',
    component: 'Select',
    label: '',
    colProps: {
      span: 3,
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
  }
];
const add: any = ref([]);
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
  setup() {
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
    function ActionType(type) {

    }
    function formvalue(arg, index1) {
      console.log(arg, '...arg...?')
      const values = getFieldsValue()
      console.log(values, '...values2...?')
      console.log(index, '...index3...?')
      if (index1 == 0) {
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
          console.log(key, '?...key...?')
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

      add.value[event.newIndex].schemas_norml = add.value[event.oldIndex].schemas_norml;
      delete add.value[event.oldIndex].schemas_norml

      // const item = add.value.splice(event.oldIndex, 1)[0];
      // 处理拖拽排序问题

      // add.value.splice(event.newIndex, 0, item);
    }
    function handel_Add() {
      add.value.push({
        schemas_normal: schemas_normal
      })

      console.log(toRaw(add), 'ddd?')
    }
    function handleSuccess(params) {
      console.log(getFieldsValue(), '?...getFieldsValue...?')
      const obj = { ...params }
      // DeviceName
      console.log(obj[0].DeviceName, '...obj...?')

      setFieldsValue({
        device: obj[0].DeviceName,
      });
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
    function e_Device(record) {
      //  打开弹窗
      openModal(true, {
        record,
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
    return {
      register,
      schemas,
      schemas_normal,
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
      handleSuccess
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

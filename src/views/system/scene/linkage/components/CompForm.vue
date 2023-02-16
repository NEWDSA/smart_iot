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
      <template v-for="item, index in add" :key="index">
        <div :class="[index <= 0 ? 'border bg-light-100 p-4 lc_liner' : 'border bg-light-100 p-4 mt-5 lc_liner']">
          <BasicForm v-if="item && item.schemas_normal" :schemas="item.schemas_normal" @register="register">
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
            <Form v-if="item && Object.keys(item.FormAdd).length > 0" class="p-4 enter-x" :model="item.FormAdd"
              ref="formRef">
              <template v-for="itemr, cindex in item.FormAdd" :key="itemr">
                <Row class="enter-x" :gutter="0" v-if="itemr">
                  <Col class="p-1" :span="2">
                  <FormItem :name="itemr.Op" class="enter-x">
                    <Switch checked-children="AND" v-model:checked="itemr.Op" un-checked-children="OR" />
                  </FormItem>
                  </Col>
                  <Col class="p-1" :span="2">
                  <FormItem :name="itemr.item1" class="enter-x">
                    <Select style="width:80px;" :options="options2" v-model:value="itemr.item1">
                    </Select>
                  </FormItem>
                  </Col>
                  <Col class="p-1" :span="2">
                  <FormItem :name="itemr.item2" class="enter-x">
                    <Select style="width:80px;" :options="options3" v-model:value="itemr.item2">
                    </Select>
                  </FormItem>
                  </Col>
                  <Col class="p-1" :span="2">
                  <FormItem :name="itemr.Gval" class="enter-x">
                    <Input v-model:value="itemr.Gval" />
                  </FormItem>
                  </Col>
                  <Col class="item_felx" :span="2">
                  <!-- 移除附加条件 -->
                  <div style="padding:5px;">
                    <Icon @click="remove_attach(index, cindex)" icon="ant-design:close-outlined"></Icon>
                  </div>
                  <!-- 移除图标 -->
                  <div style="padding:5px;">
                    <Icon @click="delete_rule(index)" icon="ant-design:delete-outlined"></Icon>
                  </div>
                  </Col>
                </Row>
              </template>
            </Form>
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
      <a-button type="primary" class="my-4" @click="handel_Add">
        添加条件
      </a-button>
    </div>
</PageWrapper>
</template>
<script lang="tsx">
import { defineComponent, reactive, ref } from 'vue';
import { Switch, Form, Input, Row, Col, InputNumber, Select } from 'ant-design-vue';
import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
import { CollapseContainer } from '@/components/Container/index';
import { PageWrapper } from '@/components/Page';
import { Icon } from '@/components/Icon';
import AccountTable from './AccountTable.vue';
import { useModal } from '@/components/Modal';
import SelectItem from '@/layouts/default/setting/components/SelectItem.vue';
const [registerMyTable, { openModal }] = useModal();
const schemas: FormSchema[] = [];
const add: any = ref([]);

const schemas_normal: FormSchema[] = [
  {
    field: 'ConditionItems',
    component: 'Select',
    label: '',
    colProps: {
      span: 3
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
      span: 3
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
      span: 3
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
      span: 3
    },
    show: ({ values }) => {
      return values.Gval1 && values.Gvalparams == 0 && values.ConditionItems == '1';
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
      span: 8
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
      span: 3
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
  }, {
    field: 'delete',
    label: '',
    component: 'Input',
    slot: 'deleteSlot',
    colProps: {
      span: 3
    }
  }
];
const showForm = ref(false);
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
export default defineComponent({
  components: { BasicForm, CollapseContainer, PageWrapper, Icon, Switch,AccountTable,InputNumber, Input, Row, Col, Select, SelectItem },
  setup() {
    const [register, { appendSchemaByField, setProps, updateSchema, setFieldsValue, getFieldsValue }] =
      useForm({
        labelWidth: 0,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 6,
        },
      });
    function handel_Add() {
      add.value.push({
        FormAdd: [
        ],
        schemas_normal: schemas_normal
      })
    }
    function delete_rule(index) {
      add.value[index].schemas_normal = [];
      add.value[index].FormAdd = [];
    }
    function handleSuccess(params) {
      const obj = { ...params }
      setFieldsValue({
        device: obj[0].DeviceName
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
    const n = ref(1);
    // 添加规则
    function addRule(index1) {
      add.value.map((item, index) => {
        // item[].FormAdd=[];
        if (index == index1) {
          // item.FormAdd = [];
          item.FormAdd.push({
            Op: '',
            item1: '',
            item2: '',
            item3: '',
            Gval: ''
          })
        }
        // item.Op = '',
        // item.item1 = '',
        // item.item2 = '',
        // item.item3 = '',
        // item.Gval = ''
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
      delete_rule,
      setProps,
      changeLabel3,
      changeLabel34,
      appendField,
      deleteField,
      e_Device,
      addRule,
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

  &::before {
    position: absolute;
    display: block;
    content: '';
    top: 50%;
    right: -10px;
    transform: translateY(-50%);
    width: 10px;
    height: 10px;
    background: red;
    border-bottom: 1px solid #ffff;
  }

  // &::after {
  //   position: absolute;
  //   top: 50%;
  //   right: -10px;
  //   display: block;
  //   // transform: @elemPosFunc; // 注意CSS是不支持函数的，所以要调用JS中定义的函数
  //   transform: ${myItem.computed.elemPosFunc};
  //   width: 10px;
  //   height: 10px;
  //   background: green;
  //   border: 1px solid #ffff;
  //   border-radius: 100%;
  // }
}
</style>

<template>
  <PageWrapper title="触发条件2">
    <div class="rounded-md pt-5 pl-5 border  bg-light-50">
      <BasicForm :schemas="schemas" @register="register">
        <template #customSlot="{ model, field }">
          <a-input @click="e_Device" placeholder="请选择设备" v-model:value="model[field]">
            <template #suffix>
              <Icon icon="carbon:logo-github" />
            </template>
          </a-input>
        </template>
      </BasicForm>
      <template v-if="Object.keys(FormAdd)">
        <Form v-if="Object.keys(FormAdd).length > 0" class="p-4 enter-x" :model="FormAdd" ref="formRef">
          <template v-for="item, index in FormAdd" :key="item">
            <Row class="enter-x" v-if="item">
              <Col class="p-1" :span="2">
              <FormItem :name="item?.Op" class="enter-x">
                <Switch checked-children="AND" v-model:checked="item.Op" un-checked-children="OR" />
              </FormItem>
              </Col>
              <Col class="p-1" :span="2">
              <FormItem :name="item?.item1" class="enter-x">
                <Select :options="options2" v-model:value="item.item1">
                </Select>
              </FormItem>
              </Col>
              <Col class="p-1" :span="2">
              <FormItem :name="item?.item2" class="enter-x">
                <Select :options="options3" v-model:value="item.item2">
                </Select>
              </FormItem>
              </Col>
              <Col class="p-1" :span="2">
              <FormItem :name="item?.Gval" class="enter-x">
                <Input v-model:value="item.Gval" />
              </FormItem>
              </Col>
              <Col class="p-1" :span="2">
              <!-- 移除附加条件 -->
              <FormItem>
                <Icon @click="remove_attach(index)" icon="ant-design:close-outlined"></Icon>
              </FormItem>
              </Col>
              <Col class="p-1" :span="2">
              <!-- 移除图标 -->
              <FormItem>
                <Icon icon="ant-design:delete-outlined"></Icon>
              </FormItem>
              </Col>
            </Row>
          </template>
        </Form>
      </template>


      <!-- 引入模态框 -->
      <AccountTable @register="registerMyTable" @success="handleSuccess" />
    </div>
  </PageWrapper>
</template>
<script lang="ts">
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
const schemas_normal = [
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
      return values.Gval1 && values.Gvalparams == 0 && values.ConditionItems == '1';
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
  components: { BasicForm, CollapseContainer, PageWrapper, Icon, Switch, AccountTable, InputNumber, Input, Row, Col, Select, SelectItem },
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
      console.log('!!!添加!!!');
      schemas_normal.forEach((item) => {
        appendSchemaByField({ ...item }, '')
      })


    }
    function handleSuccess(params) {
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
    function remove_attach(index) {
      delete FormAdd[index]
      console.log(FormAdd, '?...item...?');
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
    function addRule() {
      const values: any = getFieldsValue();
      console.log(Object.keys(values), '?...values...?')
      Object.keys(values).length > 0 ? (FormAdd.push({
        Op: '',
        item1: '',
        item2: '',
        item3: '',
        Gval: ''
      }), showForm.value = true) : ''

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
  },
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
</style>

<template>
  <PageWrapper title="触发条件">
    <template #extra>
      <a-button type="primary"> 保存设置 </a-button>
    </template>
    <div class="rounded-md pt-5 pl-5 border  bg-light-50 h-100">
      <BasicForm @register="register">
        <template #customSlot="{ model, field }">
          <a-input @click="e_Device" placeholder="请选择设备" v-model:value="model[field]">
            <template #suffix>
              <Icon icon="carbon:logo-github" />
            </template>
          </a-input>
        </template>
      </BasicForm>
      <!-- 添加过滤条件 -->
      <span @click="addRule">
        <Icon icon="bi:plus" size="14" />
        添加过滤条件
      </span>

    </div>
  </PageWrapper>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
import { CollapseContainer } from '@/components/Container/index';
import { PageWrapper } from '@/components/Page';
import { Icon } from '@/components/Icon';
const schemas: FormSchema[] = [
  {
    field: 'field1',
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
    field: 'field2',
    label: '',
    component: 'Input',
    slot: 'customSlot',
    colProps: {
      span: 3,
    },
    // 判断显示隐藏
    show: ({ values }) => {
      console.log(values.field1)
      return values.field1 == '1';
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
  },
  // // 工单条件
  // {
  //   field: 'tickets',
  //   component: 'Select',
  //   label: '',
  //   colProps: {
  //     span: 3,
  //   },
  //   show: ({ values }) => {
  //     return values.field1 == '6' || values.field1 == '7';
  //   },
  //   componentProps: {
  //     options: [{
  //       label: '工单更新时间',
  //       value: '1',
  //       key: '1'
  //     }, {
  //       label: '更改时间',
  //       value: '2',
  //       key: '2'
  //     }]
  //   }
  // }
];
export default defineComponent({
  components: { BasicForm, CollapseContainer, PageWrapper, Icon },
  setup() {
    const [register, { setProps, updateSchema, appendSchemaByField, removeSchemaByField }] =
      useForm({
        labelWidth: 0,
        schemas,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 6,
        },
      });
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

    function appendField() {
      appendSchemaByField(
        {
          field: 'field10',
          label: '字段10',
          component: 'Input',
          colProps: {
            span: 8,
          },
        },
        'field3',
      );
    }
    function deleteField() {
      removeSchemaByField('field11');
    }
    // 选择设备
    function e_Device() {

    }
    const n = ref(1);
    // 添加规则
    function addRule() {
      appendSchemaByField(
        {
          field: `field${n.value}a`,
          label: '',
          component: 'Select',
          componentProps: {
            options: [{
              label: '工单更新时间',
              value: '1',
              key: '1'
            }, {
              label: '更改时间',
              value: '2',
              key: '2'
            }]
          },
          colProps: {
            span: 8,
          },
          required: true,
        },
        '',
      );
    }
    return {
      register,
      schemas,
      setProps,
      changeLabel3,
      changeLabel34,
      appendField,
      deleteField,
      e_Device,
      addRule
    };
  },
});
</script>

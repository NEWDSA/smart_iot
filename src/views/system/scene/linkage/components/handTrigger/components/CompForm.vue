<template>
  <PageWrapper>
    <BasicForm @register="register">
    </BasicForm>
  </PageWrapper>
</template>
<script lang="tsx">
import { defineComponent, } from 'vue';

import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
import { CollapseContainer } from '@/components/Container/index';
import { PageWrapper } from '@/components/Page';
import { Icon } from '@/components/Icon';
import AccountTable from './AccountTable.vue';
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
      value: '1',
      key: '1'
    }, {
      label: '按月',
      value: '2',
      key: '2'
    }]
  }
},
{
  field: 'ExecuteTime',
  label: '',
  component: 'DatePicker',
  componentProps: {
    format: 'YYYY-MM-DD HH:mm:ss',
    // placeholder: ['开始时间', '结束时间'],
    showTime: { format: 'HH:mm:ss' },
  },
  colProps: { span: 4 },
  show: ({ values }) => {
    return values.ConditionItems == 1 ||values.ConditionItems == 2;
  }
},
{
  field: 'ExecuteNum',
  component: 'Select',
  label: '',
  colProps: {
    span: 3
  },
  componentProps: {
    placeholder: '请选择',
    options: [{
      label: '执行一次',
      value: '1',
      key: '1'
    }, {
      label: '执行两次',
      value: '2',
      key: '2'
    },
    {
      label: '执行三次',
      value: '2',
      key: '2'
    },
    {
      label: '执行四次',
      value: '2',
      key: '2'
    }]
  },
  show: ({ values }) => {
    return values.ConditionItems == 1 ||values.ConditionItems == 2;
  }
},
];

export default defineComponent({
  components: { BasicForm, CollapseContainer, PageWrapper, Icon, AccountTable },
  setup() {
    const [register, { setProps }] =
      useForm({
        labelWidth: 0,
        schemas: schemas,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 6,
        },
      });

    function appendField() {
    }
    function deleteField() {
      // removeSchemaByField('field11');
    }
    function handleSuccess() {

    }
    // 添加规则
    return {
      register,
      schemas,
      setProps,
      appendField,
      deleteField,
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

// .overflow-hidden
// ::v-deep(.overflow-hidden) {
//   overflow: inherit;
// }
</style>

import { FormSchema } from '@/components/Form';

const basicOptions = [
  {
    label: '默认',
    value: '1',
  },
  {
    label: '按时间',
    value: '2',
  },
  {
    label: '按名称排序',
    value: '3',
  }
];


export const schemas = [
  {
    field: 'f1',
    component: 'Select',
    label: '',
    componentProps: {
      options: basicOptions
    },
    required: false,
    colProps: {
      span: 5
    }
  },
  {
    field: 'f2',
    component: 'Input',
    label: '',
    required: false,
    colProps: {
      span: 8
    }
  }
]

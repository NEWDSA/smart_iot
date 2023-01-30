
import { BasicColumn } from '@/components/Table/src/types/table'
import { FormSchema } from '@/components/Table'
import { h } from 'vue'
import { Tag } from 'ant-design-vue'

import dayjs from 'dayjs'
export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '部门名称',
      dataIndex: 'DeptName',
      width: 160,
      align: 'left'
    },
    {
      title: '排序',
      dataIndex: 'OrderNum',
      width: 50
    },
    {
      title: '状态',
      dataIndex: 'Status',
      width: 80,
      customRender: ({ record }) => {
        const status = record.Status
        const enable = ~~status === 0
        const color = enable ? 'green' : 'red'
        const text = enable ? '正常' : '停用'
        return h(Tag, { color: color }, () => text)
      }
    },
    {
      title: '创建时间',
      dataIndex: 'Basic',
      width: 180,
      format(text, record, index) {
        return dayjs.unix(record.Basic.CreatedAt.seconds).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  ]
}

export const searchFormSchema: FormSchema[] = [
  {
    field: 'DeptName',
    label: '部门名称',
    component: 'Input',
    colProps: { span: 8 }
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: '0' },
        { label: '停用', value: '1' }
      ]
    },
    colProps: { span: 8 }
  }
]

export const formSchema: FormSchema[] = [
  {
    field: 'ParentId',
    label: '上级部门',
    component: 'TreeSelect',
    ifShow:true,
    componentProps: {
      fieldNames: {
        label: 'Name',
        key: 'Id',
        value: 'Id'
      },
      getPopupContainer: () => document.body
    },
    
    required: true
  },
  {
    field: 'DeptName',
    label: '部门名称',
    component: 'Input',
    required: true
  },
  {
    field: 'orderNo',
    label: '排序',
    component: 'InputNumber',
    required: true
  },

  {
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '启用', value: '0' },
        { label: '停用', value: '1' }
      ]
    },
    required: true
  }
]




import { BasicColumn } from '@/components/Table/src/types/table'
import { FormSchema } from '@/components/Table'
import { h } from 'vue'
import { Tag } from 'ant-design-vue'
import dayjs from 'dayjs'
export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '区域列表',
      dataIndex: 'RegionName',
      width: 160,
      align: 'left'
    },
    {
      title: '排序',
      dataIndex: 'Sort',
      width: 50
    },
    {
      title: '状态',
      dataIndex: 'Status',
      width: 80,
      customRender: ({ record }) => {
        const status = record.Status
        const enable = ~~status === 1
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
    label: '上级区域',
    component: 'TreeSelect',
    show: ({ values }) => {
      return values.ParentId=='0'?false:true
    },
    componentProps:{
      fieldNames: {
        label: 'RegionName',
        key: 'RegionId',
        value: 'RegionId'
      }
    },
    required: true
  },
  {
    field: 'RegionName',
    label: '区域名称',
    component: 'Input',
    required: true
  },
  {
    field: 'Sort',
    label: '显示排序',
    component: 'InputNumber'
  },
  {
    field: 'Status',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '启用', value: 1 },
        { label: '停用', value: 2 }
      ]
    },
    required: true
  }
]



import { BasicColumn } from '@/components/Table'
import { FormSchema } from '@/components/Table'
import { h } from 'vue'
import { Tag } from 'ant-design-vue'
import { Icon } from '@/components/Icon'
import dayjs from 'dayjs'

export const columns: BasicColumn[] = [
  {
    title: '菜单名称',
    dataIndex: 'MenuName',
    width: 200,
    align: 'left'
  },
  {
    title: '图标',
    dataIndex: 'Icon',
    width: 50,
    customRender: ({ record }) => {
      return h(Icon, { icon: record.Icon })
    }
  },
  {
    title: '排序',
    dataIndex: 'OrderNum',
    width: 50
  },
  {
    title: '请求地址',
    dataIndex: 'Path',
    width: 50
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 80,
    customRender: ({ record }) => {
      const status = record.status
      const enable = ~~status === 0
      const color = enable ? 'green' : 'red'
      const text = enable ? '启用' : '停用'
      return h(Tag, { color: color }, () => text)
    }
  },
  {
    title: '创建时间',
    dataIndex: 'Basic',
    // 对时间格式进行特殊化处理
    format(text, record, index) {
      return dayjs.unix(record.Basic.CreatedAt.seconds).format('YYYY-MM-DD HH:mm:ss')
    },
    width: 180
  }
]

const isDir = (type: string) => type === 'M'
const isMenu = (type: string) => type === 'C'
const isButton = (type: string) => type === 'F'

export const searchFormSchema: FormSchema[] = [
  {
    field: 'MenuName',
    label: '菜单名称',
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
    field: 'MenuType',
    label: '菜单类型',
    component: 'RadioButtonGroup',
    defaultValue: 'M',
    componentProps: {
      options: [
        { label: '目录', value: 'M' },
        { label: '菜单', value: 'C' },
        { label: '按钮', value: 'F' }
      ]
    },
    colProps: { lg: 24, md: 24 }
  },
  {
    field: 'MenuName',
    label: '菜单名称',
    component: 'Input',
    required: true
  },
  {
    field: 'ParentId',
    label: '上级菜单',
    component: 'TreeSelect',
    componentProps: {
      fieldNames: {
        label: 'Name',
        key: 'Id',
        value: 'Id'
      },
      getPopupContainer: () => document.body
    }
  },
  {
    field: 'Perms',
    label: '权限标识',
    component: 'Input',
    required: true,
    ifShow: ({ values }) => isButton(values.MenuType),
    componentProps:{
      placehldr:'请输入权限标识'
    }
  },
  {
    field: 'OrderNum',
    label: '排序',
    component: 'InputNumber',
    required: true
  },
  {
    field: 'Icon',
    label: '图标',
    component: 'IconPicker',
    required: true,
    ifShow: ({ values }) => !isButton(values.MenuType)
  },

  {
    field: 'Component',
    label: '组件地址',
    component: 'Input',
    required: true,
    ifShow: ({ values }) => !isDir(values.MenuType) && !isButton(values.MenuType)
  },
  {
    field: 'Path',
    label: '路由地址',
    component: 'Input',
    required: true,
    ifShow: ({ values }) => !isButton(values.MenuType)
  },
  {
    field: 'Status',
    label: '菜单状态',
    component: 'RadioButtonGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '启用', value: '0' },
        { label: '禁用', value: '1' }
      ]
    }
  },
  {
    field: 'Visible',
    label: '显示状态',
    component: 'RadioButtonGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '是', value: '0' },
        { label: '否', value: '1' }
      ]
    },
    ifShow: ({ values }) => !isButton(values.type)
  }
]

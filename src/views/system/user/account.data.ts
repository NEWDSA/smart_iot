import { BasicColumn } from '@/components/Table'
import { FormSchema } from '@/components/Table'
import { Tag } from 'ant-design-vue'
import { h } from 'vue'
import dayjs from 'dayjs'
import { RuleObject } from 'ant-design-vue/lib/form'
// 邮箱验证
const validateEmail = () => {
  return async (_: RuleObject, value: string) => {
    if (!value) {
      return Promise.reject('请输入邮箱')
    }
    var regu =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    var re = new RegExp(regu)
    if (!re.test(value)) {
      return Promise.reject('请检查输入的邮箱格式是否正确');
    }
  }
}
export const columns: BasicColumn[] = [
  {
    title: '用户名',
    dataIndex: 'UserName',
    width: 120
  },
  {
    title: '昵称',
    dataIndex: 'NickName',
    width: 120
  },
  {
    title: '手机',
    dataIndex: 'PhoneNumber',
    width: 120
  },
  // 需对部门信息进行处理
  {
    title: '部门',
    dataIndex: 'DeptName'
  },
  {
    title: '状态',
    dataIndex: 'Status',
    width: 120,
    customRender: ({ record }) => {
      console.log(record.Status)
      const status = record.Status
      const enable = ~~status === 0
      const color = enable ? 'green' : 'red'
      const text = enable ? '正常' : '停用'
      return h(Tag, { color: color }, () => text)
    }
  },
  {
    title: '创建时间',
    dataIndex: 'CreateTime',
    width: 180,
    format(text, record, index) {
      return dayjs.unix(record.Basic.CreatedAt.seconds).format('YYYY-MM-DD HH:mm:ss')
    }
  }
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'NickName',
    label: '用户名',
    component: 'Input',
    colProps: { span: 8 },
    componentProps: () => {
      return {
        placeholder: '请输入用户名',
        onChange: (e: any) => {
          console.log(e)
        }
      }
    }
  },
  {
    field: 'PhoneNumber',
    label: '手机号',
    component: 'Input',
    colProps: { span: 8 },
    componentProps: () => {
      return {
        placeholder: '请输入手机号',
        onChange: (e: any) => {
          console.log(e)
        }
      }
    }
  }
]

export const accountFormSchema: FormSchema[] = [
  {
    field: 'NickName',
    label: '昵称',
    component: 'Input',
    rules: [
      {
        required: true,
        message: '请输入用户名'
      }
    ]
  },
  {
    field: 'DeptId',
    label: '所属部门',
    component: 'TreeSelect',

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
    field: 'UserName',
    label: '用户名称',
    component: 'Input',
    required: true
  },
  {
    field: 'PhoneNumber',
    label: '手机号',
    component: 'Input',
    required: true
  },
  {
    label: '角色类型',
    field: 'RoleIds',
    component: 'TreeSelect',
    componentProps: {
      fieldNames: {
        label: 'RoleName',
        key: 'RoleId',
        value: 'RoleId'
      }
    },
    required: true
  },
  {
    label: '邮箱',
    field: 'Email',
    component: 'Input',
    // 使用正则
    rules: [
      {
        required: true,
        validator: validateEmail(),
        trigger: 'blur'
      }
    ]
    // rules:[],
    // required: true
  },
  // 状态设置
  {
    field: 'Status',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '启用', value: '0' },
        { label: '禁用', value: '1' }
      ]
    }
  }
]

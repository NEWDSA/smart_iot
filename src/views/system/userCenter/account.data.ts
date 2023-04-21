import { FormSchema } from '@/components/Form'
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
      return Promise.reject('请检查输入的邮箱格式是否正确')
    }
  }
}

export const accountFormSchema: FormSchema[] = [
  {
    field: 'UserId',
    label: '用户编号',
    component: 'Input',
    show: false
  },
  {
    field: 'UserName',
    label: '用户名',
    component: 'Input',
    show: false
  },
  {
    field: 'NickName',
    label: '昵称',
    component: 'Input',
    colProps: {
      span: 8
    },
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
    show: false,
    componentProps: {
      fieldNames: {
        label: 'deptName',
        key: 'id',
        value: 'id'
      },
      getPopupContainer: () => document.body
    },
    required: true
  },

  {
    field: 'UserName',
    label: '用户名称',
    component: 'Input',
    show: false,
    colProps: {
      span: 8
    },
    required: true
  },
  {
    field: 'PhoneNumber',
    label: '手机号',
    colProps: {
      span: 8
    },
    component: 'Input',
    required: true
  },
  {
    label: '邮箱',
    field: 'Email',
    component: 'Input',
    colProps: {
      span: 8
    },
    // 使用正则
    rules: [
      {
        required: true,
        validator: validateEmail(),
        trigger: 'blur'
      }
    ]
  },
  // 角色 RoleIds
  {
    label: '角色类型',
    field: 'RoleIds',
    component: 'TreeSelect',
    show: false,
    componentProps: {
      fieldNames: {
        label: 'RoleName',
        key: 'RoleId',
        value: 'RoleId'
      }
    },
    required: false
  },
  {
    field: 'Remark',
    component: 'InputTextArea',
    label: '备注',
    componentProps: {
      placeholder: '请输入',
      rows: 4
    }
    // required: true
  }
]

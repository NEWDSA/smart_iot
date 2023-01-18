import { getAllRoleList, isAccountExist, getDeptList } from '@/api/demo/system'
import { toRaw } from 'vue'
import { BasicColumn } from '@/components/Table'
import { FormSchema } from '@/components/Table'
import { Tag } from 'ant-design-vue'
import { h } from 'vue'
import dayjs from 'dayjs'
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
    field: 'UserName',
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
    field: 'UserName',
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
    label: '角色',
    field: 'RoleId',
    component: 'ApiSelect',
    componentProps: {
      api: getAllRoleList,
      labelField: 'RoleName',
      valueField: 'RoleId'
    },
    required: true
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
    field: 'nickname',
    label: '昵称',
    component: 'Input',
    required: true
  },

  {
    label: '邮箱',
    field: 'email',
    component: 'Input',
    required: true
  },

  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea'
  }
]

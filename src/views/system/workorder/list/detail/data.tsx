import { BasicColumn } from '@/components/Table'
import { FormSchema } from '@/components/Table'
import { Tag } from 'ant-design-vue'
import { h } from 'vue'
import dayjs from 'dayjs'

export interface ListItem {
  title: string;
  icon: string;
  color?: string;
}

export interface TabItem {
  key: string;
  name: string;
  component: string;
}
export const achieveList: TabItem[] = [
  {
    key: '1',
    name: '工单属性',
    component: 'workorderDetail',
  },
  {
    key: '2',
    name: '设备资料',
    component: 'deviceDetail',
  },
  {
    key: '3',
    name: '操作日志',
    component: 'log',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'UserName',
    label: '用户名',
    labelWidth:60,
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
    labelWidth:60,
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
    dataIndex: 'DeptName',
    customRender:({record})=>{
      return record.Dept.DeptName;
    }
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
import { h } from 'vue'
import { BasicColumn } from '@/components/Table'
import { FormSchema } from '@/components/Table'
import { Tag } from 'ant-design-vue'
import dayjs from 'dayjs'
export const columns: BasicColumn[] = [
  {
    title: '昵称',
    dataIndex: 'NickName',
    width: 120
  },
  {
    title: '用户名称',
    dataIndex: 'UserName',
    width: 120
  },
  {
    title: '手机号',
    dataIndex: 'PhoneNumber',
    width: 120
  },
  {
    title: '状态',
    dataIndex: 'Status',
    width: 180,
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
    field: 'DeviceName',
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
    field: 'DeviceName',
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

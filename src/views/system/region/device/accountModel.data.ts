import { h } from 'vue'
import { BasicColumn } from '@/components/Table'
import { FormSchema } from '@/components/Table'
import { Tag } from 'ant-design-vue'
import dayjs from 'dayjs'
export const columns: BasicColumn[] = [
  {
    title: '设备名称',
    dataIndex: 'DeviceName',
    width: 120
  },
  {
    title: '设备类型',
    dataIndex: 'DeviceTypeName',
    width: 120
  },
  {
    title: '设备ID',
    dataIndex: 'DeviceId',
    width: 120
  },
  {
    title: '创建时间',
    dataIndex: 'CreateTime',
    width: 180,
    format(text, record, index) {
      return dayjs.unix(record.Basic.CreatedAt.seconds).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    title: '设备状态',
    dataIndex: 'DeviceStatus',
    width: 120,
    customRender: ({ record }) => {
      const status = record.DeviceStatus
      const enable = ~~status === 2
      const color = enable ? 'green' : 'red'
      const text = enable ? '正常' : '停用'
      return h(Tag, { color: color }, () => text)
    }
  }
]
export const searchFormSchema: FormSchema[] = [
  {
    field: 'Sort',
    label: '选择排序',
    component: 'Select',
    colProps: { span: 4 },
    componentProps:{
      options:[{
        label:'按名称排序',value:'1'
      },{
        label:'按创建时间排序',value:'2'
      }]
    }
  },
  {
    field: 'TypeId',
    label: '设备分类',
    component: 'TreeSelect',
    colProps: { span: 4 },
    componentProps: {
      fieldNames: {
        label: 'TypeName',
        key: 'TypeId',
        value: 'TypeId'
      },
      getPopupContainer: () => document.body
    }
  },
  {
    field: 'DeviceName',
    label: '可添加设备',
    component: 'Input',
    colProps: { span: 6 },
    componentProps: () => {
      return {
        placeholder: '请输入设备名称',
        onChange: (e: any) => {
          console.log(e)
        }
      }
    }
  }
]

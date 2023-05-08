import { h } from 'vue'
import { BasicColumn } from '@/components/Table'
import { FormSchema } from '@/components/Table'
import { Tag } from 'ant-design-vue'
import dayjs from 'dayjs'
export const columns: BasicColumn[] = [
  {
    title: '可添加场景',
    dataIndex: 'Name',
    width: 120
  },
  {
    title: '触发类型',
    dataIndex: 'TriggerMode',
    width: 120
  },
  {
    title: '场景状态',
    dataIndex: 'Status',
    width: 120,
    customRender: ({ record }) => {
      const status = record.Status
      const color= ~~status===2 ?'gray':~~status===1?'green':~~status===3?'yellow':~~status===4?'red':~~status===5?'blue':''
      const text =  ~~status===2 ?'离线':~~status===1?'在线':~~status===3?'异常':~~status===4?'故障':~~status===5?'运行':''
      return h(Tag, { color: color }, () => text)
    }
  },
  {
    title: '关联设备',
    dataIndex: 'DeviceNames',
    width: 180,
  },

]
export const searchFormSchema: FormSchema[] = [
  {
    field: 'TriggerMode',
    label: ' ',
    labelWidth:'10px',
    component: 'Select',
    colProps: { span: 5 },
    componentProps:{
      placeholder:'触发类型',
      options:[{
        label:'条件触发',value:1
      },{
        label:'定时触发',value:2
      },{
        label:'手动触发',value:3
      }]
    }
  },
  {
    field: 'Status',
    label: ' ',
    labelWidth:'10px',
    component: 'Select',
    colProps: { span: 5 },
    componentProps: {
      placeholder:'设备状态',
      options:[{
        label:'在线',value:1
      },{
        label:'离线',value:2
      }]
    }
  },
  {
    field: 'Name',
    label: ' ',
    component: 'Input',
    labelWidth:'10px',
    colProps: { span: 6 },
    componentProps: () => {
      return {
        placeholder: '请输入场景名称',
      }
    }
  }
]

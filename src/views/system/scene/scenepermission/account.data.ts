import { BasicColumn } from '@/components/Table'
import { FormSchema } from '@/components/Table'
import { Tag } from 'ant-design-vue'
import { h } from 'vue'
export const columns: BasicColumn[] = [
  {
    title: '场景名称',
    dataIndex: 'Name',
    width: 120
  },
  {
    title: '关联设备',
    dataIndex: 'DeviceNames',
    width: 120
  },
  {
    title: '触发类型',
    dataIndex: 'TriggerMode',
    width: 120
  },
  // 需对部门信息进行处理
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
  }
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'RuleName',
    label: '场景名称',
    component: 'Input',
    colProps: { span: 8 },
    componentProps: () => {
      return {
        placeholder: '请输入场景名称',
        onChange: (e: any) => {
          console.log(e)
        }
      }
    }
  }
]

export const accountFormSchema: FormSchema[] = [
  {
    field: 'Dept',
    label: '设备',
    component: 'TreeSelect',
    colProps: {
      offset: 1,
      lg: 11,
      md: 11
    },
    // 特殊化处理
    componentProps: {
      placeholder: '请选择设备',
      fieldNames: {
        label: 'TypeName',
        key: 'TypeId',
        value: 'TypeId'
      },
      getPopupContainer: () => document.body
    },
    required: true
  },

  {
    field: 'nickname',
    label: '设备名称',
    component: 'Input',
    colProps: {
      offset: 1,
      lg: 11,
      md: 11
    },
    componentProps:{
      placeholder: '请输入设备名称'
    },
    required: true
  }
]

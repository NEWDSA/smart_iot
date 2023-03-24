import { BasicColumn } from '@/components/Table'
import { FormSchema } from '@/components/Table'
import { Tag } from 'ant-design-vue'
import { h } from 'vue'
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
  // 需对部门信息进行处理
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
    field: 'DeviceName',
    label: '设备名称',
    component: 'Input',
    colProps: { span: 8 },
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

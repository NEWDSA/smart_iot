import { h } from 'vue'
import { BasicColumn } from '@/components/Table'
import { FormSchema } from '@/components/Table'
import { Tag } from 'ant-design-vue'
export const columns: BasicColumn[] = [
  {
    title: '设备名称',
    dataIndex: 'DeviceName',
    width: 120
  },
  {
    title: '设备类型',
    dataIndex: 'typeName',
    width: 120
  },
  {
    title: '设备ID',
    dataIndex: 'DeviceId',
    width: 120
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
  // 接入区域列表
  {
    field: 'RegionId',
    label: '',
    component: 'TreeSelect',
    colProps: { span: 3 },
    componentProps: {
      placeholder:'请选择区域',
      fieldNames: {
        label: 'RegionName',
        key: 'RegionId',
        value: 'RegionId'
      },
      getPopupContainer: () => document.body
    }
  },
  {
    field: 'TypeId',
    label: '',
    component: 'TreeSelect',
    colProps: { span: 3 },
    componentProps: {
      placeholder:'请选择设备类型',
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
    label: '',
    component: 'Input',
    colProps: { span: 3 },
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

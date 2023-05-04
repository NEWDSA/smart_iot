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
    dataIndex: 'TypeName',
    width: 120
  },
  {
    title: '设备ID',
    dataIndex: 'DeviceId',
    width: 120
  },
  {
    title: '设备状态',
    dataIndex: 'NetworkStatus',
    width: 120,
    customRender: ({ record }) => {
      const status = record.NetworkStatus
      console.log(status)
      var color
      var text
      switch (status) {
        case 1:
          color = 'green'
          text = '在线'
          return h(Tag, { color: color }, () => text)
        case 2:
          color = 'red'
          text = '离线'
          return h(Tag, { color: color }, () => text)
        case 3:
          color = 'red'
          text = '异常'
          return h(Tag, { color: color }, () => text)
        case 4:
          color = 'red'
          text = '故障'
          return h(Tag, { color: color }, () => text)
        case 5:
          color = 'blue'
          text = '运行'
          return h(Tag, { color: color }, () => text)

        default:
          color = 'gray'
          text = '未知'
          return h(Tag, { color: color }, () => text)
      }

      // const status = record.DeviceStatus
      // const enable = ~~status === 2
      // const color = enable ? 'green' : 'red'
      // const text = enable ? '正常' : '停用'
      
    }
  }
]
export const searchFormSchema: FormSchema[] = [
  // {
  //   field: 'Sort',
  //   label: '选择排序',
  //   component: 'Select',
  //   colProps: { span: 8 },
  //   componentProps:{
  //     options:[{
  //       label:'按名称排序',value:'1'
  //     },{
  //       label:'按创建时间排序',value:'2'
  //     }]
  //   }
  // },
  // 接入区域列表
  {
    field: 'RegionId',
    label: '',
    component: 'TreeSelect',
    colProps: { span: 5 },
    componentProps: {
      placeholder: '请选择区域',
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
    colProps: { span: 5 },
    componentProps: {
      placeholder: '请选择设备类型',
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
    colProps: { span: 5 },
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


export const deviceColumns: BasicColumn[] = [
  {
    title: '设备ID',
    dataIndex: 'DeviceId',
    width: 80,
  },
  {
    title: '设备名称',
    dataIndex: 'DeviceName',
    width: 50,
  },

]


// export const searchFormSchema: FormSchema[] = [
//   {
//     field: 'DeviceId',
//     label: '设备ID',
//     component: 'Input',
//     colProps: { span: 8 },
//     componentProps: () => {
//       return {
//         placeholder: '请输入设备ID',
//       }
//     }
//   },
//   {
//     field: 'DeviceName',
//     label: '设备名称',
//     component: 'Input',
//     colProps: { span: 8 },
//     componentProps: () => {
//       return {
//         placeholder: '请输入手机号',
//       }
//     }
//   }
// ]
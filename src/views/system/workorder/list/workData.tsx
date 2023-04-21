import { FormProps, FormSchema, BasicColumn } from '@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { Icon } from '@/components/Icon';

export function TabColumns() {
  return [
    {
      title: '工单号',
      dataIndex: 'TaskTicketNo',
      width: 80,
    },
    {
      title: '优先级',
      dataIndex: 'Priority',
      width: 50,
      customRender: ({ record }) => {
        switch (record.Priority) {
          case 1:
            return h(Tag, { color: 'blue' }, () => '低');

          case 2:
            return h(Tag, { color: 'blue' }, () => '一般');

          case 3:
            return h(Tag, { color: 'yellow' }, () => '紧急');

          case 4:
            return h(Tag, { color: 'red' }, () => '非常紧急');

          default:
            return '异常'
        }
      }
    },
    {
      title: '工单标题',
      dataIndex: 'Title',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'Status',
      width: 50,
      customRender: ({ record }) => {
        switch (record.Status) {
          case 1:
            return h(Tag, { color: 'yellow' }, () => '受理中');

          case 2:
            return h(Tag, { color: 'green' }, () => '已完结');

          default:
            return '异常'
        }
      }
    },
    {
      title: '上报时间',
      dataIndex: ['Basic', 'CreatedAt', 'seconds'],
      width: 100,
      customRender: ({ record }) => {
        let date = new Date(record.Basic.CreatedAt.seconds * 1000);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';

        let h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
        let m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
        let s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
        let strDate = Y + M + D + h + m + s;
        return strDate
      }
    },
    {
      title: '已用时',
      dataIndex: 'usedTime',
      width: 150,
    },
    {
      title: '更新时间',
      dataIndex: ['Basic', 'UpdatedAt', 'seconds'],
      width: 100,
      customRender: ({ record }) => {
        let date = new Date(record.Basic.UpdatedAt.seconds * 1000);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';

        let h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
        let m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
        let s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
        let strDate = Y + M + D + h + m + s;
        return strDate
      }
    },
    {
      title: '受理组',
      dataIndex: 'AcceptanceGroupNames',
      width: 150,
      customRender: ({ record }) => {
        if (record.AcceptanceGroupNames) {
          return record.AcceptanceGroupNames
        } else {
          return '暂无受理组'
        }
      }

    },
    {
      title: '上报类型',
      dataIndex: 'NoticeType',
      width: 80,
      customRender: ({ record }) => {
        switch (record.NoticeType) {
          case 1:
            return '系统上报'

          case 2:
            return '用户上报';

          default:
            return '其他'
        }
      }
    },
  ]
}

export function getFormConfig() {
  return {
    labelWidth: 100,
    // showSubmitButton:false,
    autoAdvancedLine: 2,
    gutter: 32,
    schemas: [
      {
        field: 'Priority',
        label: '优先级',
        component: 'Select',
        componentProps: {
          placeholder: '请选择优先级',
          options: [
            { label: '低', value: 1 },
            { label: '一般', value: 2 },
            { label: '紧急', value: 3 },
            { label: '非常紧急', value: 4 },
          ],
        },
        colProps: { span: 4 },
      },
      {
        field: 'Status',
        label: '工单状态',
        component: 'Select',
        componentProps: {
          placeholder: '请选择工单状态',
          options: [
            { label: '受理中', value: 1 },
            { label: '已完结', value: 2 },

          ],
        },
        colProps: { span: 4 },
      },
      {
        field: 'Search',
        label: ' ',
        labelWidth: '20px',
        component: 'Select',
        componentProps: {
          placeholder: '请选择查询字段',
          options: [
            { label: '工单号', value: 'TaskTicketNo' },
            { label: '工单标题', value: 'Title' },
            { label: '上报时间', value: 'NoticeTime' },
          ],
        },
        colProps: { span: 3 },
      },
      {
        field: 'SearchValue',
        label: ' ',
        ifShow: ({ values }) => {
          return values.Search !== 'NoticeTime'
        },
        labelWidth: '5px',
        component: 'Input',
        componentProps: {
          placeholder: '请输入关键字',
        },
        colProps: { span: 6 },
      },
      {
        field: 'NoticeTime',
        label: ' ',
        ifShow: ({ values }) => {
          return values.Search === 'NoticeTime'
        },
        labelWidth: '20px',
        component: 'DatePicker',
        componentProps: {
          placeholder: '请选择时间',
        },
        colProps: { span: 6 },
      },
    ],
  };
}

export const getwarnFormConfig: FormSchema[] = [
  {
    field: 'TemplateId',
    label: '工单模板',
    component: 'Select',
    componentProps: {
      placeholder: '请选择工单模块',
      options: [
        { label: '默认模板', value: 1 }
      ],
      // onChange:(e)=>{
      //   console.log(e)
      //   setFieldsValue({
      //     TemplateName:e
      // });
      // }
    },
    required: true,
  },
  {
    field: 'TemplateName',
    label: '工单模板名称',
    component: 'Input',
    // componentProps: {
    //   defaultValue:'0',
    // },
    // defaultValue:'0',
    // required: true,
    show: ({ values }) => {
      return false
    }
  },
  {
    field: 'Title',
    label: '工单标题',
    component: 'Input',
    componentProps: {
      placeholder: '请输入工单标题'
    },
    required: true,
  },
  {
    field: 'Priority',
    label: '优先级',
    component: 'RadioButtonGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '低', value: 1 },
        { label: '一般', value: 2 },
        { label: '紧急', value: 3 },
        { label: '非常紧急', value: 4 }
      ]
    },
    required: true,
  },
  {
    field: 'Content',
    label: '工单内容',
    component: 'InputTextArea',
    componentProps: {
      placeholder: '请输入工单内容'
    },
    required: true,
  },

]


export const deviceColumns: BasicColumn[] = [
  {
    title: '可添加设备',
    dataIndex: 'DeviceName',
    width: 160,
  },
  {
    title: '设备ID',
    dataIndex: 'DeviceId',
    width: 160,
  },
  {
    title: '创建时间',
    dataIndex: ['Basic', 'CreatedAt', 'seconds'],
    width: 100,
    customRender: ({ record }) => {
      let date = new Date(record.Basic.CreatedAt.seconds * 1000);
      let Y = date.getFullYear() + '-';
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';

      let h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
      let m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
      let s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
      let strDate = Y + M + D + h + m + s;
      return strDate
    }
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
          text = '启用'
          return h(Tag, { color: color }, () => text)
        case 2:
          color = 'red'
          text = '禁用'
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
          text = '离线'
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
  //   field: 'DeviceId',
  //   label: '设备ID',
  //   component: 'Input',
  //   colProps: { span: 8 },
  //   componentProps: () => {
  //     return {
  //       placeholder: '请输入设备ID',
  //     }
  //   }
  // },
  {
    field: 'RegionId',
    label: ' ',
    labelWidth:5,
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
    label: ' ',
    labelWidth:5,
    component: 'TreeSelect',
    colProps: { span: 6 },
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
    label: ' ',
    labelWidth:5,
    component: 'Input',
    colProps: { span: 7 },
    componentProps: () => {
      return {
        placeholder: '请输入设备名称',
      }
    }
  }
]
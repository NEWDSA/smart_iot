import { FormProps, FormSchema } from '@/components/Table';
import { BasicColumn } from '@/components/Table/src/types/table';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '编号',
      dataIndex: 'Id',
      fixed: 'left',
      width: 200,
    },
    {
      title: '告警内容',
      dataIndex: 'AlertContent',
      width: 150,
    },
    {
      title: '告警类别',
      dataIndex: 'AlertType',
      width: 150,
      customRender: ({ record }) => {
        let msg
        record.AlertType == 1 ? msg = '异常告警' : record.AlertType == 2 ? msg = '故障告警' : '其他告警'
        return msg
      },
    },
    {
      title: '告警级别',
      dataIndex: 'AlertLevel',
      width: 150,
      sorter: true,
    },
    {
      title: '告警方式',
      width: 150,
      sorter: true,
      dataIndex: 'AlertMode',
      customRender: ({ record }) => {
        let msg
        record.AlertMode == 1 ? msg = '信息通知' : msg = '短信通知'
        return msg
      },

    },
    {
      title: '告警时间',
      width: 150,
      sorter: true,
      dataIndex: ['Basic', 'CreatedAt', 'seconds'],
      customRender: ({ record }) => {
        // console.log('record',record)
        var date = new Date(record.Basic.CreatedAt.seconds * 1000);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';

        var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
        var s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
        var strDate = Y + M + D + h + m + s;
        return strDate
      },
    },
  ];
}

export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    showSubmitButton: false,
    autoAdvancedLine: 2,
    schemas: [
      {
        field: 'SortMode',
        label: '排序方式',
        component: 'Select',
        componentProps: {
          options: [
            { label: 'ID排序', value: '2' },
            { label: '时间排序', value: '1' },
          ],
        },
        colProps: { span: 4 },
      },
      {
        field: 'AlertMode',
        label: '警告方式',
        component: 'Select',
        componentProps: {
          options: [
            { label: '信息提醒', value: '1' },
            { label: '短信提醒', value: '2' },
          ],
        },
        colProps: { span: 4 },
      },
      {
        field: 'AlertContent',
        label: ' ',
        component: 'Input',
        componentProps: {
          placeholder: '请输入查询关键字'
        },
        colProps: { span: 8 },
      },

    ],
  };
}

export function getLogFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    autoAdvancedLine: 2,
    schemas: [
      {
        field: '[StartTime, EndTime]',
        label: '时间范围',
        component: 'RangePicker',
        componentProps: {
          format: 'YYYY-MM-DD HH:mm:ss',
          placeholder: ['开始时间', '结束时间'],
          showTime: { format: 'HH:mm:ss' },
        },
        colProps: { span: 4 },
      },
      {
        field: 'LogType',
        label: '警告方式',
        component: 'Select',
        componentProps: {
          options: [
            { label: '信息提醒', value: '1' },
            { label: '短信提醒', value: '2' },
          ],
        },
        colProps: { span: 4 },
      },
      {
        field: 'AlertContent',
        label: ' ',
        component: 'Input',
        componentProps: {
          placeholder: '请输入查询关键字'
        },
        colProps: { span: 8 },
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
      option: [
        { label: '默认模板', value: '1' }
      ]
    },
    required: true,
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
    defaultValue: '4',
    componentProps: {
      options: [
        { label: '低', value: '4' },
        { label: '一般', value: '3' },
        { label: '紧急', value: '2' },
        { label: '非常紧急', value: '1' }
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
  // {
  //   field: 'AcceptanceGroup',
  //   label: '工单受理组',
  //   component: 'TreeSelect',
  //   componentProps: {
  //     placeholder: '请选择受理组',
  //     multiple: true,
  //     fieldNames:{ key: 'Id', label: 'Name',value: 'Id', }
  //     // getPopupContainer: () => document.body
  //   },
  //   required: true,
  // },
  // {
  //   field: 'Acceptor',
  //   label: '工单受理人',
  //   component: 'Select',
  //   componentProps: {
  //     placeholder: '请选择受理人',
  //     mode: 'multiple',
  //     options:[
  //       { label:'请选择',value:'0' }
  //     ]
  //     // getPopupContainer: () => document.body
  //   },
  //   required: true,
  // },
  // {
  //   field: 'Followers',
  //   label: '工单关注人',
  //   component: 'Select',
  //   componentProps: {
  //     placeholder: '请选择关注人',
  //     mode: 'multiple',

  //     // getPopupContainer: () => document.body
  //   },
  //   required: true,
  // },

]

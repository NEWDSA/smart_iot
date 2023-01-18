import { FormSchema } from '@/components/Table'

export function TabColumns() {
  return [
    {
      title: '编号',
      dataIndex: 'VisitorTypeId',
      width: 150,
    },
    {
      title: '分类名称',
      dataIndex: 'VisitorTypeName',
      width: 150,
    },
    {
      title: '排序',
      dataIndex: 'VisitorTypeSort',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'VisitorTypeState',
      width: 150,
      customRender: ({ record }) => {
        let msg
        record.VisitorTypeState == 1 ? msg = '正常' : msg = '停用'
        return msg
      },
    },
    {
      title: '创建时间',
      dataIndex: ['Basic', 'CreatedAt', 'seconds'],
      width: 150,
      customRender: ({ record }) => {
        // console.log('record',record)
        var date = new Date(record.Basic.CreatedAt.seconds *1000);
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

export const formSchema: FormSchema[] = [
  {
    field: 'VisitorTypeName',
    label: '访客类型名称',
    component: 'Input',
    required: true
  },
  {
    field: 'VisitorTypeSort',
    label: '排序',
    component: 'InputNumber',
    required: true
  },
  {
    field: 'VisitorTypeState',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '正常', value: 1 },
        { label: '停用', value: 2 }
      ]
    },
    required: true
  },

]

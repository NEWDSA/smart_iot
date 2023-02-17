import { FormProps, FormSchema } from '@/components/Table';
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
      width: 100,
    },
    {
      title: '工单标题',
      dataIndex: 'Title',
      width: 50,
    },
    {
      title: '状态',
      dataIndex: 'Status',
      width: 150,
      
    },
    {
      title: '上报时间',
      dataIndex: 'NoticeTime',
      width: 50,
    },
    {
      title: '已用时',
      dataIndex: 'Reason',
      width: 150,
    },
    {
      title: '更新时间',
      dataIndex: 'Status',
      width: 50,
    },
    {
      title: '受理组',
      dataIndex: 'AcceptanceGroup',
      width: 150,
    },
    {
      title: '上报类型',
      dataIndex: 'NoticeType',
      width: 150,
    },
  ]
}

export function getFormConfig() {
  return {
    labelWidth: 100,
    // showSubmitButton:false,
    autoAdvancedLine: 2,
    gutter:32,
    schemas: [
      {
        field: 'VisitorTypeId',
        label: '优先级',
        component: 'Select',
        componentProps: {
          placeholder: '请选择访客类型',
          fieldNames: {
            label: 'VisitorTypeName',
            key: 'VisitorTypeId',
            value: 'VisitorTypeId'
          },
          // options: [
          //   { label: '访客类型', value: 'VisitorTypeId' },
          //   { label: '手机号', value: 'VisitorPhone' },
          //   { label: '访客名称', value: 'VisitorName' },
          //   { label: '车牌号', value: 'LicensePlate' },
          //   { label: '预定时间', value: 'AppointTime' },
          // ],
        },
        colProps: { span: 4 },
      },
      {
        field: 'Status',
        label: '工单状态',
        component: 'Select',
        componentProps: {
          placeholder: '请选择访客状态',
          options: [
            { label: '待确认', value: 1 },
            { label: '已预约', value: 2 },
            { label: '已登记', value: 3 },
            { label: '已离开', value: 4 },
            { label: '已取消', value: 5 },
            { label: '已推迟', value: 6 },
          ],
        },
        colProps: { span: 4 },
      },
      {
        field: 'Search',
        label: ' ',
        labelWidth:'20px',
        component: 'Select',
        defaultValue:'VisitorName',
        componentProps: {
          placeholder: '请选择查询字段',
          options: [
            { label: '访客姓名', value: 'VisitorName' },
            { label: '联系电话', value: 'VisitorPhone' },
          ],
        },
        colProps: { span: 3},
      },
      {
        field: 'SearchValue',
        label: ' ',
        labelWidth:'20px',
        component: 'Input',
        colProps: { span: 6},
      }, 
    ],
  };
}
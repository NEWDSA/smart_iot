import { FormProps, FormSchema } from '@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { Icon } from '@/components/Icon';

export function TabColumns() {
  return [

    {
      title: '用户',
      dataIndex: 'VisitorName',
      width: 80,
    },
    {
      title: '联系电话',
      dataIndex: 'VisitorPhone',
      width: 100,
    },
    {
      title: '访客类型',
      dataIndex: 'VisitorTypeName',
      width: 50,
    },
    {
      title: '预约时间',
      dataIndex: ['AppointTime', 'seconds'],
      width: 150,
      customRender: ({ record }) => {
        // console.log('record', record)
        var date = new Date(record.AppointTime.seconds * 1000);
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
    {
      title: '车牌号',
      dataIndex: 'LicensePlate',
      width: 50,
    },
    {
      title: '到访事由',
      dataIndex: 'Reason',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'Status',
      width: 50,
      customRender: ({ record }) => {
        switch (record.Status) {
          case 1:
            return h(Tag, { color: 'blue' }, () => '待确认');

          case 2:
            return h(Tag, { color: 'green' }, () => '已预约');

          case 3:
            return h(Tag, { color: 'rgb(26, 177, 196)' }, () => '已登记');

          case 4:
            return h(Tag, { color: 'rgb(203, 203, 203)' }, () => '已离开');

          case 5:
            return h(Tag, { color: 'red' }, () => '已取消');

          case 6:
            return h(Tag, { color: 'rgb(255, 191, 0)' }, () => '已推迟');

          default:
            return '状态异常'
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
    gutter:32,
    actionColOptions: {
      span: 5,
    },
    schemas: [
      {
        field: 'VisitorTypeId',
        label: '访客类型',
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
        label: '访客状态',
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


export const formSchema: FormSchema[] = [
  {
    label: '访客姓名',
    field: 'VisitorName',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入访客姓名',

    }
  },
  {
    label: '联系电话',
    field: 'VisitorPhone',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入联系电话',
    }
  },
  {
    label: '访客类型',
    field: 'VisitorTypeId',
    component: 'Select',
    required: true,
    componentProps: {
      placeholder: '请选择访客类型',
      fieldNames: {
        value: 'VisitorTypeId',
        label: 'VisitorTypeName'
      },
    }
  },
  {
    label: '接待人',
    field: 'ReceptionId',
    component: 'Select',
    required: true,
    componentProps: {
      placeholder: '请选择接待人',
      mode: 'multiple',
      fieldNames: {
        value: 'UserId',
        label: 'UserName'
      },
      
      // getPopupContainer: () => document.body
    },

  },
  {
    label: '预约时间',
    field: "yuyueTime",
    component: 'DatePicker',
    componentProps: {
      placeholder: '请选择预约时间',
      showTime: { format: 'HH:mm:ss' },
      valueFormat: "YYYY-MM-DD HH:mm:ss"
    },
    required: true,
  },
  {
    label: '单位名称',
    field: 'Company',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入单位名称',
    },
  },
  // {
  //   label: '正面照片',
  //   field: 'Photo',
  //   component: 'CropperImage',
  //   componentProps: {
  //     listType: 'picture-card',
  //   },
  //   required: true,
  // },
  {
    label: '车牌号',
    field: 'LicensePlate',
    component: 'Input',
    required: false,
    componentProps: {
      placeholder: '请输入车牌号',
    },
  },
  {
    label: '到访事由',
    field: 'Reason',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入到访事由',
    },
  },
  {
    label: '状态', 
    field: 'Status',
    component: 'Select',
    required: true,
    defaultValue:1,
    componentProps: {
      options: [
        { label: '待确认', value: 1 },
        { label: '已预约', value: 2 },
        { label: '已登记', value: 3 },
        { label: '已离开', value: 4 },
        { label: '已取消', value: 5 },
        { label: '已推迟', value: 6 },
      ],
    },
  },
  // {
  //   label: '备注',
  //   field: 'Remarks',
  //   component: 'Input',
  //   required: false,
  // },

];
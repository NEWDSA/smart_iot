import { FormProps, FormSchema } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';

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
        record.AlertType == 1 ? msg = '异常告警' :  record.AlertType == 2 ? msg = '故障告警' : '其他告警'
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
      dataIndex:['Basic','CreatedAt','seconds'],
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

export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    showSubmitButton:false,
    autoAdvancedLine:2,
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
        colProps: { span: 8 },
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
        colProps: { span: 8 },
      },
    ],
  };
}

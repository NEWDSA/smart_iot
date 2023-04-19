import { BasicColumn } from '@/components/Table/src/types/table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '分类名称',
      dataIndex: 'TypeName',
      // editRow: true,
      width: 150,
      // slots:{ customRender : 'name'}
    },
    {
      title: '排序',
      dataIndex: 'SortPosition',
      // editRow: true,
      // onEditRow:
      width: 100,
      // slots:{ customRender : 'address'}
      customRender: ({ record }) => {
        if (!record.SortPosition) {
            return 0 
        }

      },
    },
    {
      title: '状态',
      dataIndex: 'Status',
      // editRow: true,
      // onEditRow:
      width: 200,
      customRender: ({ record }) => {
        switch (record.Status) {
          case 1:
            return h(Tag, { color: 'green' }, () => '正常');

          case 2:
            return h(Tag, { color: 'red' }, () => '停用');

          default:
            return h(Tag, { color: 'ref' }, () => '异常');  
        }

      },
    },
    {
      title: '创建时间',
      dataIndex: ['Basic','CreatedAt','seconds'],
      // editRow: true,
      // onEditRow:
      width: 200,
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
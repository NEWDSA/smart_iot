import { BasicColumn } from '@/components/Table/src/types/table';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '分类名称',
      dataIndex: 'TypeName',
      // editRow: true,
      width: 80,
      // slots:{ customRender : 'name'}
    },
    {
      title: '排序',
      dataIndex: 'SortPosition',
      // editRow: true,
      // onEditRow:
      width: 100,
      // slots:{ customRender : 'address'}
    },
    {
      title: '说明',
      dataIndex: 'TypeName',
      // editRow: true,
      // onEditRow:
      width: 700,
      // slots:{ customRender : 'address'}
    },


  ];
}
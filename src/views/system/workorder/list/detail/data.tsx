export interface ListItem {
  title: string;
  icon: string;
  color?: string;
}

export interface TabItem {
  key: string;
  name: string;
  component: string;
}
export const achieveList: TabItem[] = [
  {
    key: '1',
    name: '工单属性',
    component: 'workorderDetail',
  },
  {
    key: '2',
    name: '设备资料',
    component: 'deviceDetail',
  },
  {
    key: '3',
    name: '操作日志',
    component: 'log',
  },
];
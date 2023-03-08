export interface ListItem {
  id: string
  avatar: string
  // 通知的标题内容
  title: string
  // 是否在标题上显示删除线
  titleDelete?: boolean
  datetime: string
  type: string
  read?: boolean
  description: string
  clickClose?: boolean
  extra?: string
  color?: string
}

export interface TabItem {
  key: string
  name: string,
  component:string,
  unreadlist?: ListItem[]
}

export const tabListData: TabItem[] = [
  {
    key: '0',
    name: '全部',
    component:'NoticeLists'
  },
  {
    key: '1',
    name: '设备告警',
    component:'NoticeLists'
  },
  {
    key: '2',
    name: '工单',
    component:'NoticeLists'
  }
]

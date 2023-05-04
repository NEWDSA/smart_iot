import emitter from '@/utils/mybus'
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
  name: string
  component: string
  total: string
  unreadlist?: ListItem[]
  list: []
}
import { isRead } from '@/api/demo/system'
const myTabList: any = []
export const tabListData: TabItem[] = myTabList

async function getData2(type) {
  myTabList.value=[];
  const data = await isRead({
    PageNum: 1,
    PageSize: 10,
    Type: type
  })
  myTabList.push({
    key: type,
    name: type == 0 ? '全部' : type == 1 ? '设备告警' : type == 2 ? '工单' : '',
    component: '',
    list: data.Detail,
    total: data.Total
  })
  console.log(myTabList.value,'......myTablist....')
}
// emitter.on('')
// emitter.on('getDataAvatar', async () => {
  // 对接口进行重置
  // myTabList.value=[];
  for (var i = 0; i <= 2; i++) {
    await getData2(i)
  }
// })



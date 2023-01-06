import { realHttp } from '@/utils/http/axios'
import { getMenuListResultModel } from './model/menuModel'


enum Api {
  // GetMenuList = '/getMenuList' // 模拟数据
  GetMenuListReal = '/system/user/getRouters' //后端接口
}

/**
 * @description: Get user menu based on id
 */
//获取菜单列表
export const getMenuList = () => {
  // return defHttp.get<getMenuListResultModel>({ url: Api.GetMenuList }) // 模拟数据
  return realHttp.get<getMenuListResultModel>(
    {
      url: Api.GetMenuListReal
    },{
      isTransformResponse:true
    }
  )
}

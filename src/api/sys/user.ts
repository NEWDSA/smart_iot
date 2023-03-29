import { defHttp,realHttp } from '@/utils/http/axios'
import { message } from 'ant-design-vue'
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel'

import { ErrorMessageMode } from '/#/axios'

enum Api {
  Login = '/login',
  LoginReal='/user/login',
  Logout = '/system/user/logout',
  GetUserInfo = '/getUserInfo',
  GetUserInfoReal='/system/user/getInfo',
  GetPermCode = '/getPermCode',
  TestRetry = '/testRetry',

  
  SystemUserMenu = '/system/user/menu',
  SystemUserMenuTreeSelect = '/system/user/menuTreeSelect'
}


/**
 * @description: user login api
 */
// 登录
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return realHttp.post<LoginResultModel>({
    url:Api.LoginReal,
    params
  },{
    errorMessageMode: 'message'
  })
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  // return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' })  //模拟数据
  return realHttp.get<GetUserInfoModel>({
    url:Api.GetUserInfoReal
  },{ errorMessageMode: 'modal' })
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode })
}

// 登出
export function doLogout() {
  return realHttp.get({ url: Api.Logout })
}

export function testRetry() {
  return defHttp.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000
      }
    }
  )
}

// 渲染快捷菜单
export function shortCutMenu() {
  return realHttp.get(
    { url: Api.SystemUserMenu }
  )
}

// 添加渲染快捷菜单POST GET 的区别
export function AddshortCutMenu(params) {
  return realHttp.post(
    { url: Api.SystemUserMenu,
      params
    }
  )
}

// 获取快捷菜单checkbox
export function shortCutTreeSelectMenu() {
  return realHttp.get(
    { url: Api.SystemUserMenuTreeSelect }
  )
}



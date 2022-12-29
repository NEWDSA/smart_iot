import { defHttp,realHttp } from '@/utils/http/axios'
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel'

import { ErrorMessageMode } from '/#/axios'

enum Api {
  Login = '/login',
  LoginReal='/user/login',
  Logout = '/logout',
  GetUserInfo = '/getUserInfo',
  GetUserInfoReal='/system/user/getInfo',
  GetPermCode = '/getPermCode',
  TestRetry = '/testRetry'
}


/**
 * @description: user login api
 */
// TODO:更改为 后端真实接口
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  // return defHttp.post<LoginResultModel>(
  //   {
  //     url: Api.Login,
  //     params
  //   },
  //   {
  //     errorMessageMode: mode
  //   }
  // )
  return realHttp.post<LoginResultModel>({
    url:Api.LoginReal,
    params
  },{
    errorMessageMode: mode
  })
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  // return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' })  //模拟数据
  return realHttp.get<GetUserInfoModel>({
    url:Api.GetUserInfoReal
  },{
    errorMessageMode: 'none'
  })
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode })
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout })
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

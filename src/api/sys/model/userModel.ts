/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string
  password: string
}

export interface RoleInfo {
  roleName: string
  value: string
}

/**
 * @description: Login interface return value
 */
//  TODO:根据后端接口进行修改
export interface LoginResultModel {
  userId: string | number
  // token: string    // 模拟数据
  Token:string,
  role: RoleInfo
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  Roles: RoleInfo[]
  // 用户id
  UserId: string | number
  // 用户名
  username: string
  // 真实名字
  realName: string
  // 头像
  avatar: string
  // 介绍
  desc?: string,
  user?:any
}

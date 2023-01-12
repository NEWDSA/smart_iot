import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel'

export type AccountParams = BasicPageParams & {
  account?: string
  nickname?: string
}

export type regionParam = BasicPageParams & {
  RegionId: number
  TypeId: number
  Sort: number
}
export type RoleParams = {
  RoleId: number
  roleName?: string
  status?: string
  MenuIds?: [] // 添加角色ID
}

export type RolePageParams = BasicPageParams & RoleParams

export type DeptParams = {
  deptName?: string
  status?: string
  DeptId: number
  id: string
  orderNo: string
  createTime: string
  remark: string
}

export type MenuParams = {
  MenuId?: number
  MenuName?: string
  ParentId?: 0
  OrderNum?: number
  Path?: string
  Component?: string
  IsFrame?: string
  IsCache?: string
  MenuType?: string
  Visible?: string
  Status?: string
  Perms?: string
  Icon?: string
}

export interface AccountListItem {
  id: string
  account: string
  email: string
  nickname: string
  role: number
  createTime: string
  remark: string
  status: number
}

export interface DeptListItem {
  DeptId: number
  id: string
  orderNo: string
  createTime: string
  remark: string
  status: number
}

export interface MenuListItem {
  // id: string;
  // orderNo: string;
  // createTime: string;
  // status: number;
  // icon: string;
  // component: string;
  // permission: string;
  Component: string
  CreateBy: string
  CreateTime: string
  Icon: string
  IsCache: string
  IsFrame: number
  MenuId: number
  MenuName: string
  MenuType: string
  OrderNum: string
  ParentId: number
  Path: string
  Perms: string
  Query: string
  Remark: string
  Status: number
  UpdateBy: string
  UpdateTime: string
}

export interface TreeListItem {
  TreeSelect: any
  Id: number
  ParentId: number
  Name: string
  Children: []
}

export interface RoleListItem {
  RoleId: string
  roleName: string
  RoleKey: string
  Status: number
  Remark: string
  MenuIds: []
}

/**
 * @description: Request list return value
 */
export type AccountListGetResultModel = BasicFetchResult<AccountListItem>

export type DeptListGetResultModel = BasicFetchResult<DeptListItem>

export type MenuListGetResultModel = BasicFetchResult<MenuListItem>

export type RolePageListGetResultModel = BasicFetchResult<RoleListItem>

export type RoleListGetResultModel = RoleListItem[]

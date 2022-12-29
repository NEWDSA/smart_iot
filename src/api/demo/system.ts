import {
  AccountParams,
  DeptListItem,
  MenuParams,
  RoleParams,
  RolePageParams,
  MenuListGetResultModel,
  DeptListGetResultModel,
  AccountListGetResultModel,
  RolePageListGetResultModel,
  RoleListGetResultModel,
} from './model/systemModel';
import { defHttp,realHttp } from '@/utils/http/axios';


enum Api {
  AccountList = '/system/getAccountList',
  IsAccountExist = '/system/accountExist',
  DeptList = '/system/getDeptList',
  setRoleStatus = '/system/role/changeStatus',
  MenuList = '/system/getMenuList',
  MenuRealList='/system/menu',
  RolePageList = '/system/getRoleListByPage',
  RoleRealPageList='/system/role',
  RoleStatus='/system/role/changeStatus',
  createRole='/system/role',
  DelRole='/system/role',
  GetAllRoleList = '/system/getAllRoleList',
}

export const getAccountList = (params: AccountParams) =>
  defHttp.get<AccountListGetResultModel>({ url: Api.AccountList, params });

export const getDeptList = (params?: DeptListItem) =>
  defHttp.get<DeptListGetResultModel>({ url: Api.DeptList, params });

  // 获取菜单
export const getMenuList = (params?: MenuParams) =>
  // defHttp.get<MenuListGetResultModel>({ url: Api.MenuList, params }); //模拟数据
  realHttp.get<MenuListGetResultModel>({ url: Api.MenuRealList, params }) //后端接口

export const getRoleListByPage = (params?: RolePageParams) =>
  // defHttp.get<RolePageListGetResultModel>({ url: Api.RolePageList, params }); //模拟数据
  realHttp.get<RolePageListGetResultModel>({ url: Api.RoleRealPageList,params }); //后端接口

export const getAllRoleList = (params?: RoleParams) =>
  defHttp.get<RoleListGetResultModel>({ url: Api.GetAllRoleList, params });

// export const setRoleStatus = (id: number, status: string) =>
//   defHttp.post({ url: Api.setRoleStatus, params: { id, status } });  //

// 创建角色
export const CreateRole=(params?:RoleParams)=>
realHttp.post<RolePageListGetResultModel>({ url: Api.createRole,params }); //后端接口

// 删除角色
export const DelRole=(params?:RoleParams)=>{
  realHttp.delete<RolePageListGetResultModel>({ url: Api.DelRole,params }); //后端接口
}
// 修改角色
export const ModifiRole=(params?:RoleParams)=>{
  console.log(params,'...修改角色....')
  realHttp.put<RolePageListGetResultModel>({ url: Api.createRole,params:{...params,RoleId:menu}}); //后端接口
}
// 修改角色状态
export const setRoleStatus = (RoleId: number, Status: string) =>
realHttp.put({ url: Api.RoleStatus, params: { RoleId, Status } });  //后端接口




export const isAccountExist = (account: string) =>
  defHttp.post({ url: Api.IsAccountExist, params: { account } }, { errorMessageMode: 'none' });

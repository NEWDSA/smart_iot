import {
  AccountParams,
  DeptParams,
  MenuParams,
  RoleParams,
  RolePageParams,
  MenuListGetResultModel,
  DeptListGetResultModel,
  AccountListGetResultModel,
  RolePageListGetResultModel,
  RoleListGetResultModel,
  TreeListItem
} from './model/systemModel'
import { defHttp, realHttp } from '@/utils/http/axios'

enum Api {
  AccountList = '/system/user',
  IsAccountExist = '/system/accountExist',
  DeptList = '/system/getDeptList',
  DeptReal = '/system/dept',
  Depttree = '/system/dept/treeselect',
  setRoleStatus = '/system/role/changeStatus',
  MenuList = '/system/getMenuList',
  MenuRealList = '/system/menu',
  MenuTree = '/system/menu/treeSelect',
  RoleMenuTree = '/system/menu/roleMenuTreeSelect',
  RouterList = '/system/user/getRouters',
  CreateDept = '/system/dept',
  RolePageList = '/system/getRoleListByPage',
  RoleRealPageList = '/system/role',
  RoleStatus = '/system/role/changeStatus',
  createRole = '/system/role',
  DelRole = '/system/role',
  GetAllRoleList = '/system/role',
  RoleUserList = '/system/role/authUser/allocatedList',
  GetBull = '/system/usersDept',
  RoleUnUserList = '/system/role/authUser/unallocatedList',
  buckPermissionUser = '/system/role/authUser/selectAll',
  delAuthUser = '/system/role/authUser/cancel',
  delAuthUserList = '/system/role/authUser/cancelAll',
  updaePwd='/system/user/updatePwd'
}

// 获取用户列表
export const getAccountList = (params: AccountParams) =>
  realHttp.get({ url: Api.AccountList, params }, { isTransformResponse: true })

// 修改用户信息
export const modifiAccountList = (params: AccountParams) =>
  realHttp.put<AccountListGetResultModel>(
    { url: Api.AccountList, params },
    { isTransformResponse: true }
  )
// 修改用户密码
export const updatePwd = (params?) =>
  realHttp.put(
    {
      url: Api.updaePwd,
      params
    },
    {
      isTransformResponse: true
    }
  )
// /system/user/updatePwd
// 根据编号获取详细信息
export const getUserRole = (params?) =>
  realHttp.get({ url: `${Api.AccountList}/${params}` }, { isTransformResponse: true })
// 新增用户信息
export const createAccountList = (params: AccountParams) =>
  realHttp.post<AccountListGetResultModel>(
    { url: Api.AccountList, params },
    { isTransformResponse: true }
  )
// 删除用户信息
export const delAccount = (params) =>
  realHttp.delete<AccountListGetResultModel>(
    { url: Api.AccountList, params },
    { isTransformResponse: true }
  )

// 获取部门列表
export const getDeptList = (params?: DeptParams) =>
  realHttp.get({ url: Api.DeptReal, params }, { isTransformResponse: true })

// 部门下拉列表
export const getDeptDrop = (params?: DeptParams) =>
  realHttp.get<TreeListItem>({ url: Api.Depttree, params }, { isTransformResponse: true })

// 创建部门
export const createDept = (params?: DeptParams) =>
  realHttp.post<DeptListGetResultModel>({ url: Api.CreateDept, params })

// 修改部门
export const modifiDept = (params?: DeptParams) =>
  realHttp.put<DeptListGetResultModel>({ url: Api.CreateDept, params })

// 删除部门
export const DelDept = (params) =>
  realHttp.delete<DeptListGetResultModel>({ url: Api.CreateDept, params })
// 批量调动用户部门接口
export const BulkDept = (params) => {
  realHttp.put({ url: Api.GetBull, params })
}

// 获取菜单
export const getMenuList = (params?: MenuParams) =>
  realHttp.get(
    {
      url: Api.MenuRealList,
      params
    },
    {
      isTransformResponse: true
    }
  )

// 编辑菜单
export const editMenuList = (params?: MenuParams) =>
  realHttp.put<MenuListGetResultModel>(
    {
      url: Api.MenuRealList,
      params
    },
    {
      isTransformResponse: true
    }
  )
// 新增菜单
export const createMenuList = (params?: MenuParams) =>
  realHttp.post<MenuListGetResultModel>(
    {
      url: Api.MenuRealList,
      params
    },
    {
      isTransformResponse: true
    }
  )

// 删除菜单
export const DelMenuList = (params?: MenuParams) =>
  realHttp.delete<MenuListGetResultModel>(
    {
      url: Api.MenuRealList,
      params
    },
    {
      isTransformResponse: true
    }
  )

// 获取菜单下拉列表树
export const getMenTree = (params?) =>
  realHttp.get({ url: Api.MenuTree, params }, { isTransformResponse: true })

// 根据角色加载对应菜单列表树
export const geRoletMenTree = (params?) =>
  realHttp.get({ url: `${Api.RoleMenuTree}/${params}` }, { isTransformResponse: true })

export const getRoleListByPage = (params?: RolePageParams) =>
  realHttp.get({ url: Api.RoleRealPageList, params }) //后端接口

// 获取角色列表
export const getAllRoleList = (params?: RoleParams) =>
  realHttp.get({ url: Api.GetAllRoleList, params })

// 创建角色
export const CreateRole = (params?: RoleParams) =>
  realHttp.post<RolePageListGetResultModel>({ url: Api.createRole, params }) //后端接口

// 删除角色
export const DelRole = (params?: RoleParams) => {
  realHttp.delete<RolePageListGetResultModel>({ url: Api.DelRole, params }) //后端接口
}
// 修改角色
export const ModifiRole = (params?: RoleParams) => {
  realHttp.put<RolePageListGetResultModel>({ url: Api.createRole, params }) //后端接口
}
// 修改角色状态
export const setRoleStatus = (RoleId: number, Status: string) =>
  realHttp.put({ url: Api.RoleStatus, params: { RoleId, Status } }) //后端接口
//admin12345

// 查询已分配用户角色列表
export const RoleUserList = (params?) => realHttp.get({ url: Api.RoleUserList, params }) //后端接口

// 查询未分配用户角色列表
export const RoleUnUserList = (params?) => realHttp.get({ url: Api.RoleUnUserList, params }) //后端接口

// 批量选择用户授权
export const buckPermissionUser = (params?) => realHttp.put({ url: Api.buckPermissionUser, params }) //后端接口

// 取消授权用户
export const delAuthUser = (params?) => realHttp.put({ url: Api.delAuthUser, params }) //后端接口

// 批量取消授权用户
export const delAuthUserList = (params?) => realHttp.put({ url: Api.delAuthUserList, params }) //后端接口

export const isAccountExist = (account: string) =>
  defHttp.post({ url: Api.IsAccountExist, params: { account } }, { errorMessageMode: 'none' })

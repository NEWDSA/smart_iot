import { realHttp } from '@/utils/http/axios'
// import { getMenuListResultModel } from './model/menuModel'


enum Api {
  // GetMenuList = '/getMenuList' // 模拟数据
  RuleSave = '/rule/save', //新增场景
  RuleInfo = '/rule/info', //场景详情
  RuleEdit = '/rule/edit',  //场景编辑
  RuleDeptPage = '/rule/dept/page',  //可控场景列表
  RuleFreeList = '/rule/free/list',  //可分配场景列表
  RuleDeptSave = '/rule/dept/save',  //分配场景到部门
  RuleDeptDelete = '/rule/dept/delete',  //移出场景出部门
}

/**
 * @description: Get user menu based on id
 */
//添加场景
export function RuleSaveApi(params) {
  return realHttp.post({
    url: Api.RuleSave,
    params
  })
}

//场景详情
export function RuleInfoApi(params) {
  return realHttp.get({
    url: Api.RuleInfo,
    params
  })
}

//场景编辑
export function RuleEditApi(params) {
  return realHttp.put({
    url: Api.RuleEdit,
    params
  })
}

//可控场景列表
export function RuleDeptPageApi(params) {
  return realHttp.get({
    url: Api.RuleDeptPage,
    params
  })
}

//可分配场景列表
export function RuleFreeListApi(params) {
  return realHttp.get({
    url: Api.RuleFreeList,
    params
  })
}

//分配场景到部门
export function RuleDeptSaveApi(params) {
  return realHttp.post({
    url: Api.RuleDeptSave,
    params
  })
}

//移出场景出部门
export function RuleDeptDeleteApi(params) {
  return realHttp.delete({
    url: Api.RuleDeptDelete,
    params
  })
}


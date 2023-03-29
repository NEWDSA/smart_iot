import { realHttp } from '@/utils/http/axios'
// import { getMenuListResultModel } from './model/menuModel'


enum Api {
  // GetMenuList = '/getMenuList' // 模拟数据
  RuleSave = '/rule/save', //新增场景
  RuleInfo = '/rule/info', //场景详情
  RuleEdit = '/rule/edit'  //场景编辑
}

/**
 * @description: Get user menu based on id
 */
//添加场景
export function RuleSaveApi(params) {
    return realHttp.post({
      url:Api.RuleSave,
      params
    })
  }

  //场景详情
export function RuleInfoApi(params) {
  return realHttp.get({
    url:Api.RuleInfo,
    params
  })
}

  //场景编辑
  export function RuleEditApi(params) {
    return realHttp.put({
      url:Api.RuleEdit,
      params
    })
  }


import { realHttp } from '@/utils/http/axios'

enum Api {
    TaskTicketPage = '/task/ticket/page',
    TaskTicketInfo = '/task/ticket/info',
    TaskTicketLogList = '/task/ticket/log/list',
    TaskTicketSave = '/task/ticket/save',
    TaskTicketProgressList = '/task/ticket/progress/list',
    TaskTicketProgressSave = '/task/ticket/progress/save',
    TaskTicketHandOver = '/task/ticket/hand/over',
    TaskTicketEdit = '/task/ticket/edit',
    TaskTicketCopy = '/task/ticket/copy',
    TaskTicketAuth = '/task/ticket/auth',

    TaskTicketClose = '/task/ticket/close',
    TaskTicketCountData = '/task/ticket/count/data',
    TicketCountClosedTime = '/task/ticket/count/closed/time',
    TaskTicketCountTrend = '/task/ticket/count/trend',
    TaskTicketCountPriorityRatio = '/task/ticket/count/priority/ratio',
}

/**
 * @description: 工单分页列表
 */

export function TaskTicketPageApi(params) {
  return realHttp.get({
    url:Api.TaskTicketPage,
    params
  })
}

/**
 * @description: 工单详情
 */

export function TaskTicketInfoApi(params) {
  return realHttp.get({
    url:Api.TaskTicketInfo,
    params
  })
}

/**
 * @description: 工单修改
 */

export function TaskTicketEditApi(params,id) {
  return realHttp.put({
    url:Api.TaskTicketEdit + '?id='+id,
    params
  })
}

/**
 * @description: 工单复制
 */

export function TaskTicketCopyApi(params) {
  return realHttp.get({
    url:Api.TaskTicketCopy,
    params
  })
}

/**
 * @description: 工单日志列表
 */

export function TaskTicketLogListApi(params) {
  return realHttp.get({
    url:Api.TaskTicketLogList,
    params
  })
}

/**
 * @description: 新建工单
 */

export function TaskTicketSaveApi(params) {
  return realHttp.post({
    url:Api.TaskTicketSave,
    params
  })
}

/**
 * @description: 工单列表
 */

export function TaskTicketProgressListApi(params) {
  return realHttp.get({
    url:Api.TaskTicketProgressList,
    params
  })
}


/**
 * @description: 新建工单进度
 */

export function TaskTicketProgressSaveApi(params,id) {
  return realHttp.post({
    url:Api.TaskTicketProgressSave + '?id='+id,
    params
  })
}

/**
 * @description: 转交工单
 */

export function TaskTicketHandOverApi(params,id) {
  return realHttp.put({
    url:Api.TaskTicketHandOver + '?id='+id,
    params
  })
}

/**
 * @description: 完结工单
 */

export function TaskTicketCloseApi(params,id) {
  return realHttp.put({
    url:Api.TaskTicketClose + '?id='+id,
    params
  })
}

/**
 * @description: 工单权限
 */

export function TaskTicketAuthApi(id) {
  return realHttp.get({
    url:Api.TaskTicketAuth + '?id='+id,
  })
}

/**
 * @description: 工单总览
 */

export function TaskTicketCountDataApi(params) {
  return realHttp.get({
    url:Api.TaskTicketCountData,
    params
  })
}

/**
 * @description: 工单统计
 */

export function TicketCountClosedTimeApi(params) {
  return realHttp.get({
    url:Api.TicketCountClosedTime,
    params
  })
}

/**
 * @description: 工单量数据趋势
 */

export function TaskTicketCountTrendApi(params) {
  return realHttp.get({
    url:Api.TaskTicketCountTrend,
    params
  })
}

/**
 * @description: 工单优先级
 */

export function TaskTicketCountPriorityRatioApi(params) {
  return realHttp.get({
    url:Api.TaskTicketCountPriorityRatio,
    params
  })
}

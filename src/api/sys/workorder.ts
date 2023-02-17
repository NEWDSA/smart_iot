import { realHttp } from '@/utils/http/axios'

enum Api {
    TaskTicketPage = '/task/ticket/page',
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

// Interface data format used to return a unified format
import { ResultEnum } from '@/enums/httpEnum'

// TODOl:模拟数据后端响应结果/** Code: ResultEnum.SUCCESS,Data,Msg, */
export function resultSuccess<T = Recordable>(Data: T, { Msg = 'ok' } = {}) {
  return {
    Code: ResultEnum.SUCCESS,
    Data,
    Msg,
    type: 'sucess'
  }
}

export function resultPageSuccess<T = any>(
  page: number,
  pageSize: number,
  list: T[],
  { message = 'ok' } = {}
) {
  const pageData = pagination(page, pageSize, list)

  return {
    ...resultSuccess({
      items: pageData,
      total: list.length
    }),
    message
  }
}

// TODO:模拟数据根据后端需要进行模拟  /**Code,Data,Msg,type: 'error' */
export function resultError(
  Msg = 'Request failed',
  { Code = ResultEnum.ERROR, Data = null } = {}
) {
  return {
    Code,
    Data,
    Msg,
    type: 'error'
    // Status,
    // result,
    // message,
    // type: 'error'
  }
}

export function pagination<T = any>(pageNo: number, pageSize: number, array: T[]): T[] {
  const offset = (pageNo - 1) * Number(pageSize)
  return offset + Number(pageSize) >= array.length
    ? array.slice(offset, array.length)
    : array.slice(offset, offset + Number(pageSize))
}

export interface requestParams {
  method: string
  body: any
  headers?: { authorization?: string }
  query: any
}

/**
 * @description 本函数用于从request数据中获取token，请根据项目的实际情况修改
 *
 */
export function getRequestToken({ headers }: requestParams): string | undefined {
  return headers?.authorization
}

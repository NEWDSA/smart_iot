export type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined
export type SuccessMessageMode = ErrorMessageMode

export interface RequestOptions {
  // Splicing request parameters to url
  joinParamsToUrl?: boolean
  // Format request parameter time
  formatDate?: boolean
  // Whether to process the request result
  isTransformResponse?: boolean
  // Whether to return native response headers
  // For example: use this attribute when you need to get the response headers
  isReturnNativeResponse?: boolean
  // Whether to join url
  joinPrefix?: boolean
  // Interface address, use the default apiUrl if you leave it blank
  apiUrl?: string
  // 请求拼接路径
  urlPrefix?: string
  // Error message prompt type
  errorMessageMode?: ErrorMessageMode
  // Success message prompt type
  successMessageMode?: SuccessMessageMode
  // Whether to add a timestamp
  joinTime?: boolean
  ignoreCancelToken?: boolean
  // Whether to send token in header
  withToken?: boolean
  // 请求重试机制
  retryRequest?: RetryRequest
}

export interface RetryRequest {
  isOpenRetry: boolean
  count: number
  waitTime: number
}

/**
 * 修改返回结果接收的数据类型
 */
// TODO:根据后端进行修改   /** Code: number,Data:T,Msg: string*/ 
//模拟数据
// export interface Result<T = any> {
//   code: number,
//   type:'success' | 'error' | 'warning',
//   message: string,
//   result:T
// }


//后端接口
export interface Result<T = any> {
  Code: number,
  type:'success' | 'error' | 'warning',
  Msg: string,
  Data:T
}

// multipart/form-data: upload file
export interface UploadFileParams {
  // Other parameters
  data?: Recordable
  // File parameter interface field name
  name?: string
  // file name
  file: File | Blob
  // file name
  filename?: string
  [key: string]: any
}

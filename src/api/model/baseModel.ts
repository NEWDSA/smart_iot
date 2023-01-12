export interface BasicPageParams {
  PageNum: number
  PageSize: number
}

export interface BasicFetchResult<T> {
  items: T[]
  Total: number
}

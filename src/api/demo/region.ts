
import { realHttp } from '@/utils/http/axios'
import {
  regionParam
} from './model/systemModel'
enum Api {
 regionList='region/list',
 regionUnionDevice='/device/list-region-id',
 regionTreeList='/system/dept'
}

// 获取区域列表
export const getReginList = (params?) =>
  realHttp.get({ url: Api.regionList, params },{isTransformResponse: true})

// 获取区域关联设备列表
export const getReginDevice=(params?:regionParam)=>
realHttp.get({url:Api.regionUnionDevice,params},{isTransformResponse: true})

// 获取设备分类树形列表
export const getTreeList=(params?:regionParam)=>
realHttp.get({url:Api.regionTreeList,params},{isTransformResponse: true})


import { realHttp } from '@/utils/http/axios'
import {
  regionParam,
  deviceParam
} from './model/systemModel'
enum Api {
 regionList='region/list',
 regionUnionDevice='/device/list-region-id',
 regionTreeList='/system/dept',
 DeviceType='/device/type/info',
 devicePermissionList='/device-department/edit',
 deviceTreeList='device/type/tree',
 deviceListApi='/device/list',
 deviceArea='device/edit-region-id'
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

// 获取设备类型名称
export const getDeviceType=(params?:deviceParam)=>
realHttp.get({url:Api.DeviceType,params},{isTransformResponse: true})

// 区域设备批量设置权限
export const devicePermission=(params)=>
realHttp.post({url:Api.devicePermissionList,params},{isTransformResponse: true})

// 接入设备分类树形表
export const deviceTree=(params?)=>
realHttp.get({url:Api.deviceTreeList,params},{isTransformResponse: true})

// 设备列表
export const deviceList=(params?)=>
realHttp.get({url:Api.deviceListApi,params},{isTransformResponse: true})

// 编辑设备区域
export const editDeviceArea=(params?)=>
realHttp.post({url:Api.deviceArea,params},{isTransformResponse: true})

// 批量移除设备
export const bulkDeviceOut=(params?)=>
realHttp.post({url:Api.deviceArea,params},{isTransformResponse: true})

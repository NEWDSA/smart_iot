import { realHttp } from '@/utils/http/axios'

enum Api {
 scenceList='/rule/list',
 deviceList='/device/list',
 regionList='/region/list'
}
// 场景列表
export const scenceList=(params?)=>
realHttp.get({url: Api.scenceList, params },{isTransformResponse: true})
// 设备列表
export const deviceList=(params?)=>
realHttp.get({url: Api.deviceList, params },{isTransformResponse: true})
// 区域列表
export const regionList=(params?)=>
realHttp.get({url: Api.regionList, params },{isTransformResponse: true})



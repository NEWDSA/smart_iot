import { realHttp } from '@/utils/http/axios'

enum Api {
 scenceList='/rule/list',
 deviceList='/device/list',
 regionDetail='/region/info'
}
// 场景列表
export const scenceList=(params?)=>
realHttp.get({url: Api.scenceList, params },{isTransformResponse: true})
// 设备分类详情
export const deviceList=(params?)=>
realHttp.get({url: Api.deviceList, params },{isTransformResponse: true})
// 区域列表
export const regionDetail=(params?)=>
realHttp.get({url: Api.regionDetail, params },{isTransformResponse: true})



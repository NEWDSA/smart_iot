import { realHttp } from '@/utils/http/axios'
import {
    facilityListParams,
    facilityDetailParams,
    facilityEditParams,
    facilityClassParams,
    facilityEditClassParams,
    facilityLogParams,
    facilityAlertParams,
    facilityAlertPostParams
} from './model/facilityModel';
import { ErrorMessageMode } from '/#/axios'

enum Api {
    DeviceList = '/device/list',
    DeviceInfo = '/device/info',
    DeviceEnable = '/device/enable',
    DeviceDisable = '/device/disable',
    DeviceSave = '/device/save',
    DeviceEdit = '/device/edit',
    DeviceDelete = '/device/delete',
    DeviceData = '/device/data',

    DeviceCheckRule = '/device/check/rule',
    DeviceDisableRule = 'device/disable/rule',
    DeviceRelieve = '/device/relieve',
    DeviceRuleList = '/device/rule/list',
    ruleEnable = '/rule/enable',
    ruleDisable = '/rule/disable',
    
    DeviceTypeTree = '/device/type/tree',
    DeviceTypeSameGrade = '/device/type/same/grade',
    DeviceTypeInfo = '/device/type/info',
    DeviceTypeSave = '/device/type/save',
    DeviceTypeEdit = '/device/type/edit',
    DeviceTypeDelete = '/device/type/delete',

    

    DeviceLogList = '/device/log',
    DeviceLogInfo = '/device/log/info',
    DeviceAlertList = '/device/alert/list',
    DeviceAlertIgnore = '/device/alert/ignore',
    DeviceAlertNotice = '/device/alert/notice',
    DeviceState = '/device/state',

    DeviceTrendRatio = '/device/trendRatio',
    DeviceBoardNum = '/device/board/num',


    regionList = '/region/list', //区域列表
    regionInfo = '/region/info'   // 区域详情
}

/**
 * @description: Get sample list value
 */
// 设备类型树形列表
export function facilityTypeTreeApi() { 
    return realHttp.get({
        url: Api.DeviceTypeTree,
    },{
        isTransformResponse:true
    });
}

// 父类同级分类列表
export function facilityTypeSameGradeApi(params) {
    return realHttp.get({
        url: Api.DeviceTypeSameGrade,
        params
    });
}

// 新增设备类型
export function facilityTypeSaveApi(params:facilityClassParams) {
    return realHttp.post({
        url: Api.DeviceTypeSave,
        params
    });
}

// 删除设备类型
export function facilityTypeDeleteApi(params) {
    return realHttp.delete({
        url: Api.DeviceTypeDelete,
        params
    });
}

// 更新设备类型
export function facilityTypeEditApi(params:facilityEditClassParams) {
    return realHttp.put({
        url: Api.DeviceTypeEdit,
        params
    });
}

// 设备类型详情
export function facilityTypeInfoApi(params) {
    return realHttp.get({
        url: Api.DeviceTypeInfo,
        params
    });
}

// 设备详情
export function facilityDetailApi(params:facilityDetailParams) {
    return realHttp.get({
        url: Api.DeviceInfo,
        params
    });
}

// 设备列表
export function facilityListApi(params:facilityListParams) {
    return realHttp.get({
        url: Api.DeviceList,
        params
    },{
        isTransformResponse:true
    });
}

// 启动设备
export function facilityEnableApi(params:facilityDetailParams) {
    return realHttp.get({
        url: Api.DeviceEnable,
        params
    });
}

// 禁用设备
export function facilityDisableApi(params:facilityDetailParams) {
    return realHttp.get({
        url: Api.DeviceDisable,
        params
    });
}

// 删除设备
export function facilityDeleteApi(params) {
    return realHttp.delete({
        url: Api.DeviceDelete,
        params
    });
}

// 设备场景（查看有没有启动的场景）
export function facilityCheckRuleApi(params) {
    return realHttp.get({
        url: Api.DeviceCheckRule,
        params
    });
}

// 设备场景（停用设备关联的所有场景）
export function facilityDisableRuleApi(params) {
    return realHttp.get({
        url: Api.DeviceDisableRule,
        params
    });
}


// 移出设备去未分类
export function facilityRelieveApi(params) {
    return realHttp.get({
        url: Api.DeviceRelieve,
        params
    });
}

// 设备关联的场景
export function facilityRuleListApi(params) {
    return realHttp.get({
        url: Api.DeviceRuleList,
        params
    });
}

// 场景启用
export function ruleEnableApi(params) {
    return realHttp.get({
        url: Api.ruleEnable,
        params
    });
}

// 场景禁用
export function ruleDisableApi(params) {
    return realHttp.get({
        url: Api.ruleDisable,
        params
    });
}

// 设备日志列表
export function facilityLogListApi(params) {
    return realHttp.get({
        url: Api.DeviceLogList,
        params
    });
}

// 设备日志详情
export function facilityLogInfoApi(params:facilityAlertPostParams) {
    return realHttp.get({
        url: Api.DeviceLogInfo,
        params
    });
}

// 区域列表
export function facilityRegionListApi() {
    return realHttp.get({
        url: Api.regionList,
    });
}

// 区域详情
export function facilityRegionInfoApi(params) {
    return realHttp.get({
        url: Api.regionInfo,
        params
    });
}

// 设备更新
export function facilityEditApi(params:facilityEditParams) {
    return realHttp.put({
        url: Api.DeviceEdit,
        params
    });
}

// 设备告警列表
export const facilityAlertListApi = (params:facilityAlertParams) => 
    realHttp.get({
        url: Api.DeviceAlertList,
        params
    });


// 设备告警忽略
export function facilityAlertIgnoreApi(params:facilityAlertPostParams) {
    return realHttp.get({
        url: Api.DeviceAlertIgnore,
        params
    });
}

// 设备告警上报
export function facilityAlertNoticeApi(params) {
    return realHttp.post({
        url: Api.DeviceAlertNotice,
        params
    });
}

// 设备控制状态
export function facilityStateApi(params) {
    return realHttp.get({
        url: Api.DeviceState,
        params
    });
}

// 查询用电数据趋势(日) Type:day week month 电field：power Number：5 7 12
export function facilityTrendRatioApi(params) {
    return realHttp.get({
        url: Api.DeviceTrendRatio,
        params
    });
}

// 今日用电量
export function facilityBoardNumApi(params) {
    return realHttp.get({
        url: Api.DeviceBoardNum,
        params
    });
}

// 设备统计
export function facilityDataApi() {
    return realHttp.get({
        url: Api.DeviceData
    });
}






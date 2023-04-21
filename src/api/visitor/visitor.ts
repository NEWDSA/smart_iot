import { realHttp } from '@/utils/http/axios'
import { } from './model/visitorModel';
import { ErrorMessageMode } from '/#/axios'
import { visitorListParams } from './model/visitorModel'

enum Api {
    visitorTypeList = '/visitor-type/list',
    visitorTypeSave = '/visitor-type/save',
    visitorTypeEdit = '/visitor-type/edit',
    visitorTypeDelete = '/visitor-type/delete',

    visitorList = '/visitor/list',
    visitorSave = '/visitor/save',
    visitorEdit = '/visitor/edit',
    visitorDelete = '/visitor/delete',
    visitorInfo = '/visitor/info',
    visitorStatusEdit = '/visitor/status-edit',

    ruleVisitorList = '/rule/visitor/list',
    ruleEnable = '/rule/enable',
    ruleDisable = '/rule/disable',
    ruleDelete = '/rule/delete',

    fileUpload = '/file/upload',
    fileDownload = '/file/download',

    regionList = '/region/list', //区域列表
    regionInfo = '/region/info'   // 区域详情
}

/**
 * @description: Get sample list value
 */

// 访客类型列表
export function visitorTypeListApi() {
    return realHttp.get({
        url: Api.visitorTypeList,
    });
}

// 访客列表
export const visitorListApi = (params: visitorListParams) =>
    realHttp.get({
        url: Api.visitorList,
        params
    }, {
        isTransformResponse: true
    });

// 访客详情
export const visitorInfoApi = (params) =>
    realHttp.get({
        url: Api.visitorInfo,
        params
    }, {
        isTransformResponse: true
    });

//访客状态编辑
export const visitorStatusEditApi = (params) =>
    realHttp.post({
        url: Api.visitorStatusEdit,
        params
    }, {
        isTransformResponse: true
    });


// 访客添加
export const visitorSaveApi = (params: visitorListParams) =>
    realHttp.post({
        url: Api.visitorSave,
        params
    }, {
        isTransformResponse: true
    });

// 访客编辑
export const visitorEditApi = (params) =>
    realHttp.put({
        url: Api.visitorEdit,
        params
    }, {
        isTransformResponse: true
    });


// 访客类型新增
export const visitorTypeSaveApi = (params) =>
    realHttp.post({
        url: Api.visitorTypeSave,
        params
    }, {
        isTransformResponse: true
    });

// 访客类型编辑
export const visitorTypeEditApi = (params) =>
    realHttp.put({
        url: Api.visitorTypeEdit,
        params
    }, {
        isTransformResponse: true
    });

// 访客类型删除
export const visitorTypeDeleteApi = (params) =>
    realHttp.delete({
        url: Api.visitorTypeDelete,
        params
    }, {
        isTransformResponse: true
    });

// 访客场景联动列表
export const ruleVisitorListApi = (params) =>
    realHttp.get({
        url: Api.ruleVisitorList,
        params
    }, {
        isTransformResponse: true
    });

// 启动访客场景
export const ruleEnableApi = (params) =>
    realHttp.get({
        url: Api.ruleEnable,
        params
    }, {
        isTransformResponse: true
    });

// 禁用访客场景
export const ruleDisableApi = (params) =>
    realHttp.get({
        url: Api.ruleDisable,
        params
    }, {
        isTransformResponse: true
    });

// 删除访客场景
export const ruleDeleteApi = (params) =>
    realHttp.delete({
        url: Api.ruleDelete,
        params
    }, {
        isTransformResponse: true
    });

// 上传文件
export const seeFileApi = (params) =>
    realHttp.get({
        url: params,
    }, {
        isTransformResponse: true
    });

// 下载文件
export const fileDownloadApi = (params) =>
    realHttp.get({
        url: Api.fileDownload + '?fileUrl='+params,
    }, {
        isTransformResponse: true
    });
    
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

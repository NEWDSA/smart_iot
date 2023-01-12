
import { realHttp } from '@/utils/http/axios'

enum Api {
 visitorTypeList='visitor-type/list'
}

// 获取访客类型列表
export const getVisitorTypeList = (params?) =>
  realHttp.get({ url: Api.visitorTypeList, params },{isTransformResponse: true})




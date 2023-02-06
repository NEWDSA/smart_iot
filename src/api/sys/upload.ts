import { UploadApiResult } from './model/uploadModel'
import { realHttp } from '@/utils/http/axios'
import { UploadFileParams } from '/#/axios'
import { useGlobSetting } from '@/hooks/setting'


// const { uploadUrl = 'htttp://192.168.8.180:4000/api/v1/file/upload' } = useGlobSetting()
enum Api {
 uploadUrl='/file/upload'
}
/**
 * @description: Upload interface
 */
export function uploadApi(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: ProgressEvent) => void
) {
  return realHttp.uploadFile<UploadApiResult>(
    {
      baseURL:'/admin-api',
      url: Api.uploadUrl,
      onUploadProgress
    },
    params
  )
}

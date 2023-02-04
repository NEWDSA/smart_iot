import { UploadApiResult } from './model/uploadModel'
import { defHttp } from '@/utils/http/axios'
import { UploadFileParams } from '/#/axios'
import { useGlobSetting } from '@/hooks/setting'

const { uploadUrl = 'htttp://192.168.8.180:4000/api/v1/file/upload' } = useGlobSetting()

/**
 * @description: Upload interface
 */
export function uploadApi(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: ProgressEvent) => void
) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: uploadUrl,
      onUploadProgress
    },
    params
  )
}

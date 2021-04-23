// 一个模块放一个文件
import axios from '@/util/request'

const PREFIX_API = ''
// 获取oss上传凭证
export const getOssToken = query =>
  axios.request({
    url: `${PREFIX_API}/assetmaker/assetTask/assetUploadForm
  `,
    method: 'GET',
    data: query
  })
// oss上传
export const uploadOss = query =>
  axios.request({
    ...query,
    method: 'POST',
    timeout: 60 * 1000
  })
// 通知上传文件校验
export const notifyOssCheck = query =>
  axios.request({
    url: `${PREFIX_API}/assetmaker/assetTask/assetCreate`,
    method: 'POST',
    data: query,
    timeout: 60 * 1000
  })
// 下载文件
export const download = url =>
  axios.request({
    url,
    method: 'GET',
    responseType: 'blob',
    timeout: 0
  })
// 上传文件（图片、视频）
export const uploadMaterial = param => axios.request(param)
// 上传用户
export const uploadUserUrl = `${axios.baseURL}/redirect/task/uploadUser`

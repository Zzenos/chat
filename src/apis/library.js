// 登录接口
import axios from '@/util/request'

const PREFIX_API = '/assetmanager'
// 获取oss上传凭证
const getOssToken = query =>
  axios.request({
    url: `${PREFIX_API}/file/upload/form`,
    method: 'GET',
    data: query
  })
// oss上传
const uploadOss = query =>
  axios.request({
    ...query,
    method: 'POST',
    // timeout: 0
    timeout: 60 * 1000
  })
// 通知上传文件校验
const notifyOssCheck = query =>
  axios.request({
    url: `${PREFIX_API}/asset/create`,
    method: 'POST',
    data: query
  })

export default {
  getOssToken,
  notifyOssCheck,
  uploadOss
}

// 登录接口
import axios from '@/util/request'

const PREFIX_API = process.env.VUE_APP_CHAT_API
// 获取oss上传凭证
const getOssToken = query =>
  axios.request({
    url: `${PREFIX_API}/oss/signature`,
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
//语音转文本
const audioText = query =>
  axios.request({
    url: `${PREFIX_API}/voice/convert`,
    method: 'POST',
    data: query
  })

//语音转文本
const getImgUrl = query =>
  axios.request({
    url: `${PREFIX_API}/image/upload`,
    method: 'POST',
    data: query
  })

export default {
  getOssToken,
  notifyOssCheck,
  uploadOss,
  audioText,
  getImgUrl
}

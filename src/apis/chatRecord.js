// 聊天记录接口
import axios from '@/util/request'

// 接口请求数据处理
const api = requestData => {
  requestData.url = `/conversation/record${requestData.url}`
  return new Promise((resolve, reject) => {
    axios
      .request(requestData)
      .then(result => (result.code === 0 ? resolve(result.data) : reject(result)))
      .catch(err => reject(err))
  })
}

// 获取私聊列表
const getPrivateChatList = data =>
  api({
    url: '/customer/list',
    method: 'POST',
    data
  })

// 获取群聊列表
const getGroupChatList = data =>
  api({
    url: '/group/list',
    method: 'POST',
    data
  })

// 聊天记录
const getChatRecordList = data =>
  api({
    url: '/list',
    method: 'POST',
    data
  })

// 搜索聊天记录
const searchChatRecord = data =>
  api({
    url: '/search',
    method: 'POST',
    data
  })

// 导出群聊
const exportChatRecord = data =>
  axios.request({
    url: '/conversation/record/list/export',
    method: 'POST',
    data,
    responseType: 'blob'
  })

export default {
  getPrivateChatList,
  getGroupChatList,
  getChatRecordList,
  searchChatRecord,
  exportChatRecord
}

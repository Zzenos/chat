import {
  systemMsg,
  textMsg,
  imgMsg,
  voiceMsg,
  videoMsg,
  hyperLinkMsg,
  contactMsg,
  fileMsg,
  mpMsg
} from './Msg'

// 支持的消息类型
const MsgGen = {
  10000: systemMsg, // 系统消息
  2001: textMsg, // 文本
  2002: imgMsg, // 图片
  2003: voiceMsg, // 语音
  2004: videoMsg, // 视频
  2005: hyperLinkMsg, // h5
  2006: contactMsg, // 名片
  2010: fileMsg, // 文件
  2013: mpMsg // 小程序
}

// 数据返回消息
const data2Msg = function (data) {
  if (!data || !data.msg_type || !Object.keys(MsgGen).includes(data.msg_type)) {
    throw new Error('Not Support Msg Type')
  }
  const {
    msg_type
  } = data
  return new MsgGen(msg_type)
}

export default data2Msg
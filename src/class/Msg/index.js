import { systemMsg, textMsg, imgMsg, voiceMsg, videoMsg, hyperLinkMsg, contactMsg, fileMsg, mpMsg } from './Msg'

// 支持的消息类型
const MsgType = {
  system: systemMsg, // 系统消息 10000
  text: textMsg, // 文本 2001
  image: imgMsg, // 图片 2002
  voice: voiceMsg, // 语音 2003
  video: videoMsg, // 视频 2004
  link: hyperLinkMsg, // h5 2005
  card: contactMsg, // 名片 2006
  file: fileMsg, // 文件 2010
  weapp: mpMsg // 小程序 2013
}

// 数据返回消息
export const MsgGen = function(data) {
  if (!data || !data.msg_type || !Object.keys(MsgType).includes(data.msg_type)) {
    throw new Error('Not Support Msg Type')
  }
  return new MsgType(data.msg_type, false)
}

export const getSendMsg = function(data) {
  return new MsgType(data.msg_type, true)
}

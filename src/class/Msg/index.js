import { systemMsg, textMsg, imgMsg, voiceMsg, videoMsg, hyperLinkMsg, contactMsg, fileMsg, mpMsg, videoNumMsg, locationMsg, chatRecordMsg } from './Msg'

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
  weapp: mpMsg, // 小程序 2013
  videoNum: videoNumMsg, // 视频号
  location: locationMsg, // 位置
  chatRecord: chatRecordMsg //聚合消息
}

// 数据返回消息
export const MsgGen = function(data, notResend) {
  if (data && data.msgType && data.msgId && !Object.keys(MsgType).includes(data.msgType)) {
    const msg = new MsgType.text(
      {
        ...data,
        msgType: 'text',
        content: '[当前版本暂不支持查看此消息]'
      },
      false
    )
    return msg
  } else if (!data || !data.msgType || !Object.keys(MsgType).includes(data.msgType)) {
    throw new Error(`${data.msgType} is Not Support Msg Type`)
  } else return new MsgType[data.msgType](data, notResend)
}

export const getSendMsg = function(data, notResend) {
  return new MsgType[data.msgType](data, notResend)
}

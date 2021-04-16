import { getUuid } from '@/util/util'
const MSG_SEND_STATUS = {
  SUCCESS: 0,
  PENDING: 1,
  FAILED: 2
}

/**
 * 消息类
 * @param {Bool} isSendMsg
 */
class Msg {
  constructor(options, isSendMsg) {
    let { msgId, chatId, chatType, fromId, toId, msgType, atLocation, at, at_ids, msgTime, sender, unread, seq, clientMsgId } = options
    this.msgId = msgId // 发出的消息id为uuid
    this.clientMsgId = clientMsgId
    this.sender = sender // 发送人信息
    if (isSendMsg) {
      this.clientMsgId = getUuid() // 发出的消息id为uuid
      this.msgId = this.clientMsgId
    }
    this.chatId = chatId //会话id
    this.chatType = chatType //会话类型 1私聊 2群聊
    this.fromId = fromId
    this.toId = toId
    this.msgType = msgType //消息类型
    this.atLocation = atLocation // @人的位置 0 头 1 尾
    this.time = msgTime || 0 // 发出的消息time为0， 时间戳
    this.seq = seq || 0 //消息序号 0为发出的消息
    this.at = at
    this.atIds = at_ids // 被@人员的id列表，若多人被@则使用逗号隔开，@全体成员时该指为 'ALL'
    this.unread = unread || true // 是否已读
    this.status = isSendMsg ? MSG_SEND_STATUS.PENDING : MSG_SEND_STATUS.SUCCESS // 是否已发送成功
  }

  mutateSuccess() {
    this.status = MSG_SEND_STATUS.SUCCESS
  }

  mutateFail() {
    this.status = MSG_SEND_STATUS.FAILED
  }

  mutatePending() {
    this.status = MSG_SEND_STATUS.PENDING
  }
}
// 不同消息类型
/**
 * 10000 系统消息
 *
 */
export class systemMsg extends Msg {
  constructor(options, isSendMsg) {
    super(options, isSendMsg)
    let { content } = options
    this.content = content
  }
}

/**
 * 2001 文字消息
 *
 */
export class textMsg extends Msg {
  constructor(options, isSendMsg) {
    super(options, isSendMsg)
    let { content } = options
    this.content = content
  }
}

/**
 * 2002 图片  jpg/png 超过10M将以文件形式发送， gif 超过5M将以文件形式发送
 */
export class imgMsg extends Msg {
  constructor(options, isSendMsg) {
    super(options, isSendMsg)
    let { url } = options
    this.url = url // 图片需要给图片地址
  }
}
/**
 * TODO
 *  * 2003 语音
 */
export class voiceMsg extends Msg {
  constructor(options, isSendMsg) {
    super(options, isSendMsg)
    let { voiceTime, url } = options
    this.voiceTime = voiceTime
    this.url = url
  }
}

/**
 * 2004 视频
 */

export class videoMsg extends Msg {
  constructor(options, isSendMsg) {
    super(options, isSendMsg)
    let { voiceTime, url, coverUrl } = options
    this.voiceTime = voiceTime // 时长
    this.url = url
    this.coverUrl = coverUrl
  }
}

/**
 * 2005 H5
 */
export class hyperLinkMsg extends Msg {
  constructor(options, isSendMsg) {
    super(options, isSendMsg)
    let { url, href, title, desc, coverUrl } = options
    this.url = url
    this.href = href
    this.title = title // h5标题
    this.desc = desc //文字描述
    this.coverUrl = coverUrl
  }
}
/**
 * 2006 好友名片
 */
export class contactMsg extends Msg {
  constructor(options, isSendMsg) {
    super(options, isSendMsg)
    let { content } = options
    this.content = JSON.parse(content)
  }
}
/**
 * TODO
 * 2010 文件类型
 */
export class fileMsg extends Msg {
  constructor(options, isSendMsg) {
    super(options, isSendMsg)
    let { url, title } = options
    this.url = url
    this.title = title
  }
}

/**
 * 2013 小程序
 */

export class mpMsg extends Msg {
  constructor(options, isSendMsg) {
    super(options, isSendMsg)
    let { content, coverUrl } = options
    this.content = JSON.parse(content) // 解码后为小程序的配置json,需要parse一次
    this.coverUrl = coverUrl
  }
}

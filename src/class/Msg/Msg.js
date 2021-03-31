import { Base64, getUuid } from '@/util/util'
const MSG_SEND_STATUS = {
  SUCCESS: 0,
  PENDING: 1,
  FAILED: 2
}
/**
 * 消息类
 *
 */
class Msg {
  constructor(options) {
    let { msg_id, chat_id, chat_type, from_id, to_id, msg_type, at_location, at, at_ids, msg_time, sender, unread, seq, sending = false } = options
    this.id = msg_id || getUuid() // 发出的消息id为uuid
    this.chatId = chat_id //会话id
    this.chatType = chat_type //会话类型 1私聊 2群聊
    this.fromId = from_id
    this.toId = to_id
    this.sender = sender || null // 发送人信息
    this.msgType = msg_type //消息类型
    this.atLocation = at_location // @人的位置 0 头 1 尾
    this.time = msg_time || 0 // 发出的消息time为0， 时间戳
    this.seq = seq || 0 //消息序号 0为发出的消息
    this.at = at
    this.atIds = at_ids // 被@人员的id列表，若多人被@则使用逗号隔开，@全体成员时该指为 'ALL'
    this.unread = unread // 是否已读
    this.status = sending ? MSG_SEND_STATUS.PENDING : MSG_SEND_STATUS.SUCCESS // 是否已发送成功
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
  constructor(options) {
    super(options)
    let { msg_content } = options
    this.content = Base64.parse(msg_content)
  }
}

/**
 * 2001 文字消息
 *
 */
export class textMsg extends Msg {
  constructor(options) {
    super(options)
    let { msg_content } = options
    this.content = Base64.parse(msg_content)
  }
}

/**
 * 2002 图片  jpg/png 超过10M将以文件形式发送， gif 超过5M将以文件形式发送
 */
export class imgMsg extends Msg {
  constructor(options) {
    super(options)
    let { url } = options
    this.url = url // 图片需要给图片地址
  }
}
/**
 * TODO
 *  * 2003 语音
 */
export class voiceMsg extends Msg {
  constructor(options) {
    super(options)
    let { voice_time, url } = options
    this.voiceTime = voice_time
    this.url = url
  }
}

/**
 * 2004 视频
 */

export class videoMsg extends Msg {
  constructor(options) {
    super(options)
    let { voice_time, url } = options
    this.voiceTime = voice_time // 时长
    this.url = url
  }
}

/**
 * 2005 H5
 */
export class hyperLinkMsg extends Msg {
  constructor(options) {
    super(options)
    let { url, href, title, desc } = options
    this.url = url
    this.href = href
    this.title = title // h5标题
    this.desc = desc //文字描述
  }
}
/**
 * 2006 好友名片
 */
export class contactMsg extends Msg {
  constructor(options) {
    super(options)
    let { content } = options
    this.content = JSON.parse(Base64.parse(content))
  }
}
/**
 * TODO
 * 2010 文件类型
 */
export class fileMsg extends Msg {
  constructor(options) {
    super(options)
    let { href } = options
    this.href = href
  }
}

/**
 * 2013 小程序
 */

export class mpMsg extends Msg {
  constructor(options) {
    super(options)
    let { content } = options
    this.content = JSON.parse(Base64.parse(content)) // 解码后为小程序的配置json,需要parse一次
  }
}

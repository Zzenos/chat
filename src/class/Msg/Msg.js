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
    let { msgId, chatId, chatType, fromId, toId, msgType, atLocation, at, atList, atContactSerialNos, grpContent, msgTime, sender, to, unread = false, seq, clientMsgId } = options
    this.msgId = msgId // 发出的消息id为uuid
    this.clientMsgId = clientMsgId
    this.sender = sender // 发送人信息
    this.to = to // 接收人信息
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
    this.time = msgTime || new Date().getTime() // 发出的消息time为0， 时间戳
    this.seq = seq || 0 //消息序号 0为发出的消息
    this.at = at || 0
    this.atList = (atList && atList.split(';')) || '' // 接收的@列表 若多人被@则使用逗号隔开，@全体成员时该指为 'ALL'
    this.atContactSerialNos = atContactSerialNos // 发送的@列表 被@人员的id列表
    this.grpContent = grpContent
    this.unread = unread // 是否已读
    this.status = navigator.onLine ? (isSendMsg ? MSG_SEND_STATUS.PENDING : MSG_SEND_STATUS.SUCCESS) : MSG_SEND_STATUS.FAILED // 是否已发送成功
    //消息未成功再执行判断
    if (this.status !== MSG_SEND_STATUS.FAILED) {
      this.networkOuttime()
    }
  }
  //60秒内消息没有发送成功判定失败
  networkOuttime() {
    setTimeout(() => {
      if (this.status !== MSG_SEND_STATUS.SUCCESS) {
        this.mutateFail()
      }
    }, 60000)
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
    this.defaultContent = content
  }
}

/**
 * 2001 文字消息
 *
 */
export class textMsg extends Msg {
  constructor(options, isSendMsg) {
    super(options, isSendMsg)
    let { content, grpContent } = options
    this.content = content
    this.grpContent = grpContent
    this.defaultContent =
      content &&
      (content.split('\n------\n').length > 1
        ? content.split('\n------\n').pop()
        : content.split('\n- - - - - - - - - - - - - - -\n').length > 1
        ? content.split('\n- - - - - - - - - - - - - - -\n').pop()
        : content)
    // this.defaultContent = grpContent ? grpContent : content
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
    this.defaultContent = '[图片]'
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
    this.defaultContent = '[语音]'
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
    this.defaultContent = '[视频]'
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
    this.defaultContent = `[链接] ${title}`
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
    this.defaultContent = `[名片]`
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
    this.defaultContent = `[文件] ${title}`
  }
}

/**
 * 2013 小程序
 */

export class mpMsg extends Msg {
  constructor(options, isSendMsg) {
    super(options, isSendMsg)
    let { content, coverUrl, title, id } = options
    this.content = content ? JSON.parse(content) : content // 解码后为小程序的配置json,需要parse一次
    this.coverUrl = coverUrl
    this.title = title
    this.defaultContent = `[小程序]`
    if (isSendMsg) {
      this.id = id
    }
  }
}
/**
 * 视频号
 */

export class videoNumMsg extends Msg {
  constructor(options, isSendMsg) {
    super(options, isSendMsg)
    let { icon, coverUrl, title, desc, href, content, msgSerialNo, base64Content } = options
    this.icon = icon
    this.coverUrl = coverUrl
    this.title = title
    this.desc = desc
    this.url = href
    this.content = JSON.parse(content)
    this.msgSerialNo = msgSerialNo
    this.base64Content = base64Content
    this.defaultContent = `[视频号] ${title}的动态`
  }
}
/**
 * 位置
 */

export class locationMsg extends Msg {
  constructor(options, isSendMsg) {
    super(options, isSendMsg)
    let { content } = options
    this.content = JSON.parse(content)
    this.defaultContent = `[位置] ${JSON.parse(content).title}`
  }
}
/**
 * 聚合消息
 */

export class chatRecordMsg extends Msg {
  constructor(options, isSendMsg) {
    super(options, isSendMsg)
    let { content, chatRecord } = options
    this.content = JSON.parse(content)
    this.chatRecord = chatRecord
    this.defaultContent = `[聊天记录]`
  }
}

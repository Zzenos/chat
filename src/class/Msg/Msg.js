import {
  Base64
} from '../../util'
/**
 * 消息类
 * 
 */
class Msg {
  constructor(options) {
    let {
      sender_serial_no,
      receiver_serial_no,
      group_serial_no,
      msg_id,
      msg_type,
      msg_time,
      at_location,
      at,
      at_list,
      file_serial_no,
      at_contact_serial_nos
    } = options
    this.id = msg_id || 0 // 发出的消息id为0
    this.type = msg_type
    this.fromId = sender_serial_no
    this.toId = receiver_serial_no
    this.gId = group_serial_no
    this.atLocation = at_location
    this.time = msg_time || 0 // 发出的消息time为0
    this.at = at
    this.atIds = at_list // 被@人员的id列表，若多人被@则使用逗号隔开，@全体成员时该指为 'ALL'
    this.fileId = file_serial_no // 文件下载编号
    this.atContactSerialIds = at_contact_serial_nos
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
    let {
      msg_content,
    } = options
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
    let {
      msg_content,
    } = options
    this.content = Base64.parse(msg_content)
  }
}

/**
 * 2002 图片  jpg/png 超过10M将以文件形式发送， gif 超过5M将以文件形式发送
 */
export class imgMsg extends Msg {
  constructor(options) {
    super(options)
    let {
      msg_content,
    } = options
    this.url = msg_content // 图片需要给图片地址
  }
}
/**
 * TODO
 *  * 2003 语音
 */
export class voiceMsg extends Msg {
  constructor(options) {
    super(options)
  }
}

/**
 * 2004 视频
 */

export class videoMsg extends Msg {
  constructor(options) {
    super(options)
    let {
      voice_time
    } = options
    this.voiceTime = voice_time // 时长

  }
}

/**
 * 2005 H5
 */
export class hyperLinkMsg extends Msg {
  constructor(options) {
    super(options)
    let {
      cover_url
    } = options
    this.coverUrl = cover_url
  }
}
/**
 * 2006 好友名片
 */
export class contactMsg extends Msg {
  constructor(options) {
    super(options)
    let {
      msg_content
    } = options
    this.content = Base64.parse(msg_content)
  }
}
/**
 * TODO
 * 2010 文件类型
 */
export class fileMsg extends Msg {
  constructor(options) {
    super(options)
    this.content = options.content
  }
}

/**
 * 2013 小程序
 */

export class mpMsg extends Msg {
  constructor(options) {
    super(options)
    let {
      msg_content
    } = options
    this.content = JSON.parse(Base64.parse(msg_content)) // 解码后为小程序的配置json,需要parse一次
  }
}
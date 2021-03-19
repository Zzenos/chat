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
      at_contact_serial_nos
    } = options
    this.id = msg_id || 0
    this.type = msg_type
    this.fromId = sender_serial_no
    this.toId = receiver_serial_no
    this.gId = group_serial_no
    this.atLocation = at_location
    this.time = msg_time
    this.at = at
    this.atContactSerialIds = at_contact_serial_nos
  }
}
// 不同消息类型
/**
 * 10000 系统消息
 */
export class systemMsg extends Msg {
  constructor(options) {
    super(options)
    let {
      msg_content,
      voice_time
    } = options
    this.content = msg_content
    this.voiceTime = voice_time
  }
}

/**
 * 2001 文字消息
 */
export class textMsg extends Msg {
  constructor(options) {
    super(options.type)
    this.content = options.content
  }
}

/**
 * 2002 图片  jpg/png 超过10M将以文件形式发送， gif 超过5M将以文件形式发送
 */
export class imgMsg extends Msg {
  constructor(options) {
    super(options.type)
    this.content = options.content
  }
}
/**
 * TODO
 *  * 2003 语音
 */
export class voiceMsg extends Msg {
  constructor(options) {
    super(options.type)
  }
}

/**
 * 2004 视频
 */

export class videoMsg extends Msg {
  constructor(options) {
    super(options.type)
    this.content = options.content
  }
}

/**
 * 2005 H5
 */
export class hyperLinkMsg extends Msg {
  constructor(options) {
    super(options.type)
    this.content = options.content
  }
}
/**
 * 2006 好友名片
 */
export class contactMsg extends Msg {
  constructor(options) {
    super(options.type)
    this.content = options.content
  }
}
/**
 * 2010 文件类型
 */
export class fileMsg extends Msg {
  constructor(options) {
    super(options.type)
    this.content = options.content
  }
}

/**
 * 2013 小程序
 */

export class mpMsg extends Msg {
  constructor(options) {
    super(options.type)
    this.content = options.content
  }
}
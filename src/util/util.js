export const Base64 = {
  stringify(str) {
    return window.btoa(encodeURIComponent(str))
  },
  parse(str) {
    return decodeURIComponent(window.atob(str))
  }
}

export const getUuid = function() {
  var d = new Date().getTime()
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
  return uuid
}
export function formateTime(datetime) {
  if (datetime == null) return ''
  // datetime = '' + datetime
  // datetime = datetime.replace(/-/g, '/')

  //当前时间戳
  let time = new Date()
  let outTime = new Date(datetime)
  // let outTime = new Date(datetime)
  // if (/^[1-9]\d*$/.test(datetime)) {
  //   outTime = new Date(parseInt(datetime) * 1000)
  // }

  if (time.getTime() < outTime.getTime() || time.getFullYear() != outTime.getFullYear()) {
    return parseTime(outTime, '{y}-{m}-{d} {h}:{i}')
  }

  if (time.getMonth() != outTime.getMonth()) {
    return parseTime(outTime, '{m}-{d} {h}:{i}')
  }

  if (time.getDate() != outTime.getDate()) {
    let day = outTime.getDate() - time.getDate()
    if (day == -1) {
      return parseTime(outTime, '昨天 {h}:{i}')
    }

    if (day == -2) {
      return parseTime(outTime, '前天 {h}:{i}')
    }

    return parseTime(outTime, '{m}-{d} {h}:{i}')
  }

  if (time.getHours() != outTime.getHours()) {
    return parseTime(outTime, '{h}:{i}')
  }

  return parseTime(outTime, '{h}:{i}')
  // let minutes = outTime.getMinutes() - time.getMinutes()
  // if (minutes == 0) {
  //   return '刚刚'
  // }

  // minutes = Math.abs(minutes)
  // return `${minutes}分钟前`
}

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  // if (typeof time === 'object') {
  //   date = time
  // } else {
  //   if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
  //     time = parseInt(time)
  //   }
  //   if (typeof time === 'number' && time.toString().length === 10) {
  //     time = time * 1000
  //   }

  //   date = new Date(time.replace(/-/g, '/'))
  // }

  date = new Date(time)
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }

    return value.toString().padStart(2, '0')
  })
  return time_str
}

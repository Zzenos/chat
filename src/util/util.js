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

const autoSize = size => {
  if (Number(size) === 'NaN') return
  let unit = 'byte'
  const units = ['byte', 'KB', 'MB', 'GB', 'TB', 'PB']
  let i = 5
  let s = 0
  while (i) {
    if (size >= 1024 ** i) {
      break
    }
    i--
  }
  unit = units[i]
  s = (size / 1024 ** i).toFixed(2)
  return `${s}${unit}`
}

export const exportFile = (data, name) => {
  const url = window.URL.createObjectURL(new Blob([data]))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  const fileName = `${name}_${new Date().getTime()}.xlsx`
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  link.remove()
}

export const pad = (num, maxLength) => {
  const times = maxLength - num.toString().length
  return new Array(times + 1).join('0') + num
}

export const getFormattedTime = () => {
  var time = new Date()
  return ' @ ' + pad(time.getHours(), 2) + ':' + pad(time.getMinutes(), 2) + ':' + pad(time.getSeconds(), 2) + '.' + pad(time.getMilliseconds(), 3)
}
// 扁平化store结构
export const js2 = {
  id: '123',

  author: {
    id: '1',

    name: 'Paul'
  },

  title: 'My awesome blog post',

  comments: [
    {
      id: '324',

      commenter: {
        id: '2',

        name: 'Nicole'
      }
    }
  ]
}

export const js3 = {
  result: '123',

  entities: {
    articles: {
      '123': {
        id: '123',

        author: '1',

        title: 'My awesome blog post',

        comments: ['324']
      }
    },

    users: {
      '1': { id: '1', name: 'Paul' },

      '2': { id: '2', name: 'Nicole' }
    },

    comments: {
      '324': { id: '324', commenter: '2' }
    }
  }
}

export const downloadImg = url => {
  const image = new Image()
  // 解决跨域 Canvas 污染问题
  image.setAttribute('crossOrigin', 'anonymous')
  image.src = url
  return new Promise(resolve => {
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      const context = canvas.getContext('2d')
      context.drawImage(image, 0, 0, image.width, image.height)
      const urls = canvas.toDataURL('image/png') // 得到图片的base64编码数据
      // console.log(urls, reject)
      resolve(urls)
      // const a = document.createElement('a'); // 生成一个a元素
      // const event = new MouseEvent('click'); // 创建一个单击事件
      // a.download = name; // 设置图片名称
      // a.href = urls; // 将生成的URL设置为a.href属性
      // a.dispatchEvent(event); // 触发a的单击事件
    }
  })
}

export default {
  autoSize
}

import axios from 'axios'
import { message } from 'ant-design-vue'
import store from '@/store'
// import router from '@/router'

class Request {
  constructor() {
    this.baseURL = process.env.VUE_APP_URANUS_API
    // this.baseURL = 'https://test-bizchat.zmeng123.cn/api'
    this.timeout = 30000
  }

  setInterceptor = instance => {
    instance.interceptors.request.use(
      config => {
        return config
      },
      err => Promise.reject(err)
    )
    instance.interceptors.response.use(
      res => {
        // this.removePending(res.config)
        // return res
        const { code } = res.data
        if (code === 301 || code === 302) {
          // router.replace('/login')
          message.error(res.data.message)
        } else if (code && code !== 0 && code !== 200) {
          message.error(res.data.message)
          return Promise.reject(res.data)
        }
        return res.data
        //=======
      },
      err => {
        if (err && err.response) {
          const { status, data } = err.response
          message.error(data)
          console.log(status)
        }
        return Promise.reject(err)
      }
    )
  }

  handleHeader = () => {
    let { token } = store.state
    token = typeof token === 'undefined' ? '' : token

    const headers = {
      'Content-Type': 'application/json;charset=UTF-8',
      'cur-path': window.location.pathname
    }
    if (token) {
      headers.token = token
    }
    return headers
  }

  request(options) {
    const instance = axios.create()
    const config = {
      timeout: this.timeout,
      ...options,
      headers: this.handleHeader(),
      baseURL: this.baseURL
      // validateStatus(status) {
      //   console.log(status)
      //   return status >= 200 && status < 500 && status !== 401 && status !== 403; // 默认的
      // }
    }
    this.setInterceptor(instance, options.url)
    return instance(config)
  }
}

export default new Request()

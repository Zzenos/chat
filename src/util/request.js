import axios from 'axios'
import { message } from 'ant-design-vue'
import store from '@/store'
import router from '@/router'

class Request {
  constructor() {
    this.baseURL = process.env.VUE_APP_BASE_API
    this.timeout = 30000
  }

  setInterceptor = instance => {
    instance.interceptors.request.use(
      config => {
        // console.log('request------', config);
        return config
      },
      err => Promise.reject(err)
    )
    // 配置响应拦截
    instance.interceptors.response.use(
      res => {
        const { code } = res.data
        if (code === 301 || code === 302) {
          router.replace('/login')
        } else if (code && code !== 0) {
          message.error(res.data.message)
          return Promise.reject(res.data)
        }
        return res.data
      },
      err => {
        if (err && err.response) {
          const { data } = err.response
          message.error(data)
        }
        return Promise.reject(err)
      }
    )
  }

  handleHeader = () => {
    let { token } = store.state
    token = typeof token === 'undefined' ? '' : token

    const headers = {
      'Content-Type': 'application/json;charset=UTF-8'
    }
    if (token) {
      headers.token = token
    }
    return headers
  }

  request(config) {
    const instance = axios.create()
    config = {
      timeout: this.timeout,
      headers: this.handleHeader(),
      baseURL: this.baseURL,
      withCredentials: true,
      ...config
    }
    this.setInterceptor(instance)
    return instance(config)
  }
}

export default new Request()

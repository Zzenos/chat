import axios from 'axios'
import {
  message
} from 'ant-design-vue'
import router from '@/router'

const BASE_URL = process.env.VUE_APP_BASE_API

const config = {
  timeout: 30000,
  baseUrl: BASE_URL
}


function request(data) {
  let instance = axios.create({
    ...config,
    ...data
  })

  instance.interceptors.request.use((config) => {
    return config
  }, (error) => {
    return Promise.reject(error)
  })

  instance.interceptors.response.use((response) => {
    return response
  }, (err) => {
    if (err && err.response) {
      const {
        status,
        data
      } = err.response
      if (status === 400) {
        message.error(data)
      } else if (status === 401 && err.config.url.includes('/authx/signin')) {
        message.error(data)
      } else if (status === 401) {
        message.error('您的登录已超时，请重新登录')
        if (router.currentRoute.path !== '/login') {
          window.location.href = '/login'
        }
      } else if (status === 403) {
        message.error('没有足够的权限')
        router.replace('/login')
      } else if (status >= 500) {
        message.error('服务器开小差了，请稍后再试')
      } else if (
        !err.config.url.includes('/asset/create' &&
          !err.config.url.includes('/file/upload/form'))) {
        message.error(data)
      }
    }
    return Promise.reject(err)
  })

  return instance
}

export default request
import axios from 'axios'
// import { message, Modal } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import store from '@/store'
// import { refreshToken } from '@/apis/user'
import router from '@/router'

class Request {
  constructor() {
    // this.baseURL = process.env.VUE_APP_BASE_API
    this.baseURL = 'https://test-bizchat.zmeng123.cn/api'
    this.timeout = 30000
    // this.queue = []
    // this.isTokenRefreshing = false
    // this.shouldRefreshToken = () => !store.getters.getAccessToken() && store.getters.getRefreshToken()
    // this.pending = [] // 声明一个数组用于存储 axios的取消函数喝axios标识 '/marketing/adver/simple/list',
    // this.routerCancelTokenList = [
    //   '/marketing/adver/list',
    //   '/marketing/campaign/list',
    //   '/marketing/campaign/simple/list',
    //   '/marketing/plan/list',
    //   '/marketing/plan/simple/list',
    //   '/marketing/creative/list'
    // ] // 权限取消集合 todo 投放列表切换
  }

  // removePending = ever => {
  //   this.pending.forEach((v, i) => {
  //     if (v.u.replace('/kuaishou/', '/') === `${ever.url.replace('/kuaishou/', '/')}&${ever.method}`) {
  //       v.f() // 取消执行
  //       this.pending.splice(i, 1)
  //     }
  //   })
  // }

  setInterceptor = instance => {
    instance.interceptors.request.use(
      config => {
        // this.refresh(config) // 在一个ajax发送前执行一下取消操作
        // this.removePending(config)
        // if (this.routerCancelTokenList.includes(config.url.replace('/kuaishou/', '/'))) {
        //   const Cancel = axios.CancelToken
        //   config.cancelToken = new Cancel(c => {
        //     this.pending.push({
        //       u: `${config.url}&${config.method}`,
        //       f: c
        //     })
        //   })
        // }
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
          router.replace('/login')
        } else if (code && code !== 0) {
          message.error(res.data.message)
          return Promise.reject(res.data)
        }
        return res.data
        //=======
      },
      err => {
        if (err && err.response) {
          const { status, data } = err.response
          // if (status === 400) {
          //   const { msg, tip } = data
          //   if (tip) {
          //     // 统一处理所有400的强提示。 2.25版本加
          //     Modal.destroyAll() // 销毁所有
          //     Modal.confirm({
          //       title: '提示',
          //       content: msg,
          //       closable: true,
          //       cancelButtonProps: {
          //         style: { display: 'none' }
          //       }
          //     })
          //   } else {
          //     message.error(data)
          //   }
          // } else if (status === 401 && err.config.url.includes('/authx/signin')) {
          //   message.error(data)
          // } else if (status === 401) {
          //   message.error('您的登录已超时，请重新登录')
          //   if (router.currentRoute.path !== '/login') {
          //     window.location.href = '/login'
          //   }
          // } else if (status === 403) {
          //   message.error('没有足够的权限')
          //   router.replace('/login')
          // } else if (status >= 500) {
          //   message.error('服务器开小差了，请稍后再试')
          // } else if (!err.config.url.includes('/asset/create' && !err.config.url.includes('/file/upload/form'))) {
          //   message.error(data)
          // }
          message.error(data)
          console.log(status)
        }
        return Promise.reject(err)
      }
    )
  }

  // refresh(config) {
  //   return new Promise(resolve => {
  //     // 只有当access_token失效而refresh_token有效时触发
  //     if (!this.shouldRefreshToken()) {
  //       config.headers.Authorization = `bearer ${store.getters.getAccessToken()}`
  //       resolve(config)
  //       return
  //     }
  //     // 绕过刷新/登录/登出接口
  //     if (config.url.includes('/authx')) {
  //       resolve(config)
  //       return
  //     }
  //     this.queue.push(newToken => {
  //       config.headers.Authorization = newToken
  //       resolve(config)
  //     })
  //     if (!this.isTokenRefreshing) {
  //       this.isTokenRefreshing = true
  //       refreshToken()
  //         .then(res => {
  //           if (res.status === 200) {
  //             store.commit('REFRESH_TOKEN', res.data)
  //             const newToken = `bearer ${store.getters.getAccessToken()}`
  //             this.queue.map(item => {
  //               item(newToken)
  //             })
  //           }
  //           this.isTokenRefreshing = false
  //         })
  //         .catch(() => {
  //           this.isTokenRefreshing = false
  //           // 刷新失败置空
  //           this.queue = []
  //           resolve(config)
  //         })
  //     }
  //   })
  // }
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

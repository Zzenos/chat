/**
 * @description 侧边栏加载应用 iframe mixin
 */
export default {
  data() {
    return {
      iframeWin: null, // iframe 对象
      // 侧边栏配置
      sidebarConfig: {
        customerInfo: {
          src: `${process.env.VUE_APP_LOGIN_URL}/app/cusPortrait.html`
          // src: `http://localhost:9999/app/cusPortrait.html`
        },
        verbalTrick: {
          src: `${process.env.VUE_APP_LOGIN_URL}/app/library.html`
          // src: `http://localhost:9999/app/library.html`
        },
        orderDynamic: {
          src: `${process.env.VUE_APP_LOGIN_URL}/app/orderDynamic.html`
          // src: `http://localhost:9999/app/orderDynamic.html`
        },
        mediaLibrary: {
          // src: `${process.env.VUE_APP_LOGIN_URL}/app/mediaLibrary.html`
          src: `http://localhost:9999/app/mediaLibrary.html`
        }
      },
      // 用户信息
      userInfo: {
        // contactUserId: 'wm_XL6CgAAmUTX9xdIFtij2jvoC90-QQ',
        // corpId: 'wwfc3ae560ee1592d8',
        // userId: 'WangJiaXiang'
      }
    }
  },
  // watch: {
  //   activeKey(n, o) {
  //     if (n === o || n == 'groupInfo') return
  //   }
  // },
  mounted() {
    window.addEventListener('message', this.handleMessage, false)
  },
  destoryed() {
    window.removeEventListener('message', this.handleMessage, false)
  },
  methods: {
    /**
     * @description 初始化iframe实例
     */
    initIframe() {
      if (!this.activeKey) return null
      const refName = this.activeKey + 'Frame'
      console.log('current iframe ref:', refName, this.$refs[`${refName}`])
      if (!this.$refs[`${refName}`]) {
        return null
      } else {
        this.sidebarConfig[this.activeKey].iframeWin = this.$refs[refName].contentWindow
        return this.$refs[refName].contentWindow
      }
    },
    /**
     * @param {String} type
     * @param {Object} data
     * @description 传递数据给iframe
     */
    sendMessage(type, data) {
      const iframeWin = this.initIframe()
      if (!iframeWin) return
      setTimeout(() => {
        iframeWin.postMessage({ type, data }, '*')
        console.warn('BizChat sendMessage', { type, data })
      }, 300)
    },
    /**
     * @description 处理iframe内部发回来的数据
     */
    handleMessage(evt) {
      console.warn('evt', evt.data)
      if (evt.origin.indexOf('bizchat') === -1 || !evt.data) return
      const { cmd, data } = JSON.parse(evt.data)
      switch (cmd) {
        case 'ready':
          // iframe 加载完成 传递用户数据
          this.sendMessage('InitUserInfo', this.userInfo)
          break
        case 'sendChatMessage':
          console.log('sendChatMessage params', data)
          switch (data.type) {
            case 1:
              data.msgType = 'text'
              break
            case 9:
              data.msgType = 'file'
              data.url = data.fileUrl
              data.title = data.fileName
              break
            case 2:
              data.msgType = 'image'
              data.url = data.picUrl
              break
            case 3:
              data.msgType = 'video'
              data.coverUrl = data.videoUrl + '?x-oss-process=video/snapshot,t_1000,f_jpg,w_0,h_0'
              data.url = data.videoUrl
              break
            case 4:
              data.msgType = 'link'
              data.href = data.url
              data.coverUrl = data.cover
              break
            case 5:
              data.msgType = 'weapp'
              data.content = {}
              data.coverUrl = data.cover
              data.content.des_1 = data.appName
              data.content.weappiconurl = data.avatar
              data.content.title = data.appTitle
              data.content.pagepath = data.path
              // data.content = JSON.stringify(data.content)
              data.title = data.appTitle
              break
            default:
              break
          }
          this.msgInfo = data
          this.transmitMsgVisible = true
          break

        default:
          break
      }
    }
  }
}

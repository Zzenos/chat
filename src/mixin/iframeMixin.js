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
        },
        verbalTrick: {
          src: `${process.env.VUE_APP_LOGIN_URL}/app/verbalTricks.html`
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
  watch: {
    activeKey(n) {
      if (n == 'groupInfo') return
      this.sendMessage('InitUserInfo', this.userInfo)
    }
  },
  mounted() {
    window.addEventListener('message', this.handleMessage, false)
  },
  destoryed() {
    window.removeEventListener('message', this.handleMessage, false)
  },
  methods: {
    initIframe(refName) {
      console.log('iframe ref', refName, this.$refs[`${refName}`])
      if (!this.$refs[`${refName}`]) return
      this.iframeWin = this.$refs[refName].contentWindow
    },
    /**
     * @param {String} type
     * @param {Object} data
     * @description 传递数据给iframe
     */
    sendMessage(type, data) {
      this.initIframe(`${this.activeKey}Frame`)
      if (!this.iframeWin) return
      setTimeout(() => {
        this.iframeWin.postMessage({ type, data }, '*')
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
      // 传递数据
      switch (cmd) {
        case 'ready':
          this.sendMessage('InitUserInfo', this.userInfo)
          break
        case 'sendChatMessage':
          console.log('sendChatMessage params', data)
          break

        default:
          break
      }
    }
  }
}

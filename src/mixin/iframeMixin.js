/**
 * @description 侧边栏加载应用 iframe mixin
 */
export default {
  data() {
    return {
      iframeWin: null, // iframe 对象
      userInfo: {
        // contactUserId: 'wm_XL6CgAAmUTX9xdIFtij2jvoC90-QQ',
        // corpId: 'wwfc3ae560ee1592d8',
        // userId: 'WangJiaXiang'
      } // 用户信息
    }
  },
  watch: {
    activeKey(n) {
      if (n == 'groupInfo') return
      this.$nextTick(() => {
        this.sendMessage('InitUserInfo', this.userInfo)
      })
    }
  },
  mounted() {
    window.addEventListener('message', this.handleMessage, false)
  },
  destoryed() {
    window.removeEventListener('message', this.handleMessage)
  },
  methods: {
    initIframe(refName) {
      console.log('iframe ref', this.$refs[`${this.activeKey}Frame`])
      if (!this.$refs[`${this.activeKey}Frame`]) return
      this.iframeWin = this.$refs[refName].contentWindow
    },
    /**
     * @param {String} type
     * @param {Object} data
     * @description 传递数据给iframe
     */
    sendMessage(type, data) {
      this.initIframe(`${this.activeKey}Frame`)
      setTimeout(() => {
        this.iframeWin.postMessage({ type, data }, '*')
        console.warn('BizChat sendMessage', { type, data })
      }, 300)
    },
    /**
     * @description iframe内部发回来的数据
     */
    handleMessage(evt) {
      console.warn('evt', evt.data)
      const { cmd } = evt.data
      // 传递数据
      switch (cmd) {
        case 'ready':
          this.sendMessage('InitUserInfo', this.userInfo)
          break

        default:
          break
      }
    }
  }
}

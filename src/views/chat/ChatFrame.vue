<template>
  <div class="chat-frame_con">
    <a-spin size="large" tip="正在初始化..." :spinning="spinning">
      <a-row type="flex">
        <a-col flex="88px" class="side-bar">
          <svg-icon class-name="logo" icon-class="bizchat_logo"></svg-icon>
          <account-list v-if="!spinning" />
          <div class="bot-logo">
            <svg-icon class-name="icon-user" icon-class="user_icon"></svg-icon>
            <div>{{ username }}</div>
          </div>
        </a-col>
        <a-col flex="auto">
          <router-view />
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import * as types from '@/store/actionType'
import AccountList from './components/AccountList'

const LGOIN_URL = process.env.VUE_APP_LOGIN_URL

export default {
  name: 'chatFrame',
  components: { AccountList },
  data() {
    return {
      spinning: true,
      username: this.$store.state.userInfo.username
    }
  },
  props: {
    // 企微saas账号
    saasId: {
      type: String
    }
  },
  methods: {
    initSocket() {
      console.log(`%c ${this.$store.state.token}`, 'color:#02f;')
      this.$socket.init('', {
        transports: ['websocket'],
        query: {
          token: `${this.$store.state.token}`
        }
      })
      // 初始化探鲸账号列表
      this.$socket.emit('accounts', ack => {
        if (ack.code === 200) {
          this[types.ADD_ACCOUNT](ack.data)
          this.spinning = false
        }
      })
      // 历史消息
      this.$socket.on('msg_history', res => {
        if (res.code === 200) {
          this[types.DISTRIBUTE_MSG](res.data)
        }
      })
      // 新消息
      this.$socket.on('msg_new', res => {
        this[types.DISTRIBUTE_MSG](res.data)
      })
      // 通讯录
      this.$socket.on('contacts', res => {
        // if (res.code === 200) {
        this[types.ADD_CONTACT](res.data)
        // }
      })
      // 添加会话列表
      this.$socket.on('chat_list', res => {
        if (res.code === 200) {
          this[types.ADD_CHAT_LIST](res.data)
        }
      })
      // 客户详细信息
      this.$socket.on('customer_info', res => {
        if (res.code === 200) {
          this[types.ADD_CUSTOMER_DETAILS](res.data)
        }
      })
      // 群聊详细信息
      this.$socket.on('group_info', res => {
        if (res.code === 200) {
          this[types.ADD_GROUP_DETAILS](res.data)
        }
      })
      // 员工详细信息
      this.$socket.on('member_info', res => {
        if (res.code === 200) {
          this[types.ADD_MEMBER_DETAILS](res.data)
        }
      })

      // 401
      this.$socket.on('no_auth', ack => {
        if (ack.code === 401) {
          this.$socket.close()
          setTimeout(() => {
            window.location.href = LGOIN_URL
          }, 500)
        }
      })

      this.$socket.on('connect_error', () => {
        // this.spinning = true
      })
    },
    ...mapActions([types.DISTRIBUTE_MSG, types.SEND_MSG]),
    ...mapMutations([types.ADD_CHAT_LIST, types.ADD_ACCOUNT, types.ADD_CONTACT, types.ADD_CUSTOMER_DETAILS, types.ADD_MEMBER_DETAILS, types.ADD_GROUP_DETAILS])
  },
  created() {
    this.initSocket()
  },
  beforeDestory() {
    this.$socket.close()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.chat-frame_con {
  min-width: 1280px;
}
.loading-mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: block;
  height: 100vh;
}
.side-bar {
  width: 88px;
  height: 100vh;
  text-align: center;
  background: #272c33;
  overflow: hidden;
  .logo {
    position: sticky;
    left: 0;
    top: 0;
    width: 88px;
    height: 88px;
    padding: 20px;
    background: #272c33;
  }
  .bot-logo {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 88px;
    height: 88px;
    color: rgba(255, 255, 255, 0.45);
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    background: #272c33;
    .icon-user {
      width: 20px;
      height: 20px;
      margin-top: 24px;
      margin-bottom: 8px;
    }
  }
}
</style>

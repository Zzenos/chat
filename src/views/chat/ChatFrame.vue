<template>
  <div>
    <a-row type="flex">
      <a-col flex="88px" class="side-bar">
        <svg-icon class-name="logo" icon-class="bizchat_logo"></svg-icon>
        <account-list />
        <div class="bot-logo">
          <svg-icon class-name="icon-user" icon-class="user_icon"></svg-icon>
          <div>ZMENG</div>
        </div>
      </a-col>
      <a-col flex="auto">
        <router-view />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import * as types from '@/store/actionType'
import AccountList from './components/AccountList'

export default {
  name: 'chatFrame',
  components: { AccountList },
  data() {
    return {}
  },
  props: {
    // 企微saas账号
    saasId: {
      type: String
    }
  },
  methods: {
    initSocket() {
      // console.log(3344, this.saasId)
      this.$socket.init(`?token=${this.$store.state.token}`)
      console.log(3344, this.$socket)
      this.$socket.emit('test', 'hahahah')

      // 历史消息
      this.$socket.on('msg_history', ack => {
        if (ack.code === 200) {
          this[types.DISTRIBUTE_MSG](ack.data)
        }
      })
      // 新消息
      this.$socket.on('msg_new', ack => {
        this[types.DISTRIBUTE_MSG](ack.data)
      })
      // 添加会话列表
      this.$socket.on('chat_list', ack => {
        if (ack.code === 200) {
          this[types.ADD_CHAT_LIST](ack.data)
        }
      })
      // 通讯录
      this.$socket.on('contacts', ack => {
        if (ack.code === 200) {
          this[types.ADD_CONTACT](ack.data)
        }
      })
      // 初始化探鲸账号列表
      this.$socket.on('accounts', ack => {
        if (ack.code === 200) {
          this[types.ADD_ACCOUNT](ack.data)
        }
      })
      // 获取微信号详细信息
      this.$socket.emit('wechat_info', { tjId: 112 }, ack => {
        console.log(ack)
      })
      // 获取群详细信息
      this.$socket.emit('group_info', { tjId: 112 }, ack => {
        console.log(ack)
      })

      setTimeout(() => {
        const msg = {
          fromId: 1112,
          toID: 1113,
          msgType: 'text'
        }
        this[types.SEND_MSG](msg)
      }, 5000)
    },
    ...mapActions([types.DISTRIBUTE_MSG, types.SEND_MSG]),
    ...mapMutations([types.ADD_CHAT_LIST, types.ADD_ACCOUNT, types.ADD_CONTACT])
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

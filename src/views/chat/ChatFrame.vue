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
import { mapActions } from 'vuex'
import * as types from '@/store/actionType'
import AccountList from './components/AccountList'

export default {
  name: 'chatFrame',
  components: { AccountList },
  data() {
    return {
      // ...mapState['d']
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
      // console.log(3344, this.saasId)
      // if (!this.saasId) return
      this.$socket.init(`?token=abc123`)
      console.log(3344, this.$socket)
      // this[types.DISTRIBUTE_MSG](123)
      this.$socket.emit('test', 'hahahah')
      this.$socket.on('test', ack => {
        console.log(223344, ack)
        // this[types.DISTRIBUTE_MSG](ack.data)
      })
      // 消息
      this.$socket.on('msg_new', ack => {
        this[types.DISTRIBUTE_MSG](ack.data)
      })
      // 添加会话列表
      this.$socket.on('chat_list', ack => {
        this[types.ADD_CHAT](ack.data)
      })
    },
    ...mapActions([types.DISTRIBUTE_MSG])
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

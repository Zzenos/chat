<template>
  <div>
    <a-row type="flex">
      <a-col flex="88px" class="side-bar">
        <svg-icon class-name="logo" icon-class="bizchat_logo"></svg-icon>
        账号列表
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

export default {
  name: 'chatFrame',
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
      if (this.saasId) this.$socket.init(this.saasId)
      this[types.DISTRIBUTE_MSG](123)
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
  background: #272c33;
  .logo {
    margin-top: 20px;
    margin-left: 20px;
    width: 48px;
    height: 48px;
  }
}
</style>

<template>
  <div class="chat-list_container">
    <div v-for="item in chatList" :key="item.chatId" class="item" :class="{ active: curChat.chatId === item.chatId }" @click="handleItem(item)">
      <!-- <a-badge :offset="[-20, 0]" :count="item.msg_count" :overflow-count="99"> -->
      <svg-icon v-if="item.chatType === 2" class-name="avatar" icon-class="icon_groupchat"></svg-icon>
      <img v-else class="avatar" :src="item.wechatAvatar" alt="" />
      <!-- </a-badge> -->
      <div class="info">
        <div class="nickname">
          <span v-html="item.wechatName"></span>
          <span v-if="[1, 3].includes(item.chatType)" class="label">@微信</span>
        </div>
        <div class="time">22:00</div>
        <!-- 需要根据消息类型，处理显示的内容 -->
        <div class="msg ellipsis">{{ item.content }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'chatList',
  data() {
    return {
      curChat: null,
      chatList: []
    }
  },
  props: {
    tjId: {
      type: String
    }
  },
  watch: {
    tjId: {
      immediate: true,
      handler: function(n, o) {
        if (n === o) return
        this.chatList = this.$store.getters.chatsByChatId(this.tjId) || []
        // this.chatList = this.$store.state.chat[this.tjId] || []
        console.log(`tjId:${this.tjId}=>chatList`, this.chatList)
        if (!this.curChat && this.chatList.length > 0) this.curChat = this.chatList[0]
      }
    }
  },
  methods: {
    handleItem(val) {
      console.log(val)
      const { chatId, wechatName } = val
      if (this.curChat.chatId === chatId) {
        // return
      }
      this.curChat = val
      this.$router.push({ path: `/chatframe/${this.tjId}/recent/${chatId}?wechatId=${this.curChat.wechatId}&wechatName=${wechatName}` })
    }
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>
.chat-list_container {
  width: 100%;
  height: calc(100vh - 132px);
  overflow-y: scroll;
  .item {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 72px;
    padding-left: 16px;
    display: flex;
    align-items: center;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    cursor: pointer;
    &.active {
      background-color: #e9eaeb;
    }
    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 4px;
      margin-right: 18px;
    }
    .info {
      text-align: left;
      height: 44px;
      .nickname {
        line-height: 22px;
        margin-bottom: 4px;
        .label {
          color: #0ead63;
          margin-left: 8px;
        }
      }
      .time {
        position: absolute;
        right: 12px;
        top: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
        line-height: 18px;
      }
      .msg {
        width: 212px;
        color: rgba(0, 0, 0, 0.45);
        line-height: 18px;
        font-size: 12px;
      }
    }
  }
}
</style>

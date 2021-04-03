<template>
  <div class="chat-list_container">
    <div v-for="item in chatList" :key="item.chatId" class="item" :class="{ active: curChat.chatId === item.chatId }" @click="handleItem(item)">
      <!-- <a-badge :offset="[-20, 0]" :count="item.msg_count" :overflow-count="99"> -->
      <img v-if="item.chatType === 2" class="avatar" :src="item.wechatAvatar" alt="" />
      <svg-icon v-else class-name="avatar" icon-class="icon_groupchat"></svg-icon>
      <!-- </a-badge> -->
      <div class="info">
        <div class="nickname">
          <span v-html="item.wechatName"></span>
          <span v-if="item.wechatAvatar" class="label">@微信</span>
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
      // wechat_account: [
      //   {
      //     wechat_id: 1,
      //     chat_id: 1,
      //     chat_type: 2, // 会话类型 1 群聊 2 私聊
      //     wechat_name: '刘东霞',
      //     msg_count: 5,
      //     content: '你好，我想咨询一下装修办公室相关事宜',
      //     wechat_avatar: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
      //   },
      //   {
      //     wechat_id: 2,
      //     chat_id: 2,
      //     chat_type: 2,
      //     wechat_name: '张建',
      //     msg_count: 10,
      //     wechat_avatar: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5JkicMu1sD1UZ8seFx9vPcAAjyaOfoBLiaV0cNz51xmPCg/0'
      //   },
      //   {
      //     wechat_id: 3,
      //     chat_id: 3,
      //     chat_type: 1,
      //     wechat_name: 'BizChat群聊测试1'
      //   },
      //   {
      //     wechat_id: 4,
      //     chat_id: 4,
      //     chat_type: 1,
      //     wechat_name: 'BizChat群聊测试2',
      //     msg_count: 0
      //   },
      //   {
      //     wechat_id: 5,
      //     chat_id: 5,
      //     chat_type: 2,
      //     wechat_name: '刘东霞5',
      //     msg_count: 100,
      //     wechat_avatar: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
      //   },
      //   {
      //     wechat_id: 6,
      //     chat_id: 6,
      //     chat_type: 2,
      //     wechat_name: '张建6',
      //     wechat_avatar: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5JkicMu1sD1UZ8seFx9vPcAAjyaOfoBLiaV0cNz51xmPCg/0'
      //   },
      //   {
      //     wechat_id: 7,
      //     chat_id: 7,
      //     chat_type: 2,
      //     wechat_name: '刘东霞7',
      //     wechat_avatar: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
      //   },
      //   {
      //     wechat_id: 8,
      //     chat_id: 8,
      //     chat_type: 2,
      //     wechat_name: '张建8',
      //     wechat_avatar: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5JkicMu1sD1UZ8seFx9vPcAAjyaOfoBLiaV0cNz51xmPCg/0'
      //   }
      // ]
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
        this.chatList = this.$store.state.chat[this.tjId] || []
        if (!this.curChat && this.chatList.length > 0) this.curChat = this.chatList[0]
      }
    }
  },
  methods: {
    handleItem(val) {
      console.log(val)
      const { chatId } = val
      if (this.curChat.chatId === chatId) {
        return
      }
      this.curChat = val
      this.$router.push({ path: `/chatframe/${this.tjId}/recent/${chatId}` })
    }
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>
.chat-list_container {
  width: 100%;
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

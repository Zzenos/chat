<template>
  <div class="chat-list_container">
    <div v-for="item in wechat_account" :key="item.wechat_id" class="item" :class="{ active: curChat.wechat_id === item.wechat_id }" @click="handleItem(item)">
      <a-badge :offset="[-20, 0]" :count="item.msg_count" :overflow-count="99">
        <img :src="item.wechat_avatar" alt="" />
      </a-badge>
      <div class="info">
        <div class="nickname">
          <span v-html="item.wechat_name"></span>
          <span class="label">@微信</span>
        </div>
        <div class="time">22:00</div>
        <!-- 需要根据消息类型，处理显示的内容 -->
        <div class="msg">{{ item.content }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'chatList',
  data() {
    return {
      curChat: {},
      wechat_account: [
        {
          wechat_id: 1,
          wechat_name: '刘东霞',
          msg_count: 5,
          content: '你好，我想咨询一下装修办公室相关事宜',
          wechat_avatar: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
        },
        {
          wechat_id: 2,
          wechat_name: '张建',
          msg_count: 10,
          wechat_avatar: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5JkicMu1sD1UZ8seFx9vPcAAjyaOfoBLiaV0cNz51xmPCg/0'
        },
        {
          wechat_id: 3,
          wechat_name: '刘东霞3',
          wechat_avatar: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
        },
        {
          wechat_id: 4,
          wechat_name: '张建4',
          msg_count: 88,
          wechat_avatar: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5JkicMu1sD1UZ8seFx9vPcAAjyaOfoBLiaV0cNz51xmPCg/0'
        },
        {
          wechat_id: 5,
          wechat_name: '刘东霞5',
          msg_count: 100,
          wechat_avatar: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
        },
        {
          wechat_id: 6,
          wechat_name: '张建6',
          wechat_avatar: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5JkicMu1sD1UZ8seFx9vPcAAjyaOfoBLiaV0cNz51xmPCg/0'
        },
        {
          wechat_id: 7,
          wechat_name: '刘东霞7',
          wechat_avatar: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
        },
        {
          wechat_id: 8,
          wechat_name: '张建8',
          wechat_avatar: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5JkicMu1sD1UZ8seFx9vPcAAjyaOfoBLiaV0cNz51xmPCg/0'
        }
      ]
    }
  },
  methods: {
    handleItem(val) {
      console.log(val)
      const { wechat_id } = val
      if (this.curChat.wechat_id === wechat_id) {
        return
      }
      this.curChat = val
      this.$router.push({ path: `/chatframe/${wechat_id}/recent/0` })
    }
  },
  mounted() {
    this.curChat = this.wechat_account[0]
  }
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
    img {
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
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: rgba(0, 0, 0, 0.45);
        line-height: 18px;
        font-size: 12px;
      }
    }
  }
}
</style>

<template>
  <div class="chat-list_container">
    <a-spin size="large" tip="数据加载中..." :spinning="spinning"></a-spin>
    <div v-for="item in chats" :key="item.chatId" class="item" :class="{ active: curChat.chatId === item.chatId }" @click="handleItem(item)">
      <a-badge :offset="[-18, 0]" :count="item.unreadCount" :overflow-count="99">
        <svg-icon v-if="item.chatType === 2" class-name="avatar" icon-class="icon_groupchat"></svg-icon>
        <img v-else class="avatar" :src="item.wechatAvatar" alt="" />
      </a-badge>
      <div class="info">
        <div class="nickname">
          <div class="ellipsis" :style="{ 'max-width': [1, 3].includes(item.chatType) && item.lost ? '70px' : '140px' }">
            <span v-html="item.wechatName"></span>
            <span v-if="[1, 3].includes(item.chatType)" :style="{ color: item.company ? '#FF8000' : '#0ead63' }" class="label">@{{ item.company || '微信' }}</span>
            <span v-if="item.chatType === 2">（{{ item.memberCount }}）</span>
          </div>
          <span v-if="[1, 3].includes(item.chatType) && item.lost == '1'" class="tag">流失客户</span>
          <span v-if="[1, 3].includes(item.chatType) && item.lost == '3'" class="tag">删除客户</span>
        </div>
        <div class="time">{{ item.lastMsg.time | timeFilter }}</div>
        <!-- 需要根据消息类型，处理显示的内容 -->
        <div class="msg ellipsis" v-html="item.lastMsg.defaultContent"></div>
      </div>
    </div>
    <no-data text="暂无消息内容" v-if="!spinning && chats.length === 0" />
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import { mapMutations } from 'vuex'
import * as types from '@/store/actionType'

export default {
  name: 'chatList',
  data() {
    return {
      curChat: { chatId: null },
      chats: [],
      spinning: true
    }
  },
  props: {
    tjId: {
      type: String
    },
    searchText: {
      type: String
    },
    selected: {
      type: Boolean
    }
  },
  computed: {
    chatList: {
      get: function() {
        return this.$store.getters.chatsByTjId(this.tjId)
      },
      set: function(val) {
        return val
      }
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler: function(n, o) {
        if (n === o) return
        console.log('chatList $route ==>', n)
        // 切换账号或者刷新后进入，会话的默认选中状态
        const { contactId } = n.params
        if (contactId === '0') {
          this.curChat = { chatId: null }
          return
        }
        this.chats.forEach(ele => {
          if (ele.chatId === contactId) {
            this.curChat = ele
          }
        })
      }
    },
    searchText: {
      immediate: true,
      handler: function(n) {
        const chatList = cloneDeep(this.$store.getters.chatsByTjId(this.tjId))
        this.chats = n ? chatList.filter(ele => ele.wechatName && ele.wechatName.indexOf(n) > -1) : chatList
      }
    },
    selected(n) {
      if (n) {
        if (this.curChat.chatId && this.curChat.chatId !== this.$route.params.contactId) {
          this.handleItem(this.curChat, true)
        }
      }
    },
    chatList: {
      immediate: true,
      handler: function(n, o) {
        if (n === o) return
        // console.log(`tjId:${this.tjId}=>chatList`, n)
        if (n && n.length === 0) {
          this.spinning = true
        } else {
          this.$nextTick(() => {
            this.spinning = false
          })
        }
        this.chats = n
      }
    }
  },
  methods: {
    ...mapMutations([types.CLEAR_UNREAD_MSG]),
    handleItem(val, canJump = false) {
      console.log('click chat', val)
      const { chatId } = val
      const { accountId, accountName } = this.$route.query
      if (this.curChat.chatId === chatId && !canJump) {
        return
      }
      this.curChat = val
      this[types.CLEAR_UNREAD_MSG](this.curChat.chatId)
      this.$router.push({
        path: `/chatframe/${this.tjId}/recent/${chatId}`,
        query: { ...this.curChat, accountId, accountName }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-list_container {
  width: 100%;
  height: calc(100vh - 132px);
  overflow-y: scroll;
  /deep/.ant-badge-count {
    box-shadow: none;
  }
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
      margin-right: 12px;
    }
    .info {
      text-align: left;
      height: 44px;
      .nickname {
        display: flex;
        align-items: center;
        line-height: 22px;
        margin-bottom: 4px;
        .label {
          color: #0ead63;
          margin-left: 8px;
        }
        .tag {
          display: inline-block;
          background: #e1eaff;
          color: #1d61ef;
          width: 56px;
          height: 18px;
          line-height: 18px;
          text-align: center;
          border-radius: 2px;
          font-size: 12px;
          margin-left: 8px;
        }
      }
      .time {
        position: absolute;
        right: 12px;
        top: 16px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
        line-height: 18px;
      }
      .msg {
        width: 212px;
        color: rgba(0, 0, 0, 0.45);
        line-height: 18px;
        height: 18px;
        font-size: 12px;
      }
    }
  }
}
</style>

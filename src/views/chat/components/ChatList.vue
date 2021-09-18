<template>
  <div class="chat-list_container">
    <a-spin size="large" tip="数据加载中..." :spinning="spinning"></a-spin>
    <RecycleScroller class="scroller" :items="chats" :emitUpdate="true" :item-size="72" key-field="chatId" v-slot="{ item }">
      <div class="item" :class="{ active: curChat.chatId === item.chatId, isTop: item.isTop === 1 }" @contextmenu="onRightClick(item, $event)" @click="handleItem(item)">
        <a-badge :offset="[-18, 0]" :count="item.unreadCount" :overflow-count="99">
          <svg-icon v-if="item.chatType === 2" class-name="avatar" icon-class="icon_groupchat"></svg-icon>
          <img v-else class="avatar" :src="item.wechatAvatar" alt="" />
        </a-badge>
        <div class="info">
          <div class="nickname">
            <div class="ellipsis" :style="{ 'max-width': [1, 3].includes(item.chatType) && item.lost ? '70px' : '140px' }">
              <span class="ellipsis nick" v-html="item.alias || item.wechatName || '未命名'"></span>
              <span v-if="[1, 3].includes(item.chatType)" :style="{ color: item.company ? '#FF8000' : '#0ead63' }" class="label">@{{ item.company || '微信' }}</span>
              <span v-if="item.chatType === 2">
                <span class="count">（{{ item.memberCount }}）</span>
                <span class="tag out" v-if="item.isInner === 0">外部</span>
                <span class="tag inner" v-if="item.isInner === 1">内部</span>
              </span>
            </div>
            <span v-if="[1, 3].includes(item.chatType) && item.lost == '1'" class="tag">流失客户</span>
            <span v-if="[1, 3].includes(item.chatType) && item.lost == '3'" class="tag">删除客户</span>
            <span v-if="item.chatType == 0" class="tag system">官方</span>
          </div>
          <div class="time">{{ item.lastMsg.time | timeFilter }}</div>
          <!-- 需要根据消息类型，处理显示的内容 v-show="curChat.chatId === item.chatId || !getDraft(item.chatId)" -->
          <div class="msg ellipsis" v-if="curChat.chatId !== item.chatId && getDraft(item.chatId)">
            <span style="color:red">[草稿] </span>
            <span v-text="getDraft(item.chatId)"></span>
          </div>
          <div class="msg ellipsis" v-else>
            <span v-show="item.lastMsg.unread" v-html="handleAt(item.lastMsg)"></span>
            <span v-html="item.lastMsg.defaultContent"></span>
          </div>
        </div>
      </div>
    </RecycleScroller>
    <no-data text="暂无消息内容" v-if="!spinning && chats.length === 0" />
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import { mapMutations, mapGetters } from 'vuex'
import * as types from '@/store/actionType'

export default {
  name: 'chatList',
  data() {
    return {
      curChat: { chatId: null },
      chats: [],
      spinning: true,
      draft: ''
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
    chatList: {
      immediate: true,
      handler: function(n, o) {
        if (n === o) return
        const {
          info: { chatInitStatus = false }
        } = this.$store.getters.userDetailsById(this.tjId)
        console.log(`tjId:${this.tjId}=>chatList`, n, chatInitStatus)
        if (n && n.length === 0) {
          this.spinning = !chatInitStatus
        } else {
          this.$nextTick(() => {
            this.spinning = false
          })
        }
        this.chats = n
      }
    },
    $route: {
      immediate: true,
      handler: function(n, o) {
        if (n === o) return
        // console.log('chatList $route ==>', n)
        // 切换账号或者刷新后进入，会话的默认选中状态
        // this.draft = this.getDraftByChatId(this.curChat.chatId) || ''
        // console.log(this.curChat.chatId, this.getDraftByChatId(this.curChat.chatId), this.$store.getters.getDraftByChatId(this.curChat.chatId))
        // this.draft = ''
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
        if (!this.selected) return
        const chatList = cloneDeep(this.$store.getters.chatsByTjId(this.tjId))
        if (!n) {
          this.chats = chatList
          return
        }
        this.spinning = true
        this.$socket.emit('chat_list_search', { tjId: this.tjId, keyword: n }, ack => {
          if (ack.code === 200) {
            this.chats = ack.data.chatList.length ? this.$store.getters.chatsByTjId(this.tjId, ack.data.chatList) : []
          }
          this.spinning = false
        })
      }
    },
    selected(n) {
      if (n) {
        if (this.curChat.chatId && this.curChat.chatId !== this.$route.params.contactId) {
          this.handleItem(this.curChat, true)
        }
      }
    }
  },
  methods: {
    ...mapMutations([types.CLEAR_UNREAD_MSG, types.ADD_CHAT_LIST, types.UPDATE_CHAT_TOP_STATUS]),
    ...mapGetters(['getDraftByChatId']),
    handleItem(val, canJump = false) {
      console.log('click chat', val)
      const { chatId } = val
      const { accountId, accountName } = this.$route.query
      if (this.curChat.chatId === chatId && !canJump) {
        return
      }
      this.curChat = val
      this[types.ADD_CHAT_LIST]({
        tjId: this.tjId,
        chatList: [{ ...this.curChat }]
      })
      this[types.CLEAR_UNREAD_MSG](this.curChat.chatId)
      this.$router.push({
        path: `/chatframe/${this.tjId}/recent/${chatId}`,
        query: { ...this.curChat, accountId, accountName }
      })
    },
    onRightClick(item, event) {
      let menus = []
      console.log(item, 'onRightClick')
      menus.push({
        label: item.isTop ? '取消置顶' : '置顶',
        customClass: 'cus-contextmenu-item',
        onClick: () => {
          console.log(item, '置顶')
          this.handleChatTop(item)
        }
      })
      this.$contextmenu({
        items: menus,
        event,
        customClass: 'cus-contextmenu',
        zIndex: 3,
        minWidth: 120
      })
      event.preventDefault()
    },
    handleChatTop(item) {
      this.$socket.emit('top_chat', { chatId: item.chatId, isTop: item.isTop ? 0 : 1 }, res => {
        if (res.code === 200) {
          this[types.UPDATE_CHAT_TOP_STATUS]({
            tjId: this.tjId,
            chatList: [{ ...item, isTop: item.isTop ? 0 : 1 }]
          })
        }
      })
    },
    handleAt(item) {
      if (item.at == 1) {
        return '<span style="color:red">@所有人</span> '
      } else if (item.at == 2 && item.atList && item.atList.includes(item.chatId.split('&')[0])) {
        return '<span style="color:red">有人@我</span> '
      } else {
        return ''
      }
    },
    getDraft(chatId) {
      return this.$store.getters.getDraftByChatId(chatId)
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-list_container {
  width: 100%;
  height: calc(100vh - 132px);
  // overflow-y: scroll;
  /deep/.ant-badge-count {
    box-shadow: none;
  }
  .scroller {
    height: 100%;
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
    &.isTop {
      background-color: #f1f7fe;
    }
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
        .nick {
          max-width: 65px;
          display: block;
          float: left;
        }
        .label {
          color: #0ead63;
          margin-left: 8px;
        }
        .count {
          max-width: 40px;
          display: block;
          float: left;
        }
        .tag {
          display: inline-block;
          background: #dcdee0;
          color: rgba(0, 0, 0, 0.65);
          width: 56px;
          height: 18px;
          line-height: 18px;
          text-align: center;
          border-radius: 2px;
          font-size: 12px;
          margin-left: 8px;
          &.system {
            width: 30px;
            background: #e1eaff;
            color: #1d61ef;
            margin-left: 8px;
          }
          &.out {
            width: 30px;
            background: #daf2e8;
            color: #0ea860;
            margin-left: 0px;
          }
          &.inner {
            width: 30px;
            background: #e1eaff;
            color: #1d61ef;
            margin-left: 0px;
          }
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

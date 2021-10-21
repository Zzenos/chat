<template>
  <div class="forward-message">
    <div class="title ellipsis">
      <!-- {{ list.chatType == 2 ? '群聊的' : `${list.sender.wechatName} 和 ${list.to.wechatName}` }} -->
      聊天记录
    </div>
    <div class="content">
      <div class="item ellipsis" v-for="(item, index) in msgList" :key="index">{{ item.content || item.defaultContent }}</div>
    </div>
    <div class="bottom">
      聊天记录
    </div>
  </div>
</template>

<script>
import { getSendMsg } from '@/class/Msg'
export default {
  name: 'ForwardMessage',
  props: {
    list: {
      type: Object,
      default: () => {}
    }
  },
  components: {},
  data() {
    return {}
  },
  methods: {},
  computed: {
    msgList() {
      return this.list.chatRecord.map(i => {
        i.msgtype = i.msgType
        return getSendMsg(i)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.forward-message {
  width: 280px;
  height: 156px;
  background: #f0f1f2;
  border-radius: 8px;
  padding: 12px 12px 0 12px;
  color: rgba(0, 0, 0, 0.45);
  line-height: 18px;
  text-align: left;
  cursor: pointer;
  .title {
    font-size: 14px;
    color: #000000;
    line-height: 22px;
    margin-bottom: 4px;
  }
  .content {
    height: 90px;
    overflow: hidden;
    .item {
      margin-bottom: 4px;
    }
  }
  .bottom {
    height: 26px;
    border-top: 1px solid #e4e5e7;
    padding-top: 4px;
  }
}
</style>

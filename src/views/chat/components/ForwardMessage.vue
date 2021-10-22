<template>
  <div class="forward-message">
    <div class="title ellipsis">
      <!-- {{ list.chatType == 2 ? '群聊的' : `${list.sender.wechatName} 和 ${list.to.wechatName}` }} -->
      聊天记录
    </div>
    <!-- <div class="content">
      <div class="item ellipsis" v-for="(item, index) in msgList" :key="index">{{ item.content ? JSON.parse(item.content)[0].msg : item.defaultContent }}</div>
    </div> -->
    <div class="bottom">
      聚合消息类型暂不支持点击，请手机端查看
    </div>
  </div>
</template>

<script>
// import { getSendMsg } from '@/class/Msg'
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
        // if (i.msgType === 'text') {
        //   i.defaultContent = '文本'
        // } else if (i.msgType === 'image') {
        //   i.defaultContent = '[图片]'
        // } else if (i.msgType === 'file') {
        //   i.defaultContent = `[文件]${i.title}`
        // } else if (i.msgType === 'video') {
        //   i.defaultContent = '[视频]'
        // } else if (i.msgType === 'link') {
        //   i.defaultContent = `[链接]${i.title}`
        // } else if (i.msgType === 'weapp') {
        //   i.defaultContent = `[小程序]`
        // } else {
        //   i.defaultContent = '[该消息类型暂不能展示]'
        // }
        return i
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.forward-message {
  width: 280px;
  height: 66px;
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

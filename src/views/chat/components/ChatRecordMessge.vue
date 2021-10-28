<template>
  <div class="chat-record_container" @click="showTip">
    <div class="chat-record_mask"></div>
    <div class="chat-record_top">聊天记录</div>
    <div class="chat-record_main">
      <div v-for="(item, index) in list" :key="index">
        <div class="chat-record_text" v-if="item.msgtype === 'text'">{{ item.content }}</div>
        <div class="chat-record_text chat-record_link" v-else-if="item.msgtype === 'link'">[链接]{{ item.title || '无标题文档' }}</div>
        <div class="chat-record_text" v-else-if="item.msgtype === 'image'">[图片]</div>
        <div class="chat-record_text" v-else-if="item.msgtype === 'video'">[视频]</div>
        <div class="chat-record_text chat-record_link" v-else-if="item.msgtype === 'file'">[文件]{{ item.title }}</div>
        <div class="chat-record_text" v-else-if="item.msgtype === 'voice'">[语音]</div>
        <div class="chat-record_text chat-record_link" v-else-if="item.msgtype === 'system'">[系统提示]{{ item.content }}</div>
        <div class="chat-record_text" v-else-if="item.msgtype === 'videoNum'">[视频号]</div>
        <div class="chat-record_text" v-else-if="item.msgtype === 'chatRecord'">[聊天记录]</div>
        <div class="chat-record_text" v-else-if="item.msgtype === 'location'">[地理位置]</div>
        <div class="chat-record_text" v-else>[暂不支持该类型查看]</div>
      </div>
    </div>
    <div class="chat-record_bottom">聊天记录</div>
  </div>
</template>

<script>
export default {
  props: ['list'],
  methods: {
    showTip() {
      this.$message.info('请在手机端查看本消息详情')
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-record_container {
  position: relative;
  width: 260px;
  padding: 12px 12px 0px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: #dfdbda 0 0 5px;
  .chat-record_mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    &:active {
      background-color: rgba(100, 100, 100, 0.1);
    }
  }
  .chat-record_top {
    margin-bottom: 8px;
    font-size: 14px;
    color: #000000;
    line-height: 22px;
  }
  .chat-record_bottom {
    padding: 3px 0px 4px;
    margin-top: 4px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.65);
    line-height: 18px;
    border-top: 1px solid #e4e5e7;
  }
  .chat-record_main {
    min-height: 20px;
    max-height: 80px;
    overflow: hidden;
  }
  .chat-record_text {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
    line-height: 20px;
    // margin-bottom: 4px;
  }
  .chat-record_link {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>

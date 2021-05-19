<template>
  <div
    class="reply"
    :class="{
      left: float == 'left',
      right: float == 'right'
    }"
    @click="replyContentAll = !replyContentAll"
  >
    <div class="reply-content" v-html="content"></div>
    <div class="reply-content-all" v-show="replyContentAll" v-html="content"></div>
  </div>
  <!-- <div class="reply-message">
    <a-popover v-model="visible" title="" trigger="click" overlayClassName="reply-message-popover">
      <div slot="content" @click="hide" v-html="content"></div>
      <div class="reply-content" v-html="content"></div>
    </a-popover>
  </div> -->
</template>
<script>
export default {
  name: 'TextMessage',
  props: {
    content: {
      type: String,
      default: ''
    },
    float: {
      type: String,
      default: 'left'
    }
  },
  data() {
    return {
      html: '',
      replyContentAll: false,
      visible: false
    }
  },
  methods: {
    hide() {
      this.visible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.reply {
  position: relative;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  margin-top: 8px;
  padding: 8px 12px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.45);
  line-height: 18px;
  .reply-content {
    max-width: 320px;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .reply-content-all {
    position: absolute;
    top: 0;
    // right: calc(100% + 8px);
    // right: 100%;
    max-width: 280px;
    z-index: 10;
    background: #fff;
    box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    padding: 16px;
    text-align: left;
    // font-size: 14px;
    line-height: 22px;
  }
  &.left {
    .reply-content-all {
      // left: calc(100% + 8px);
      // left: 100%;
      right: -8px;
      transform: translateX(100%);
    }
  }
  &.right {
    .reply-content-all {
      left: -8px;
      transform: translateX(-100%);
    }
  }
}
// .reply-message {

// }
</style>

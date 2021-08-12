<template>
  <!-- <div
    class="reply-message"
    :class="{
      left: float == 'left',
      right: float == 'right'
    }"
    @click="replyContentAll = !replyContentAll"
  >
    <div class="reply-content-message" v-html="content"></div>
    <div class="reply-content-all-message" v-show="replyContentAll" v-html="content"></div>
  </div> -->
  <div class="reply-message-pop">
    <a-popover v-model="visible" title="" :placement="placement" trigger="click" overlayClassName="reply-message-popover">
      <div slot="content" @click="hide" v-html="content"></div>
      <div style="padding: 8px 12px;background: rgba(0, 0, 0, 0.05);border-radius: 4px;margin-top: 8px;">
        <div class="reply-content" v-html="content"></div>
      </div>
    </a-popover>
  </div>
</template>
<script>
export default {
  name: 'ReplyMessage',
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
  },
  computed: {
    placement() {
      return this.float == 'left' ? 'right' : 'left'
    }
  }
}
</script>
<style lang="scss">
.reply-message {
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
  .reply-content-message {
    max-width: 320px;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .reply-content-all-message {
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
    .reply-content-all-message {
      // left: calc(100% + 8px);
      // left: 100%;
      right: -8px;
      transform: translateX(100%);
    }
  }
  &.right {
    .reply-content-all-message {
      left: -8px;
      transform: translateX(-100%);
    }
  }
}
.reply-message-pop {
  .reply-content {
    // background: rgba(0, 0, 0, 0.05);
    // border-radius: 4px;
    // margin-top: 8px;
    // padding: 8px 12px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.45);
    line-height: 18px;
    max-width: 320px;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
.reply-message-popover.ant-popover.ant-popover-placement-left,
.reply-message-popover.ant-popover.ant-popover-placement-right {
  .ant-popover-content {
    .ant-popover-arrow {
      display: none;
    }
    .ant-popover-inner {
      .ant-popover-inner-content {
        max-width: 280px;
        background: #fff;
        box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.15);
        border-radius: 8px;
        padding: 16px;
        text-align: left;
        font-size: 14px;
        line-height: 22px;
      }
    }
  }
}
</style>

<template>
  <div>
    <div
      class="text-message"
      :class="{
        left: float == 'left',
        right: float == 'right'
      }"
    >
      {{ content }}
    </div>
    <!-- <div class="reply-text">
      <span>aazsaxsaiu</span>
    </div> -->
  </div>
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
      html: ''
    }
  },
  created() {}
}
</script>
<style lang="scss" scoped>
.text-message {
  position: relative;
  max-width: 480px;
  border-radius: 8px;
  padding: 12px;
  line-height: 22px;
  color: #000;
  text-align: left;
  word-break: break-word;
  word-wrap: break-word;
  font-size: 14px;
  font-weight: 400;

  &.left {
    background: #f0f1f2;
  }

  &.right {
    background: #d2f0fa;
  }
}
.reply-text {
  height: 21px;
  line-height: 21px;
  background: rgba(0, 0, 0, 0.4);
}
</style>

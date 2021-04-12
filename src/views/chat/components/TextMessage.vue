<template>
  <div
    class="text-message"
    :class="{
      left: float == 'left',
      right: float == 'right'
    }"
  >
    {{ content }}
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
  // min-width: 30px;
  // min-height: 30px;
  max-width: 480px;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  line-height: 22px;
  color: #000;
  text-align: left;
  // overflow: hidden;
  word-break: break-word;
  word-wrap: break-word;

  &.left {
    // color: #000;
    background: #f0f1f2;
  }

  &.right {
    // color: #000;
    background: #d2f0fa;
  }
}
</style>

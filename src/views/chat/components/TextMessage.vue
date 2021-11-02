<template>
  <div
    class="text-message"
    :class="{
      left: float == 'left',
      right: float == 'right'
    }"
    v-html="content"
  ></div>
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
    return {}
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
  white-space: pre-line;

  &.left {
    background: #f0f1f2;
  }

  &.right {
    background: #d2f0fa;
  }
}
</style>

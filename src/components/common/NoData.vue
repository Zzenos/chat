<template>
  <div class="nodata-com">
    <img src="https://zm-bizchat.oss-cn-beijing.aliyuncs.com/bizchat-chat/images/icon_nodata.png" alt="" />
    <div class="text">{{ text }}</div>
  </div>
</template>

<script>
export default {
  name: 'NoData',
  props: {
    text: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.nodata-com {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  img {
    width: 96px;
    height: 96px;
  }
  .text {
    margin-top: 16px;
    color: #eee;
    color: rgba(0, 0, 0, 0.45);
    line-height: 22px;
  }
}
</style>

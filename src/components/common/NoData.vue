<template>
  <div class="nodata-com">
    <img src="https://zm-bizchat.oss-cn-beijing.aliyuncs.com/bizchat-chat/images/icon_nodata.png" alt="" />
  </div>
</template>

<script>
export default {
  name: 'NoData'
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
}
</style>

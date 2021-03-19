<template>
  <div class="not-found">
     <!-- <svg-icon icon-class="404" class='icon'/> -->
     <p class='text'>很抱歉，您访问的页面不存在</p>
  </div>
</template>

<script>
export default {
  name: 'notFound'
}
</script>

<style lang='scss' scoped>
.not-found {
  .icon {
    font-size: 260px;
    margin: 10% auto 0;
    display: block;
  }
  .text {
    font-size: 14px;
     text-align: center;
  }
}
</style>

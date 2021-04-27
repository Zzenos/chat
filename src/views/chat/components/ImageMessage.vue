<template>
  <div class="image-message no-select" v-viewer="options" v-if="src">
    <img :src="src" :data-src="src" class="receive-image" />
    <img v-show="sendingPic" src="@/assets/sending.png" alt="" class="loading" />
    <div v-show="sendingPic" class="loading-text">发送中</div>
  </div>
  <div v-else>
    <span style="height:46px;line-height:46px;font-size:14px">[图片加载失败]</span>
  </div>
</template>
<script>
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import Vue from 'vue'
Vue.use(Viewer)

export default {
  name: 'ImageMessage',
  props: {
    src: {
      type: String,
      required: true,
      default: ''
    },
    sendingPic: {
      type: Number
    }
  },
  data() {
    return {
      options: {
        url: 'data-src',
        button: true,
        navbar: false,
        title: false,
        toolbar: false,
        tooltip: false
      }
    }
  }
}
</script>
<style lang="scss">
.image-message {
  // width: 240px;
  height: 240px;
  position: relative;
  .receive-image {
    height: 100%;
    max-width: 500px;
    object-fit: contain;
  }
  .loading {
    position: absolute;
    width: 28px;
    height: 28px;
    top: 50%;
    left: 50%;
    transform: translate(-14px, -14px);
  }
  .loading-text {
    position: absolute;
    width: 36px;
    height: 18px;
    top: 50%;
    left: 50%;
    transform: translate(-18px, 22px);
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 18px;
  }
}
.viewer-canvas {
  background: rgba(255, 255, 255, 0.85) !important;
}
.viewer-button.viewer-close {
  width: 36px;
  height: 36px;
  top: 40px;
  right: 40px;
}
.viewer-button::before {
  bottom: 9px;
  left: 9px;
}
</style>

<template>
  <div class="image-message no-select" v-viewer="options">
    <img :src="src" :data-src="src" class="receive-image" />
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
  width: 240px;
  // height: 240px;
  .receive-image {
    width: 100%;
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

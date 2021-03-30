<template>
  <div class="image-message no-select" v-viewer="options">
    <img :src="src" alt="" :data-src="src" />
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
      default: ''
    }
  },
  data() {
    return {
      options: {
        url: 'data-src'
      }
    }
  },
  methods: {}
}
</script>
<style lang="scss" scoped></style>

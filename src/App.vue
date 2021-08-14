<template>
  <div id="app">
    <router-view />
    <video-modal />
  </div>
</template>
<script>
import VideoModal from '@/views/chat/components/VideoModal'

export default {
  name: 'App',
  components: {
    VideoModal
  },
  methods: {
    copy(e) {
      const selection = window.getSelection()
      // console.log(selection)
      e.clipboardData.setData('text', `${selection}`)
      e.preventDefault()
    }
  },
  created() {
    document.addEventListener('copy', this.copy)
  },
  beforeDestroy() {
    document.removeEventListener('copy', this.copy)
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  // -webkit-font-smoothing: antialiased;
  // -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

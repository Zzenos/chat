<template>
  <div class="video-message">
    <Xgplayer :config="videoConfig" @player="Player = $event" />
  </div>
</template>

<script>
import Xgplayer from 'xgplayer-vue'
export default {
  name: 'VideoMessage',
  components: { Xgplayer },
  props: {
    vid: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      Player: null,
      videoConfig: {
        id: 'vs' + this.vid,
        // url:this.url,
        url: ' http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
        // height: 330,
        width: 250,
        fitVideoSize: 'auto',
        autoplay: false,
        download: true
      }
    }
  },
  methods: {},
  created() {}
}
</script>
<style lang="scss" scoped></style>

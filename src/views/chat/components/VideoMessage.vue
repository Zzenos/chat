<template>
  <div class="video-message">
    <Xgplayer :config="videoConfig" @player="Player = $event" />

    <!-- https://www.bilibili.com/video/BV1uB4y1P7P1?spm_id_from=333.851.b_7265636f6d6d656e64.2 -->
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
    }
  },
  data() {
    return {
      Player: null,
      videoConfig: {
        id: 'vs' + this.vid,
        url: 'https://www.bilibili.com/video/BV1uB4y1P7P1?spm_id_from=333.851.b_7265636f6d6d656e64.2',
        height: 330,
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

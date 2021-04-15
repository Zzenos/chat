<template>
  <div class="video-message">
    <div class="preimg" @click="toshow">
      <!-- <img class="video_icon_play" src="@/assets/video_icon_play.png" alt="" /> -->
      <img class="video-cover" :src="coverurl" alt="" />
    </div>
  </div>
</template>

<script>
import useVideosModal from '@/util/video-modal'
const { state: videoState } = useVideosModal()
export default {
  name: 'VideoMessage',
  props: {
    vid: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      require: true,
      default: ''
    },
    coverurl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      Player: null
    }
  },
  methods: {
    toshow() {
      videoState.show = true
      videoState.config = {
        id: 'vs' + this.vid,
        url: this.url,
        // height: 330,
        // width: 250,
        fitVideoSize: 'auto',
        autoplay: false,
        download: true
      }
    }
  },
  created() {}
}
</script>
<style lang="scss">
.preimg {
  width: 240px;
  height: 240px;
  background: rgba(0, 0, 0, 0.85);
  position: relative;
  .video_icon_play {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .video-cover {
    width: 100%;
  }
}
</style>

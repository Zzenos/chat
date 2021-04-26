<template>
  <div class="video-message">
    <div class="preimg" @click="toshow">
      <img v-show="!sendingPic" class="video_icon_play" src="@/assets/video_icon_play.png" alt="" />
      <img class="video-cover" v-if="coverurl" :src="coverurl" alt="" />
      <img class="no-cover" v-else alt="" />
      <img v-show="sendingPic" src="@/assets/sending.png" alt="" class="loading" />
      <div v-show="sendingPic" class="loading-text">发送中</div>
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
      required: true,
      default: ''
    },
    coverurl: {
      type: String,
      default: ''
    },
    sendingPic: {
      type: Number
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
  // width: 240px;
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
    height: 100%;
  }
  .no-cover {
    width: 200px;
    height: 100%;
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
</style>

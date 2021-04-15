<template>
  <div class="video-modal-cover" id="cover" v-show="show">
    <div class="center">
      <Xgplayer v-if="config.url" :config="config" @player="player = $event" ref="videoPlayer" />
    </div>
    <div class="btn" @click="toclose"><img src="@/assets/关闭 (1).png" alt="" /></div>
  </div>
</template>

<script>
import Xgplayer from 'xgplayer-vue'
import useVideosModal from '@/util/video-modal'

const { state: videoState } = useVideosModal()

export default {
  components: { Xgplayer },
  data() {
    return {
      player: videoState.player
    }
  },
  computed: {
    show() {
      return videoState.show
    },
    config() {
      return videoState.config
    }
  },
  methods: {
    toclose() {
      videoState.show = false
      videoState.config = {}
      this.$refs.videoPlayer.player.pause() // 暂停
      //   this.$refs.videoPlayer.player.src('http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4') // 重置进度条
    }
  }
}
</script>

<style lang="scss">
.video-modal-cover {
  background: rgba(255, 255, 255, 0.85);
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 999;
  left: 0;
  top: 0;
  .xgplayer {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
  .btn {
    position: absolute;
    color: #fff;
    text-align: center;
    line-height: 36px;
    right: 40px;
    top: 40px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.65);
    img {
      width: 23px;
      height: 23px;
    }
  }
}
</style>

<template>
  <div class="audio-message" :class="{ isleft: float == 'left' }">
    <audio controls :src="url" ref="audioPlayer" style="display:none"></audio>
    <div class="self__audio">
      <div class="audio__duration">{{ vtime }}"</div>
      <div class="audio__trigger" @click="playAudioHandler">
        <div
          :class="{
            'wifi-symbol': true,
            'wifi-symbol--avtive': isPlaying
          }"
        >
          <div class="wifi-circle first"></div>
          <div class="wifi-circle second"></div>
          <div class="wifi-circle third"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AudioMessage',
  data() {
    return {
      isPlaying: false
      //   duration: 0
    }
  },
  props: {
    url: {
      type: String,
      // required: true,
      default: ''
    },
    float: {
      type: String,
      default: ''
    },
    vtime: {
      type: Number,
      default: 0
    }
  },
  methods: {
    playAudioHandler() {
      this.isPlaying = !this.isPlaying
      const player = this.$refs.audioPlayer
      if (this.isPlaying) {
        player.load()
        player.play()
      } else {
        player.pause()
      }
    }
  },
  mounted() {
    const player = this.$refs.audioPlayer
    player.load()
    const vm = this
    player.oncanplay = function() {
      vm.duration = Math.ceil(player.duration)
    }
  }
}
</script>
<style lang="scss" scoped>
.audio-message {
  .self__audio {
    .audio__duration {
      display: inline-block;
      line-height: 32px;
      height: 32px;
      padding-right: 6px;
      color: #888888;
    }
    .audio__trigger {
      cursor: pointer;
      vertical-align: top;
      display: inline-block;
      line-height: 32px;
      height: 32px;
      width: 100px;
      background-color: #6dff5f;
      border-radius: 4px;
      position: relative;
      .wifi-symbol {
        position: absolute;
        right: 4px;
        top: -8px;
        width: 50px;
        height: 50px;
        box-sizing: border-box;
        overflow: hidden;
        transform: rotate(-45deg) scale(0.5);
        .wifi-circle {
          border: 5px solid #999999;
          border-radius: 50%;
          position: absolute;
        }

        .first {
          width: 5px;
          height: 5px;
          background: #cccccc;
          top: 45px;
          left: 45px;
        }
        .second {
          width: 25px;
          height: 25px;
          top: 35px;
          left: 35px;
        }
        .third {
          width: 40px;
          height: 40px;
          top: 25px;
          left: 25px;
        }
      }
      .wifi-symbol--avtive {
        .second {
          animation: bounce 1s infinite 0.2s;
        }
        .third {
          animation: bounce 1s infinite 0.4s;
        }
      }
    }
  }

  &.isleft {
    .self__audio {
      display: flex !important;
      .audio__duration {
        order: 2;
      }
      .audio__trigger {
        order: 1;
        transform: rotate(-180deg);
      }
    }
  }

  @keyframes bounce {
    0% {
      opacity: 0; /*初始状态 透明度为0*/
    }
    100% {
      opacity: 1; /*结尾状态 透明度为1*/
    }
  }
}
</style>

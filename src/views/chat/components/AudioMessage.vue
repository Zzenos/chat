<template>
  <div
    class="audio-message"
    :class="{
      isleft: float == 'left',
      maxlength: voiceTime > 40,
      middlelength: voiceTime >= 10 && voiceTime <= 40,
      minlength: voiceTime < 10
    }"
  >
    <audio controls :src="url" ref="audioPlayer" style="display:none"></audio>
    <i :max="voiceTime" style="display:none"></i>
    <div class="self__audio" @click="playAll">
      <div class="audio__trigger">
        <div class="audio-icon">
          <img v-if="readyPlaying" src="@/assets/voice_icon.png" alt="" />
          <img v-else src="@/assets/playing.png" alt="" />
        </div>
      </div>
      <div class="audio__duration">{{ voiceTime }}''</div>
    </div>
  </div>
</template>
<script>
// const BenzAMRRecorder = require('benz-amr-recorder')
// import BenzAMRRecorder from 'benz-amr-recorder'
// var BenzAMRRecorder = require('benz-amr-recorder')
export default {
  name: 'AudioMessage',
  data() {
    return {
      isPlaying: false, //是否播放
      readyPlaying: true,
      currentTime: 0,
      amr: null,
      getCurrentTime: null
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
    voiceTime: {
      type: Number,
      default: 0
    }
  },
  methods: {
    toPlayVoice() {
      this.readyPlaying = !this.readyPlaying
    },
    playAudioHandler() {
      // this.isPlaying = !this.isPlaying
      // const player = this.$refs.audioPlayer
      // console.log(player)
      // player.onended = function() {
      //   console.log('end')
      // }
      // if (this.isPlaying) {
      //   player.load()
      //   player.play()
      // } else {
      //   player.pause()
      // }
    },
    playAll() {
      this.toPlayVoice(), this.playAudioHandler(), this.playUrl()
    },
    playUrl() {
      // this.isPlaying = !this.isPlaying
      // this.amr.playOrPauseOrResume()
      // console.log(this.url, 'src')
      // var amr = new BenzAMRRecorder()
      // amr.initWithUrl(this.url).then(function() {
      //   amr.play()
      // })
      // amr.onEnded(function() {
      //   alert('播放完毕')
      // })

      var BenzAMRRecorder = require('benz-amr-recorder')
      this.amr = new BenzAMRRecorder()
      console.log(this.url, this.amr)
      var blob = this.amr.initWithUrl('http://zm-weike.oss-cn-beijing.aliyuncs.com/app/78865dff7021412eb923272082d084ee.amr')
      console.log(blob)
      // this.amr.initWithBlob(blob).then(function() {
      //   this.amr.play()
      //   this.amr.onEnded(function() {
      //     console.log('end')
      //   })
      // })
    }
  },
  mounted() {
    // const player = this.$refs.audioPlayer
    // player.load()
    // const vm = this;
    // player.oncanplay = function() {
    //   vm.duration = Math.ceil(player.duration);
    // }
  }
}
</script>
<style lang="scss" scoped>
.audio-message {
  background: #f0f1f2;
  height: 46px;
  width: 360px;
  border-radius: 8px;
  box-sizing: border-box;
  .self__audio {
    // height: 20px;
    display: flex;
    flex-direction: row-reverse;

    .audio__trigger {
      cursor: pointer;
      margin: 13px 8px 13px 12px;
      line-height: normal;
      transform: rotate(-180deg);
      // order: 2;
    }

    .audio__duration {
      margin-top: 12px;
      // width: 24px;
      height: 22px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #000000;
      line-height: 22px;
    }
  }

  &.isleft {
    .self__audio {
      display: flex !important;
      flex-direction: row;
      .audio__trigger {
        order: 1;
        transform: rotate(0deg);
      }
      .audio__duration {
        order: 2;
      }
    }
  }
  &.maxlength {
    width: 360px;
  }
  &.middlelength {
    width: 240px;
  }
  &.minlength {
    width: 120px;
  }
}
</style>

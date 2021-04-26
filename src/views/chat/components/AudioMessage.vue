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
import BenzAMRRecorder from 'benz-amr-recorder'

export default {
  name: 'AudioMessage',
  data() {
    return {
      readyPlaying: true,
      init: false,
      amr: null
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
    toPlayAmination() {
      this.readyPlaying = !this.readyPlaying
    },
    playAll() {
      if (this.amr && this.init) {
        this.toPlayAmination(), this.playUrl()
      }
    },
    playUrl() {
      this.amr.playOrPauseOrResume()
    }
  },
  mounted() {
    // let vm = this
    // // amr = null
    // // amr = new BenzAMRRecorder()
    // amr.initWithUrl('https://benzleung.github.io/benz-amr-recorder/res/mario.amr').then(function() {
    //   // console.log('初始化完毕') 'https://benzleung.github.io/benz-amr-recorder/res/mario.amr'
    //   //http://kfpt.oss-cn-hangzhou.aliyuncs.com/pc/pcwork/msgfile/20210425/7120509bd976af2daf43031c4a240d5d/ec38f1fa34414f40a0306f3880bcccea.amr
    // })
    // amr.onEnded(function() {
    //   amr.stop()
    //   vm.toPlayVoice()
    //   console.log('播放完毕')
    // })
  },
  watch: {
    url: {
      immediate: true,
      handler(newVal) {
        let vm = this
        if (!newVal) return
        // console.log(newVal)
        this.amr = new BenzAMRRecorder()
        this.amr.initWithUrl(newVal).then(function() {
          console.log('初始化完毕')
          vm.init = true
        })
        this.amr.onEnded(function() {
          vm.amr.stop()
          vm.toPlayAmination()
          console.log('播放完毕')
        })
      }
    }
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

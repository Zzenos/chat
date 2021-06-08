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
    <div class="self__audio" @click="playAll">
      <div class="audio__trigger">
        <div class="audio-icon">
          <img v-if="readyPlaying" src="@/assets/voice_icon.png" alt="" />
          <img v-else src="@/assets/playing.png" alt="" />
        </div>
      </div>
      <div class="audio__duration">{{ voiceTime }}''</div>
    </div>
    <div class="translate" v-show="translateShow">
      <span v-show="translateResult == 'pending'"><img src="@/assets/sending.png" alt="" class="loading"/></span>
      <span v-show="translateResult == 'success'">{{ translateText }}</span>
      <span v-show="translateResult == 'fail'">
        <img src="@/assets/icon_voice_warning.png" alt="" />
        <span class="fail-text">转换失败</span>
      </span>
      <!-- <span v-show="translateResult != 'pending'" @click="closeTranslate" style="margin-left:5px;font-size:10px">&times;</span> -->
    </div>
    <div class="to-text-menu" v-show="textMenuShow" @click="audioToText">
      转为文字
    </div>
  </div>
</template>
<script>
import BenzAMRRecorder from 'benz-amr-recorder'
import filesLibrary from '@/apis/library'

export default {
  name: 'AudioMessage',
  data() {
    return {
      readyPlaying: true,
      init: false,
      amr: null,
      translateText: '',
      translateShow: false,
      translateResult: ''
    }
  },
  props: {
    url: {
      type: String,
      default: ''
    },
    float: {
      type: String,
      default: ''
    },
    voiceTime: {
      type: Number,
      default: 0
    },
    index: {
      type: Number
    },
    changeAudioIndex: {
      type: Function
    },
    onlyOnePlay: {
      type: Boolean
    },
    closeTranslateText: {
      type: Function
    },
    //转文字
    textMenuShow: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toPlayAmination() {
      this.readyPlaying = !this.readyPlaying
    },
    playAll() {
      if (this.amr && this.init) {
        // this.changeAudioIndex(this.index)
        this.toPlayAmination(), this.playUrl()
      }
    },
    playUrl() {
      this.amr.playOrPauseOrResume()
    },
    closeTranslate() {
      this.closeTranslateText(this.index)
    },
    audioToText() {
      this.translateShow = true
      this.translateResult = 'pending'
      filesLibrary
        .audioText({ url: this.url })
        .then(res => {
          console.log(res)
          let { code, data } = res
          console.log(code, data)
          if (code == 200) {
            this.translateText = data.result
            this.translateResult = 'success'
          } else {
            this.translateResult = 'fail'
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
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
          // console.log('初始化完毕')'https://zm-weike.oss-cn-beijing.aliyuncs.com/chat/test.wav'
          vm.init = true
        })
        this.amr.onEnded(function() {
          vm.amr.stop()
          vm.toPlayAmination()
          // console.log('播放完毕')
        })
      }
    },
    onlyOnePlay(newVal) {
      console.log(newVal, 'onlyOnePlay-newVal')
      // if (this.amr && this.init) {
      //   this.toPlayAmination(), this.playUrl()
      // }
    }
  }
}
</script>
<style lang="scss" scoped>
.audio-message {
  background: #f0f1f2;
  // height: 46px;
  width: 360px;
  border-radius: 8px;
  box-sizing: border-box;
  padding: 0 12px;
  position: relative;
  .self__audio {
    height: 46px;
    display: flex;
    flex-direction: row-reverse;

    .audio__trigger {
      cursor: pointer;
      margin: 13px 8px 13px 0px;
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
  .translate {
    // height: 21px;
    // padding: 12px;
    padding: 12px 0;
    text-align: left;
    background: #f0f1f2;
    border-top: 1px solid #e6e7e8;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #000000;
    line-height: 22px;
    .loading {
      width: 20px;
      height: 20px;
    }
    .fail-text {
      color: rgba(0, 0, 0, 0.45);
      margin-left: 8px;
    }
  }
  .to-text-menu {
    display: none;
    position: absolute;
    width: 90px;
    height: 46px;
    line-height: 46px;
    top: 0;
    left: -90px;
    cursor: pointer;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    border-radius: 4px;
  }
  &:hover .to-text-menu {
    display: block;
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
    .to-text-menu {
      left: 100%;
    }
    &:hover .to-text-menu {
      display: block;
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

<template>
  <div class="chat-voice">
    <audio class="chat-voice_audio" controls ref="audio" @loadedmetadata="loadedmetadata" @ended.stop="audioEnded">
      <source :src="voiceUrl" type="audio/ogg" />
      您的浏览器不支持音频文件播放。
    </audio>
    <div class="chat-voice_body">
      <div
        :class="['voice-container', toTextVisible && 'to-text_show']"
        :style="{ width: `${120 + (voiceDuration > 3 ? (voiceDuration - 3) * 3 : 0)}px` }"
        @click="playVoice"
        @contextmenu.prevent="rightClick"
      >
        <div class="voice-controls">
          <i></i>
          <i v-if="!playTime || !(playTime % 2) || !(playTime % 3)"></i>
          <i v-if="!playTime || !(playTime % 3)"></i>
          <div class="voice-controls_mask">
            <!-- 语音转文字弹窗 -->
            <div class="tool-modal" ref="toolModal" :style="modalPosition" v-if="toTextVisible" @click.stop>
              <span class="tool-modal_btn" @click="voiceToText">{{ isConversion ? '收起文字' : '转文字' }}</span>
            </div>
          </div>
        </div>
        <div class="to-text-container" v-if="isConversion">
          <div class="to-text-content">
            <div class="to-text_tip">转换结果仅供参考</div>
            <div class="to-text_loading" v-if="toTextLoading">
              <a-spin size="small" />
            </div>
            <div class="text-content" v-else>{{ textContent }}</div>
          </div>
        </div>
      </div>
      <span class="voice-duration">{{ Math.floor(voiceDuration) }}''</span>
    </div>
  </div>
</template>

<script>
import api from '@/apis/chatRecord.js'

export default {
  props: {
    voiceUrl: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 语音时长
      voiceDuration: 0,
      // 是否正在播放
      isPlay: false,
      // 播放时间
      playTime: 0,
      // 处理播放时间的定时器
      timer: null,
      // 显示转文字弹窗
      toTextVisible: false,
      // 转文字弹窗位置
      modalPosition: {
        top: 0,
        left: 0
      },
      // 是否转化
      isConversion: false,
      // 转文字loading
      toTextLoading: false,
      // 文本内容
      textContent: ''
    }
  },
  mounted() {
    document.addEventListener('mousedown', e => {
      const el = this.$refs.toolModal
      if (el && !el.contains(e.target)) {
        this.toTextVisible = false
      }
    })
  },
  methods: {
    /**
     * @author 王泽
     * @time  2021-07-16
     * @param
     * @description 播放器加载完成 获取语音时间
     */
    loadedmetadata(event) {
      this.voiceDuration = event.target.duration
    },
    /**
     * @author 王泽
     * @time  2021-07-16
     * @param
     * @description 播放器播放结束事件
     */
    audioEnded() {
      clearInterval(this.timer)
      this.playTime = 0
      this.isPlay = false
    },
    /**
     * @author 王泽
     * @time  2021-07-16
     * @param
     * @description 点击播放语音
     */
    playVoice() {
      if (this.isPlay) {
        this.isPlay = false
        // this.$refs.audio.pause()
        clearInterval(this.timer)
        this.playTime = 0
        this.$refs.audio.load()
      } else {
        this.isPlay = true
        this.$refs.audio.play()
        this.handelPlaying()
      }
    },
    /**
     * @author 王泽
     * @time  2021-07-16
     * @param
     * @description 处理语音播放
     */
    handelPlaying() {
      this.timer = setInterval(() => {
        this.playTime++
      }, 200)
    },
    /**
     * @author 王泽
     * @time  2021-07-16
     * @param
     * @description 右击显示语音转文字弹窗
     */
    rightClick(e) {
      this.toTextVisible = true
      const { offsetX, offsetY } = e
      this.modalPosition = {
        top: `${offsetY}px`,
        left: `${offsetX}px`
      }
    },
    /**
     * @author 王泽
     * @time  2021-07-16
     * @param
     * @description 语音转文字
     */
    voiceToText() {
      this.toTextVisible = false
      this.isConversion = !this.isConversion
      if (!this.isConversion) return
      this.toTextLoading = true
      api
        .voiceToText({ url: this.voiceUrl })
        .then(data => {
          this.textContent = data.result
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.toTextLoading = false
        })
    }
  }
}
</script>

<style scoped lang="scss">
.chat-voice {
  user-select: none;
  .chat-voice_audio {
    display: none;
  }
  .voice-container {
    position: relative;
    display: inline-block;
    box-shadow: #dfdbda 0 0 5px;
    border-radius: 4px;
    background-color: #fff;
    min-width: 120px;
    max-width: 450px;
    &.to-text_show {
      background-color: #d2d2d2;
      .voice-controls {
        &:before {
          border-color: transparent transparent #d2d2d2 #d2d2d2;
        }
        i {
          &:nth-child(2),
          &:nth-child(3) {
            &:before {
              background-color: #d2d2d2;
            }
          }
        }
      }
    }
  }
  .voice-controls {
    // position: relative;
    // display: inline-block;
    // min-width: 100px;
    height: 36px;
    padding: 5px 15px;
    line-height: 26px;
    // background-color: #fff;
    // box-shadow:#dfdbda 0 0 5px;
    // box-shadow:#dfdbda 0 2px 8px;
    border-radius: 4px;
    box-sizing: border-box;
    &:before {
      position: absolute;
      top: 16px;
      left: 0px;
      transform: translate(-50%, -50%) rotate(45deg);
      content: '';
      border: 3px solid;
      width: 0px;
      height: 0px;
      border-color: transparent transparent #fff #fff;
      box-shadow: -3px 3px 10px #dfdbda;
    }
    i {
      display: inline-block;
      vertical-align: middle;
      // background-color: #ccc;
      &:first-child {
        position: relative;
        width: 3px;
        height: 3px;
        border-radius: 50%;
        background-color: #aaa;
        transform: translateY(20%);
        z-index: 3;
      }
      &:nth-child(2),
      &:nth-child(3) {
        position: relative;
        border: 2px solid #aaa;
        border-radius: 50%;
        &:before {
          content: '';
          background-color: #fff;
          position: absolute;
          z-index: 1;
          left: -2px;
          top: -2px;
        }
      }
      &:nth-child(2) {
        left: -4px;
        width: 10px;
        height: 10px;
        z-index: 2;
        &:before {
          width: 6px;
          height: 10px;
        }
      }
      &:nth-child(3) {
        left: -18px;
        width: 20px;
        height: 20px;
        &:before {
          width: 14px;
          height: 20px;
        }
      }
    }
  }
  .voice-controls_mask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border-radius: 4px;
    z-index: 8;
  }
  .tool-modal {
    position: absolute;
    // top: 0;
    // left: 0;
    padding: 5px 0px;
    line-height: normal;
    background-color: #fff;
    // border: 1px solid #ccc;
    border-radius: 7px;
    box-shadow: 0 2px 8px #dfdbda;
    z-index: 9;
  }
  .tool-modal_btn {
    display: block;
    width: 100px;
    text-align: center;
    cursor: pointer;
    &:hover {
      background-color: #5590ed;
      color: #fff;
    }
  }
  .voice-duration {
    display: inline-block;
    vertical-align: top;
    line-height: 36px;
    margin-left: 10px;
    color: rgba(0, 0, 0, 0.45);
  }
  .to-text-container {
    padding: 0px 10px;
  }
  .to-text-content {
    border-top: 1px solid #ddd;
  }
  .to-text_tip {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
  }
  .to-text_loading {
    text-align: center;
  }
  .text-content {
    padding-bottom: 10px;
    font-size: 14px;
    color: #333;
    line-height: 18px;
  }
}
</style>

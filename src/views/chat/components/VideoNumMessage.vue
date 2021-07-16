<template>
  <div class="video-num-message">
    <div class="video-num-cover" @click="toshow">
      <img class="video_icon_play" src="@/assets/video_icon_play.png" alt="" />
      <img class="cover" :src="coverurl" alt="" />
    </div>
    <div class="video-content">
      <div class="title">
        <!-- <img :src="iconurl" alt="" /> -->
        <img class="icon" src="@/assets/webappIcon.png" alt="" />
        {{ title }}
      </div>
      <div class="content">
        {{ des }}
      </div>
    </div>
    <div class="video-num-bottom">
      <div class="bottom-content">
        <img class="videoIcon" src="@/assets/webappIcon.png" alt="" />
        视频号
      </div>
    </div>
  </div>
</template>

<script>
import useVideosModal from '@/util/video-modal'
const { state: videoState } = useVideosModal()
export default {
  name: 'VideoNumMessage',
  props: {
    vid: {
      type: String,
      default: ''
    },
    iconurl: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    des: {
      type: String,
      default: '角度犀利从前段时间王思聪...............'
    },
    title: {
      type: String,
      default: ''
    },
    coverurl: {
      type: String,
      default: ''
    }
  },
  components: {},
  data() {
    return {}
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
  }
}
</script>
<style lang="scss" scoped>
.video-num-message {
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 280px;
  background-color: rgba(0, 0, 0, 0.35);
  .video-num-cover {
    position: relative;
    height: 200px;
    .cover {
      width: 100%;
      max-height: 200px;
    }
    .video_icon_play {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .video-content {
    height: 50px;
    padding: 10px;
    text-align: left;
    font-size: 12px;
    color: #fff;
    .title {
      .icon {
        width: 15px;
        height: 15px;
      }
    }
    .content {
      color: rgba(255, 255, 255, 0.4);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .video-num-bottom {
    // height: 30px;
    padding: 0 10px;
    font-size: 12px;
    text-align: left;
    .bottom-content {
      padding-top: 5px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      .videoIcon {
        width: 15px;
        height: 15px;
      }
    }
  }
}
</style>

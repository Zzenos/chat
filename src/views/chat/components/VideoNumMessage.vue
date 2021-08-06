<template>
  <div class="video-num-message">
    <div class="video-num-cover">
      <!--  @click="toshow" -->
      <!-- <img class="video_icon_play" src="@/assets/video_icon_play.png" alt="" /> -->
      <img class="cover" :src="coverurl" alt="" />
    </div>
    <div class="video-content">
      <div class="title">
        <div class="left">
          <img class="icon" :src="iconurl" alt="" />
          {{ title }}
        </div>
        <div class="right">
          <img class="videoIcon" src="@/assets/icon_shipinhao.png" alt="" />
          视频号
        </div>
      </div>
      <div class="content">
        {{ des }}
      </div>
    </div>
    <div class="video-num-bottom">
      {{ des }}
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
      default: ''
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
  width: 224px;
  height: 328px;
  background-color: #fff;
  border: 1px solid #e4e5e7;
  .video-num-cover {
    position: relative;
    height: 220px;
    width: 224px;
    .cover {
      width: 100%;
      height: 100%;
      // max-height: 220px;
    }
    .video_icon_play {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .video-content {
    height: 75px;
    padding: 12px;
    text-align: left;
    font-size: 12px;
    color: #fff;
    .title {
      display: flex;
      justify-content: space-between;
      margin-bottom: 9px;
      .left {
        font-size: 12px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: left;
        color: rgba(0, 0, 0, 0.65);
        line-height: 18px;
        .icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
        }
      }
      .right {
        color: rgba(0, 0, 0, 0.45);
      }
    }
    .content {
      font-size: 14px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.85);
      line-height: 22px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .video-num-bottom {
    height: 33px;
    padding: 7px 12px;
    font-size: 12px;
    text-align: left;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: rgba(0, 0, 0, 0.45);
    line-height: 18px;
    border-top: 1px solid #e4e5e7;
  }
}
</style>

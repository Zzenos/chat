<template>
  <div class="video-num-message">
    <div class="video-num-cover">
      <img class="video_icon_play" src="@/assets/video_icon_play.png" alt="" />
      <img class="cover" :src="coverurl" alt="" />
    </div>
    <div class="video-content">
      <div class="title">
        <img src="" alt="" />
        {{ title }}
      </div>
    </div>
    <div class="video-num-bottom">
      <img class="webappIcon" src="@/assets/webappIcon.png" alt="" />
      视频号
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideoNumMessage',
  props: {
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
  methods: {}
}
</script>
<style lang="scss" scoped>
.video-num-message {
  // width: 230px;
  height: 280px;
  background: #f0f1f2;
  display: flex;
  flex-direction: column;
  .video-num-cover {
    position: relative;
    // width: 230px;
    height: 200px;
    .cover {
      width: auto;
      max-width: 200px;
      height: 100%;
    }
    .video_icon_play {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .video-content {
    height: 40px;
    text-align: left;
  }
  .video-num-bottom {
    height: 25px;
    width: 100%;
    font-size: 12px;
    border-top: 1px solid #e4e5e7;
    // padding: 5px;
    padding-left: 10px;
    margin-top: 5px;
    padding-top: 5px;
    text-align-last: left;
    .webappIcon {
      width: 15px;
      height: 15px;
    }
  }
}
</style>

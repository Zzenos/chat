<template>
  <div class="webapp-message">
    <div class="top">
      <div class="logo"><img :src="iconurl" alt="" /></div>
      <div class="appname">{{ des }}</div>
    </div>
    <div class="middle">
      <div class="app-title">
        {{ title }}
      </div>
      <div class="big-img">
        <img :src="coverurl" alt="" />
      </div>
    </div>
    <div class="bottom"><img class="webappIcon" src="@/assets/webappIcon.png" alt="" /> 小程序<a :href="url"></a></div>
  </div>
</template>

<script>
export default {
  name: 'WebappMessage',
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
  methods: {},
  created() {}
}
</script>
<style lang="scss" scoped>
.webapp-message {
  width: 230px;
  height: 265px;
  padding: 10px;
  background: #f0f1f2;
  display: flex;
  flex-direction: column;
  .top {
    display: flex;
    // padding: 5px;
    height: 25px;
    width: 100%;
    .logo {
      width: 25px;
      height: 25px;
      // background: #000;
      margin-right: 10px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .appname {
      line-height: 25px;
      font-size: 10px;
      color: rgba(0, 0, 0, 0.45);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .middle {
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
    .app-title {
      color: rgba(0, 0, 0, 0.85);
      font-size: 14px;
      height: 30px;
      line-height: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: left;
    }
    .big-img {
      flex: 1 1 0;
      overflow: hidden;
      img {
        width: 100%;
        height: auto;
      }
    }
  }
  .bottom {
    height: 25px;
    width: 100%;
    font-size: 12px;
    border-top: 1px solid #e4e5e7;
    // padding: 5px;
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

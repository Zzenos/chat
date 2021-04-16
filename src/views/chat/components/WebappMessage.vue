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
        <img :src="url" alt="" />
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
  width: 200px;
  height: 230px;
  padding: 5px;
  background: #f0f1f2;
  display: flex;
  flex-direction: column;
  .top {
    display: flex;
    // padding: 5px;
    height: 40px;
    width: 100%;
    .logo {
      width: 30px;
      height: 30px;
      // background: #000;
      margin-right: 10px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .appname {
      line-height: 40px;
      font-size: 10px;
      color: rgba(0, 0, 0, 0.45);
    }
  }
  .middle {
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
    .app-title {
      color: rgba(0, 0, 0, 0.85);
      font-size: 14px;
      height: 40px;
      line-height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .big-img {
      flex: 1 1 0;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .bottom {
    height: 32px;
    width: 100%;
    font-size: 12px;
    border-top: 1px solid #e4e5e7;
    padding: 5px;
    text-align-last: left;
    .webappIcon {
      width: 15px;
      height: 15px;
    }
  }
}
</style>

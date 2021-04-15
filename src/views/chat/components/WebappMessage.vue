<template>
  <div class="webapp-message">
    <div class="top">
      <div class="logo"><img :src="iconurl" alt="" /></div>
      <div class="appname">{{ des }}</div>
    </div>
    <div class="middle">
      <img :src="url" alt="" />
    </div>
    <div class="bottom">{{ des }}小程序<a :href="url"></a></div>
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
  // background: lightblue;
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
    }
  }
  .middle {
    flex: 1 1 0;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .bottom {
    // height: 20px;
    width: 100%;
    border-top: 1px solid #e4e5e7;
    padding: 5px;
  }
}
</style>

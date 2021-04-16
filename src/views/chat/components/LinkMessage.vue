<template>
  <div class="link-message">
    <div class="h-title">
      <!-- <span>{{ title }}</span> -->
      <a :href="href">
        <span style="color:rgba(0,0,0,0.45)">{{ title }}</span>
      </a>
    </div>
    <div class="h-main">
      <!-- <a :href="href" target="_blank">{{ desc }}</a> -->
      <div class="text-main">
        {{ desc }}
      </div>
      <div class="img-main">
        <img :src="coverurl" alt="" />
      </div>
    </div>
    <div class="h-foot">
      <!-- dianshang -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'LinkMessage',
  props: {
    title: {
      type: String,
      default: ''
    },
    href: {
      type: String,
      default: '',
      required: true
    },
    desc: {
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
.link-message {
  height: 105px;
  width: 235px;
  padding: 10px;
  background: #f0f1f2;

  .h-title {
    height: 20px;
    line-height: 20px;
    width: 100%;
    text-align: left;
    font-size: 14px;
  }

  .h-main {
    height: 50px;
    width: 100%;
    display: flex;
    font-size: 10px;
    .text-main {
      width: 160px;
      height: 44px;
    }
    .img-main {
      width: 44px;
      height: 44px;
      overflow: hidden;
      position: relative;
      img {
        // width: 100%;
        // height: 100%;
        height: 44px;
        object-fit: contain;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
  .h-foot {
    height: 15px;
    width: 100%;
    border-top: 1px solid #e4e5e7;
    font-size: 10px;
    color: rgba(0, 0, 0, 0.45);
    text-align: left;
  }
}
</style>

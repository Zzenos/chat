<template>
  <div class="file-message">
    <!-- 文件描述  大小 -->
    <div class="file-box">
      <span class="name">{{ desc }}</span>
      <span class="size">5.3MB<a :href="href">下载</a></span>
    </div>
    <!-- 文件图片 -->
    <div class="ext">
      <img src="@/assets/icon_file.png" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FileMessage',
  props: {
    href: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    }
  },
  components: {},
  data() {
    return {}
  },
  methods: {
    download() {}
  },
  created() {}
}
</script>
<style lang="scss" scoped>
.file-message {
  width: 240px;
  height: 74px;
  background: lightblue;
  padding: 12px;
  display: flex;
  justify-content: space-between;

  .file-box {
    height: 50px;
    width: 160px;
    text-align: left;

    span {
      display: block;

      &.name {
        // width: 131px;
        height: 22px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.85);
        line-height: 22px;
      }
      &.size {
        // width: 37px;
        height: 18px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
        line-height: 18px;
        margin-top: 10px;
      }
    }
  }
}
</style>

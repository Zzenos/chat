<template>
  <div class="file-message">
    <!-- 文件描述  大小 -->
    <div class="file-box">
      <span class="name">{{ title }}</span>
      <span class="size"><a :href="url">查看</a></span>
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
    url: {
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
      font-family: PingFangSC-Regular, PingFang SC;

      &.name {
        // width: 131px;
        height: 22px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.85);
        line-height: 22px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &.size {
        // width: 37px;
        height: 18px;
        font-size: 12px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
        line-height: 18px;
        margin-top: 10px;
      }
    }
  }
}
</style>

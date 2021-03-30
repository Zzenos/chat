<template>
  <div class="card-message ">
    <div class="card">
      <div class="avatar">
        <a-avatar :src="src" />
        <span class="nickname">{{ name }}</span>
      </div>
      <div class="person">
        个人名片
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CardMessage',
  props: {
    src: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.card {
  width: 240px;
  height: 100px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e4e5e7;
  padding: 12px;

  .avatar {
    border-bottom: 1px solid #e4e5e7;
    height: 57px;
    text-align: left;

    .ant-avatar {
      overflow: visible;
    }

    /deep/ .ant-avatar > img {
      width: 44px;
      height: 44px;
    }
    .nickname {
      width: 42px;
      height: 22px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.85);
      line-height: 22px;
      display: block;
      margin-top: -21px;
      margin-left: 56px;
    }
  }

  .person {
    width: 48px;
    height: 18px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.45);
    line-height: 18px;
    margin-top: 4px;
  }
}
</style>

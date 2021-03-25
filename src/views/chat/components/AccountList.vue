<template>
  <div class="act-list_container">
    <div v-for="item in wechat_account" :key="item.wechat_id" class="act-item" :class="{ active: curAct.wechat_id === item.wechat_id }" @click="handleAct(item)">
      <img :src="item.wechat_avatar" alt="" />
      <div v-html="item.wechat_name"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'accountList',
  data() {
    return {
      curAct: {},
      wechat_account: [
        {
          wechat_id: 1,
          wechat_name: '刘东霞',
          wechat_avatar: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
        },
        {
          wechat_id: 2,
          wechat_name: '张建',
          wechat_avatar: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5JkicMu1sD1UZ8seFx9vPcAAjyaOfoBLiaV0cNz51xmPCg/0'
        },
        {
          wechat_id: 3,
          wechat_name: '刘东霞3',
          wechat_avatar: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
        },
        {
          wechat_id: 4,
          wechat_name: '张建4',
          wechat_avatar: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5JkicMu1sD1UZ8seFx9vPcAAjyaOfoBLiaV0cNz51xmPCg/0'
        },
        {
          wechat_id: 5,
          wechat_name: '刘东霞5',
          wechat_avatar: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
        },
        {
          wechat_id: 6,
          wechat_name: '张建6',
          wechat_avatar: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5JkicMu1sD1UZ8seFx9vPcAAjyaOfoBLiaV0cNz51xmPCg/0'
        },
        {
          wechat_id: 7,
          wechat_name: '刘东霞7',
          wechat_avatar: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
        },
        {
          wechat_id: 8,
          wechat_name: '张建8',
          wechat_avatar: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5JkicMu1sD1UZ8seFx9vPcAAjyaOfoBLiaV0cNz51xmPCg/0'
        }
      ]
    }
  },
  methods: {
    handleAct(val) {
      console.log(val)
      const { wechat_id } = val
      if (this.curAct.wechat_id === wechat_id) {
        return
      }
      this.curAct = val
      this.$router.push({ path: `/chatframe/${this.curAct.wechat_id}/recent/0` })
    }
  },
  mounted() {
    this.curAct = this.wechat_account[0]
  }
}
</script>

<style lang="scss" scoped>
.act-list_container {
  height: calc(100vh - 176px);
  overflow-y: scroll;
  width: 100px;
  .act-item {
    width: 88px;
    height: 88px;
    padding-top: 16px;
    color: rgba(255, 255, 255, 0.45);
    font-size: 12px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    cursor: pointer;
    &.active {
      color: #fff;
      background-color: #414954;
    }
    img {
      width: 36px;
      height: 36px;
      border-radius: 18px;
      margin-bottom: 8px;
    }
  }
}
</style>

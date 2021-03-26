<template>
  <div class="address-book_container">
    <div v-for="item in wechat_account" :key="item.wechat_id" class="item" :class="{ active: curAddress.wechat_id === item.wechat_id }" @click="handleItem(item)">
      <img :src="item.wechat_avatar" alt="" />
      <div v-html="item.wechat_name"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'addressBook',
  data() {
    return {
      curAddress: {},
      wechat_account: [
        {
          wechat_id: 1,
          wechat_name: '刘东霞',
          msg_count: 5,
          wechat_avatar: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
        },
        {
          wechat_id: 2,
          wechat_name: '张建',
          msg_count: 10,
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
          msg_count: 88,
          wechat_avatar: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5JkicMu1sD1UZ8seFx9vPcAAjyaOfoBLiaV0cNz51xmPCg/0'
        },
        {
          wechat_id: 5,
          wechat_name: '刘东霞5',
          msg_count: 100,
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
    handleItem(val) {
      console.log(val)
      const { wechat_id } = val
      if (this.curAddress.wechat_id === wechat_id) {
        return
      }
      this.curAddress = val
      this.$router.push({ path: `/chatframe/${wechat_id}/contactInfo/0` })
    }
  },
  mounted() {
    this.curAddress = this.wechat_account[0]
  }
}
</script>

<style lang="scss" scoped>
.address-book_container {
  width: 100%;
  .item {
    box-sizing: border-box;
    width: 100%;
    height: 64px;
    padding-left: 16px;
    display: flex;
    align-items: center;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    cursor: pointer;
    &.active {
      background-color: #e9eaeb;
    }
    img {
      width: 36px;
      height: 36px;
      border-radius: 4px;
      margin-right: 12px;
    }
  }
}
</style>

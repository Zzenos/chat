<template>
  <div class="act-list_container">
    <div v-if="accounts.length > 0">
      <div v-for="item in accounts" :key="item.info.tjId" class="act-item" :class="{ active: curAct && curAct.info.tjId === item.info.tjId }" @click="handleAct(item)">
        <a-badge :count="item.unread" :overflow-count="99">
          <img :src="item.info.wechatAvatar" alt="" />
        </a-badge>
        <div class="nickname ellipsis" v-html="item.info.wechatName"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'accountList',
  data() {
    return {
      curAct: null
      // wechat_account: [
      //   {
      //     chatId: 1,
      //     wechat_name: '刘东霞',
      //     msg_count: 5,
      //     wechatAvatar: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
      //   },
      //   {
      //     chatId: 2,
      //     wechat_name: '张建',
      //     msg_count: 10,
      //     wechatAvatar: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5JkicMu1sD1UZ8seFx9vPcAAjyaOfoBLiaV0cNz51xmPCg/0'
      //   },
      //   {
      //     chatId: 3,
      //     wechat_name: '刘东霞3',
      //     wechatAvatar: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
      //   },
      //   {
      //     chatId: 4,
      //     wechat_name: '张建4',
      //     msg_count: 88,
      //     wechatAvatar: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5JkicMu1sD1UZ8seFx9vPcAAjyaOfoBLiaV0cNz51xmPCg/0'
      //   },
      //   {
      //     chatId: 5,
      //     wechat_name: '刘东霞5',
      //     msg_count: 100,
      //     wechatAvatar: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
      //   },
      //   {
      //     chatId: 6,
      //     wechat_name: '张建6',
      //     msg_count: 0,
      //     wechatAvatar: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5JkicMu1sD1UZ8seFx9vPcAAjyaOfoBLiaV0cNz51xmPCg/0'
      //   },
      //   {
      //     chatId: 7,
      //     wechat_name: '刘东霞7',
      //     wechatAvatar: 'https://wework.qpic.cn/bizmail/Wx8ic87cXIKmgFMicR0HQO6ByfBkPWBS2B7Yv0sUjBWYicZ6MpywvK07Q/0'
      //   },
      //   {
      //     chatId: 8,
      //     wechat_name: '张建8',
      //     wechatAvatar: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5JkicMu1sD1UZ8seFx9vPcAAjyaOfoBLiaV0cNz51xmPCg/0'
      //   }
      // ]
    }
  },
  computed: {
    accounts: function() {
      return this.$store.state.accounts.accounts
    }
  },
  watch: {
    accounts: {
      immediate: true,
      deep: true,
      handler: function() {
        if (!this.curAct && this.accounts.length > 0) {
          this.curAct = this.accounts[0]
          if (this.$route.matched.length <= 1) this.$router.replace({ path: `/chatframe/${this.curAct.info.tjId}/recent/0` })
        }
      }
    }
  },
  methods: {
    handleAct(account) {
      const { tjId } = account.info
      if (this.curAct.info.tjId === tjId) {
        return
      }
      this.curAct = account
      this.$router.push({ path: `/chatframe/${this.curAct.info.tjId}/recent/0` })
    }
  },
  mounted() {
    // this.curAct = this.accounts[0]
    // console.log(3333, this.accounts[0])
  }
}
</script>

<style lang="scss" scoped>
.act-list_container {
  height: calc(100vh - 176px);
  overflow-y: scroll;
  width: 100px;
  .act-item {
    position: relative;
    width: 88px;
    height: 88px;
    padding-top: 16px;
    color: rgba(255, 255, 255, 0.45);
    font-size: 12px;
    font-family: PingFangSC-regular, PingFang SC;
    font-weight: 400;
    cursor: pointer;
    &.active {
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #fff;
      background-color: #414954;
    }
    img {
      width: 36px;
      height: 36px;
      border-radius: 18px;
      margin-bottom: 8px;
    }
    .nickname {
      width: 60px;
      margin: 0 auto;
    }
  }
}
</style>

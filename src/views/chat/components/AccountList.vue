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
        if (this.$route.params.tjId) {
          this.curAct = this.$store.getters.userDetailsById(this.$route.params.tjId)
        } else if (!this.curAct && this.accounts.length > 0) {
          this.curAct = this.accounts[0]
          if (this.$route.matched.length <= 1) this.$router.replace({ path: `/chatframe/${this.curAct.info.tjId}/recent/0` })
        }
        if (this.curAct) {
          const tjId = this.curAct.info.tjId
          this.$socket.emit('init', { tjId }, ack => {
            if (ack.code === 200) {
              this.$socket.emit('init_ack', { tjId })
            }
          })
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
      // 拉取数据
      this.$socket.emit('init', { tjId }, ack => {
        if (ack.code === 200) {
          this.$socket.emit('init_ack', { tjId })
        }
      })
      this.$router.push({ path: `/chatframe/${tjId}/recent/0` })
    }
  }
}
</script>

<style lang="scss" scoped>
.act-list_container {
  height: calc(100vh - 176px);
  overflow-y: scroll;
  overflow-x: hidden;
  width: 110px;
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

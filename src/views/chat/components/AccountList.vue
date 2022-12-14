<template>
  <div class="act-list_container">
    <div v-if="accounts.length > 0">
      <div v-for="item in accounts" :key="item.info.tjId" class="act-item" :class="{ active: curAct && curAct.info.tjId === item.info.tjId }" @click="handleAct(item)">
        <a-badge :count="item.unreadCount" :overflow-count="99">
          <img :src="item.info.wechatAvatar" alt="" />
        </a-badge>
        <a-tooltip placement="right">
          <template slot="title">
            {{ item.info.wechatName }}
          </template>
          <div class="nickname ellipsis" v-html="item.info.wechatName"></div>
        </a-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'accountList',
  data() {
    return {
      curAct: null
    }
  },
  computed: {
    accounts() {
      return this.$store.getters.getAccounts
    }
  },
  watch: {
    accounts: {
      immediate: true,
      deep: true,
      handler: function(n) {
        if (!n) return
        // curAct 当前选中账号 存在于账号列表中无需操作 若不存在说明离线
        if (this.curAct && n.some(i => i.info.tjId === this.curAct.info.tjId)) return
        // 当前账号列表为空 返回初始页
        if (this.accounts.length === 0) {
          this.$router.push({ path: `/chatframe` })
          return
        }
        if (this.$route.params.tjId && n.some(i => i.info.tjId === this.$route.params.tjId)) {
          this.curAct = this.$store.getters.userDetailsById
        } else {
          // 未选中账号 或 当前选中账号离线 则切换为账号列表的第一个
          this.curAct = this.accounts[0]
          const { wechatId, wechatName } = this.curAct.info
          this.setCurTjId(this.curAct.info.tjId)
          this.setCurChatId(0)
          this.$router.replace({ path: `/chatframe/${this.curAct.info.tjId}/recent/0?accountId=${wechatId}&accountName=${wechatName}` })
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
    ...mapMutations(['setCurTjId', 'setCurChatId']),
    handleAct(account) {
      const { tjId, wechatId, wechatName, chatInitStatus = false } = account.info
      if (this.curAct.info.tjId === tjId) {
        return
      }
      this.curAct = account
      // 拉取数据 wechatId wechatName ?accountId=${wechatId}&accountName=${wechatName}
      if (!chatInitStatus) {
        this.$socket.emit('init', { tjId }, ack => {
          if (ack.code === 200) {
            this.$socket.emit('init_ack', { tjId })
          }
        })
      }
      this.setCurTjId(tjId)
      this.setCurChatId(0)
      this.$router.push({ path: `/chatframe/${tjId}/recent/0?accountId=${wechatId}&accountName=${wechatName}` })
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
  /deep/.ant-badge-count {
    box-shadow: none;
  }
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

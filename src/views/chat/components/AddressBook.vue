<template>
  <div class="address-book_container">
    <div class="address-book_tab">
      <a-tabs v-model="activeKey" :default-active-key="activeKey" :tabBarGutter="5">
        <a-tab-pane key="1" tab="客户">
          <div class="list-wraper">
            <div v-for="item in customerList" :key="item.wechatId" class="item" :class="{ active: curAddress.wechatId === item.wechatId }" @click="handleItem(item)">
              <img class="avatar" :src="item.wechatAvatar" alt="" />
              <div class="nickname">
                <span v-html="item.wechatName"></span>
                <!-- <span v-if="item.wechatAvatar" class="label">@微信</span> -->
              </div>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="群聊">
          <div class="list-wraper">
            <div v-for="item in groupList" :key="item.wechatId" class="item" :class="{ active: curAddress.wechatId === item.wechatId }" @click="handleItem(item)">
              <svg-icon class-name="avatar" icon-class="icon_groupchat"></svg-icon>
              <span v-html="item.wechatName"> </span><span>（{{ item.group_num }}）</span>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="3" tab="成员">
          <div class="list-wraper">
            <div v-for="item in memberList" :key="item.wechatId" class="item" :class="{ active: curAddress.wechatId === item.wechatId }" @click="handleItem(item)">
              <img class="avatar" :src="item.wechatAvatar" alt="" />
              <div class="nickname">
                <span v-html="item.wechatName"></span>
                <span :style="{ color: item.company ? '#FF8000' : '#0ead63' }" class="label">{{ item.company || '@微信' }}</span>
              </div>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import * as types from '@/store/actionType'

export default {
  name: 'addressBook',
  data() {
    return {
      activeKey: '1', // 1 客户 2 群聊 3 成员 查询详情的时候使用
      curAddress: {},
      customerList: [],
      groupList: [],
      memberList: []
    }
  },
  props: {
    tjId: {
      type: String
    }
  },
  /* computed: {
    // 通信录数据
    contactData: function() {
      console.log(77777, this.$store.getters.contactByTjId(this.tjId))
      return this.$store.getters.contactByTjId(this.tjId)
    }
  }, */
  watch: {
    tjId: {
      immediate: true,
      handler: function(n) {
        console.log(8888888, n, this.contactData)
        this.contactData = this.$store.getters.contactByTjId(n)
        if (this.contactData) {
          const { customerList, groupList, memberList } = this.contactData
          this.customerList = customerList
          this.groupList = groupList
          this.memberList = memberList
        }
      }
    }
  },
  methods: {
    ...mapMutations([types.ADD_WECHAT_DETAILS, types.ADD_GROUP_DETAILS]),
    handleItem(val) {
      console.log(val)
      const { wechatId, tjId } = val
      switch (this.activeKey) {
        case '1':
          // 获取客户信息
          this.$socket.emit('customer_info', { tjId }, ack => {
            console.log(ack)
          })
          break
        case '2':
          // 获取群详细信息
          this.$socket.emit('group_info', { tjId }, ack => {
            console.log(ack)
          })
          break
        case '3':
          // 获取员工详细信息
          this.$socket.emit('member_info', { tjId }, ack => {
            console.log(ack)
          })
          break

        default:
          break
      }
      this.curAddress = val
      this.$router.push({ path: `/chatframe/${this.tjId}/contactInfo/${wechatId}?type=${this.activeKey}` })
    }
  }
}
</script>

<style lang="scss" scoped>
.address-book_container {
  width: 100%;
  .list-wraper {
    height: calc(100vh - 193px);
    overflow-y: scroll;
  }
  /deep/ .ant-tabs-nav-scroll {
    text-align: left;
    padding-left: 16px;
  }
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
    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 4px;
      margin-right: 12px;
    }
    .nickname {
      .label {
        color: #0ead63;
        margin-left: 8px;
      }
    }
  }
}
</style>

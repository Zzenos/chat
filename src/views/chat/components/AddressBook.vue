<template>
  <div class="address-book_container">
    <div class="address-book_tab">
      <a-tabs v-model="activeKey" :default-active-key="activeKey" :tabBarGutter="5">
        <a-tab-pane key="customer" tab="客户">
          <div class="list-wraper">
            <div v-for="item in customerList" :key="item.wechatId" class="item" :class="{ active: curAddress.wechatId === item.wechatId }" @click="handleItem(item)">
              <img class="avatar" :src="item.wechatAvatar" alt="" />
              <div class="nickname ellipsis">
                <span v-html="item.wechatName"></span>
                <span :style="{ color: item.company ? '#FF8000' : '#0ead63' }" class="label">@{{ item.company || '微信' }}</span>
              </div>
            </div>
            <no-data v-if="customerList.length === 0" />
          </div>
        </a-tab-pane>
        <a-tab-pane key="group" tab="群聊">
          <div class="list-wraper">
            <div v-for="item in groupList" :key="item.wechatId" class="item" :class="{ active: curAddress.wechatId === item.wechatId }" @click="handleItem(item)">
              <svg-icon class-name="avatar" icon-class="icon_groupchat"></svg-icon>
              <div class="nickname ellipsis">
                <span v-html="item.wechatName"></span>
                <span>（{{ item.memberCount }}）</span>
              </div>
            </div>
            <no-data v-if="groupList.length === 0" />
          </div>
        </a-tab-pane>
        <a-tab-pane key="member" tab="成员">
          <div class="list-wraper">
            <div v-for="item in memberList" :key="item.wechatId" class="item" :class="{ active: curAddress.wechatId === item.wechatId }" @click="handleItem(item)">
              <img class="avatar" :src="item.wechatAvatar" alt="" />
              <div class="nickname ellipsis">
                <span v-html="item.wechatName"></span>
                <span :style="{ color: item.company ? '#FF8000' : '#0ead63' }" class="label">@{{ item.company || '微信' }}</span>
              </div>
            </div>
          </div>
          <no-data v-if="memberList.length === 0" />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'

const ADDRESS_BOOK_CONFIG = {
  customer: '1',
  group: '2',
  member: '3'
}

export default {
  name: 'addressBook',
  data() {
    return {
      activeKey: 'customer', // 1 客户 2 群聊 3 成员 查询详情的时候使用
      curAddress: {},
      contactData: {},
      customerList: [],
      groupList: [],
      memberList: []
    }
  },
  props: {
    tjId: {
      type: String
    },
    searchText: {
      type: String
    }
  },
  watch: {
    tjId: {
      immediate: true,
      handler: function(n) {
        this.activeKey = 'customer'
        console.log(8888888, n, this.contactData)
        this.handleData(n)
      }
    },
    searchText(n) {
      const list = `${this.activeKey}List`
      this[list] = n ? this.contactData[list].filter(ele => ele.wechatName && ele.wechatName.indexOf(n) > -1) : this.contactData[list]
    },
    activeKey(n) {
      const list = `${n}List`
      this[list] = this.searchText ? this.contactData[list].filter(ele => ele.wechatName && ele.wechatName.indexOf(this.searchText) > -1) : this.contactData[list]
    }
  },
  methods: {
    handleItem(val) {
      console.log(val)
      const { wechatId, tjId } = val
      if (this.curAddress.tjId === tjId) {
        return
      }
      const type = ADDRESS_BOOK_CONFIG[this.activeKey]
      this.$socket.emit(`${this.activeKey}_info`, { tjId: this.$route.params.tjId, curtomerId: tjId }, ack => {
        console.log(ack)
      })
      this.curAddress = val
      this.$router.push({
        path: `/chatframe/${this.tjId}/contactInfo/${wechatId}?type=${type}`,
        query: {
          ...val,
          type
        }
      })
    },
    handleData(n) {
      const contactData = cloneDeep(this.$store.getters.contactByTjId(n))
      this.contactData = contactData
      if (contactData) {
        for (const key in contactData) {
          if (Object.prototype.hasOwnProperty.call(contactData, key)) {
            this[key] = contactData[key]
          }
        }
      }
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
      width: 230px;
      text-align: left;
      .label {
        color: #0ead63;
        margin-left: 8px;
      }
    }
  }
}
</style>

<template>
  <div class="address-book_container">
    <div class="address-book_tab">
      <div class="btn-sync" @click="syncAddressBook">
        <a-icon type="sync" :spin="addressBookSyncStatus" />
        <!-- <span v-show="addressBookSyncStatus">同步中...</span> -->
      </div>
      <a-tabs v-model="activeKey" :default-active-key="activeKey" :tabBarGutter="5">
        <a-tab-pane key="customer" tab="客户">
          <RecycleScroller class="list-wraper" :items="customerListAry" :emitUpdate="true" :item-size="64" key-field="wechatId" v-slot="{ item }">
            <div class="item" :class="{ active: curAddress.wechatId === item.wechatId }" @click="handleItem(item)">
              <img class="avatar" :src="item.wechatAvatar" alt="" />
              <div class="nickname">
                <div class="ellipsis" :style="{ 'max-width': item.lost ? '150px' : '225px' }">
                  <span v-html="item.wechatName"></span>
                  <span :style="{ color: item.company ? '#FF8000' : '#0ead63' }" class="label">@{{ item.company || '微信' }}</span>
                </div>
                <span v-if="item.lost == '1'" class="tag">流失客户</span>
                <span v-if="item.lost == '3'" class="tag">删除客户</span>
              </div>
            </div>
          </RecycleScroller>
          <no-data v-if="customerListAry.length === 0" />
        </a-tab-pane>
        <a-tab-pane key="group" tab="群聊">
          <RecycleScroller class="list-wraper group" :items="groupListAry" :emitUpdate="true" :item-size="64" key-field="wechatId" v-slot="{ item }">
            <div class="item" :class="{ active: curAddress.wechatId === item.wechatId }" @click="handleItem(item)">
              <svg-icon class-name="avatar" icon-class="icon_groupchat"></svg-icon>
              <div class="nickname">
                <div class="ellipsis" :style="{ 'max-width': '225px' }">
                  <span v-html="item.wechatName || '未命名'"></span>
                </div>
                <span>（{{ item.memberCount }}）</span>
              </div>
            </div>
          </RecycleScroller>
          <div class="group-manage" @click="showGroupManage">群聊管理</div>
          <group-manage :visible.sync="groupManageVisible" title="选择关注群聊" :tjId="tjId" @confirmSelect="concernGroup" />
          <no-data v-if="groupListAry.length === 0" />
        </a-tab-pane>
        <a-tab-pane key="member" tab="成员">
          <RecycleScroller class="list-wraper" :items="memberListAry" :emitUpdate="true" :item-size="64" key-field="wechatId" v-slot="{ item }">
            <div :key="item.wechatId" class="item" :class="{ active: curAddress.wechatId === item.wechatId }" @click="handleItem(item)">
              <img class="avatar" :src="item.wechatAvatar" alt="" />
              <div class="nickname">
                <div class="ellipsis" :style="{ 'max-width': '225px' }">
                  <span v-html="item.wechatName"></span>
                  <span :style="{ color: item.company ? '#FF8000' : '#0ead63' }" class="label">@{{ item.company || '微信' }}</span>
                </div>
              </div>
            </div>
          </RecycleScroller>
          <no-data v-if="memberListAry.length === 0" />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import GroupManage from '@/views/chat/components/GroupManage'

const ADDRESS_BOOK_CONFIG = {
  customer: '1',
  group: '2',
  member: '3'
}

export default {
  name: 'addressBook',
  data() {
    return {
      addressBookSyncStatus: false, // 通讯录同步状态
      activeKey: 'customer', // 1 客户 2 群聊 3 成员 查询详情的时候使用
      curAddress: {},
      contactInfo: {},
      customerListAry: [],
      groupListAry: [],
      memberListAry: [],
      groupManageVisible: false
    }
  },
  props: {
    tjId: {
      type: String
    },
    searchText: {
      type: String
    },
    selected: {
      type: Boolean
    }
  },
  components: {
    GroupManage
  },
  computed: {
    contactData() {
      return this.$store.getters.contactByTjId(this.tjId)
    },
    accountData() {
      return this.$store.getters.userDetailsById(this.tjId)
    }
  },
  watch: {
    tjId(n) {
      console.log('AddressBook tjId:', n)
      this.activeKey = 'customer'
      this.curAddress = {}
    },
    contactData: {
      immediate: true,
      deep: true,
      handler: function(n) {
        console.log('contactData:', n)
        n && this.handleData(n)
        if (n && n.contactEventType === 3 && this.addressBookSyncStatus) {
          this.addressBookSyncStatus = false
          this.$message.success(`【${this.accountData.info.wechatName}】的通讯录同步完成`)
        }
      }
    },
    searchText(n) {
      const list = `${this.activeKey}ListAry`
      this[list] = n ? this.contactInfo[list].filter(ele => ele.wechatName && ele.wechatName.indexOf(n) > -1) : this.contactInfo[list]
    },
    activeKey(n) {
      const list = `${n}ListAry`
      this[list] = this.searchText ? this.contactInfo[list].filter(ele => ele.wechatName && ele.wechatName.indexOf(this.searchText) > -1) : this.contactInfo[list]
    },
    selected(n) {
      if (n && this.curAddress.wechatId && this.curAddress.wechatId !== this.$route.params.contactId) {
        this.handleItem(this.curAddress, true)
      }
    }
  },
  methods: {
    handleItem(val, canJump = false) {
      console.log(val)
      const { wechatId, tjId } = val
      const { accountId, accountName } = this.$route.query
      if (this.curAddress.tjId === tjId && !canJump) {
        return
      }
      const type = ADDRESS_BOOK_CONFIG[this.activeKey]
      const params = {}
      if (this.activeKey === 'member') {
        params.memberId = tjId
      } else if (this.activeKey === 'customer') {
        params.customerId = tjId
      } else if (this.activeKey === 'group') {
        params.groupId = tjId
      }
      this.$socket.emit(`${this.activeKey}_info`, { tjId: this.$route.params.tjId, [this.activeKey + 'Id']: tjId }, ack => {
        console.log(ack)
        this.curAddress = val
        this.$router.push({
          path: `/chatframe/${this.tjId}/contactInfo/${wechatId}?type=${type}`,
          query: {
            ...val,
            type,
            accountId,
            accountName
          }
        })
      })
    },
    handleData(n) {
      const contactData = cloneDeep(n)
      this.contactInfo = contactData
      for (const key in contactData) {
        if (Object.prototype.hasOwnProperty.call(contactData, key) && key.indexOf('ListAry') > 0) {
          this[key] = contactData[key]
        }
      }
    },
    syncAddressBook() {
      if (this.addressBookSyncStatus) {
        this.$message.warn('数据同步中，请稍等...')
        return
      }
      this.$confirm({
        title: `确定同步【${this.accountData.info.wechatName}】的通讯录吗？`,
        content: '数据较多时，同步耗时较长，请耐心等待～',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.$socket.emit('sync_contact', { tjId: this.tjId }, res => {
            if (res.code === 200) {
              console.log(res)
              this.addressBookSyncStatus = true
            }
          })
        },
        onCancel() {}
      })
    },
    showGroupManage() {
      this.groupManageVisible = true
      console.log(this.tjId)
    },
    concernGroup() {
      this.groupManageVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.address-book_container {
  width: 100%;
  .address-book_tab {
    position: relative;
    .btn-sync {
      position: absolute;
      right: 16px;
      top: 14px;
      z-index: 100;
      cursor: pointer;
      display: flex;
      align-items: center;
      font-size: 16px;
      color: #000;
      span {
        margin-left: 5px;
        font-size: 12px;
      }
    }
  }
  .list-wraper {
    height: calc(100vh - 193px);
    overflow-y: scroll;
    &.group {
      height: calc(100vh - 245px);
    }
  }
  .group-manage {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 51px;
    border-top: 1px solid #e4e5e7;
    cursor: pointer;
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
      display: flex;
      align-items: center;
      width: 230px;
      text-align: left;
      .label {
        color: #0ead63;
        margin-left: 8px;
      }
      .tag {
        display: inline-block;
        background: #dcdee0;
        color: rgba(0, 0, 0, 0.65);
        width: 56px;
        height: 18px;
        line-height: 18px;
        text-align: center;
        border-radius: 2px;
        font-size: 12px;
        margin-left: 8px;
      }
    }
  }
}
</style>

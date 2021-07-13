<template>
  <div>
    <a-row type="flex">
      <a-col flex="300px" class="contact-list">
        <div class="tab-container">
          <div class="tab" :class="{ active: curTab === 'Chat' }" @click="handleTab('Chat')">
            <icon-font type="icontab_chat" class="icon" />
            <span>会话</span>
          </div>
          <div class="tab" :class="{ active: curTab === 'ContactInfo' }" @click="handleTab('ContactInfo')">
            <icon-font type="icontab_addresslist_pre" class="icon" />
            <span>通讯录</span>
          </div>
        </div>
        <div class="input-container">
          <a-input-search v-model="searchText" placeholder="搜索" />
          <div class="addByPhone" v-if="curTab === 'ContactInfo'">+</div>
        </div>
        <div>
          <chat-list :selected="curTab === 'Chat'" :searchText="searchText" v-show="curTab === 'Chat'" :tjId="tjId" />
          <address-book :selected="curTab === 'ContactInfo'" :searchText="searchText" v-if="curTab === 'ContactInfo'" :tjId="tjId" />
        </div>
      </a-col>
      <a-col flex="1 1 0">
        <router-view />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import ChatList from './components/ChatList'
import AddressBook from './components/AddressBook'

export default {
  name: 'contactList',
  components: { ChatList, AddressBook },
  props: {
    // 探鲸id
    tjId: {
      type: String,
      required: true
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler: function(n, o) {
        if (n === o) return
        // console.log('contactList $route ==>', n)
        this.curTab = n.name
        this.searchText = ''
      }
    }
  },
  data() {
    return {
      tabOptions: [],
      curTab: 'Chat',
      searchText: ''
    }
  },
  methods: {
    handleTab(val) {
      this.curTab = val
      this.searchText = ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.contact-list {
  width: 300px;
  height: 100vh;
  border-right: 1px solid #e4e5e7;
  background: #ffffff;
  .tab-container {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e4e5e7;
    .tab {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 150px;
      height: 67px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: rgba(0, 0, 0, 0.45);
      cursor: pointer;
      .icon {
        font-size: 22px;
        margin-right: 8px;
      }
      span {
        line-height: 22px;
      }
      &.active {
        color: rgba(0, 0, 0, 0.85);
      }
    }
  }
  .input-container {
    padding: 16px;
    display: flex;
    // border-bottom: 1px solid #e4e5e7;
    /deep/.ant-input {
      border-radius: 0;
      font-size: 12px;
    }
    .addByPhone {
      width: 50px;
    }
  }
}
</style>

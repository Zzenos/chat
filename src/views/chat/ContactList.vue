<template>
  <div>
    <a-row type="flex">
      <a-col flex="300px" class="contact-list">
        <div class="tab-container">
          <div class="tab" :class="{ active: curTab === 1 }" @click="handleTab(1)">
            <icon-font type="icontab_chat" class="icon" />
            <span>会话</span>
          </div>
          <div class="tab" :class="{ active: curTab === 2 }" @click="handleTab(2)">
            <icon-font type="icontab_addresslist_pre" class="icon" />
            <span>通讯录</span>
          </div>
        </div>
        <div class="input-container">
          <a-input-search placeholder="搜索" />
        </div>
        <div>
          <chat-list v-show="curTab === 1" :tjId="tjId" />
          <address-book v-show="curTab === 2" :tjId="tjId" />
        </div>
      </a-col>
      <a-col flex="auto">
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
    tjId: {
      immediate: true,
      handler: function(n, o) {
        if (n === o) return
        this.curTab = 1
      }
    }
  },
  data() {
    return {
      tabOptions: [],
      curTab: 1
    }
  },
  methods: {
    handleTab(val) {
      this.curTab = val
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
    // border-bottom: 1px solid #e4e5e7;
    /deep/.ant-input {
      border-radius: 0;
    }
  }
}
</style>

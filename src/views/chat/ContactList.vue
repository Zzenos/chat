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
          <div class="addByPhone" @click="addModal = true" v-if="curTab === 'ContactInfo'">+</div>
          <a-modal v-model="addModal" wrapClassName="add-friends-modal" title="添加客户" centered @ok="addFriends" ok-text="发送" cancel-text="取消">
            <div class="add-cell">
              <div class="add-text">添加成员：</div>
              <div>{{ $route.query.accountName }}</div>
            </div>
            <div class="add-cell">
              <div class="add-text">搜索客户：</div>
              <input class="search-cus" type="text" placeholder="请输入客户手机号" />
            </div>
            <div class="add-cell">
              <div class="add-text">验证语：</div>
              <div>
                <textarea class="area-cus" name="" id="" rows="4"></textarea>
                <div class="send-text">你需要发送验证请求，对方通过后才能添加其为客户好友</div>
              </div>
            </div>
          </a-modal>
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
      searchText: '',
      addModal: false
    }
  },
  methods: {
    handleTab(val) {
      this.curTab = val
      this.searchText = ''
    },
    addFriends() {
      this.addModal = false
      //api.toadd(id,id)
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
      line-height: 32px;
      cursor: pointer;
    }
  }
}
/deep/ .add-friends-modal.ant-modal-mask {
  display: none;
}
/deep/ .ant-modal-wrap.ant-modal-centered.add-friends-modal {
  background-color: rgba(0, 0, 0, 0.35);
  // .ant-modal-close-x {
  //   display: none;
  // }
  .ant-modal-content {
    width: 400px;
    height: 400px;
    // .ant-modal-header {
    //   color: rgba(0, 0, 0, 0.85);
    //   line-height: 24px;
    //   padding: 0;
    // }
    .ant-modal-body {
      .add-cell {
        display: flex;
        .add-text {
          width: 100px;
          height: 50px;
        }
        .search-cus {
          width: 250px;
          height: 30px;
          padding-left: 10px;
          border: 1px solid rgba(0, 0, 0, 0.35);
          border-radius: 4px;
          outline: none;
          &::-webkit-input-placeholder {
            color: rgba(0, 0, 0, 0.25);
          }
        }
        .area-cus {
          width: 250px;
          border: 1px solid rgba(0, 0, 0, 0.35);
          border-radius: 4px;
          outline: none;
          resize: none;
        }
        .send-text {
          width: 250px;
          font-size: 12px;
          color: rgba(0, 0, 0, 0.25);
        }
      }
    }
    .ant-modal-footer {
      border-top: none;
      padding-right: 24px;
      // margin-top: 44px;
      // text-align: center;
      .ant-btn {
        // width: 132px;
        width: 60px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.65);
        line-height: 22px;
        &.ant-btn-primary {
          color: #fff;
        }
      }
    }
  }
}
</style>

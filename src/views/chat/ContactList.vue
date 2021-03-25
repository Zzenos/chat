<template>
  <div>
    <a-row type="flex">
      <a-col flex="300px" class="contact-list">
        <div class="tab-container">
          <div class="tab" :class="{ active: curTab === 1 }" @click="handleTab(1)">
            <icon-font type="icontab_chat" class="icon" />
            会话
          </div>
          <div class="tab" :class="{ active: curTab === 2 }" @click="handleTab(2)">
            <icon-font type="icontab_addresslist_pre" class="icon" />
            通讯录
          </div>
        </div>
        <a-button block type="primary">按钮</a-button>
      </a-col>
      <a-col flex="auto">
        <router-view />
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'contactList',
  props: {
    // 企微号
    userId: {
      type: String,
      required: true
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
  background: #ffffff;
  .tab-container {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 68px;
    border-bottom: 1px solid #e4e5e7;
    .tab {
      width: 150px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      cursor: pointer;
      .icon {
        font-size: 24px;
        vertical-align: middle;
      }
      &.active {
        color: rgba(0, 0, 0, 0.85);
      }
    }
  }
}
</style>

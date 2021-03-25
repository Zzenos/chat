<template>
  <div>
    <a-row type="flex">
      <a-col flex="300px" class="contact-list">
        这里是联系人列表
        {{ userId }}
        <a-button block type="primary">按钮</a-button>
        <icon-font type="icontab_chat" class="icon-chat" />
        <icon-font type="icontab_addresslist_pre" class="icon" />
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.contact-list {
  width: 300px;
  height: 100vh;
  background: #ffffff;
  .icon {
    color: #1d61ef;
    font-size: 24px;
  }
  .icon-chat {
    color: #888;
    font-size: 24px;
  }
}
</style>

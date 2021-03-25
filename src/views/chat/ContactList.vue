<template>
  <div>
    <a-row type="flex">
      <a-col flex="300px" class="contact-list">
        这里是联系人列表
        <icon-font type="icon-exploit" />
        {{userId}}
        <a-button block type="primary">按钮</a-button>
      </a-col>
      <a-col flex="auto">
        <router-view/>
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
<style scoped>
.contact-list{
  width: 300px;
  height: 100vh;
  background: #FFFFFF;
}
</style>

<template>
  <div class="hello">
    <p>
     这里是聊天外框架
     主要加载saas账号信息和对应绑定的企微号
    </p>
  </div>
</template>

<script>
export default {
  name: 'chat',
  props: {
    // 企微saas账号
    saasId: {
      type: String,
      required: true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

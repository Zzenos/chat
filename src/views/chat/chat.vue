<template>
  <div>
    <p>
      这里是具体聊天框
      {{userId}}
    </p>
  </div>
</template>

<script>
export default {
  name: 'chat',
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

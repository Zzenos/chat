<template>
  <div class="file-message">
    这里是 文件消息----{{ title }}---- --------链接
    <a :href="url">{{ desc }}</a>
  </div>
</template>

<script>
export default {
  name: 'FileMessage',
  props: {
    title: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    }
  },
  components: {},
  data() {
    return {}
  },
  methods: {},
  created() {}
}
</script>
<style lang="scss" scoped></style>

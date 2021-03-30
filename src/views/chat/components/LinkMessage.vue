<template>
  <div class="link-message">
    这里是 链接消息- -----链接
    <a :href="url">{{ desc }}</a>
  </div>
</template>

<script>
export default {
  name: 'LinkMessage',
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

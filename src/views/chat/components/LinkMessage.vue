<template>
  <div class="link-message">
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

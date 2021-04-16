<template>
  <div class="link-message">
    <div class="h-title">
      <span>{{ title }}</span>
    </div>
    <div class="h-main">
      <!-- <a :href="href" target="_blank">{{ desc }}</a> -->
      <div class="text-main">
        {{ desc }}
      </div>
      <div class="img-main">
        <img src="" alt="" />
      </div>
    </div>
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
    href: {
      type: String,
      default: '',
      required: true
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
<style lang="scss" scoped>
.link-message {
  height: 150px;
  width: 250px;

  .h-title {
    height: 60px;
    width: 100%;
  }

  .h-main {
    height: 90px;
    width: 100%;
    .text-main {
      width: 160px;
      height: 100%;
    }
    .img-main {
      width: 90px;
      height: 90px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>

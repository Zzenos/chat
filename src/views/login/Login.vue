<template>
  <div @click="show">
    {{ myarr }}
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      name: '112',
      myarr: [1, 2, 3]
    }
  },
  methods: {
    show() {
      this.myarr[2] = 4
      console.log(this.myarr)
    }
  }
}
</script>

<style lang="scss" scoped></style>

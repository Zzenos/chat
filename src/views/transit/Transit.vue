<script>
import { mapMutations } from 'vuex'
console.log(1223, mapMutations)
export default {
  name: 'transit',
  data() {
    return {
    }
  },
  props: {
    token: {
      type: String
    }
  },
  methods: {
    ...mapMutations(['storeToken'])
  },
  mounted() {
    console.log(11111, this, this.token);
    this.storeToken(this.token)
  },
  render() {
    return (
      <div>正在进行跳转...</div>
    )
  }
}
</script>

<style lang='scss' scoped>

</style>

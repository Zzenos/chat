<script>
import { mapMutations } from 'vuex'
export default {
  name: 'transit',
  data() {
    return {}
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
    this.storeToken(this.token)
    console.log(`%c ${this.token}`, 'color:#f2f;')
    this.$router.push({ path: `/chatframe` })
  },
  render() {
    return <div>正在进行跳转...</div>
  }
}
</script>

<style lang="scss" scoped></style>

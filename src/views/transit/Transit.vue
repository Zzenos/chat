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
  created() {
    console.log(`%c ${this.token}`, 'color:#f2f;')
    this.storeToken(this.token)
    this.$router.push({ path: `/chatframe` })
  },
  render() {
    return <div>正在进行跳转...</div>
  }
}
</script>

<style lang="scss" scoped></style>

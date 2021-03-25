import vue from 'vue'
import vuex from 'vuex'
import vuexLocal from '@/plugins/vuex.persist'

vue.use(vuex)

console.log(3334, vuexLocal)

const store = new vuex.Store({
  store: {
    token: null
  },
  mutations: {
    storeToken(state, token) {
      console.log(222333, token)
      state.token = token
    }
  },
  plugins: [vuexLocal.plugin]
})
export default store

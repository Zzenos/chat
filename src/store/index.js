import vue from 'vue'
import vuex from 'vuex'
import vuexLocal from '@/plugins/vuex.persist'
import messages from './messages'

vue.use(vuex)

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
  modules: {
    messages
  },
  plugins: [vuexLocal.plugin]
})
export default store

import vue from 'vue'
import vuex from 'vuex'
import vuexLocal from '@/plugins/vuex.persist'
import messages from './messages'
import chat from './chat'
import contact from './contact'
import accounts from './accounts'
import accountDetails from './accountDetails'

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
    messages,
    accountDetails,
    accounts,
    chat,
    contact
  },
  plugins: [vuexLocal.plugin]
})
export default store

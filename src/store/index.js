import vue from 'vue'
import vuex from 'vuex'
import vuexLocal from '@/plugins/vuex.persist'
import createLogger from 'vuex/dist/logger'
import messages from './messages'
import chat from './chat'
import contact from './contact'
import accounts from './accounts'
import accountDetails from './accountDetails'

vue.use(vuex)

const store = new vuex.Store({
  state: {
    token: '',
    username: 'ZMENG'
  },
  mutations: {
    storeToken(state, token) {
      state.token = token
    },
    saveUserName(state, username) {
      state.username = username
    }
  },
  modules: {
    messages,
    accountDetails,
    accounts,
    chat,
    contact
  },
  getters: {
    getToken: state => {
      return () => {
        return state.token
      }
    }
  },
  plugins: [createLogger(), vuexLocal.plugin]
})
export default store

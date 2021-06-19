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

let plugins = [vuexLocal.plugin]
if (process.env.VUE_APP_MODE !== 'production') {
  plugins.push(createLogger())
}
const store = new vuex.Store({
  state: {
    token: '',
    userInfo: {
      username: 'ZMENG'
    }
  },
  mutations: {
    storeToken(state, token) {
      state.token = token
    },
    saveUserInfo(state, userInfo) {
      state.userInfo = JSON.parse(userInfo)
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
  plugins
})
export default store

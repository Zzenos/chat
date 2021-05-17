import vue from 'vue'
import vuex from 'vuex'
import vuexLocal from '@/plugins/vuex.persist'
import createLogger from 'vuex/dist/logger'
import messages from './messages'
import chat from './chat'
import contact from './contact'
import accounts from './accounts'
import accountDetails from './accountDetails'
import { getTokenValue } from '@/util/storageUtil'
import * as types from './actionType'

vue.use(vuex)

const store = new vuex.Store({
  state: {
    token: '',
    username: 'ZMENG',
    takeBreath: {
      [types.ACCESS_TOKEN_KEY]: {
        value: '',
        expires: 0
      },
      [types.REFRESH_TOKEN_KEY]: {
        value: '',
        expires: 0
      }
    }
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
    },
    getAccessToken: state => () => {
      return getTokenValue(state.takeBreath[types.ACCESS_TOKEN_KEY])
    },
    getRefreshToken: state => () => {
      return getTokenValue(state.takeBreath[types.REFRESH_TOKEN_KEY])
    }
  },
  plugins: [createLogger(), vuexLocal.plugin]
})
export default store

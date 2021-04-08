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
  state: {
    token:
      'eyJjb21wYW55Ijoi5piT5rGH5LyX55ufIiwiY29ycElkIjoid3dmYzNhZTU2MGVlMTU5MmQ4IiwiZGF0YUxpbWl0IjowLCJkZXB0SWQiOjAsImVudGVycHJpc2VJZCI6MSwiZXhwaXJlIjoxNjE3ODUwNjgyNjk4LCJpZCI6MTA1LCJyZWFsbmFtZSI6IuiBiuWkqeW3peWFtyIsInJvbGVJZCI6Mywic3RhdHVzIjowLCJ1c2VybmFtZSI6Imx0Z2oiLCJ1dWlkIjoiYzExY2I2ODhjNTBmNDhhNTkyNzc3MjBmZjYzZmZiNjIifQ=='
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

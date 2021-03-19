import vue from 'vue'
import vuex from 'vuex'
vue.use(vuex)

const store = new vuex.Store({
  store: {
    token: null
  },
  mutations: {
    'storeToken'(state, payload) {
      state.token = payload.token
    }
  }
})
export default store
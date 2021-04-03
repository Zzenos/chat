import * as types from './actionType'
// 探鲸账号
export default {
  state: {
    wechat: {},
    group: {}
  },
  mutations: {
    [types.ADD_WECHAT_DETAILS](state, accounts) {
      state.accounts = accounts.map(i => {
        return {
          info: i
        }
      })
    },
    [types.ADD_GROUP_DETAILS](state, accounts) {
      state.accounts = accounts.map(i => {
        return {
          info: i
        }
      })
    }
  },
  actions: {},
  getters: {}
}

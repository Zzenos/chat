import * as types from './actionType'
// 探鲸账号
export default {
  state: {
    accounts: []
  },
  mutations: {
    [types.ADD_ACCOUNT](state, accounts) {
      state.accounts = accounts.map(i => {
        return {
          info: i,
          unread: 1
        }
      })
    }
  },
  getters: {
    accounts: state => {
      return state.accounts
    }
  }
}

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
          info: i
          // unread: 1 // 服务端拿不到，所以，一期不做
        }
      })
    }
  },
  getters: {
    accounts: state => {
      return state.accounts
    },
    userDetailsById: state => {
      return tjId => {
        console.log(tjId, state.accounts)
        return state.accounts.filter(item => item.info.tjId == tjId)
      }
    }
  }
}

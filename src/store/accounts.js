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
        }
      })
    }
  },
  getters: {
    getAccounts: (state, getters, rootState) => {
      return () => {
        return state.accounts.map(i => {
          return {
            info: i.info,
            unreadCount: rootState.messages.chatInfo[i.info.tjId] ? rootState.messages.chatInfo[i.info.tjId].unreadCount : 0
          }
        })
      }
    },
    userDetailsById: state => {
      return tjId => {
        return state.accounts.find(item => item.info.tjId === tjId)
      }
    }
  }
}

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
    },
    [types.SET_CHATLIST_INIT_STATUS](state, tjId) {
      state.accounts.forEach(i => {
        if (i.info.tjId === tjId) {
          // 当前选中账号对应的会话初始化的状态
          i.info.chatInitStatus = true
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

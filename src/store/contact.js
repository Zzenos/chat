import Vue from 'vue'
// import sortedLastIndex from 'lodash/sortedLastIndex'
/**
 *
 * <企微号id>&<会话对方id | 群id> 组成 <会话id>
 * 按 <会话id> 缓存消息
 * @state { Object } key: <会话id>
 */
// 添加会话
const ADD_CHAT = 'ADD_CHAT'
// 消息缓存
const ADD_MSG = 'ADD_MSG'
// 消息分发
const DISTRIBUTE_MSG = 'DISTRIBUTE_MSG'

export default {
  state: {
    chatMsgHash: {}
  },
  mutations: {
    [ADD_CHAT](state, chatId) {
      if (!state[chatId]) Vue.set(state, `${chatId}`, [])
    },
    [ADD_MSG](state, msg) {
      // 查重
      if (state.chatMsgHash[msg.id]) return
      if (state[msg.chatId]) {
        // 这里只需要去重而不需要排序
        state[msg.chatId].splice(state[msg.chatId].length - 1, 0, msg)
        Vue.set(state.chatMsgHash, `${msg.chatId}`, msg)
      }
    }
  },
  actions: {
    [DISTRIBUTE_MSG]: {
      root: true,
      handler: ({ commit }, msg) => {
        if (Object.prototype.toString.call(msg) === '[object Array]') {
          msg.forEach(msgItem => {
            commit(ADD_CHAT, msgItem.chatId)
            commit(ADD_MSG, msgItem)
          })
        } else {
          commit(ADD_CHAT, msg.chatId)
          commit(ADD_MSG, msg)
        }
      }
    }
  },
  getters: {}
}

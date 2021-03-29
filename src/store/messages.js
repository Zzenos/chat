import Vue from 'vue'
// import sortedLastIndex from 'lodash/sortedLastIndex'
/**
 *
 * <企微号id>&<会话对方id | 群id> 组成 <会话id>
 * 以 <会话id> 为 key 缓存消息
 * <会话id>:{
 *  lastMsgId<最后一条消息id>
 *  firstSeq<分页加载的最旧一条数据>
 *  msgs<消息列表>
 * }
 */
// 添加会话
const ADD_CHAT = 'ADD_CHAT'
// 添加消息到会话
const ADD_MSG = 'ADD_MSG'
// 设置消息缓存
const CACHE_MSG = 'CACHE_MSG'
// 获取历史消息
const ADD_HISTORY_MSG = 'ADD_HISTORY_MSG'
// 消息分发
const DISTRIBUTE_MSG = 'DISTRIBUTE_MSG'

export default {
  state: {
    chatMsgHash: {}
  },
  mutations: {
    // 新会话
    [ADD_CHAT](state, chatId) {
      if (!state[chatId]) Vue.set(state, `${chatId}`, [])
    },
    // 新消息
    [ADD_MSG](state, msg) {
      // 查重
      if (state.chatMsgHash[msg.id]) return
      if (state[msg.chatId]) {
        // 这里只需要去重而不需要排序
        state[msg.chatId].splice(state[msg.chatId].length - 1, 0, msg)
      }
    },
    // 历史消息
    [ADD_HISTORY_MSG](state, chatId, msgs) {
      if (state[chatId]) {
        state[chatId].splice(0, 0, msgs)
      }
    },
    // 消息缓存
    [CACHE_MSG](state, msg) {
      if (state.chatMsgHash[msg.id]) return
      Vue.set(state.chatMsgHash, `${msg.chatId}`, msg)
    }
  },
  actions: {
    // 消息分发
    [DISTRIBUTE_MSG]: {
      root: true,
      handler: ({ commit }, msg) => {
        if (Object.prototype.toString.call(msg) !== '[object Array]') {
          msg = [msg]
        }
        msg.forEach(msgItem => {
          commit(ADD_CHAT, msgItem.chatId)
          commit(ADD_MSG, msgItem)
          commit(CACHE_MSG, msgItem)
        })
      }
    }
  },
  getters: {}
}

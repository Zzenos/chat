import Vue from 'vue'
import * as types from './actionType'
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

export default {
  state: {
    chat: {}
  },
  mutations: {
    // 根究探鲸id获取会话列表
    [types.ADD_CHAT_LIST](state, tjId, chatList) {
      if (!state.chat[tjId]) Vue.set(state.chat, `${tjId}`, chatList)
      state.chat[tjId] = {
        chatList
      }
    }
  },
  actions: {},
  getters: {
    chatsByChatId: (state, rootState) => {
      return chatId => {
        const chatList = state.chat[chatId].map(i => {
          return {
            chatInfo: i,
            lastMsg: rootState[chatId][rootState[chatId].length - 1] || null
          }
        })
        return chatList
      }
    }
  }
}

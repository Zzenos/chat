import Vue from 'vue'
import * as types from './actionType'
// import sortedLastIndex from 'lodash/sortedLastIndex'
/**
 * 根据tjId设置会话列表
 */

export default {
  state: {},
  mutations: {
    // 根究探鲸id获取会话列表
    [types.ADD_CHAT_LIST](state, chatInfo) {
      console.log(state, chatInfo)

      // 结构修改后注释
      // const tjId = chatInfo[0].chatId.split('&')[0]
      // if (!state[tjId]) {
      //   Vue.set(state, `${tjId}`, chatInfo)
      // } else {
      //   state[tjId] = chatInfo
      // }
      // 结构修改后释放
      const tjId = chatInfo.tjId
      if (!state[tjId]) {
        Vue.set(state, `${tjId}`, chatInfo.chatList)
      } else {
        state[tjId] = chatInfo.chatList
      }
    }
  },
  actions: {},
  getters: {
    chatsByChatId: (state, rootState) => {
      return tjId => {
        const chatList = state[tjId].map(i => {
          console.log(tjId, rootState)
          return {
            ...i
            // lastMsg: rootState[tjId][rootState[tjId].length - 1] || null
          }
        })
        return chatList
      }
    }
  }
}

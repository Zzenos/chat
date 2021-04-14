import Vue from 'vue'
import * as types from './actionType'
// import sortedLastIndex from 'lodash/sortedLastIndex'
/**
 * 根据tjId设置会话列表
 */

export default {
  state: {
    chatListHash: {}, //会话列表hash，chatId全局唯一
    chatList: {}
  },
  mutations: {
    // 根究探鲸id获取会话列表
    // {
    //   tjId:'xxxxxx',
    //   chatList:[{
    //      chat_id":"{tj_id}&{target_id}", //会话id
    //      "chat_type": 1, //会话类型 1 2群聊,
    //      "wechat_avatar":"https://xxxx",
    //      "wechat_name":"",
    //      "last_active_time": 1600855008843
    //  }]
    // }
    [types.ADD_CHAT_LIST](state, chatInfo) {
      // 结构修改后释放
      const tjId = chatInfo.tjId
      const filterLsit = chatInfo.chatList.filter(i => {
        if (!state.chatListHash[i.chatId]) {
          Vue.set(state.chatListHash, `${i.chatId}`, i)
          return true
        }
      })
      if (!state.chatList[tjId]) {
        Vue.set(state.chatList, `${tjId}`, filterLsit)
      } else {
        state.chatList[tjId].splice(0, 0, ...filterLsit)
      }
    }
  },
  actions: {},
  getters: {
    chatsByChatId: state => {
      return tjId => {
        console.log(tjId, state.chatList[tjId])
        if (state.chatList[tjId]) {
          return state.chatList[tjId].map(i => {
            return {
              ...i
              // lastMsg: rootState[tjId][rootState[tjId].length - 1] || null
            }
          })
        } else {
          Vue.set(state.chatList, `${tjId}`, [])
          return state.chatList[tjId]
        }
      }
    }
  }
}

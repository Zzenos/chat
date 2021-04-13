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
      if (!state[tjId]) {
        Vue.set(state, `${tjId}`, chatInfo.chatList)
      } else {
        state[tjId].splice(0, 0, ...chatInfo.chatList)
      }
      console.log(state, chatInfo)
    }
  },
  actions: {},
  getters: {
    chatsByChatId: state => {
      return tjId => {
        console.log(tjId, state[tjId])
        if (state[tjId]) {
          return state[tjId].map(i => {
            return {
              ...i
              // lastMsg: rootState[tjId][rootState[tjId].length - 1] || null
            }
          })
        } else {
          Vue.set(state, `${tjId}`, [])
          return state[tjId]
        }
      }
    }
  }
}

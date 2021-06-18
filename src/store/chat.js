import Vue from 'vue'
import * as types from './actionType'
import orderBy from 'lodash/orderBy'
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
    chatsByTjId: (state, getters, rootState) => {
      return (tjId, chatList) => {
        chatList = chatList || state.chatList[tjId]

        // 获取当前会话消息，计算未读消息数量，获取最后一条消息，并排序
        if (chatList && chatList.length) {
          return orderBy(
            chatList,
            function(i) {
              const curChatMsgs = rootState.messages.chatMsgs[i.chatId] || []
              const curContactInfo = state[tjId] && state[tjId].customerList ? state[tjId].customerList[tjId] : null
              const curChatInfo = rootState.messages.chatInfo[tjId] ? rootState.messages.chatInfo[tjId][i.chatId] : null
              i.unreadCount = curChatInfo ? curChatInfo.unreadCount : 0
              i.lost = curContactInfo ? curContactInfo.lost : 0 // 0-未流失，1-流失
              i.lastMsg = curChatMsgs.length
                ? curChatMsgs[curChatMsgs.length - 1]
                : {
                    time: i.lastActiveTime,
                    defaultContent: ''
                  }
              return i.lastMsg.time
            },
            ['desc']
          )
        } else {
          Vue.set(state.chatList, `${tjId}`, [])
          return state.chatList[tjId]
        }
      }
    }
  }
}

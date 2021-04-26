import Vue from 'vue'
import * as types from './actionType'
import orderBy from 'lodash/orderBy'
/**
 * 根据tjId设置会话列表
 */

export default {
  state: {
    chatListHash: {}, //会话列表hash，chatId全局唯一
    chatList: {},
    chatInfo: {}
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
    },
    // 记录会话消息数量
    [types.SET_CHAT_INFO](state, chatId) {
      const tjId = chatId.split('&')[0]
      let info = {}
      if (state.chatInfo[tjId]) {
        console.log(state.chatInfo[tjId][chatId])
        state.chatInfo[tjId][chatId].unreadCount++
        state.chatInfo[tjId].unreadCount++
        info = state.chatInfo[tjId]
      } else {
        info = { unreadCount: 1 }
        info[chatId] = { unreadCount: 1 }
      }
      Vue.set(state.chatInfo, `${tjId}`, info)
    },
    // 更新会话消息数量
    [types.UPDATE_CHAT_INFO](state, chatId) {
      const tjId = chatId.split('&')[0]
      let info = {}
      if (state.chatInfo[tjId]) {
        if (!state.chatInfo[tjId][chatId]) {
          return
        }
        state.chatInfo[tjId].unreadCount = state.chatInfo[tjId].unreadCount - state.chatInfo[tjId][chatId].unreadCount
        state.chatInfo[tjId][chatId].unreadCount = 0
        info = { ...state.chatInfo[tjId] }
        Vue.set(state.chatInfo, `${tjId}`, info)
      }
    }
  },
  actions: {},
  getters: {
    chatsByTjId: (state, getters, rootState, rootGetters) => {
      return tjId => {
        // 获取当前会话消息，计算未读消息数量，获取最后一条消息，并排序
        if (state.chatList[tjId]) {
          return orderBy(
            state.chatList[tjId],
            function(i) {
              const curChatMsgs = rootState.messages.chatMsgs[i.chatId] || []
              const curContactInfo = rootGetters.contactInfoByWechatId(tjId, i.wechatId)
              const curChatInfo = state.chatInfo[tjId] ? state.chatInfo[tjId][i.chatId] : null
              i.unreadCount = curChatInfo ? curChatInfo.unreadCount : 0
              i.lost = curContactInfo ? curContactInfo.lost : 0 // 0-未流失，1-流失
              i.lastMsg = curChatMsgs.length
                ? curChatMsgs[curChatMsgs.length - 1]
                : {
                    time: i.lastActiveTime,
                    content: ''
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

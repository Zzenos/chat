import Vue from 'vue'
import * as types from './actionType'
import MsgGen from '@/class/Msg'
import Zsocket from '@/class/ZSocket'
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
  namespaced: true,
  state: {
    chatMsgHash: {}
  },
  mutations: {
    // 新会话
    [types.ADD_CHAT](state, chatId) {
      if (!state[chatId]) Vue.set(state, `${chatId}`, [])
    },
    // 新消息
    [types.ADD_MSG](state, msg) {
      // 查重
      if (state.chatMsgHash[msg.id]) return
      if (state[msg.chatId]) {
        // 这里只需要去重而不需要排序
        state[msg.chatId].splice(state[msg.chatId].length - 1, 0, msg)
      }
    },
    // 历史消息
    [types.ADD_HISTORY_MSG](state, chatId, msgs) {
      if (state[chatId]) {
        state[chatId].splice(0, 0, msgs)
      }
    },
    // 消息缓存
    [types.CACHE_MSG](state, msg) {
      if (state.chatMsgHash[msg.id]) return
      Vue.set(state.chatMsgHash, `${msg.chatId}`, msg)
    }
  },
  actions: {
    /**
     * 消息分发
     * @param {Array} data 消息数组
     */
    [types.DISTRIBUTE_MSG]: {
      root: true,
      handler: ({ commit }, data) => {
        console.log(3322, data, Zsocket)
        if (Object.prototype.toString.call(data) !== '[object Array]') {
          data = [data]
        }
        data.forEach(msgItem => {
          const msg = MsgGen(msgItem)
          commit(types.ADD_CHAT, msg.chatId)
          commit(types.ADD_MSG, msg)
          commit(types.CACHE_MSG, msg)
        })
      }
    },
    /**
     * 指定会话的历史消息分页
     * @param {String} chatId 会话id
     * @param {chatType} chatType 会话类型
     * */

    [types.PULL_HISTORY_MSG]: {
      root: true,
      handler: ({ commit, state }, chatId, chatType) => {
        Zsocket.emit(
          'chat_msg_history',
          {
            chat_id: chatId,
            chat_type: chatType,
            seq: state[chatId] && state[chatId][0] && state[chatId][0].seq,
            page_size: 20
          },
          ack => {
            if (Object.prototype.toString.call(ack.data) !== '[object Array]') {
              ack.data = [ack.data]
            }
            const hisoryMsgs = ack.data.map(i => {
              return MsgGen(i)
            })
            commit(types.ADD_HISTORY_MSG, hisoryMsgs)
          }
        )
      }
    },
    /**
     * 消息发送
     * @param {Object} msg 消息实例
     */
    [types.SEND_MSG]: {
      root: true,
      handler: ({ commit }, msg) => {
        Zsocket.emit('msg_send', msg, ack => {
          commit(types.ADD_MSG, msg)
          commit(types.CACHE_MSG, MsgGen(ack.msg))
        })
      }
    }
  },
  getters: {
    getMsgsByChatId: state => {
      return chatId => {
        return state[chatId] || []
      }
    }
  }
}

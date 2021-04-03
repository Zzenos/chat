import Vue from 'vue'
import * as types from './actionType'
import { MsgGen, getSendMsg } from '@/class/Msg'
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
  state: {
    chatMsgs: {},
    sendingMsgHash: {},
    chatMsgHash: {}
  },
  mutations: {
    // 新会话
    [types.ADD_CHAT](state, chatId) {
      if (!state.chatMsgs[chatId]) Vue.set(state.chatMsgs, `${chatId}`, [])
    },
    // 新消息
    [types.ADD_MSG](state, msg) {
      // 查重
      if (state.chatMsgHash[msg.id]) return
      if (state.chatMsgs[msg.chat_id]) {
        // 这里检查cli_msg_id,如果store中存在，则说明已经发送，进行msg_id的更改即可
        const index = state.chatMsgs[msg.chat_id].findIndex(i => {
          return i.cli_msg_id === msg.cli_msg_id
        })
        if (index >= 0) {
          state.chatMsgs[msg.chat_id].splice(index, 1, msg)
        } else {
          state.chatMsgs[msg.chatId].splice(state.chatMsgs[msg.chatId].length - 1, 0, msg)
        }
      }
    },
    // 历史消息
    [types.ADD_HISTORY_MSG](state, chatId, msgs) {
      if (state.chatMsgs[chatId]) {
        state.chatMsgs[chatId].splice(0, 0, msgs)
      }
    },
    //
    [types.CLEAR_UNREAD_MSG](state, chatId) {
      if (state.chatMsgs[chatId]) {
        state.chatMsgs[chatId].forEach(i => {
          i.unread = false
        })
      }
    },
    [types.CACHE_SENDING_MSG](state, msg) {
      if (state.sendingMsgHash[msg.cli_msg_id]) return
      Vue.set(state.sendingMsgHash, `${msg.cli_msg_id}`, msg)
    },
    // 消息缓存
    [types.CACHE_MSG](state, msg) {
      if (state.chatMsgHash[msg.id]) return
      Vue.set(state.chatMsgHash, `${msg.id}`, msg)
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
        if (Object.prototype.toString.call(data) !== '[object Array]') {
          data = [data]
        }
        data.forEach(msgItem => {
          const msg = MsgGen(msgItem)
          commit(types.ADD_CHAT, msg.chatId)
          commit(types.ADD_MSG, msg)
          commit(types.CACHE_MSG, msg)
          commit(types.CLEAR_SENDING_MSG, msg)
        })
      }
    },
    [types.CLEAR_SENDING_MSG](state, msg) {
      if (state.sendingMsgHash[msg.cli_msg_id]) {
        Vue.delete(state.sendingMsgHash, `${msg.cli_msg_id}`, msg)
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
     * 消息发送，收到ack后修改消息状态
     * @param {Object} msg 消息实例
     */
    [types.SEND_MSG]: {
      root: true,
      handler: ({ commit, dispatch }, data) => {
        const newmsg = getSendMsg(data)
        commit(types.CACHE_SENDING_MSG, data)
        Zsocket.emit('msg_send', newmsg, ack => {
          // 找到对应的消息并且修改消息id
          if (ack.code === 200) {
            dispatch(types.DISTRIBUTE_MSG, ack.data)
          }
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

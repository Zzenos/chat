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
    [types.ADD_CHAT](state, msg) {
      if (!state.chatMsgs[msg.chatId]) Vue.set(state.chatMsgs, `${msg.chatId}`, [])
    },
    // 新消息
    // 需要检查是否为ACK中返回的消息体
    [types.ADD_MSG](state, msg) {
      // 查重
      if (state.chatMsgHash[msg.msgId]) return
      if (state.chatMsgs[msg.chatId]) {
        // 这里检查cli_msg_id,如果store中存在，则说明已经发送，进行msg_id的更改即可
        const index = state.chatMsgs[msg.chatId].findIndex(i => {
          return i.clientMsgId === msg.clientMsgId
        })
        if (index >= 0) {
          state.chatMsgs[msg.chatId].splice(index, 1, msg)
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
      if (state.sendingMsgHash[msg.clientMsgId]) return
      Vue.set(state.sendingMsgHash, `${msg.clientMsgId}`, msg)
    },
    [types.CLEAR_SENDING_MSG](state, msg) {
      if (state.sendingMsgHash[msg.clientMsgId]) {
        Vue.delete(state.sendingMsgHash, `${msg.clientMsgId}`, msg)
      }
    },
    // 消息缓存
    [types.CACHE_MSG](state, msg) {
      if (state.chatMsgHash[msg.msgId]) return
      Vue.set(state.chatMsgHash, `${msg.msgId}`, msg)
    }
  },
  actions: {
    /**
     * 消息分发
     * @param {Array} data 消息数组
     */
    [types.DISTRIBUTE_MSG]: {
      // root: true,
      handler: ({ commit }, data) => {
        if (Object.prototype.toString.call(data) !== '[object Array]') {
          data = [data]
        }
        data.forEach(msgItem => {
          const msg = MsgGen(msgItem)
          console.log('将要分发消息', msg)
          commit(types.ADD_CHAT, msg)
          commit(types.ADD_MSG, msg)
          commit(types.CACHE_MSG, msg)
          // TODO
          commit(types.CLEAR_SENDING_MSG, msg)
        })
      }
    },
    /**
     * 指定会话的历史消息分页
     * @param {String} chatId 会话id
     * @param {chatType} chatType 会话类型
     * */

    [types.PULL_HISTORY_MSG]: {
      // root: true,
      handler: ({ commit, state }, chatId, chatType) => {
        Zsocket.emit(
          'chat_msg_history',
          {
            chatId,
            chatType,
            seq: state.chatMsgs[chatId] && state.chatMsgs[chatId][0] && state.chatMsgs[chatId][0].seq, // 不能保证初始每个会话都有消息
            pageSize: 20
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
     * TODO: 消息超时
     */
    [types.SEND_MSG]: {
      // root: true,
      handler: ({ commit, dispatch }, data) => {
        const newMsg = getSendMsg(data)
        commit(types.CACHE_SENDING_MSG, newMsg)
        dispatch(types.DISTRIBUTE_MSG, newMsg)
        Zsocket.emit('msg_send', newMsg, ack => {
          // TODO
          // 找到对应的消息的息cliMsgId，并修改该消息的msgId和消息状态
          if (ack) {
            // dispatch(types.DISTRIBUTE_MSG, ack.data)
          }
        })
      }
    }
  },
  getters: {
    getMsgsByChatId: state => {
      return chatId => {
        return state.chatMsgs[chatId] || []
      }
    }
  }
}

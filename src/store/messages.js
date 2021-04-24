import Vue from 'vue'
import * as types from './actionType'
import { MsgGen, getSendMsg } from '@/class/Msg'
import Zsocket from '@/class/ZSocket'
import sortedIndexBy from 'lodash/sortedIndexBy'
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
    // 需要检查是否为ACK中返回的消息体
    [types.ADD_MSG](state, msg) {
      // 查重
      if (state.chatMsgHash[msg.msgId]) return
      if (state.chatMsgs[msg.chatId]) {
        // 这里检查cli_msg_id,如果store中存在，则说明已经在会话中，进行msg_id的更改即可
        const index = state.chatMsgs[msg.chatId].findIndex(i => {
          return msg.clientMsgId && i.clientMsgId === msg.clientMsgId
        })
        if (index >= 0) {
          state.chatMsgs[msg.chatId].splice(index, 1, msg)
          console.log('找到了对应的clientMsgId并置换')
        } else {
          const index = sortedIndexBy(state.chatMsgs[msg.chatId], msg, function(obj) {
            return obj.seq
          })
          state.chatMsgs[msg.chatId].splice(index, 0, msg)
        }
      }
    },
    // 本地发送消息
    [types.ADD_MSG_LOCAL](state, msg) {
      if (state.chatMsgs[msg.chatId]) {
        state.chatMsgs[msg.chatId].splice(state.chatMsgs[msg.chatId].length, 0, msg)
      }
    },
    // 历史消息
    [types.ADD_HISTORY_MSG](state, payload) {
      if (state.chatMsgs[payload.chatId]) {
        state.chatMsgs[payload.chatId].splice(0, 0, ...payload.msgs)
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
      handler: ({ commit, state }, data) => {
        if (Object.prototype.toString.call(data) !== '[object Array]') {
          data = [data]
        }
        data.forEach(msgItem => {
          const msg = MsgGen(msgItem)
          if (state.chatMsgHash[msg.msgId]) return
          commit(types.ADD_CHAT, msg.chatId)
          commit(types.ADD_MSG, msg)
          commit(types.CACHE_MSG, msg)
          // TODO
          commit(types.CLEAR_SENDING_MSG, msg)
        })
        // 排序
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
        return new Promise(resolve => {
          Zsocket.emit(
            'chat_msg_history',
            {
              chatId,
              chatType,
              seq: state.chatMsgs[chatId] && state.chatMsgs[chatId][0] && state.chatMsgs[chatId][0].seq, // 不能保证初始每个会话都有消息
              pageSize: 20
            },
            ack => {
              if (Object.prototype.toString.call(ack.data.data) !== '[object Array]') {
                ack.data.data = [ack.data.data]
              }
              const hisoryMsgs = ack.data.data.map(i => {
                return MsgGen(i)
              })
              commit(types.ADD_HISTORY_MSG, { chatId, msgs: hisoryMsgs })
              resolve(hisoryMsgs)
            }
          )
        })
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
        const newMsg = getSendMsg(data, data.notResend)
        // 发送消息不需要放到hash
        if (data.notResend) {
          commit(types.ADD_CHAT, newMsg.chatId)
          commit(types.CACHE_SENDING_MSG, newMsg)
          commit(types.ADD_MSG_LOCAL, newMsg)
        }
        Zsocket.emit('msg_send', newMsg, ack => {
          // 找到对应的消息的息cliMsgId，并修改该消息的msgId和消息状态
          if (ack) {
            dispatch(types.DISTRIBUTE_MSG, ack.data)
          }
          // if (!ack) {
          //   //后端返回的是发送成功
          //   console.log('-----------------后端返回成功')
          //   dispatch(types.DISTRIBUTE_MSG, {
          //     data: ack.data,
          //     type: 'false'
          //   })
          // } else {
          //   //后端返回的是发送失败
          //   console.log('-----------------后端返回失败')
          //   // dispatch(types.DISTRIBUTE_MSG, {
          //   //   data: ack.data,
          //   //   type: 'fail'
          //   // })
          //   ack.data.forEach(item => (item.type = 'fail'))
          //   dispatch(types.DISTRIBUTE_MSG, ack.data)
          // }
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

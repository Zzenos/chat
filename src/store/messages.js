import Vue from 'vue'
import * as types from './actionType'
import { MsgGen, getSendMsg } from '@/class/Msg'
import Zsocket from '@/class/ZSocket'
import sortedIndexBy from 'lodash/sortedIndexBy'
import { getFormattedTime } from '@/util/util.js'

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
    chatMsgHash: {},
    chatInfo: {}
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
          // 返回 value值 应该在数组array中插入的索引位置 index
          const seqIndex = sortedIndexBy(state.chatMsgs[msg.chatId], msg, function(obj) {
            return obj.seq
          })
          // 比较seq，计算该条消息在会话中的位置，然后插入
          state.chatMsgs[msg.chatId].splice(seqIndex, 0, msg)

          // 计算未读消息数量
          if (msg.unread) {
            const tjId = msg.chatId.split('&')[0]
            let info = { unreadCount: 1 }
            info[msg.chatId] = { unreadCount: 1 }
            let chatCountInfo = state.chatInfo[tjId]
            if (chatCountInfo) {
              chatCountInfo.unreadCount++
              if (chatCountInfo[msg.chatId]) {
                chatCountInfo[msg.chatId].unreadCount++
              }
              info = { ...info, ...chatCountInfo }
            }
            console.log(info)
            Vue.set(state.chatInfo, `${tjId}`, info)
          }
        }
      }
    },
    // 本地发送消息
    [types.ADD_MSG_LOCAL](state, msg) {
      if (state.chatMsgs[msg.chatId]) {
        state.chatMsgs[msg.chatId].splice(state.chatMsgs[msg.chatId].length, 0, msg)
      }
    },
    // 添加历史消息
    [types.ADD_HISTORY_MSG](state, payload) {
      if (state.chatMsgs[payload.chatId]) {
        state.chatMsgs[payload.chatId].splice(0, 0, ...payload.msgs)
      } else {
        Vue.set(state.chatMsgs, payload.chatId, [])
        state.chatMsgs[payload.chatId].splice(0, 0, ...payload.msgs)
      }
    },
    // 清除历史消息
    [types.CLEAR_HISTORY_MSG](state, msg) {
      if (state.chatMsgs[msg.chatId]) {
        // 找到需要清除的消息
        const index = state.chatMsgs[msg.chatId].findIndex(i => {
          return msg.clientMsgId && i.clientMsgId === msg.clientMsgId
        })
        if (index >= 0) {
          state.chatMsgs[msg.chatId].splice(index, 1)
          console.log('找到消息并移除')
        }
      }
    },
    // 消息设为已读
    [types.CLEAR_UNREAD_MSG](state, chatId) {
      if (state.chatMsgs[chatId]) {
        state.chatMsgs[chatId].forEach(i => {
          i.unread = false
        })
        // 更新会话消息数量
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
        Vue.set(state.chatMsgs, `${chatId}`, state.chatMsgs[chatId])
      }
    },
    // 缓存发送的消息
    [types.CACHE_SENDING_MSG](state, msg) {
      if (state.sendingMsgHash[msg.clientMsgId]) return
      Vue.set(state.sendingMsgHash, `${msg.clientMsgId}`, msg)
    },
    // 清除发送的消息
    [types.CLEAR_SENDING_MSG](state, msg) {
      if (state.sendingMsgHash[msg.clientMsgId]) {
        Vue.delete(state.sendingMsgHash, `${msg.clientMsgId}`, msg)
      }
    },
    // 消息缓存
    [types.CACHE_MSG](state, msg) {
      if (state.chatMsgHash[msg.msgId]) return
      Vue.set(state.chatMsgHash, `${msg.msgId}`, msg)
    },
    // 清除缓存的消息
    [types.ClEAR_CACHED_MSG](state, msg) {
      if (state.chatMsgHash[msg.msgId]) {
        Vue.delete(state.chatMsgHash, `${msg.msgId}`, msg)
      }
    }
  },
  actions: {
    /**
     * 消息分发
     * @param {Array} data 消息数组
     */
    [types.DISTRIBUTE_MSG]: {
      handler: ({ commit, state }, data) => {
        if (Object.prototype.toString.call(data) !== '[object Array]') {
          data = [data]
        }
        console.log(`%c 开始分发消息: ${getFormattedTime()}`, 'color:#a1a;')
        data.forEach(msgItem => {
          const msg = MsgGen(msgItem)
          const tjId = msg.chatId.split('&')[0]
          if (state.chatMsgHash[msg.msgId]) return
          // 新会话，添加会话列表
          if (!state.chatMsgs[msg.chatId]) {
            // chatType: 2 群聊 群内其他人给群发消息，to是群的信息
            const info = msg.chatType === 2 ? msg.to : msg.sender.tjId === tjId ? msg.to : msg.sender
            commit(types.ADD_CHAT_LIST, {
              tjId,
              chatList: [
                {
                  ...msg,
                  ...info,
                  lost: 0
                }
              ]
            })
          }
          commit(types.ADD_CHAT, msg.chatId)
          commit(types.ADD_MSG, msg)
          commit(types.CACHE_MSG, msg)
          // TODO
          commit(types.CLEAR_SENDING_MSG, msg)
        })
        console.log(`%c 分发消息结束: ${getFormattedTime()}`, 'color:#a1a;')
        // 排序
      }
    },
    /**
     * 指定会话的历史消息分页
     * @param {String} chatId 会话id
     * @param {chatType} chatType 会话类型
     * */
    [types.PULL_HISTORY_MSG]: {
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
        // // 发送消息不需要放到hash
        commit(types.ADD_CHAT, newMsg.chatId)
        commit(types.CACHE_SENDING_MSG, newMsg)
        Zsocket.emit('msg_send', newMsg, ack => {
          // 找到对应的消息的息cliMsgId，并修改该消息的msgId和消息状态
          if (ack) {
            dispatch(types.DISTRIBUTE_MSG, ack.data)
          }
        })
        //小程序先发送 再json.parse添加本地 发送时不会出现空白
        if (data.notResend) {
          if (newMsg.msgType == 'weapp') {
            newMsg.content = JSON.parse(newMsg.content)
          }
          commit(types.ADD_MSG_LOCAL, newMsg)
        }
      }
    },
    /**
     *撤回消息
     * @param {String} tjId 当前账号
     * @param {Object} msg 消息
     */
    [types.RECALL_MSG]: {
      handler: ({ commit }, tjId, msg) => {
        const { seq } = msg
        return new Promise(resolve => {
          Zsocket.emit('recall_msg', { tjId, seq }, res => {
            if (res.code === 200) {
              // 清除本地缓存的消息
              commit(types.ClEAR_CACHED_MSG, msg)
              // 清除会话里的消息
              commit(types.CLEAR_HISTORY_MSG, msg)
              resolve(res.data)
            }
          })
        })
      }
    }
  },
  getters: {
    getMsgsByChatId: state => {
      return chatId => {
        return state.chatMsgs[chatId] || []
      }
    },
    // 获取未读消息数量
    getMsgsUnread: state => {
      return chatId => {
        return state.chatMsgs[chatId] ? state.chatMsgs[chatId].filter(ele => ele.unread) : []
      }
    }
  }
}

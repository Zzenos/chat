import Vue from 'vue'
import * as types from './actionType'
// 通信录
export default {
  state: {},
  mutations: {
    [types.ADD_CONTACT](state, contactsData) {
      // if (state[contactsData[0].tjId]) {
      //   state[contactsData[0].tjId] = contactsData[0]
      // } else {
      //   Vue.set(state, `${contactsData[0].tjId}`, contactsData[0])
      // }
      Vue.set(state, `${contactsData[0].tjId}`, contactsData[0])
    }
  },
  actions: {},
  getters: {
    contactByTjId: state => {
      return tjId => {
        return state[tjId]
      }
    },
    /**
     * 获取x通讯录下x账号信息
     * @param tjId 操作的账号对应的tjId
     * @param wechatId 聊天的客户的tjId/wechatId
     * @param tag customerList / groupList / memberList
     */
    contactInfoByWechatId: state => {
      return (tjId, wechatId, tag = 'customerList') => {
        return state[tjId] && state[tjId][tag] ? state[tjId][tag].find(item => item.wechatId === wechatId) : null
      }
    }
  }
}

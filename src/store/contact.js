import Vue from 'vue'
import * as types from './actionType'
// 通信录
export default {
  state: {},
  mutations: {
    [types.ADD_CONTACT](state, contactsData) {
      const { tjId, customerList, memberList, groupList } = contactsData[0]
      const customerListAry = Object.values(customerList),
        memberListAry = Object.values(memberList),
        groupListAry = Object.values(groupList)
      const addressBookData = { ...contactsData[0], customerListAry, memberListAry, groupListAry }
      if (state[tjId]) {
        state[tjId] = addressBookData
      } else {
        Vue.set(state, `${tjId}`, addressBookData)
      }
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
        return state[tjId] && state[tjId][tag] ? state[tjId][tag][wechatId] : null
      }
    }
  }
}

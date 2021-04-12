import Vue from 'vue'
import * as types from './actionType'
// 探鲸账号
export default {
  state: {
    customer: {},
    group: {},
    member: {}
  },
  mutations: {
    // 客户信息
    [types.ADD_CUSTOMER_DETAILS](state, wechatDetailsData) {
      const data = wechatDetailsData
      if (!state.customer[data.wechatId]) {
        Vue.set(state.customer, `${data.wechatId}`, data)
      } else {
        state.customer[data.wechatId] = data
      }
    },
    // 成员信息
    [types.ADD_MEMBER_DETAILS](state, wechatDetailsData) {
      const data = wechatDetailsData
      if (!state.member[data.wechatId]) {
        Vue.set(state.member, `${data.wechatId}`, data)
      } else {
        state.member[data.wechatId] = data
      }
    },
    // 群详细信息
    [types.ADD_GROUP_DETAILS](state, groupDetailsData) {
      const data = groupDetailsData
      if (!state.group[data.wechatId]) {
        Vue.set(state.group, `${data.wechatId}`, data)
      } else {
        state.group[data.wechatId] = data
      }
    }
  },
  actions: {},
  getters: {
    customerDetailsById: state => {
      return wechatId => {
        return state.customer[wechatId]
      }
    },
    groupDetailsById: state => {
      return groupId => {
        return state.group[groupId]
      }
    },
    memberDetailsById: state => {
      return wechatId => {
        return state.member[wechatId]
      }
    }
  }
}

import Vue from 'vue'
import * as types from './actionType'
// 探鲸账号
export default {
  namespaced: true,
  state: {
    wechat: {},
    group: {}
  },
  mutations: {
    // 微信细信息
    [types.ADD_WECHAT_DETAILS](state, wechatDetailsData) {
      const data = wechatDetailsData[0]
      if (!state.wechat[data.wechatId]) {
        Vue.set(state.wechat, `${data.wechatId}`, data)
      } else {
        state.wechat[data.wechatId] = data
      }
    },
    // 群详细信息
    [types.ADD_GROUP_DETAILS](state, groupDetailsData) {
      const data = groupDetailsData[0]
      if (!state.group[data.groupId]) {
        Vue.set(state.group, `${data.groupId}`, data)
      } else {
        state.group[data.groupId] = data
      }
    }
  },
  actions: {},
  getters: {
    wechatDetailsById: state => {
      return wechatId => {
        return state.wechat[wechatId]
      }
    },
    groupDetailsById: state => {
      return wechatId => {
        return state.group[wechatId]
      }
    }
  }
}

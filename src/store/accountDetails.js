import Vue from 'vue'
import * as types from './actionType'
import Zsocket from '@/class/ZSocket'

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
      if (!state.group[data.groupId]) {
        Vue.set(state.group, `${data.groupId}`, data)
      } else {
        state.group[data.groupId] = data
      }
    }
  },
  actions: {
    /**
     *拉取群信息
     * @param {String} tjId 当前账号
     * @param {String} groupId 群ID
     */
    [types.PULL_GROUP_DETAILS]: {
      handler: ({ commit }, data) => {
        return new Promise(resolve => {
          Zsocket.emit('group_info', { tjId: data.tjId, groupId: data.groupId }, res => {
            if (res.code === 200) {
              commit(types.ADD_GROUP_DETAILS, res.data)
              resolve(res.data)
            }
          })
        })
      }
    }
  },
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

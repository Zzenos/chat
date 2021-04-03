import Vue from 'vue'
import * as types from './actionType'
// 通信录
export default {
  state: {},
  mutations: {
    [types.ADD_CONTACT](state, contactsData) {
      if (state[contactsData[0].tjId]) {
        state[contactsData[0].tjId] = contactsData
      } else {
        Vue.set(state, `${contactsData[0].tjId}`, contactsData)
      }
    }
  },
  actions: {},
  getters: {
    contactByTjId: state => {
      return tjId => {
        return state[tjId]
      }
    }
  }
}

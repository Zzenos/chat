import Vue from 'vue'
import * as types from './actionType'
// 通信录
export default {
  state: {
    contact: {}
  },
  mutations: {
    [types.ADD_CONTACT](state, contactsData) {
      if (state.contact[contactsData.tj_id]) {
        state.contact[contactsData.tj_id] = contactsData
      } else {
        Vue.set(state.contact, `${contactsData.tj_id}`, contactsData)
      }
    }
  },
  actions: {},
  getters: {
    getContactByTjId: state => {
      return tjId => {
        return state.contact[tjId]
      }
    }
  }
}

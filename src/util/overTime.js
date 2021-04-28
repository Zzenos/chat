import Vue from 'vue'

const state = Vue.observable({
  show: false
})

export default function overTimeModal() {
  return {
    state
  }
}

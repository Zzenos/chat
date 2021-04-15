import Vue from 'vue'

const state = Vue.observable({
  show: false,
  player: null,
  config: {}
})

export default function useVideosModal() {
  return {
    state
  }
}

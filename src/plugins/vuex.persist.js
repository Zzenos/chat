import VuexPersistence from 'vuex-persist'
const vuexLocal = new VuexPersistence({
  key: 'im',
  storage: window.localStorage
})
export default vuexLocal

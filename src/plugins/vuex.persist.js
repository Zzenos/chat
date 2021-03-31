import VuexPersistence from 'vuex-persist'
import localForage from 'localforage'

const vuexLocal = new VuexPersistence({
  key: 'im',
  // storage: window.localStorage,
  asyncStorage: true,
  storage: localForage
})
export default vuexLocal

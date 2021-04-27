import VuexPersistence from 'vuex-persist'
// import localForage from 'localforage'

const vuexLocal = new VuexPersistence({
  key: 'im',
  storage: window.localStorage,
  reducer: state => ({
    token: state.token,
    username: state.username
  })
  // asyncStorage: true
  // storage: localForage
})
export default vuexLocal

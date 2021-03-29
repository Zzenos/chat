import store from '@/store'

//
export default {
  waitForStorageToBeReady: async (to, from, next) => {
    console.log(22222, to, from, next, store, store.restored)
    // if (to.path === '')
    await store.restored
    next()
  }
}

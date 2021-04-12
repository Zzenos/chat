import store from '@/store'

//
export default {
  waitForStorageToBeReady: async (to, from, next) => {
    // if (to.path === '')
    await store.restored
    next()
  }
}

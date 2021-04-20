// import store from '@/store'

//
export default {
  waitForStorageToBeReady: async (to, from, next) => {
    // if (to.path === '')
    // await store.restored
    // 刷新需要重新回到
    if (from.path === '/' && to.path !== '/chatframe' && to.name !== 'Transit') {
      next('/chatframe')
    }
    next()
  }
}

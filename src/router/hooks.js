// import store from '@/store'

//
export default {
  waitForStorageToBeReady: async (to, from, next) => {
    // if (to.path === '')
    // await store.restored
    console.log(6666666666, to, from, next)
    // 刷新需要重新回到
    if (from.path === '/' && to.path !== '/chatframe' && to.name !== 'Transit') {
      next('/chatframe')
    }
    next()
  }
}

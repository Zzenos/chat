import store from '@/store'

//
export default {
  waitForStorageToBeReady: async (to, from, next) => {
    // if (to.path === '')
    console.log('router', to, from, 2222, next)
    await store.restored
    // 刷新需要重新回到
    if (from.path === '/' && to.path !== '/chatframe' && to.path !== '/transit') {
      next('/chatframe')
    }
    next()
  }
}

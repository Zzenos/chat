import store from '@/store'

//
export default {
  waitForStorageToBeReady: async (to, from, next) => {
    // if (to.path === '')
    await store.restored
    // 刷新需要重新回到
    // /* if ((from.path === '/' || from.path === '/chatframe') && to.path !== '/chatframe' && to.path !== '/transit') {
    //   next('/chatframe')
    // } */
    next()
  }
}

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [{
    path: '/login',
    name: 'login',
    component: () => import('../views/login/login')
  }, {
    path: '/',
    redirect: '/login'
  }]

})
export default router
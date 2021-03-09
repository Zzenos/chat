import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [{
    path: '/login',
    name: 'login',
    component: () => import( /* webpackChunkName: "login" */ '../views/login/login')
  }, {
    path: '/chat',
    name: 'chat',
    component: () => import( /* webpackChunkName: "chatroom" */ '../views/chat/chat')
  }, {
    path: '/',
    redirect: '/login'
  }]

})
export default router
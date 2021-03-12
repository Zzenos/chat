import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [{
  path: '/login',
  name: 'login',
  component: () => import( /* webpackChunkName: "login" */ '../views/login/login')
}, {
  path: '/chat',
  name: 'chat',
  component: () => import( /* webpackChunkName: "chatroom" */ '../views/chat/chat')
}]


const notFound = [{
  path: '*',
  component: () => import( /* webpackChunkName: "404" */ '../views/404/404')
}]


routes.concat(notFound)

export default new Router({
  mode: 'history',
  routes
})
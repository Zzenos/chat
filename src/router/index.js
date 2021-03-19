import Vue from 'vue'
import VueRouter from 'vue-router'
import hooks from './hooks'

Vue.use(VueRouter)

let routes = [{
    path: '/login',
    name: 'login',
    component: () => import( /* webpackChunkName: "login" */ '../views/login/Login')
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import( /* webpackChunkName: "chat" */ '../views/chat/Chat')
  },
  {
    path: '/transit/:token',
    name: 'Transit',
    component: () => import( /* webpackChunkName: "about" */ '../views/transit/Transit'),
    props: true
  },
  {
    path: '/',
    redirect: '/login'
  }
]

const notFound = {
  path: '*',
  name: '404',
  component: () => import( /* webpackChunkName: "404" */ '../views/404/404')
}

routes.splice(routes.length - 1, 0, notFound)



const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach(hooks)
export default router
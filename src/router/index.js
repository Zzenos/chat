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
    path: '/chatframe/:userId',
    name: 'ChatFrame',
    component: () => import( /* webpackChunkName: "chatframe" */ '../views/chat/ChatFrame'),
    props: true,
    children: [{ // 联系人会话
      path: 'recent/:contactId',
      name: 'Chat',
      component: () => import( /* webpackChunkName: "chat" */ '../views/chat/Chat'),
      props: true,
    }, { // 联系人信息
      path: 'accountInfo',
      name: 'AccountInfo',
      component: () => import( /* webpackChunkName: "chat" */ '../views/chat/AccountInfo'),
      props: true,
    }]
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

routes = routes.concat([notFound])



const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach(hooks)
export default router
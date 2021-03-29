import Vue from 'vue'
import VueRouter from 'vue-router'
import hooks from './hooks'

Vue.use(VueRouter)

let routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/login/Login')
  },
  {
    // 聊天框
    path: '/chatframe',
    name: 'ChatFrame',
    component: () => import(/* webpackChunkName: "chatframe" */ '../views/chat/ChatFrame'),
    children: [
      {
        path: ':userId',
        name: 'ContactList',
        component: () => import(/* webpackChunkName: "contactlist" */ '../views/chat/ContactList'),
        props: true,
        children: [
          {
            // 联系人会话
            path: 'recent/:contactId',
            name: 'Chat',
            component: () => import(/* webpackChunkName: "chat" */ '../views/chat/Chat'),
            props: true
          },
          {
            // 联系人信息
            path: 'contactInfo/:contactId',
            name: 'contactInfo',
            component: () => import(/* webpackChunkName: "chat" */ '../views/chat/ContactInfo'),
            props: true
          }
        ]
      }
    ]
  },
  {
    path: '/transit/:token',
    name: 'Transit',
    component: () => import(/* webpackChunkName: "about" */ '../views/transit/Transit'),
    props: true
  },
  {
    path: '/',
    redirect: '/chatframe'
  },
  {
    path: '/404',
    name: '404',
    component: () => import(/* webpackChunkName: "404" */ '../views/404/404')
  }
]

const notFound = {
  path: '*',
  redirect: '/404'
}

routes = routes.concat([notFound])

const router = new VueRouter({
  mode: 'history',
  routes
})

Object.values(hooks).forEach(hook => {
  router.beforeEach(hook.bind(router))
})

export default router

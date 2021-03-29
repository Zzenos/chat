import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './config/icon.config'
import './config/antd.config'
import './components/common/AntIcon'
import ZSocket from '@/class/ZSocket'

Vue.config.productionTip = false
Vue.prototype.$socket = new ZSocket()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

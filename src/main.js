import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Meta from 'vue-meta'
import './assets/scss/index.scss'
import './config/icon.config'
import './config/antd.config'
import './components/common/AntIcon'
import NoData from './components/common/NoData.vue'
import ZSocket from '@/class/ZSocket'
import './util/filters'

Vue.use(Meta)
Vue.component('no-data', NoData)

Vue.config.productionTip = false
Vue.prototype.$socket = ZSocket

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

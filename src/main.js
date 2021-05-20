import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueVirtualScroller from 'vue-virtual-scroller'
import './assets/scss/index.scss'
import './config/icon.config'
import './config/antd.config'
import './components/common/AntIcon'
import NoData from './components/common/NoData.vue'
import ZSocket from '@/class/ZSocket'
import './util/filters'

Vue.component('no-data', NoData)
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
Vue.use(VueVirtualScroller)
Vue.config.productionTip = false
Vue.prototype.$socket = ZSocket

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

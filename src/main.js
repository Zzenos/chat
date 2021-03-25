import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './config/icon.config'
import './config/antd.config'
import './components/common/AntIcon'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

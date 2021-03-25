import Vue from 'vue'
import SvgIcon from '@/components/common/SvgIcon.vue'

// 全局引入SvgIcon组件
Vue.component('svg-icon', SvgIcon)
// require.context
// require.context('@/assets/icons/svg', false, /\.svg$/)
const req = require.context('@/assets/icons/svg', false, /\.svg$/)
req.keys().map(req)

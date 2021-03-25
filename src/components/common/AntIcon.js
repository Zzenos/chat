import { Icon } from 'ant-design-vue'
import Vue from 'vue'

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2444751_o6mz93l8dan.js'
})
Vue.component('icon-font', IconFont)

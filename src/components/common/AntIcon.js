import { Icon } from 'ant-design-vue'
import Vue from 'vue'

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2211282_wel4rgzsyi.js'
})
Vue.component('icon-font', IconFont)

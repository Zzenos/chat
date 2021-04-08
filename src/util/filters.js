// vue filter
import Vue from 'vue'
import moment from 'moment'

Vue.filter('placeholder', value => {
  return value || '--'
})

Vue.filter('timeFilter', ts => {
  return ts ? moment(ts).format('YYYY-MM-DD HH:mm') : '--'
})

Vue.filter('nullFilter', str => {
  if (!str) return '--'
})

// vue filter
import Vue from 'vue'
import moment from 'moment'

Vue.filter('placeholder', value => {
  return value || '--'
})

Vue.filter('timeFilter', ts => {
  const startOfDay = new Date(moment().format('YYYY-MM-DD')).setHours(0, 0, 0, 0)
  return ts ? (ts >= startOfDay ? moment(ts).format('HH:mm') : moment(ts).format('YYYY-MM-DD')) : '--'
})

Vue.filter('nullFilter', str => {
  if (!str) return '--'
})

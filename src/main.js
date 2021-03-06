// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/index.css'
import moment from 'moment'
import http from './plugins/http'
import myBreadcrumb from './components/myBreadcrumb'

Vue.use(ElementUI)
Vue.use(http)
Vue.prototype.$moment = moment

Vue.filter('fmtDate', val => {
  return moment(val).format('YYYY-MM-DD')
})

Vue.component('myBreadcrumb', myBreadcrumb)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

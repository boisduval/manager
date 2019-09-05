import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'home',
      path: '/',
      // redirect: {
      //   name: 'login'
      // }
      component: Home
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    }
  ]
})

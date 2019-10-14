import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import TestPaperParticulars from './views/TestPaperManage/TestPaperParticulars.vue'
import BaseRouter from './router/base'
import TestRouter from './router/test'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children:[
         ...BaseRouter,
         ...TestRouter,
         {
          path:'/TestPaperParticulars',
          name:'TestPaperParticulars',
          component:TestPaperParticulars
        }
      ]
    },
    {
      path:'/login',
      name:'login',
      component:Login
    },
    
  ]
})

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUi from "element-ui"
import "element-ui/lib/theme-chalk/index.css"
import Axios from "axios"
import VueAxios from "vue-axios"
import echarts from 'echarts'
import i18n from './i18n/i18n';
import JsonExcel from 'vue-json-excel'
import Print from 'vue-print-nb'
Vue.component('downloadExcel', JsonExcel) // Excel表格插件
Vue.use(Print);  // 打印插件



// import btnPermissions from "@direction/btnPermissions.js";
Vue.prototype.$echarts = echarts 
Vue.use(ElementUi)
Vue.use(VueAxios,Axios)
Vue.config.productionTip = false
// Vue.use(btnPermissions)



Axios.defaults.baseURL = "http://192.168.1.188:12"  //基路径c
Axios.interceptors.request.use(function(config){
  //携带凭证
  config.headers['Authorization'] = sessionStorage.getItem("token")
  return config
}),function(error){
  return Promise.reject(error)
}

Axios.interceptors.response.use(function(response){
  return response
},function(error){
  var url = error.config.url.toLocaleLowerCase();
  
  if(error.response.status === 401&&!url.endsWith("oauth/authenticate")){
    console.log(router.fullPath)
    router.replace({name:'login',query:{return:router.fullPath}})
    
  }
  return Promise.reject(error)
})


router.beforeEach((to,from,next) => {
  if(sessionStorage.getItem('userName') || to.fullPath == "/login"){
      next()
  }else{
    next("/login")
  }
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')


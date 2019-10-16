import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import ElementUi from "element-ui"
import "element-ui/lib/theme-chalk/index.css"
import Axios from "axios"
import VueAxios from "vue-axios"
import echarts from 'echarts'
import i18n from './i18n/i18n';
Vue.prototype.$echarts = echarts 
Vue.use(ElementUi)
Vue.use(VueAxios,Axios)
Vue.config.productionTip = false

import has from '@/directive/btnPermissions'
import { mapState } from 'vuex'

async function reGetToken(userInfo,error){  //token过期重新获取
  //发送请求，使用await等待异步结果返回
  var res = await Axios.get("api/OAuth/authenticate?userMobile="+userInfo.userMobile+"&userPassword="+userInfo.userPassword)
  .catch(() => {
    router.replace({name:'login',query:{return:router.fullPath}})
  })
  // console.log(res&&res.status == 200 && res.data)
  if(res&&res.status == 200 && res.data){
    var token = res.data.token_type + " " + res.data.access_token
    sessionStorage.setItem("token",token)
    store.state.access_token = token,
    store.state.userName = res.data.profile.userName
    store.state.userUid = res.data.profile.userUid
    store.state.userHeader = res.data.profile.userHeader
    store.state.userUserTypeId = res.data.profile.userUserTypeId
    error.config.headers["Authorization"] = token
    var config = error.config
    return await Axios(config)
  }
  return Promise.reject(error)
}

 Axios.defaults.baseURL = "http://192.168.1.188:12"  //基路径


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
    var info = {
      userMobile:sessionStorage.getItem('userPhone'),    //登录账号
      //sessionStorage.setItem('userName',res.data.profile.userName) //用户姓名
      userPassword:sessionStorage.getItem('userPwd')       //用户密码
    }
    if(document.cookie){  //判断用户是否保存密码
      return reGetToken(info,error)
    }else{
      router.replace({name:'login',query:{return:router.fullPath}})
      return Promise.reject(error)
    }
  }
  return Promise.reject(error)
})
/**
 * get
 * @param {String} url 请求地址
 * @param {Object} params 请求参数
 */
const get =  function get(url,params){
  return Axios.get(url,{
    params
  })
}
Vue.prototype.get = get

/**
 * get
 * @param {String} url 请求地址
 * @param {Object} data 请求数据
 * @param {Object} params 请求参数
 */
const post = function post(url,data,params){
  return Axios.post(url,data,{
    params
  })
}
Vue.prototype.post = post


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
  render: h => h(App),
  computed:{
    ...mapState({
      testInfo:"testInfo",
      userInfo:"userInfo"
    })
  },
 
}).$mount('#app')


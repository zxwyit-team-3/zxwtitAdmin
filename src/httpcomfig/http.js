import Axios from "axios";
import url from './apiUrl'
// import VueRouter from 'vue-router'
import router from "../router";
Axios.defaults.baseUrl = url



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
    var url = error.config.url.toLocaleLoveCase();
    if(error.response.status === 401&&!url.endsWith("oauth/authenticate")){
        router.replace({})
    }
    return Promise.reject(error)
})


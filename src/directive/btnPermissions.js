import Vue from 'vue'
import store from '../store/index'
const has = Vue.directive('has',{
    inserted:function(el,binging,vnode){
        //获取按钮权限
        let btnPermissions = vnode.context.$route.meta.btnPermissions;
        //获取状态管理用户
            var userUserTypeId = store.state.userUserTypeId
            if(!Vue.prototype.$_has(btnPermissions,userUserTypeId)&&el.parentElement){
                el.parentElement.removeChild(el);
            } 
    }
})
//权限检查方法
Vue.prototype.$_has = function(value,userUserTypeId){
    
    let idExist = false;
    if(userUserTypeId == undefined || userUserTypeId == null){
        return false;
    }
    if(value.indexOf(userUserTypeId) > -1){
        idExist = true
    }
    return idExist
}
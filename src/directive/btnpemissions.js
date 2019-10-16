import Vue from 'vue'
import store from '../store'
const has = Vue.directive('has',{
    inserted:function(el,binging,vnode){
        //获取按钮权限
        let btnPermissions = vnode.context.$route.meta.btnPermissions;
        
        //获取状态管理用户
        var user = vnode.context.$root;
        var userUserTypeId = user.$store.state.userUserTypeId
        // console.log()
        // var userUserTypeId = null
        // setTimeout(() => {
        //     for (let i = 0; i < vnode.context.tableDatb.length; i++) {
        //        if(vnode.context.tableDatb[i].userUid == sessionStorage.getItem("userUid")){
        //         userUserTypeId = vnode.context.tableDatb[i].userUserTypeId
        //        }
        //     }
            if(!Vue.prototype.$_has(btnPermissions,userUserTypeId)&&el.parentElement){
                el.parentElement.removeChild(el);
            }
        // },500)
       
       
        
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
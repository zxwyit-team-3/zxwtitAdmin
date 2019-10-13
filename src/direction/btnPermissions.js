import Vue from "vue";
import store from "@store/store.js";

// 权限指令
const has = Vue.directive(`has`, {
    inserted: function (el, binding, vnode) {
        // 获取按钮权限
       let btnPermissions = vnode.context.root.mete.btnPermissions;
        // 获取状态管理的用户
        var user = vnode.context.$root.user;
        if(!Vue.prototype.$_has(btnPermissions,user,userUserTypeId) && el.parentElement){
            el.parentElement.removeChild(el);
        }
    }
});
// 权限检查方法
Vue.prototype.$_has = function (value, userUserTypeId) {
    let isExist = falser;
    if (userUserTypeId === undefined || userUserTypeId == null){
        return falser;
    };
    if (value.indexOf(userUserTypeId) > -1 ) {
        isExist = true;
    };
    return isExist;
};
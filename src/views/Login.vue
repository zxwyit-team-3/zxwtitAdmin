<!--
   登录页面
-->
<template>
    <div id="login">
        <div id="login_box">
                <div id="left_box">    
                <img src="../assets/favicon.jpg">
                <h3>智学无忧后台管理系统</h3>    
                <p>做最有态度，责任，良心的教育</p>    
                </div>
                <div id="from_data">
                        <el-input
                        placeholder="请输入内容"
                        v-model="user"
                        prefix-icon="el-icon-user-solid"
                        clearable>
                        </el-input>
                        <el-input placeholder="请输入密码" prefix-icon="el-icon-lock" v-model="password" show-password></el-input>
                        <el-checkbox v-model="checked">记住密码</el-checkbox>
                        <el-button type="success" @click="userLogin" :loading="isloading">登录</el-button>
                </div>
        </div>
    </div>
</template>


<script>
    export default {
        name:"login",
        data(){
            return {
                    user:"", //用户
                    password:"",//密码
                    checked:true,//是否选中
                    isloading:false
            }
        },
        methods:{ //btoa（加密的东西）加密 atob(解密的东西)解密
            setCookie(name, value, day){  //设置cookie
                   if(day !== 0){     //当设置的时间等于0时，不设置expires属性，cookie在浏览器关闭后删除
                     var expires = day * 24 * 60 * 60 * 1000;
                     var date = new Date(+new Date()+expires);
                     document.cookie = name + "=" + btoa(escape(value)) + ";expires=" + date.toUTCString();
                   }else{
                     document.cookie = name + "=" + escape(value);
                   }
            },
            clearCookie(name){  //删除cookie
                    this.setCookie(name, ' ', -1);
            },
            userLogin(){
                var _this = this
                this.isloading = true
                
                // var info = {  
                // userMobile:_this.user,    //登录账号
                // //sessionStorage.setItem('userName',res.data.profile.userName) //用户姓名
                // userPassword:_this.password       //用户密码
                // }
                // console.log(this.get("api/OAuth/authenticate",info))   封装axios调用

                this.axios.get("api/OAuth/authenticate?userMobile="+_this.user+"&userPassword="+_this.password)
                .then(function(res){
                    // console.log(res.data)
                    if(res.statusText == "OK"){
                        if(_this.checked){ //cookie存储用户信息
                            var Days = 7;  //过期时间
                            _this.setCookie("userPwd",_this.password,Days)
                            _this.setCookie("userName",_this.user,Days)
                           
                        }else{ //清空cookie
                                _this.clearCookie("userPwd")
                                _this.clearCookie("userName")
                        }
                        _this.$message({
                        message: '登录成功',
                        type: 'success'
                        });
                        var token = res.data.access_token  //token
                        var tokenType = res.data.token_type //token类型
                        sessionStorage.setItem('token',tokenType+" "+token)  //token类型及token放会话
                        sessionStorage.setItem('userPhone', _this.user)      //登录账号
                        sessionStorage.setItem('userName',res.data.profile.userName) //用户姓名
                        sessionStorage.setItem('userPwd', _this.password)       //用户密码
                        sessionStorage.setItem('userHeader',res.data.profile.userHeader)    //用户头像
                        sessionStorage.setItem('userUid',res.data.profile.userUid)      // 用户Id
                        _this.$store.state.userName = res.data.profile.userName
                        _this.$store.state.userUid = res.data.profile.userUid
                        _this.$store.state.userHeader = res.data.profile.userHeader
                        _this.$store.state.userUserTypeId = res.data.profile.userUserTypeId
                        _this.$router.push('/') //跳转路由
                        _this.isloading = false //按钮禁用
                    }
                }).catch(function (error) {
                    if(error == "Error: Request failed with status code 401"){
                        _this.$message({
                        message: '用户名或密码错误',
                        type: 'warning'
                        });
                    }else{
                         _this.$message({
                        message: '登录失败'+error,
                        type: 'warning'
                        });
                    }
                    _this.isloading = false
                });
            }
        },
        created(){
            if(this.checked){
                var strcookie = document.cookie;//获取cookie字符串
                var arrcookie = strcookie.split("; ");//根据分号分割
                var arr = []
                //遍历匹配
                for ( var i = 0; i < arrcookie.length; i++) {
                        arr.push(arrcookie[i].split("=")); //根据==keyvalue分割成数组
                    if (arr[i][0] == "userPwd"){ 
                       this.password = atob(arr[i][1])
                    }else{
                        this.user = atob(arr[i][1])
                    }
                }
            }
            
        }
    }
</script>


<style lang="less" scoped>
#login{
    width: 100%;
    height:100%;
    background: url(../assets/03761015b076272a801209a853b522f.jpg) 0px 0px repeat;
}
#login_box{
    height: 50%;
    width: 40%;
    position: absolute;
    left:50%;
    top:50%;
    transform:translate(-50%,-50%);
    box-shadow:white 2px 2px 15px 15px;
    background-color: rgba(255, 255, 255, .5)
}
#login_box div{
    float: left;
    width: 49.8%;
    height:100%;
   
}
#login_box #left_box{
    border-right: 1px solid #fff;
    text-align: center;
}
#login_box #left_box img{
width: 40%;
height: 30%;
border-radius: 50%;
margin-top: 15%;
}
#login_box #left_box h3{
    margin-top: 25px;
    color:#219892;
}
#login_box #left_box p{
    margin-top: 30px;
    color:#ccc;
    font-size: 13px;
}

#from_data div:nth-child(1){
    height: 50px;
    width: 80%;
    margin-left: 10%;
    margin-top: 25%;
}
#from_data div:nth-child(2){
    height: 50px;
    width: 80%;
    margin-left: 10%;
    margin-top: 5%;
}
#from_data label{
    width: 80%;
     margin-left: 10%;
}
#from_data button{
     margin-left: 10%;
      margin-top: 15%;
    width: 80%;
}
/deep/ .el-input__inner{
    border:1px solid #219892;
    border-radius: 0px;
}
/deep/ .el-input__prefix{
    color:#219892;
    font-size: 20px;
    height: 40px;
}
@media screen and (max-width: 950px) {
    #login_box div{
        height: 45%;
        width: 100%;
        clear: both;
    }
   #login_box #left_box{
        text-align: center;
        border-right:0px;      
    }
    #login_box #left_box img{
        margin-top: 15px;
        height: 80px;
        width: 80px;
        border-radius: 50%; 
    }
    /deep/ #from_data div:nth-child(1){
        margin-top: 0px;
    }
    #from_data button{
        margin-top: 15px;
    }
    #login_box #left_box h3{
        margin-top: 10px;
    }
    #login_box #left_box p{
         margin-top: 20px;
    }
}

</style>
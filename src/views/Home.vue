<template>
  <div id="home">
    <el-container style="height:100%;">
  <el-aside width='200' style="background-color:#545c64">
    <el-menu :default-active="$route.path"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      background-color="#545C64"
      router 
      text-color="#fff">
      <p id="title"><img src="../assets/head.jpg" />智学无忧教育</p>
    <el-submenu index="1">
      <template slot="title">
        <i class="el-icon-document"></i>
        <span slot="title">在线测试</span>
      </template>
      <el-menu-item-group>
        <el-menu-item v-for="(item,index) in test" :key="index"  :route="item.url" :name="item.name" :index="item.url" @click="addTab(index,item.name,item.url)">{{item.name}}<i></i></el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-menu"></i>
        <span slot="title">基本数据</span>
      </template>
      <el-menu-item-group>
         <el-menu-item v-for="(item,index) in base" :key="index" :route="item.url" :name="item.name" :index="item.url"  @click="addTab(index,item.name,item.url)">{{item.name}}<i></i></el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    </el-menu>
  </el-aside>
  <el-container>
    <el-header style=" font-size: 12px">
      <p id="changeTab" @click="NavChange"><i :class="[isActive?'el-icon-caret-left':'el-icon-caret-right']"></i></p>
      <div style="display:flex;width:100%;">
         <el-tabs v-model="editableTabsValue"  type="card" closable @tab-remove="removeTab" @tab-click='tabClick' >
              <el-tab-pane
                v-for="(item) in editableTabs"
                :key="item.name"
                :label="item.title"
                :name="item.name"
                :url="item.comtent"
              >
              </el-tab-pane>
            </el-tabs>
            <div style="display:flex;">
            <el-dropdown style="width:50px;margin-top:20px;">
              <span>{{isInternationalization}}</span>
              <i class="el-icon-arrow-down" style=""></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item  @click.native="Internationalization('英文')">英文</el-dropdown-item>
                <el-dropdown-item  @click.native="Internationalization('中文')">中文</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <span  style="display:inline-block;width:50px;padding:0px 10px;margin-top:20px;">{{userName}}</span>
            <el-avatar  :src="circleUrl" style="vertical-align: middle;margin-top:10px;"></el-avatar>
            </div>
            </div>
          </el-header>
          <el-main>
            <router-view />
          </el-main>
        </el-container>
      </el-container>
  </div>
</template>
<script>
// @ is an alias to /src
export default {
  name: 'home',
  data(){
      return {
        circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png", //头像
        userName:"",
        editableTabsValue: '1', //选中tabs
       editableTabs: [{ //tab数组
          title: '首页',
          name: '1',
          content: '/'
        }], 
        base:[ //基本数据数组
          {url:"/ClassManage",name:"班级管理"},
          {url:"/StudentManage",name:"学生管理"},
          {url:"/TeacherManage",name:"老师管理"},
          {url:"/MondifyPassword",name:"修改密码"}
        ],
        test:[ //在线测试数组
          {url:"/MakeTestPaper",name:"老师出卷"},
          {url:"/TestPaperManage",name:"试卷管理"},
          {url:"/TestResult",name:"安排测试"},
          {url:"/TestSetter",name:"批阅试卷"},
          {url:"/ViewTestPaper",name:"测试成绩"},
        ],
       tabIndex: 1,
       isCollapse:false,//操控是否收缩
       isActive:true, //箭头切换
       isInternationalization:"中文"
      }
  },
   methods: {
        NavChange(){  //菜单栏收缩
          this.isCollapse = !this.isCollapse
          this.isActive = !this.isActive
        },
        addTab(targetName,content,url) { //添加tabs
          let newTabName = ++this.tabIndex + '';
          for(let i =0;i< this.editableTabs.length;i++){ //判断是否有相同
            if(this.editableTabs[i].title == content){
                this.editableTabsValue = i+1+""  //点击菜单栏选中tabs
                return
            }
          }
          this.editableTabs.push({
            title: content, //内容
            name: newTabName,
            content:url //路由
          });
        this.editableTabsValue  = newTabName;
        },
        removeTab(targetName) {  //删除tabs
          let tabs = this.editableTabs;
          let activeName = this.editableTabsValue;
          console.log(this.editableTabsValue)
          if (activeName === targetName) {
            tabs.forEach((tab, index) => {
              if (tab.name === targetName) {
                let nextTab = tabs[index + 1] || tabs[index - 1];
                if (nextTab) {
                  activeName = nextTab.name;
                }
              }
            });
          }
        
          this.editableTabsValue = activeName;
          this.editableTabs = tabs.filter(tab => tab.name !== targetName)
          let length = this.editableTabs.length
          this.$router.push(this.editableTabs[length-1].content) //删除跳转上一个
          // this.$router.push(.content)
          //  console.log()
        },
      tabClick(event){  //点击tabs切换路由
        //event.index 获取当前点击tabs下标
        //  console.log(this.editableTabs)
        //  console.log(event.index)
        this.$router.push(this.editableTabs[event.index].content)
      },
      Internationalization(isType){  //国际化
       this.isInternationalization = isType
      if(isType == "中文"){
          isType = "cn"
          localStorage.setItem('lang',isType);
          this.$i18n.locale = isType;
      }else{
          isType = "en"
          localStorage.setItem('lang',isType);
          this.$i18n.locale = isType;
      }
        // LangStorage.setLang(this.$i18n.locale) //后面会用做切换和将用户习惯存储到本地浏览器
      }
    },

    beforeCreate(){  //是否登录验证
      var token = sessionStorage.getItem("token")
      if(!token){
        this.$message({
            message: '你还没登录',
            type: 'warning'
        });
       this.$router.replace("/login?returnUrl="+location.pathname+location.search)
      }
    },
    mounted(){
      this.circleUrl = sessionStorage.getItem("userHeader")
      this.userName = sessionStorage.getItem("userName")
    },
    created(){
      let that = this;
      console.log(localStorage.lang)
      that.selectValue = localStorage.lang == undefined?'cn':localStorage.lang
    }
}
</script>


<style lang="less" scoped>
 .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  #home{
    height:100%;
  }
  /deep/ .el-container is-vertical{
    height:100%;
  }
  .el-header {
    background-color: #fff;
    color: #333;
    padding-left: 0px;
    border-bottom: 1px solid #ccc;
    display: flex;
  }
  
  /deep/ .el-aside {
    color: #333;
  }
  #title{
    height:60px;
    line-height: 60px;
    text-align: center;
    color: #079787;
    font-weight: bold;
    background-color: #FFEB3A;
    overflow: hidden;
  }
  #title img{
    vertical-align: middle;
    height:30px;
    width:30px;
    margin-right: 15px;
    margin-left: 15px;
    border-radius: 50%;
    box-shadow: #079787 1px 1px 5px 5px;
  }
  /deep/ .el-tabs.el-tabs--card.el-tabs--top{
    height:50px;
    width:90%;
  }
  /deep/ .el-tabs__header.is-top{
    border-bottom: 0px;
  }
 /deep/ .el-menu{
   border-right: 0px
 }
/deep/ .el-menu--collapse.el-menu{
  overflow: hidden;
  
}
/deep/ .el-menu--collapse>.el-menu-item [class^=el-icon-], .el-menu--collapse>.el-submenu>.el-submenu__title [class^=el-icon-]{
  margin-right: .5%;
}
#changeTab{
height:60px;
width:30px;
background:#008181;
flex:none;
text-align: center;
font-size: 15px;
color: #fff;
line-height: 60px;
margin-right: 2%;
}
/deep/ .el-tabs__item.is-top.is-active.is-closable{
  border-bottom: 3px solid skyblue;
}
/deep/ .el-menu-item.is-active{
  position: relative;
   background-color: #434A50 !important;
  color:yellow;
}
/deep/ .el-menu-item.is-active i{ //菜单栏箭头
  position: absolute;
  right:0px;
  top: 20px;
  width: 0px;
  height: 0px;
  border: 8px solid transparent;
  border-right: 8px solid white;
}
/deep/ .el-avatar.el-avatar--circle{
  vertical-align: middle;
  margin-left: 1%;
}
/deep/ .el-tabs--card>.el-tabs__header .el-tabs__item.is-closable:first-of-type .el-icon-close{
   display: none;
}
/deep/ .el-tabs__nav-scroll{
  margin-top: 20px;
}
/deep/ .el-tabs__nav-next{
  margin-top: 20px;
}
/deep/ .el-tabs__nav-prev{
  margin-top: 20px;
}
@media screen and (max-width: 1360px) {
  /deep/ .el-tabs.el-tabs--card.el-tabs--top{
      width:75%;
  }
}
@media screen and (max-width: 1025px) {
  /deep/ .el-tabs.el-tabs--card.el-tabs--top{
      width:70%;
  }
}
@media screen and (max-width: 825px) {
  /deep/ .el-tabs.el-tabs--card.el-tabs--top{
      width:70%;
  }
}
@media screen and (max-width: 763px) {
/deep/ .el-tabs.el-tabs--card.el-tabs--top{
      width:65%;
  }
}
@media screen and (max-width: 684px) {
/deep/ .el-tabs.el-tabs--card.el-tabs--top{
      width:60%;
  }
}
@media screen and (max-width: 630px) {
/deep/ .el-tabs.el-tabs--card.el-tabs--top{
      width:55%;
  }
}
@media screen and (max-width: 578px) {
/deep/ .el-tabs.el-tabs--card.el-tabs--top{
      width:50%;
  }
}
@media screen and (max-width: 540px) {
/deep/ .el-tabs.el-tabs--card.el-tabs--top{
      width:45%;
  }
}
</style>

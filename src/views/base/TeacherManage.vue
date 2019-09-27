/**
   * 用户管理页面
*/
<template>
<!-- mian主容器 -->
  <div id="mian">
    <!-- 导航面包屑 top容器-->
    <div id="top">
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>基本类型</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    </div>
    <div id="middle">
      <!-- 弹框 -->
        <el-button type="text"
        class="el-icon-circle-plus-outline" 
         @click="callAdd">&nbsp;新增用户</el-button>
         <!-- 头部的过滤监听 -->
        <el-radio-group v-model="radio" style="margin-left: 20px;">
            <el-radio :label="0">全部</el-radio>
            <el-radio 
                v-for="(item,index) in tableDatb"
                :key="index"
                :label="index+1"
            >{{item.userTypeTypeName}}</el-radio>
          </el-radio-group>
        <!-- //弹出框 -->
        <div id="middle-top">
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="25%"
      >
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="80px"
        >
          <el-form-item label="用户名称" prop="className">
            <el-input v-model="ruleForm.className"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="userMobile">
            <el-input v-model="ruleForm.userMobile"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="userPassword">
            <el-input v-model="ruleForm.userPassword"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio v-model="ruleForm.userSex" :label="1">男</el-radio>
            <el-radio v-model="ruleForm.userSex" :label="2">女</el-radio>
          </el-form-item>
          <el-form-item label="角色" prop="giveTeacher">
            <el-select v-model="ruleForm.giveTeacher"
             :placeholder="myTeacher">
              <el-option
                v-for="item in tableDatb"
                :key="item.userTypeId"
                :label="item.userTypeTypeName"
                :value="item.userTypeId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer" align="center">
          <el-button @click="closePop">取 消</el-button>
          <el-button type="primary" @click="addClass" 
          v-if="addEnsure==true">添 加</el-button>
          <el-button type="primary" @click="updataClass" 
          v-if="addEnsure==!true">确 定</el-button>
        </span>
      </el-dialog>
        </div>
    </div>
    <!-- //渲染页面 -->
    <div id="bottom">
  <el-table
    :data="tableData"
    style="width: 100%">
    <el-table-column label="#" type="index"></el-table-column>
    <el-table-column label="用户名称" prop="userName"></el-table-column>
    <el-table-column label="手机号" prop="userMobile"> </el-table-column>
    <el-table-column label="密码" prop="userPassword"> </el-table-column>
    <el-table-column label="性别" prop="userSex"></el-table-column>
    <el-table-column label="角色名称" prop="userTypeTypeName"></el-table-column>
    <el-table-column prop="userId" label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="addUpdata(scope.$index,scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          :disabled="scope.row.disableDelete"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  </div>
</div>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [],//接收所有老师信息
        tableDatatow:[],//接收用来二次赋值
        tableDatb: [],//接收所有角色的信息
        userSex:1,//弹框按钮值
        radio: 0,//导航绑定值
        //默认值
        myTeacher:"请选择",
        addEnsure:true,//新增确定
        dialogVisible:false,//弹出框不显示
        dialogTitle:"",//弹出款默认的值
        stuId:0,//用来接收班级
        ruleForm:{
          className:"",//用户名
          userMobile:"",//手机号
          userPassword:"",//密码
          userSex:"",//性别
          giveTeacher:"",//角色
          userUid:""//用来接收userUid唯一标识符
        },
        rules:{
          clsaaName:[
               { required: true, message: "请输入班级名称", trigger: "blur" }
          ],
          giveTeacher:[
              {required:true,message: "请选择老师",trigger:"change"}
          ]
        }
      };
    },
    watch: {
        radio(pares){
          var _this = this;
          // console.log(_this.tableData)
          if(pares == 0){
            _this.tableData = _this.tableDatatow;
          }
          // console.log(pares)
          for(var i =1; i <=_this.tableDatb.length ; i++){
              if(pares == i){
                  _this.tableData = _this.tableDatatow.filter((item,index)=>{
                    // console.log(item)
                    return item.userTypeTypeName == _this.tableDatb[i -1 ].userTypeTypeName
                  })
              }
          }
       }
    },
    methods: {
      //关闭弹窗
      closePop(){
        this.dialogVisible = false;
      },
      addUpdata(index,row){
        var _this = this;
        _this.addEnsure = false;
        _this.dialogTitle = "修用户信息";
        _this.stuId = row.userId;//赋值
        _this.ruleForm.className =row.userName;//用户
        _this.ruleForm.userMobile =row.userMobile;//手机
        _this.ruleForm.userPassword =row.userPassword;//密码
        _this.ruleForm.userSex = row.userSex == "男" ? 1: 2;//性别
        _this.ruleForm.giveTeacher =row.userUserTypeId;//角色
        _this.ruleForm.userUid = row.userUid;
        _this.myTeacher = row.userName;
        _this.dialogShow();
      },
      //修改
      updataClass(){
        var _this = this;
        // console.log(_this.ruleForm.giveTeacher)
        // console.log(_this.ruleForm.userUid)
        _this.ruleForm.userSexs = _this.ruleForm.userSex == 1 ? "男" : "女"
        _this.axios.post("/api/User/ModifyTeacher",{
          userUid:_this.ruleForm.userUid,
          userName:_this.ruleForm.className,
          userMobile:_this.ruleForm.userMobile,
          userSex:_this.ruleForm.userSexs,
          userUserTypeId:_this.ruleForm.giveTeacher,
          userPassword:_this.ruleForm.userPassword
        }).then(res => {
           _this.$message({
          message: '修改成功',
          type: 'success'
        });
         _this.dialogVisible = false;
         _this.apply();
      });
      },
      callAdd(){
        var _this = this;
        _this.dialogTitle = "新增用户信息";
        _this.ruleForm.className = "";
        _this.addEnsure = true;
        _this.myTeacher = "请选择";
        _this.dialogShow();
      },
      //弹出修改框
      dialogShow(){
        this.dialogVisible =true;
      },
      //新增用户
      addClass(){
        var _this = this;
        _this.ruleForm.userSexs = _this.ruleForm.userSex == 1 ? "男" : "女"
        // console.log(_this.ruleForm.giveTeacher)
        _this.axios.post("/api/User/AddTeacher",{
          userName:_this.ruleForm.className,
          userMobile:_this.ruleForm.userMobile,
          userSex:_this.ruleForm.userSexs,
          userPassword:_this.ruleForm.userPassword,
          userUserTypeId:_this.ruleForm.giveTeacher
        }).then(res => {
          _this.dialogVisible = false;
          _this.apply();
          _this.$message({
            message:'添加成功',
            type: 'success'
          });
        });
      },
      //删除
    handleDelete(index,row){
      var _this = this;
            _this.$confirm('此操作将永久删除该班级, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                //发送请求
                _this.axios.post("/api/User/RemoveTeacher?uid="+row.userUid).then(res => {
                  _this.$message({
                    message: '删除成功',
                    type: 'success'
                  });
                  _this.apply();
                });
              }).catch(() => {
                _this.$message({
                  type: 'info',
                  message: '已取消删除'
                });          
              });
    },
    //获取接口的值赋值给tableData
    apply(){
          var _this = this
          _this.axios.get("/api/User/GetTeachers").then(function(data){
            _this.tableData=data.data
            _this.tableDatatow=data.data
            // console.log(data.data)
        })
        _this.axios.get("/api/UserType/GetUserRoles").then(function(data){
             _this.tableDatb=data.data
            // console.log(data.data)
        })
    }
    },
    //渲染后调用apply
    created(){
       this.apply()
    }
  }
</script>
<style lang="less" scoped>
/deep/.el-dialog__footer{text-align: center;}
/deep/.el-dialog__header{text-align: center;}
</style>

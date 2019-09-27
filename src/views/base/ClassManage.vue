/**
   * 班级管理页面
*/
<template>
    <!-- 大容器 -->
  <div id="mian">
    <!-- 导航面包屑 -->
    <div id="top">
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>基本类型</el-breadcrumb-item>
    <el-breadcrumb-item>班级管理</el-breadcrumb-item>
    </el-breadcrumb>
    </div>
    <!-- 弹框 -->
    <div id="middle">
        <el-button type="text"
         @click="callAdd">&nbsp;新增班级</el-button>
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
          <el-form-item label="班级名称" prop="className">
            <el-input v-model="ruleForm.className"></el-input>
          </el-form-item>

          <el-form-item label="专业课程" prop="majorCoures">
            <el-select v-model="ruleForm.majorCoures"
             :placeholder="myCourse">
              <el-option
                v-for="(item,index) in tableDatc"
                :key="index"
                :label="item.courseName"
                :value="item.courseId"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="授课老师" prop="giveTeacher">
            <el-select v-model="ruleForm.giveTeacher"
             :placeholder="myTeacher">
              <el-option
                v-for="(item,index) in tableDatb"
                :key="index"
                :label="item.userName"
                :value="item.userId"
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
        <el-table-column label="班级名称" prop="className"></el-table-column>
        <el-table-column label="授课老师" prop="userName"> </el-table-column>
        <el-table-column label="专业" prop="courseName"> </el-table-column>
        <el-table-column label="班级人数" prop="classStudents"></el-table-column>
        <el-table-column label="开班日期" prop="classCreateTime"></el-table-column>
        <el-table-column prop="classId" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="addUpdata(scope.$index,scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              :disabled="scope.row.classStudents > 0 ? true : false"
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
        tableData: [],//接收班级信息
        tableDatb: [],//接收老师的信息
        tableDatc:[],//接收课程的信息
        //默认值
        myCourse:"请选择课程",//课程的默认值
        myTeacher:"请选择老师",//老师的默认值
        addEnsure:true,//新增确定
        dialogVisible:false,//弹出框不显示
        dialogTitle:"",//接收弹出款导航的默认值
        stuId:0,//用来接收班级
        //设了一个方法来接受值
        ruleForm:{
          className:"",//班级
          majorCoures:"",//专业
          giveTeacher:""//老师
        },
        //设了一个方法来赋值给选拉框
        rules:{
          clsaaName:[
               { required: true, message: "请输入班级名称", trigger: "blur" }
          ],
          majorCoures:[
              {required: true,message: "请选择课程",trigger:"change"}
          ],
          giveTeacher:[
              {required:true,message: "请选择老师",trigger:"change"}
          ]
        }
      };
    },
    methods: {
      /**
       * 关闭取消弹窗
      */
      closePop(){
        this.dialogVisible = false;
      },
      /**
       * 编辑
       * @param {Number} index 下标
       * @param {Object} row  当前行的所有数据
      */
      addUpdata(index,row){
        var _this = this;
        _this.addEnsure = false;//增加窗口关闭
        _this.dialogTitle = "修改班级信息";//赋值给导航窗口
        _this.stuId = row.classId;//接收到的班级名称赋值
        _this.ruleForm.className =row.className;//接收到的班级赋值
        _this.myCourse = row.courseName;//接收到的专业赋值
        _this.myTeacher = row.userName;//接收到的授课老师
        _this.dialogShow();//弹框
      },
      /**
       * 修改
       * @param {Number} index 下标
       * @param {Object} row  当前行的所有数据
      */
      updataClass(index,row){
        var _this = this;
        _this.axios.post("/api/Class/ModifyClass",{
          classId:_this.stuId,//传送班级名称
          className:_this.ruleForm.className,//传送班级
          classCourseId:_this.ruleForm.majorCoures,//传送专业
          classTeacherId:_this.ruleForm.giveTeacher//传送老师名称
        }).then(res => {//发送接口成功后返回
           _this.$message({
          message: '修改成功',
          type: 'success'
        });
         _this.dialogVisible = false;//成功之后把弹窗关闭
         _this.apply();
      });
      },
       /**
       * 新增班级
      */
      callAdd(){
        var _this = this;
        _this.dialogTitle = "新增班级";//赋值给导航窗口
        _this.ruleForm.className = "";//新增班级设置为空
        _this.addEnsure = true;//增加窗口打开
        _this.myCourse = "请选择课程";//课程选拉框第一行显示默认值
        _this.myTeacher = "请选择老师";//老师选拉框第一行显示默认值
        _this.dialogShow();//弹框
      },
      //弹出修改框
      dialogShow(){
        this.dialogVisible =true;
      },
      /**
       * 新增添加班级
      */
      addClass(){
        var _this = this;
        _this.axios.post("/api/Class/AddClass",{
          className:_this.ruleForm.className,
          classCourseId:_this.ruleForm.majorCoures,
          classTeacherId:_this.ruleForm.giveTeacher
        }).then(res => {
          _this.dialogVisible = false;
          _this.apply();
          _this.$message({
            message:'添加成功',
            type: 'success'
          });
        });
      },
      /**
       * 删除
       * @param {Number} index 下标
       * @param {Object} row  当前行的所有数据
      */
    handleDelete(index,row){
      var _this = this;
            _this.$confirm('此操作将永久删除该班级, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                //发送请求
                _this.axios.get("/api/Class/RemoveClass?classId="+row.classId).then(res => {
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
    }
    ,
     /**
       * 获取接口的值赋值给tableData
       * 获取接口的值赋值给tableDatb
       * 获取接口的值赋值给tableDatc
      */
    apply(){
          var _this = this
          _this.axios.get("/api/Class/GetAllClass").then(function(data){
            _this.tableData=data.data
            // console.log(data.data)
        })
        _this.axios.get("/api/Class/GetAllCourse").then(function(data){
             _this.tableDatc=data.data
        })
        _this.axios.get("/api/User/GetTeachers").then(function(data){
             _this.tableDatb=data.data
            // console.log(data.data)
        })
    }
    },
      /**
       * 渲染后调用apply
      */
    created(){
       this.apply()
    }
  }
</script>
<style lang="less" scoped>
/deep/.el-dialog__footer{text-align: center;}
/deep/.el-dialog__header{text-align: center;}
</style>

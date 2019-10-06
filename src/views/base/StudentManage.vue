<!--
   学生管理页面
-->
<template>
  <div id="StudentManage">
    <!-- 面包屑导航 -->
    <div style="height:30px; line-height:30px;">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础数据</el-breadcrumb-item>
      <el-breadcrumb-item>学生管理</el-breadcrumb-item>
    </el-breadcrumb>
    </div>
    <!-- 卡片容器 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <template>
          <!-- 外层下拉框 -->
          <el-select v-model="outerClassId" filterable placeholder="请选择班级" @change="optionsClass(outerClassId)">
            <el-option
              v-for="item in getAllClass"
              :key="item.classId"
              :label="item.className"
              :value="item.classId"
            ></el-option>
          </el-select>

          <el-button
            type="primary"
            @click="centerDialogVisible = true,title=true"
            icon="el-icon-circle-plus-outline"
            style="margin-left:20px;"
          >
            <!-- 新增学员信息，点击事件中用逗号分隔，可以填写多个值，第一个为显示弹框，第二个为标题，可以做为请求接口的判断条件 -->
            <b style="margin-left:5px;">新增学生</b>
          </el-button>
          <!-- (新增 与 编辑)弹框 -->
          <div>
            <el-dialog
              :title="title?'新增学员':'编辑学员信息'"
              :visible.sync="centerDialogVisible"
              width="30%"
              center
            >
              <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="100px"
                class="demo-ruleForm"
              >
                <el-form-item label="班级" required>
                  <el-select v-model="innerClassId" placeholder="请选择班级" @change="options(innerClassId)">
                    <!-- 获取班级列表 -->
                    <el-option
                      v-for="item in getAllClass"
                      :key="item.classId"
                      :label="item.className"
                      :value="item.classId"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="学生姓名" prop="stuName" required>
                  <el-input v-model="ruleForm.stuName"></el-input>
                </el-form-item>

                <el-form-item label="生日" required>
                  <el-form-item prop="stuBirthDay">
                    <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.stuBirthDay"></el-date-picker>
                  </el-form-item>
                </el-form-item>

                <el-form-item label="手机号" prop="stuMobile" required>
                  <el-input v-model="ruleForm.stuMobile"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="stuSex" required>
                  <el-radio-group v-model="ruleForm.stuSex">
                    <el-radio label="男">男</el-radio>
                    <el-radio label="女">女</el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-form-item label="密码" prop="stuPassword" required>
                  <el-input placeholder="请输入密码" v-model="ruleForm.stuPassword" show-password></el-input>
                </el-form-item>
              </el-form>

              <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('ruleForm')">重置</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
              </span>
            </el-dialog>
          </div>
        </template>
      </div>
      <div>
        <el-table :data="getClassAllInfo | capitalize " style="width: 100%;">
          <el-table-column label="#" prop="index" type="index"></el-table-column>
          <el-table-column label="班级名称" prop="className"></el-table-column>
          <el-table-column label="学生姓名" prop="stuName"></el-table-column>
          <el-table-column label="性别" prop="stuSex"></el-table-column>
          <el-table-column label="手机号" prop="stuMobile"></el-table-column>
          <el-table-column label="出生日期" prop="stuBirthDay"></el-table-column>
          <el-table-column label="年龄" prop="stuAge"></el-table-column>
          <el-table-column label="操作" prop="operation">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row),centerDialogVisible = true"
              >编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <!-- 卡片容器==================== -->
  </div>
</template>


<script>
export default {
  name: "studentManage",
  data() {
    return {
      getAllClass: [],            // 获取所有班级信息编号
      outerClassId: "",          // 当前外层下拉菜单的班级编号
      getClassAllInfo: [],        // 当前班级所有信息
      centerDialogVisible: false, // 编辑框显示隐藏
      title: true,                // 弹框标题
      innerClassId: "",           // 编辑弹框中的班级编号
      index: "",                  // 当前行的下标
      ruleForm: {                 // 表单所有数据
        classId: "",              // 班级标号
        className: "",            // 班级名称
        stuAge: "",               // 学生年龄
        stuBirthDay: "",          // 学生出生日期
        stuMobile: "",            // 学生手机号
        stuName: "",              // 学生名字
        stuPassword: "",          // 密码
        stuSex: '男',             // 学生性别
        stuUid: ""                // 学生ID
      },
      // (新增 编辑)弹框验证
      rules: {
        value: [{ required: true, message: "请选择班级", trigger: "blur" }],
        stuName: [
          { required: true, message: "请输入学生姓名", trigger: "blur" }
        ],

        birthday: [
          {
            type: "date",
            required: true,
            message: "请选择出生日期",
            trigger: "change"
          }
        ],
        phone: [
          { required: true, message: "请正确输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "长度为11位数字字符", trigger: "blur" }
        ],
        stuSex: [{ required: true, message: "请选择性别", trigger: "change" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "长度 最小6位 最大18位 数字字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  /**
   * @property  created {Vue 钩子函数 创建后} 请求所有班级的编号，并保存到 data 中
  */
  created() {
    let _this = this;
    _this.axios.get("/api/Class/GetAllClass").then(response => {
      _this.getAllClass = response.data;
      _this.outerClassId = _this.getAllClass[0].classId;
    }) ;
  },
  watch:{
    outerClassId(classId){
      this.optionsClass(classId)
    }
  },
  filters:{
    capitalize:function(value){
      for (let i = 0; i < value.length; i++) {
            value[i].stuBirthDay = new Date(
              value[i].stuBirthDay
            ).toLocaleDateString();
          }
          return value
    }
  },
  
  methods: {
  /**
   * 删除事件 {@link 点击删除当前行数据,并使用数组方法[splice]对数组进行截取删除,同时实现实时刷新}
   * @param {Number} index -当前行的索引
   * @param {Object} row -当前行的所有数据
   */
    handleDelete(index, row) {
      let _this = this;
      _this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios
            .get("/api/Student/RemoveStudent?Uid=" + row.stuUid)
            .then(res => {
              // console.log(res.data);
              if (res.data.code == 1) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                _this.getClassAllInfo.splice(index, 1); // 删除当前学生信息后更新当前班级的所有信息
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    
    /**
     * 外层下拉菜单 {@link 获取外层的下拉框当前的索引，并渲染对应索引的班级数据}     
     * @param  {Number} classId         - 当前外层的班级索引
     * @param  {Number} innerClassId    - 保存当前外层的班级索引，给内层编辑弹框中的下拉框获取，为了同步显示，给内层下拉框设置默认值，避免编辑弹框的出现空下拉框
    */
    optionsClass(classId) {
      let _this = this;
      _this.innerClassId = classId;
      _this.axios
        .get("/api/Student/GetClassStudent?classId=" + classId)
        .then(response => {
          _this.getClassAllInfo = response.data;
        });
    },
    /**
     * 弹框下拉框
     * @param {Number} id {@link 模态框下拉菜单当前的索引}
     */
    options(id) { 
      let _this = this;
      if(_this.outerClassId==""){
        _this.outerClassId = _this.innerClassId;
      }
    },
    // 编辑
    /**
     * @param {object} row {@link 初始化编辑弹框,将row当前行的所有数据赋值给编辑弹框}
     * 
     * @param {Number} index {@link 将（index）当前行的下标保存到data,用来做修改数据后的前端同步更新DOM的操作}
     */ 
    handleEdit(index, row) {
       let _this = this;
      _this.index = index;
      _this.title = false;
      _this.ruleForm = row;
    },

    /**
     * 模态框提交 {@link 用来获取新增与编辑的数据}
     * @param {object} formName {@link 表示表单组件名}
     */
    submitForm(formName) {
      let _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          //验证通过才会进行数据请求，注意参数格式，要转化时间的格式
          _this.centerDialogVisible = false; // 隐藏新增编辑弹框
          /**
           * 利用绑定的title的Boolean值来作为请求接口地址的判断条件
           * @param {Boolean} title true为新增，false为编辑
           */
          if (_this.title) {
              _this.axios({
              url: "/api/Student/AddStudent",
              method: "post",
              data: {
                stuName: _this.ruleForm.stuName, //学生姓名
                stuClassId: _this.innerClassId, //班级编号
                stuBirthDay: _this.ruleForm.stuBirthDay, //生日
                stuMobile: _this.ruleForm.stuMobile, //手机号
                stuPassword: _this.ruleForm.stuPassword, //登录密码,
                stuSex: _this.ruleForm.stuSex
              }
            })
              .then(res => {
                if(res.data.code == 1){
                /**
                  *  使用数组更新的方法来代替请求后台接口实现实时刷新
                  *  将请求接口后返回的数据添加到数组
                  */ 
                  _this.outerClassId = _this.innerClassId;
                  _this.getClassAllInfo.unshift(res.data.data);
                  _this.$message({
                  message: "恭喜你，修改成功",
                  type: "success"
                  })
                }else {
                  _this.$message({
                  message: "修改失败",
                  type: "warning"
                });
                }
              })
              .catch(error => console.log(error));
              return
          } else {

            
            _this.axios({
              url: "/api/Student/ModifyStudent",
              method: "post",
              data: {
                stuUid: _this.ruleForm.stuUid, // 学生Id
                stuName: _this.ruleForm.stuName, //学生姓名
                stuClassId: _this.innerClassId, //班级编号
                stuBirthDay: _this.ruleForm.stuBirthDay, //生日
                stuMobile: _this.ruleForm.stuMobile, //手机号
                stuPassword: _this.ruleForm.stuPassword, //登录密码,
                stuSex: _this.ruleForm.stuSex //性别
              }
            }).then(res => {
              if (res.data.code == 1) {
                _this.ruleForm.stuAge = res.data.data; //将返回的年龄赋值给表单中的stuAge
                _this.getClassAllInfo.splice(_this.index, 1, _this.ruleForm);
                _this.$message({
                  message: "恭喜你，修改成功",
                  type: "success"
                });
              } else {
                _this.$message({
                  message: "修改失败",
                  type: "warning"
                });
              }
            });
          }
        }
      });
    },
    // 重置按钮
    resetForm(formName) {
      let _this = this;
      _this.$refs[formName].resetFields();
    }
  }
  
};
</script>


<style lang="less" scoped>
// 卡片容器样式
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 100%;
  height: 100%;
}
// 卡片 ======

// 下拉菜单样式
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
// 下拉菜单
</style>
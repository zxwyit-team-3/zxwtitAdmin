<template>
  <div id="PaperInformation">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="试卷名称" prop="testName" >
        <el-input v-model="ruleForm.testName" placeholder="请输入试卷名称"></el-input>
      </el-form-item>
      <el-form-item label="课程名称" prop="courseName">
        <el-select v-model="ruleForm.courseName" placeholder="请选择课程" @change="getCourserId(ruleForm.courseName)">
          <el-option v-for="item in courseArr" :label="item.courseName" :value="item.courseName" :key="item.courseId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="text-align:center;">
        <el-button type="primary" @click="submitForm('ruleForm')">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
export default {
    /**
     * @param {ruleForm.testName}  试卷名称
     * @param {active}}  当前步骤
     * @param {ruleForm.courseName}  课程名称
     * @param {rules}  正则表达式验证
     * @param {courseArr} 所有课程数组
     * @param {courseId} 课程id
     */
  name: "PaperInformation",
   data() {
      return {
        active:1,
        ruleForm: {       
          testName: '',  //试卷名称
          courseName: '',//选中课程名称
        },
        rules: {  
          testName: [ //试卷输入框验证
            { required: true, message: '请输入试卷名称', trigger: 'blur' },
          ],
          courseName: [ //课程输入框验证
            { required: true, message: '请选择课程', trigger: 'change' }
          ],
        },
        courseArr:[], //所有课程数组
        courseId:"" //课程id
      };
    },
    methods: {
      /**
       * @param{submitForm} 表单提交方法
       * @param{getCourse} 获取课程方法
       * @param{getCourserId} 获取课程id方法
       */
      submitForm(formName) {  //表单提交
      var _this = this
        _this.$refs[formName].validate((valid) => {
          if (valid) {
              //制作试卷
              _this.axios.post('/api/TestPaper/MakeTestPaper?uid='+sessionStorage.getItem("userId"),
              {
                "tpTitle":_this.ruleForm.testName,
                "tpCourseId":_this.courseId
              })
              .then((res) => {
                console.log(res)
                 _this.$store.state.ShortAnswerNum = 0
                 _this.$store.state.MultipleChoiceNum = 0
                 _this.$store.state.FillInTheBlanksNum = 0
                _this.$store.state.allTestNum = 0
                _this.$store.testPaperId = res.data.data.testPaperId //试卷id存储到状态管理
                _this.$store.state.testPaperName = _this.ruleForm.testName
                _this.$store.state.courseId = _this.courseId
                console.log(_this.$store.state.testPaperName )
              })
              .catch((error) => {
                console.log(error)
              })
              _this.$emit('activeNum',_this.active)  //给父组件发送步骤条的值。
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      getCourse(){    //获取课程方法
             var _this = this
             _this.axios.get("/api/Class/GetAllCourse")
            .then((res) => {
                 _this.courseArr = res.data
            }).catch((error) => {
                console.log(error)
            })
      },
      getCourserId(cName){ //获取课程id方法
        if(cName == "Web前端开发"){
            this.courseId = 1
            // _this.$store.courserName = 'Web前端开发'
        }else if(cName == ".NET后台开发"){
            this.courseId = 2
            // this.$store.courserName = '.NET后台开发'
        }else{
            this.courseId = 3
            //  this.$store.courserName = '软件测试'
        }
      }
    },
    created(){
        var _this = this
        _this.getCourse()    //创建前获取课程
    }
};
</script>


<style lang="less" scoped>
@FromWidth:70%; //表单宽度
#PaperInformation{
    width: @FromWidth;
    margin: 0px auto;
}
/deep/ .el-form-item__label{
    float: none;
}
/deep/ .el-select{
    width: 100%;
}
/deep/ .el-form-item__label{
    margin-left: 100px;
}
</style>
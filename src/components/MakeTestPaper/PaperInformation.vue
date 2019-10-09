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
        <el-select v-model="ruleForm.courseName" placeholder="请选择课程">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
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
     * @param {testName}  试卷名称
     * @param {active}}  当前步骤
     * @param {courseName}  课程名称
     * @param {rules}  正则表达式验证
     */
  name: "PaperInformation",
   data() {
      return {
        active:1,
        ruleForm: {       
          testName: '',  //试卷名称
          courseName: '',//课程名称
        },
        rules: {  
          testName: [ //试卷输入框验证
            { required: true, message: '请输入试卷名称', trigger: 'blur' },
          ],
          courseName: [ //课程输入框验证
            { required: true, message: '请选择课程', trigger: 'change' }
          ],
        }
      };
    },
    methods: {
      submitForm(formName) {  //表单提交
        this.$refs[formName].validate((valid) => {
          if (valid) {
              this.$emit('activeNum',this.active)  //给父组件发送步骤条的值。
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
                 console.log(res)
            }).catch((error) => {
                console.log(error)
            })
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
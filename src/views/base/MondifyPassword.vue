<!--
   个人密码修改页面
-->
<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i class="el-icon-edit"></i>
        <span>修改密码</span>
      </div>
      <el-form
        :model="ruleForm2"
        status-icon
        :rules="rules2"
        ref="ruleForm2"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="* 旧密码" prop="password">
          <el-input type="password" v-model="ruleForm2.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="* 新密码" prop="pass">
          <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="* 确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
          <el-button @click="resetForm('ruleForm2')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    //旧密码
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入旧密码"));
      } else {
        if (this.ruleForm2.checkPass !== "") {
          this.$refs.ruleForm2.validateField("checkPass");
        }
        callback();
      }
    };
    //新密码
    var validatePass1 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else {
        if (this.ruleForm2.checkPass !== "") {
          this.$refs.ruleForm2.validateField("checkPass");
        }
        callback();
      }
    };
    //确认密码
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm2: {
        password: "", //旧密码
        pass: "", //新密码
        checkPass: "" //确认密码
      },
      rules2: {
        password: [
          { validator: validatePass, trigger: "blur" } //旧密码
        ],
        pass: [
          { validator: validatePass1, trigger: "blur" } //新密码
        ],
        checkPass: [
          { validator: validatePass2, trigger: "blur" } //确认密码
        ]
      }
    };
  },
  methods: {
    submitForm() {
      var _then = this;
      this.axios
        .get(
          "/api/User/ModifyPassword?uid=" +
            sessionStorage.Uid +
            "&oldPassword=" +
            _then.ruleForm2.password +
            "&newPassword=" +
            _then.ruleForm2.pass
        )
        .then(function(res) {
          console.log(res);
          if (res.data.code == 1) {
            _then.$message({
              type: "success",
              message: "修改成功"
            });
          } else if (res.data.code == -3) {
            _then.$message.error("旧密码错误");
          } else if (res.data.code == 0) {
            _then.$message.error("密码没有变化");
          } else {
            _then.$message.error("修改错误");
          }
        });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
</style>
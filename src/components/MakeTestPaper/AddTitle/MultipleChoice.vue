<template>
  <div id="MultipleChoice">
    <el-form
      :model="dynamicValidateForm"
      ref="dynamicValidateForm"
      label-width="100px"
      class="demo-dynamic"
    >
      <el-form-item
        prop="email"
        label="题干"
        :rules="[
      { required: true, message: '请输入题干', trigger: 'blur' },
    ]"
    
      >
        <el-input style="width:100%;" rows="1" v-model="dynamicValidateForm.email" type="textarea"></el-input>
      </el-form-item>
      <el-form-item
        v-for="(domain, index) in dynamicValidateForm.domains"
        :key="domain.key"
        :prop="'domains.' + index + '.value'"
        :rules="{
      required: true, message: '选项不能为空', trigger: 'blur'
    }"
      >
        <el-checkbox v-model="domain.cqIsRight">{{options[index] }}</el-checkbox>  <!--  增加多选 -->
        <el-input v-model="domain.value"></el-input>
        <el-button type="danger" icon="el-icon-delete" @click.prevent="removeDomain(domain)" size="small" circle></el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
        <el-button @click="addDomain">新增选项</el-button>
        <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
export default {
  name: "MultipleChoice",
  data() {
    return {
      options:["A、","B、","C、","D、","E、","F、"],
      dynamicValidateForm: {
        domains: [
          {
            value: "",
            cqIsRight:false
          }
        ],
        email: "",
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1);
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        value: "",
        cqIsRight:false
      });
    }
  }
};
</script>


<style lang="less" scoped>
/deep/ .el-input{
    width: 88%;
    margin-right: 2%;
    
}
/deep/ .el-input input{
height:33px;
}

</style>
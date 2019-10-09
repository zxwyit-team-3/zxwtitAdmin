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
        :prop="'domains.' + index + '.cqOption'"
        :rules="{
      required: true, message: '选项不能为空', trigger: 'blur'
    }"
      >
        <el-checkbox v-model="domain.cqIsRight">{{options[index] }}</el-checkbox>
        <!--  增加多选 -->
        <el-input v-model="domain.cqOption"></el-input>
        <el-button
          type="danger"
          icon="el-icon-delete"
          @click.prevent="removeDomain(domain)"
          size="small"
          circle
        ></el-button>
      </el-form-item>
      <el-form-item label="分值" id="MultipleChoiceNum">
        <el-input-number size="mini" v-model="MultipleChoiceNum"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('dynamicValidateForm')" round>重置</el-button>
        <el-button @click="addDomain" round type="info">新增选项</el-button>
        <el-button
          type="primary"
          @click="submitForm('dynamicValidateForm')"
          icon="el-icon-folder-checked"
          round
        >保存题目</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
export default {
  name: "MultipleChoice",
  data() {
    return {
      /**
       * @param {options} 选项数组
       * @param {dynamicValidateForm.domains} 每个选项内容以及是否选中
       * @param {dynamicValidateForm.email} 题干
       * @param {MultipleChoiceNum}
       */
      options: ["A、", "B、", "C、", "D、", "E、", "F、"], //选项数组
      MultipleChoiceNum: 2, //选择题分数
      dynamicValidateForm: {
        domains: [
          {
            cqOption: "",   //参考答案
            cqIsRight: false //多选是否选中
          },
          {
            cqOption: "",
            cqIsRight: false
          },
          {
            cqOption: "",
            cqIsRight: false
          },
          {
            cqOption: "",
            cqIsRight: false
          }
        ],
        email: ""  //题干
      }
    };
  },
  methods: {
    /**
     * @param{submitForm} 表单提交
     * @param{resetForm} 表单重置
     * @param {removeDomain} 删除选项
     * @param {addDomain} 增加选项
     * @param {saveMultipleChoice} 保存题目
     */
    submitForm(formName) { //提交表单内容
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.saveMultipleChoice()
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) { //重置表单内容
      this.$refs[formName].resetFields();
    },
    removeDomain(item) {
      if (this.dynamicValidateForm.domains.length <= 2) {//删除选项控制在两个
        return;
      }
      var index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1);
      }
    },
    addDomain() {
      if (this.dynamicValidateForm.domains.length == 6) {//添加选项控制在六个
        return;
      }
      this.dynamicValidateForm.domains.push({
        cqOption: "",
        cqIsRight: false
      });
    },
    saveMultipleChoice() {//保存题目
      var _this = this;
      _this.axios.post("/api/TestPaper/AddQuestionToTestPaper", {
        tpqPaperId: _this.$store.testPaperId, //试卷主键编号
        tpqScore: _this.MultipleChoiceNum, //分值
        tpqQuestion: {
          questionTitle: _this.dynamicValidateForm.email, //题目的标题
          questionTypeId: 1, //题目的类型 1=选择题 2=填空题 3=问答题
          chooseQuestion: _this.dynamicValidateForm.domains
        }
      })
      .then((res) => {
        _this.$emit('MultipleChoiceInfo',res.data.data)  //添加成功给父组件发送题目信息
        _this.$store.state.MultipleChoiceNum+=_this.MultipleChoiceNum
         _this.$store.state.allTestNum+=_this.MultipleChoiceNum
      })
      .catch((error) => {
        console.log(error)
      })
    }
  }
};
</script>


<style lang="less" scoped>
/deep/ .el-input {
  width: 86%;
  margin-right: 2%;
}
/deep/ .el-input input {
  height: 33px;
}
/deep/ .el-form-item__content:nth-child(1) {
  margin-left: 50px !important;
}
/deep/ .el-input-number__decrease {
  width: 27px;
  height: 31px;
}
/deep/ .el-input-number__increase {
  width: 27px;
  height: 31px;
}
/deep/ #MultipleChoiceNum .el-input__inner {
  width: 130px;
}

/deep/ .el-form-item__error {
  margin-left: 50px;
}
/deep/ .el-form-item__error:nth-child(2) {
  margin-left: 0px !important;
}
</style>
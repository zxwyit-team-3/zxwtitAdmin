<template>
<!-- 简答题子组件 -->
  <div>
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="题干" prop="pass">
        <el-input type="textarea" rows="1" v-model="ruleForm.pass" autocomplete="off"></el-input>
      </el-form-item>


      <el-form-item label="参考答案" prop="checkPass">
        <!-- <el-input type="textarea" rows="1" v-model="ruleForm.checkPass" autocomplete="off"> -->
          <!-- <template> -->
    <div class="edit_container">
        <quill-editor 
            v-model="ruleForm.checkPass" 
            autocomplete="off"
            ref="myQuillEditor" 
            :options="editorOption" 
            @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
            @change="onEditorChange($event)">
        </quill-editor>
    </div>
<!-- </template> -->
        <!-- </el-input> -->
      </el-form-item>
      <el-form-item label="分值">
        <el-input-number size="small" v-model="ShortAnswerNum"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('ruleForm')" round>重置</el-button>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
          icon="el-icon-folder-checked"
          round
        >新增题目</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
import { quillEditor } from "vue-quill-editor"; //调用编辑器
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

export default {
  name: "ShortAnswer",
  components: {
        quillEditor //注册富文本插件
    },
  data() {
    /**
     * @param {validatePass} 验证题目方法
     * @param {validatePass2} 验证参考答案方法
     */
    var validatePass = (rule, value, callback) => {
      //验证题目
      if (value === "") {
        callback(new Error("请输入题干"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      //验证参考答案
      if (value === "") {
        callback(new Error("请输入参考答案"));
      } else {
        callback();
      }
    };
    return {
      /**
       * @param {ruleForm.pass} 题目
       * @param {ruleForm.checkPass} 参考答案
       * @param {rules.pass} 题目验证规则
       * @param {rules.checkPass} 参考答案验证规则
       * @param {ShortAnswerNum} 简答题分值
       */
      ruleForm: {
        pass: "", //题目
        checkPass: "" //参考答案
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }], //题目验证规则
        checkPass: [{ validator: validatePass2, trigger: "blur" }] //参考答案验证规则
      },
      ShortAnswerNum: 5, //简答题分值
      // 富文本
      // content: `<p><input placeholder='请输入内容' /></p>`,
      editorOption: {} //富文本编辑选项
    };
  },
  methods: {
    /**
     * 富文本
     */
    onEditorReady(editor) { // 准备编辑器
 
    },
    onEditorBlur(){}, // 失去焦点事件
    onEditorFocus(){}, // 获得焦点事件
    onEditorChange(){
      console.log(this.ruleForm.checkPass)
    }, // 内容改变事件

    /**
     * @param {submitForm} 保存题目
     * @param {resetForm} 重置题目
     */
    submitForm(formName) {
      //保存题目方法
      this.$refs[formName].validate(valid => {
        if (valid) {
         this.saveShortAnswer()
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      //重置题目方法
      this.$refs[formName].resetFields();
    },
    saveShortAnswer() {
      var _this = this;
      _this.axios.post("/api/TestPaper/AddQuestionToTestPaper", {
        tpqPaperId:sessionStorage.getItem("testPaperId"), //试卷主键编号
        tpqScore: _this.ShortAnswerNum, //分值
        tpqQuestion: {
          questionTitle: _this.ruleForm.pass, //题目的标题
          questionTypeId: 3, //题目的类型 1=选择题 2=填空题 3=问答题
          answerQuestion: {
            aqAnswer: _this.ruleForm.checkPass //问答题的答案
          }
        }
      })
      .then((res) => {
        _this.$emit('ShortAnswerInfo',res.data.data)
         _this.$store.state.ShortAnswerNum+=_this.ShortAnswerNum
         _this.$store.state.allTestNum+=_this.ShortAnswerNum
         _this.$message({
                message: '保存成功',
                type: 'success'
              });
         _this.ruleForm.pass = ""
         _this.ruleForm.checkPass = ""
        // console.log(res.data.data)
      })
      .catch((error) => {
        console.log(error)
      })
    },
    
  },
  mounted () {
    var editor = new E('#editor')
    editor.customConfig.uploadImgShowBase64 = true
    editor.customConfig.onchange = (html) => {
      console.log(html)
       this.ruleForm.checkPass = html  //获取文本编译框内的html赋值
    }
  },
  computed: {
        editor() {
            return this.$refs.myQuillEditor.quill;
        },
    }
};
</script>


<style lang="less" scoped>
</style>
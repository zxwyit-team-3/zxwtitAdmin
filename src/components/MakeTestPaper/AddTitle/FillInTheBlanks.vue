<template>
  <div>
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
        <el-button @click="addDomain" size="small" round icon="el-icon-folder-add">插入提空</el-button>
        <el-input v-model="FillInTheBlanks" id="contentFour" rows="1" type="textarea" ></el-input>
      </el-form-item>
      <el-form-item
        class="domain"
        v-for="(domain, index) in dynamicValidateForm.domains"
        :key="domain.key"
        :prop="'domains.' + index + '.value'"
      >
         <el-badge :value="index+1" class="item" style="float:left;">
         </el-badge>
         <el-input v-model="domain.fqAnswer" class="text" ></el-input>
         <el-input-number size="small" v-model="domain.fillQuestionScore[0].fqsScore"></el-input-number>
      </el-form-item>
      <el-form-item
       label="题目预览">
         <div v-html="TopicPreview" ></div>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('dynamicValidateForm')" round size="small">重置</el-button>
        <el-button type="primary" @click="submitForm('dynamicValidateForm')" icon="el-icon-folder-add"  round size="small">新增题目</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
export default {
  name: "FillInTheBlanks",
   data() {
      return {
        dynamicValidateForm: {
          domains: [],
          email: ''
        },
        TopicPreview:"",
        sum:1
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
              this.setFillInTheBlanks()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      removeDomain(item) {
        var index = this.dynamicValidateForm.domains.indexOf(item)
        if (index !== -1) {
          this.dynamicValidateForm.domains.splice(index, 1)
        }
      },
      addDomain() {
        
        var sum = this.dynamicValidateForm.domains.length+1
         var content = document.getElementById("contentFour")
         var index = content.selectionStart//获取光标
         var strArr =this.dynamicValidateForm.email.split("")
         strArr.splice(content.selectionStart, 0, "▂")
         this.dynamicValidateForm.email = strArr.join("")
        this.dynamicValidateForm.domains.push({
           fqOrder: this.sum,
            fqAnswer:"",
            fillQuestionScore:[
              {
                fqsScore:2
              }
            ]
         
        });
        this.sum+=1
      },
      setFillInTheBlanks(){
        var _this = this
        var sunNum = 0
        for (let i = 0; i < _this.dynamicValidateForm.domains.length; i++) {
              sunNum += _this.dynamicValidateForm.domains[i].fillQuestionScore[0].fqsScore
          
        }
        // console.log(_this.dynamicValidateForm.domains)
        _this.axios.post('/api/TestPaper/AddQuestionToTestPaper',{
          "tpqPaperId": _this.$store.testPaperId,//试卷的编号
            "tpqScore":sunNum, //题目的分值
            "tpqQuestion": {
            "questionTitle": _this.dynamicValidateForm.email,//填空题的标题
            "questionTypeId": 3,//题目类型 1=选择题 2=填空题 3=问题
            "fillQuestion": _this.dynamicValidateForm.domains
            }
        })
        .then((res) => {
          _this.$emit('FillInTheBlanksInfo',res.data.data)
           _this.$store.state.FillInTheBlanksNum+=sunNum
             _this.$store.state.allTestNum+=sunNum
          console.log(res)
        })
        .catch((error) => {
          console.log(error)
        })
        this.sum = 0
      }
    },
    computed:{
      FillInTheBlanks:{
        get:function(){
          return this.dynamicValidateForm.email
        },
        set:function(val){
            this.dynamicValidateForm.email = val
        }
      }
    },
    watch:{
      FillInTheBlanks:function(val){
        this.TopicPreview = val
        var strArr = this.TopicPreview.split("▂") 
        this.dynamicValidateForm.domains.splice(strArr.length-1,1)   //删除
        var indexs = []
        this.TopicPreview = this.TopicPreview.replace(/▂/gim,"<input class='showAnswer' value=''  disabled style='border:0px;border-bottom:1px solid #ccc;text-align:center;'/>("+this.dynamicValidateForm.domains[0].fillQuestionScore[0].fqsScore+"分)" )
        var inputs = document.getElementsByClassName('showAnswer')
        for (let index = 0; index < inputs.length; index++) {
          // console.log()
          inputs[index] = this.dynamicValidateForm.domains[index].value
          
          // = index
          
        }
      }
    }
};
</script>


<style lang="less" scoped>
/deep/ .el-form-item__content .text.el-input{
    width: 70% !important;
    float:left;
    margin-left: 3%;
    margin-right: 2%;
    
}
/deep/ .el-form-item__content .text.el-input .el-input__inner:nth-child(1){
    border: 0px;
    border-bottom: 1px solid #DCDFE6;
    border-radius: 0px;
}
/deep/ .el-form-item__content:nth-child(2){
  margin-left: 100px !important;
}
/deep/ .el-form-item__content{
  margin-left: 50px !important;
}
/deep/ .el-input input{
height:33px;
}
/deep/ .domain .el-form-item__error{
    margin-left: 50px;
}
/deep/ .showAnswer:disabled{
  background-color: white;
}

</style>
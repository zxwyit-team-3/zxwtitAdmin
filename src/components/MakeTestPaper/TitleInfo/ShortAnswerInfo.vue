<template>
    <div id="ShortAnswerInfo">
    <el-form
      v-for="(item,index) in msg"
      :key="item.tpqId"
      status-icon
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item  :label="index+1+'、'">
        <el-input type="textarea" rows="1" v-model="item.tpqQuestion.questionTitle" :disabled = "isDisabled!=index" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" size="small">参考答案</el-button>
        <el-input type="textarea" rows="1" v-model="item.tpqQuestion.answerQuestion.aqAnswer" :disabled = "isDisabled!=index" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="分值">
        <el-input-number size="small" v-model="item.tpqScore" :disabled = "isDisabled!=index"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="setShortAnswerInfo(index)"  plain round >编辑</el-button>
        <el-button  round v-if="isDisabled==index" @click="cancelShortAnswerInfo()">取消</el-button>
        <el-button type="primary" plain round v-if="isDisabled==index" @click="saveShortAnswerInfo(index)">保存修改</el-button>
        <el-button type="danger" plain round v-if="isDisabled==index" @click="removeShortAnswerInfo(index)">删除题目</el-button>
      </el-form-item>
    </el-form>
    </div>
</template>

<script>
export default {
    name:"ShortAnswerInfo",
    data(){
        return {
            isDisabled:9999
        }
    },
    props:{
        msg:String
    },
    methods:{
      setShortAnswerInfo(i){
          this.isDisabled = i
      },
      cancelShortAnswerInfo(){
          this.isDisabled = 9999
      },
      saveShortAnswerInfo(i){
        console.log(this.msg[i])
          var _this = this
          _this.axios.post('/api/TestPaper/ModifyQuestion?paperQuestionId='+_this.$store.testPaperId,{
              "questionId":_this.msg[i].tpqQuestion.questionId,
              "questionTitle": _this.msg[i].tpqQuestion.questionTitle,
              "questionTypeId": 3,
              "answerQuestion": {
              "aqAnswer": _this.msg[i].tpqQuestion.answerQuestion.aqAnswer
              } 
          })
          .then((res) => {
             if(res.data.code == 1){
                _this.$message({
                message: '修改成功',
                type: 'success'
              });
             }
             let Mnum =_this.msg[i].tpqScore-_this.$store.state.ShortAnswerNum
               _this.$store.state.ShortAnswerNum+=Mnum
             _this.$store.state.allTestNum+=Mnum
             this.isDisabled = 9999
          })
          .catch((error) => {
              _this.$message.error('修改失败')
          })
      },
      removeShortAnswerInfo(i){
        var _this = this
          console.log(_this.msg)
          _this.axios.post("/api/TestPaper/RemoveQuestionFromTestPaper?paperQuestionId="+_this.msg[i].tpqId)
          .then((res) => {
             if(res.data.code == 1){
                _this.$message({
                message: '删除成功',
                type: 'success'
              });
             }
          _this.$store.state.ShortAnswerNum-=_this.msg[i].tpqScore
         _this.$store.state.allTestNum-=_this.msg[i].tpqScore
             this.isDisabled = 99999
            this.msg.splice(i,1)
          })
          .catch((error) => {
            _this.$message.error('删除失败')
             console.log(error)
          })
      }
    }
}
</script>

<style scoped>

</style>

<template>
    <div id="FillInTheBlanksInfo">
       <el-form v-for="(item,index) in msg" :key="item.tpqPaperId">
      <el-form-item
        label="题干"
      >
        <el-button @click="addDomain" :disabled = "isDisabled!=index" size="small" round icon="el-icon-folder-add">插入提空</el-button>
        <el-input v-model="item.tpqQuestion.questionTitle" :disabled = "isDisabled!=index" id="contentFour" rows="1" type="textarea" ></el-input>
      </el-form-item>
      <el-form-item
        class="domain"
        v-for="(domain, index) in item.tpqQuestion.fillQuestion"
        :key="domain.fqId"
      >
         <el-badge :value="index+1" class="item" style="float:left;">
         </el-badge>
         <el-input v-model="domain.fqAnswer" :disabled = "isDisabled!=index" class="text" ></el-input>
         <el-input-number :disabled = "isDisabled!=index" size="small" v-model="domain.fillQuestionScore[0].fqsScore"></el-input-number>
      </el-form-item>
      <el-form-item
       label="题目预览">
         <div class="txt" v-html="item.tpqQuestion.questionTitle"></div>
      </el-form-item>
      <el-form-item>
       <el-button type="primary" @click="setFillInTheBlanksInfo(index)"  plain round >编辑</el-button>
        <el-button  round v-if="isDisabled==index"  @click="cancelFillInTheBlanksInfo()">取消</el-button>
        <el-button type="primary" plain round v-if="isDisabled==index" @click="saveFillInTheBlanksInfo(index,item)">保存修改</el-button>
        <el-button type="danger" plain round v-if="isDisabled==index" @click="removeFillInTheBlanksInfo(index)">删除题目</el-button>
      </el-form-item>
    </el-form>
    </div>
</template>

<script>
import { get } from 'http'
export default {
    name:"FillInTheBlanksInfo",
    data(){
        return {
            allData:"",
            TopicPreview:123,
            isDisabled:9999
        }
    },
    props:{
        msg:String
    },
    methods:{
        setFillInTheBlanksInfo(i){
            this.isDisabled = i
        },
        cancelFillInTheBlanksInfo(){
            this.isDisabled = 9999
        },
        saveFillInTheBlanksInfo(i,item){
            var _this = this
            _this.axios.post('/api/TestPaper/ModifyQuestion?paperQuestionId='+_this.msg[i].tpqId,{
                  "questionId": 232,
                  "questionTitle": item.tpqQuestion.questionTitle,
                  "questionTypeId": 2,
                  "fillQuestion": item.tpqQuestion.fillQuestion
            })
            .then((res) => {
              console.log(res)
               _this.$message({
                message: '修改成功',
                type: 'success'
              });
            })
            .catch((error) => {
              console.log(error)
              _this.$message.error('修改失败')
            })
        },
        removeFillInTheBlanksInfo(i){
            var _this = this
            _this.axios('/api/TestPaper/RemoveQuestionFromTestPaper?paperQuestionId='+_this.msg[i].tpqId)
            .then((res) => {
             if(res.data.code == 1){
                _this.$message({
                message: '删除成功',
                type: 'success'
              });
             }
            _this.$store.state.FillInTheBlanksNum-=_this.msg[i].tpqScore
          _this.$store.state.allTestNum-=_this.msg[i].tpqScore
              this.isDisabled = 99999
              this.msg.splice(i,1)
            })
            .catch((error) => {
              _this.$message.error('删除失败')
              console.log(error)
            })
        }
    },
    created(){
      // console.log(this.msg)
    }
}
</script>

<style lang="less" scoped>
/deep/ .el-form-item__content .text.el-input{
    width: 70% !important;
    float:left;
    margin-left: 3%;
    margin-right: 2%;
    
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

<template>
    <div id="MultipleChoiceInfo">
    <el-form  v-for="(item,index) in newData"  label-width="100px" class="demo-dynamic" :key="item.tpqId">
            <el-form-item
                :label="index+1+'、'"
            >
                <el-input v-model="item.tpqQuestion.questionTitle"  style="width:100%;" rows="1"  type="textarea" :disabled = "isDisabled!=index"></el-input>
            </el-form-item>
            <el-form-item v-for="(value,i) in item.tpqQuestion.chooseQuestion" :key="value.cqId">
                <el-checkbox v-model="value.cqIsRight" :disabled = "isDisabled!=index">{{options[i] }}</el-checkbox>
                <el-input v-model="value.cqOption" :disabled = "isDisabled!=index"></el-input>
                <el-button
                type="danger"
                icon="el-icon-delete"
                @click.prevent="removeDomain(index,i)"
                size="small"
                circle
                :disabled = "isDisabled!=index"
                ></el-button>
            </el-form-item>
            <el-form-item label="分值" class="MultipleChoiceNum" >
                <el-input-number size="mini" :disabled = "isDisabled!=index" v-model="item.tpqScore"></el-input-number>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" plain round @click="setMultipleChoiceInfo(index,item)">编辑</el-button>
                <el-button  round v-if="isDisabled==index" @click="cancelMultipleChoiceInfo(index)">取消</el-button>
                <el-button @click="addDomain(index)" round v-if="isDisabled==index">新增选项</el-button>
                <el-button type="primary" plain round @click="submitForm(index)" v-if="isDisabled==index">保存修改</el-button>
                <el-button type="danger" @click="removeMultipleChoiceInfo(index)" plain round v-if="isDisabled==index">删除题目</el-button>
            </el-form-item>
    </el-form>
    </div>
</template>

<script>
export default {
    name:"MultipleChoiceInfo",
    data(){
         return {
        options: ["A、", "B、", "C、", "D、", "E、", "F、"], //选项数组
        isDisabled:9999,
        oldData:[],
        newData:[]
      };
    },
    props:{
        msg:String
    },
    methods: {
       setMultipleChoiceInfo(i,item){
         var old = JSON.stringify(item)
          this.oldData = old
          this.isDisabled = i
       },
       cancelMultipleChoiceInfo(i){
         var old = JSON.parse(this.oldData)
         this.msg[i] = old
         this.newData[i] = old
        //  console.log()
            this.isDisabled = 99999
       },
      submitForm(i) {
        var _this = this
        _this.axios.post('/api/TestPaper/ModifyQuestion?paperQuestionId='+_this.$store.testPaperId,{
        "questionId":_this.msg[i].tpqQuestion.questionId,
        "questionTitle": _this.msg[i].tpqQuestion.questionTitle,
        "questionTypeId": 1,
        "chooseQuestion": _this.msg[i].tpqQuestion.chooseQuestion
        })
        .then((res) => {
           if(res.data.code == 1){
                _this.$message({
                message: '修改成功',
                type: 'success'
              });
            
             }
                let Mnum =_this.msg[i].tpqScore-_this.$store.state.MultipleChoiceNum
               _this.$store.state.MultipleChoiceNum+=Mnum
             _this.$store.state.allTestNum+=Mnum
             
        })
        .catch((error) => {
           _this.$message.error('修改失败')
          console.log(error)
        })
      //  console.log(this.msg)
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      removeDomain(i,cindex) {
          if (this.msg[i].tpqQuestion.chooseQuestion.length <= 2) {//添加选项控制在六个
            return;
            }
            this.msg[i].tpqQuestion.chooseQuestion.splice(cindex,1)
      },
      addDomain(i) {
        if (this.msg[i].tpqQuestion.chooseQuestion.length == 6) {//添加选项控制在六个
        return;
        }
        this.msg[i].tpqQuestion.chooseQuestion.push({
          cqOption: '',
          cqIsRight:false,
          key: Date.now()
        });
      },
      removeMultipleChoiceInfo(i){
          var _this = this
          console.log(_this.msg)
          _this.axios.post("/api/TestPaper/RemoveQuestionFromTestPaper?paperQuestionId="+_this.msg[i].tpqId)
          .then((res) => {
             if(res.data.code == 1){
                _this.$message({
                message: '删除成功',
                type: 'success'
              });
              _this.$store.state.MultipleChoiceNum-=_this.msg[i].tpqScore
             _this.$store.state.allTestNum-=_this.msg[i].tpqScore
              this.isDisabled = 99999
             }
            this.msg.splice(i,1)
          })
          .catch((error) => {
            _this.$message.error('删除失败')
             console.log(error)
          })
          
        
      },
    },
    created(){
        this.newData = this.msg
    }

}
</script>

<style lang="less" scoped>
/deep/ .el-input {
  width: 86%;
  margin-right: 2%;
}
/deep/ .el-input input {
  height: 33px;
}

/deep/ .el-input-number__decrease {
  width: 27px;
  height: 31px;
}
/deep/ .el-input-number__increase {
  width: 27px;
  height: 31px;
}
/deep/ .MultipleChoiceNum .el-input__inner {
  width: 130px;
}
/deep/ .el-form-item__label{
    padding-right: 25px;
}


</style>
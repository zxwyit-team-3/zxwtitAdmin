<template>
    <div id="TestPaperParticulars">
             <div style="text-align:center;margin-bottom:30px;"><b>{{TestPaperName}}</b></div>
        <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
        label="科目"
        align="center">
        <span>{{courseName}}</span>
        </el-table-column>
        <el-table-column
        label="选择题"
        align="center">
        <span class="numStyle">{{this.$store.state.MultipleChoiceNum}}'</span>
        </el-table-column>
        <el-table-column
        label="填空题"
        align="center">
        <span class="numStyle">{{this.$store.state.FillInTheBlanksNum}}'</span>
        </el-table-column>
        <el-table-column
        label="问答题"
        align="center">
        <span class="numStyle">{{this.$store.state.ShortAnswerNum}}'</span>
        </el-table-column>
        <el-table-column
        label="总分"
        align="center">
        <span class="numStyle">{{this.$store.state.allTestNum}}'</span>
        </el-table-column>
    </el-table>
        <AddTitle :info="allTestNumInfo"/>
    </div>
</template>

<script>

import AddTitle from '../../components/MakeTestPaper/AddTitle'
import ProductionCompleted from '../../components/MakeTestPaper/ProductionCompleted'
export default {
    data(){
        return {
             tableData:[{}],
            TestPaperName:"",
            TestPaperId:"",
            courseName:"",
            allTestNumInfo:0
        }
    },
    created() {
    this.getRouterData()
    this.getTestPeparInfo()
    },
    methods: {
    getRouterData() {
      this.TestPaperName = this.$route.params.TestPaperName
      this.TestPaperId = this.$route.params.TestPaperId
      this.courseName = this.$route.params.courseName
      this.allTestNumInfo = this.$route.params.allTestInfo
        
    },
    getTestPeparInfo(){
        this.$store.state.allTestNum = 0
        if(this.allTestNumInfo.length == 1){
            this.$store.state.MultipleChoiceNum = this.allTestNumInfo[0].tpqScore
            this.$store.state.ShortAnswerNum = 0
             this.$store.state.FillInTheBlanksNum  = 0
        }else if(this.allTestNumInfo.length == 2){
             this.$store.state.MultipleChoiceNum = this.allTestNumInfo[0].tpqScore
             this.$store.state.FillInTheBlanksNum = this.allTestNumInfo[1].tpqScore
             this.$store.state.ShortAnswerNum = 0
        }else if(this.allTestNumInfo.length == 3){
            this.$store.state.MultipleChoiceNum = this.allTestNumInfo[0].tpqScore
             this.$store.state.ShortAnswerNum = this.allTestNumInfo[2].tpqScore
             this.$store.state.FillInTheBlanksNum = this.allTestNumInfo[1].tpqScore
        } 
        for (let i = 0; i < this.allTestNumInfo.length; i++) {
            this.$store.state.allTestNum+=this.allTestNumInfo[i].tpqScore
        }

       
    }

  },
  components:{
      AddTitle,
      ProductionCompleted
  },
}
</script>


<style lang="less" scoped>
.numStyle{
    display: inline-block;
    width: 20px;
    height: 20px;
    background-color: #F56C6C;
    border-radius: 50%;
    color:white;
    text-align: center;
}
</style>
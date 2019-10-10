<template>
    <div>
        <div style="text-align:center;margin-bottom:30px;"><b>{{this.$store.state.testPaperName}}</b></div>
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
     <div style="border:1px solid  #EBEEF5;border-top:0px;margin:0px auto;text-align:center;padding:1%;">
                 <el-button type="primary" @click="prve">上一步</el-button>
     </div>
    </div>
</template>


<script>
    export default {
        name:"ProductionCompleted",
       data() {
      return {
        tableData:[{}],
        active:1,
        courseName:""
      }
    },
    methods:{
        prve(){
            this.$emit('activeNum',this.active)
        },
        getCourseName(){
                if(this.$store.state.courseId ==1){
                    this.courseName = "WEB前端开发"
                }else if(this.$store.state.courseId ==2){
                    this.courseName = ".NET后台开发"
                }else{
                    this.courseName = "软件测试"
                }
                console.log(this.courseName)
        }
    },
    created(){
        this.getCourseName()
    }
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

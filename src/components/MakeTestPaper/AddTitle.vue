<template>
  <div id="AddTitle">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
          <span id="titleType" >题目类型</span>
          <el-radio v-model="radio" label='1'>选择题</el-radio>
          <el-radio v-model="radio" label='2'>填空题</el-radio>
          <el-radio v-model="radio" label='3'>问答题</el-radio>
          <el-button type="primary" id="completeTestBtn">完成制卷</el-button>
      </div>
      <MultipleChoice v-if="radio == '1'" />
      <FillInTheBlanks v-if="radio == '2'" />
      <ShortAnswer v-if="radio == '3'" />
    </el-card>
  </div>
</template>


<script>
/**
 * @param {FillInTheBlanks} 填空题
 * @param {MultipleChoice} 选择题
 * @param {ShortAnswer} 简答题
 * @param {radio} 题目类型选择单选按钮
 */
import FillInTheBlanks from "../../components/MakeTestPaper/AddTitle/FillInTheBlanks";
import MultipleChoice from "../../components/MakeTestPaper/AddTitle/MultipleChoice";
import ShortAnswer from "../../components/MakeTestPaper/AddTitle/ShortAnswer";
export default {
  name: "AddTitle",
  data() {
    return {
        radio: '1'  //题目类型选择单选按钮
    };
  },
  components: {
    FillInTheBlanks,
    MultipleChoice,
    ShortAnswer
  },
  computed:{
      
  }
};
</script>


<style lang="less" scoped>
#titleType{
margin-right:15px;
font-size:13px;
}
#completeTestBtn{
float:right;
margin-top:-10px;
}
</style>
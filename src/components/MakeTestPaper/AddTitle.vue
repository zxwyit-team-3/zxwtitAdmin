<template>
  <div id="AddTitle">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span id="titleType">题目类型</span>
        <el-radio
          v-for="item in questionType"
          :key="item.typeId"
          v-model="radio"
          :label="item.typeId"
        >{{item.typeName}}</el-radio>
        <el-button type="primary" id="completeTestBtn" @click="testInfo">{{$t('message.MackTestPaper.completion')}}</el-button>
      </div>
      <MultipleChoice v-if="radio == '1'" @MultipleChoiceInfo="getMultipleChoiceInfo" />
      <FillInTheBlanks v-if="radio == '2'" @FillInTheBlanksInfo="getFillInTheBlanksInfo" />
      <ShortAnswer v-if="radio == '3'" @ShortAnswerInfo="getShortAnswerInfo"/>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>
          一、选择题（本题共0道小题，共
          <el-badge :value="this.$store.state.MultipleChoiceNum+'/'+this.$store.state.allTestNum" :max="100" class="item"></el-badge>分）
        </span>
      </div>
      <MultipleChoiceInfo :msg="MultipleChoicesInfo"/>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>
          二、填空题（本题共0道小题，共
          <el-badge :value="this.$store.state.FillInTheBlanksNum+'/'+this.$store.state.allTestNum" :max="100" class="item"></el-badge>分）
        </span>
      </div>
      <FillInTheBlanksInfo :msg="FillInTheBlanksInfo"/>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>
          三、问答题（本题共0道小题，共
          <el-badge :value="this.$store.state.ShortAnswerNum+'/'+this.$store.state.allTestNum" :max="100" class="item"></el-badge>分）
        </span>
      </div>
      <ShortAnswerInfo :msg="ShortAnswersInfo"/>
    </el-card>
  </div>
</template>


<script>
/**
 * @param {FillInTheBlanks} 填空题组件
 * @param {MultipleChoice} 选择题组件
 * @param {ShortAnswer} 简答题组件
 * @param {FillInTheBlanksInfo} 填空题信息组件
 * @param {MultipleChoiceInfo} 选择题信息组件
 * @param {ShortAnswerInfo} 简答题信息组件
 * @param {radio} 题目类型选择单选按钮
 * @param {questionType} 题目类型数组
 * @param {MultipleChoicesInfo} 选择题信息数组
 */
import FillInTheBlanks from "../../components/MakeTestPaper/AddTitle/FillInTheBlanks";
import MultipleChoice from "../../components/MakeTestPaper/AddTitle/MultipleChoice";
import ShortAnswer from "../../components/MakeTestPaper/AddTitle/ShortAnswer";
import MultipleChoiceInfo from '../../components/MakeTestPaper/TitleInfo/MultipleChoiceInfo'  
import ShortAnswerInfo from '../../components/MakeTestPaper/TitleInfo/ShortAnswerInfo'
import FillInTheBlanksInfo from '../../components/MakeTestPaper/TitleInfo/FillInTheBlanksInfo'
export default {
  name: "AddTitle",
  data() {
    return {
      radio: 1, //题目类型选择单选按钮
      questionType: "", //题目类型数组
      MultipleChoicesInfo: [], //选择题信息数组
      ShortAnswersInfo:[],
      FillInTheBlanksInfo:[],
      active:2
    };
  },
  props:{
      info:String
  },
  components: {
    FillInTheBlanks, //填空题
    MultipleChoice, //选择题
    ShortAnswer, //问答题
    MultipleChoiceInfo,   //选择题信息组件
    ShortAnswerInfo,    //简答题信息组件
    FillInTheBlanksInfo //填空题信息组件
  },
  created() {
    var _this = this;
    _this.getAllType();
    this.MultipleChoicesInfo.push(this.info[0])
    this.FillInTheBlanksInfo.push(this.info[1])
    this.ShortAnswersInfo.push(this.info[2])
    console.log(this.info)
  },
  computed: {},
  methods: {
    getAllType() {
      //获取题目类型方法
      var _this = this;
      _this.axios
        .get("/api/TestPaper/GetQuestionType")
        .then(res => {
          _this.questionType = res.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    getMultipleChoiceInfo(info) {
      //接收选择题组件获取选择题信息
      this.MultipleChoicesInfo.push(info);
      console.log(this.MultipleChoicesInfo)
    },
    getShortAnswerInfo(info){
      this.ShortAnswersInfo.push(info)
      console.log( this.ShortAnswersInfo)
    },
    getFillInTheBlanksInfo(info){
        this.FillInTheBlanksInfo.push(info)
    },
    testInfo(){
      this.$emit('activeNum',this.active)
    }
  }
};
</script>


<style lang="less" scoped>
#titleType {
  margin-right: 15px;
  font-size: 13px;
}
#completeTestBtn {
  float: right;
  margin-top: -10px;
}
.box-card {
  margin-top: 30px;
}

</style>
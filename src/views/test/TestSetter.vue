<template>
  <div id="mian">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>测试任务列表</span>
      </div>
      <!-- //渲染页面 -->
      <div id="bottom" v-if="hidden">
        <el-table :data="tableDatb" style="width: 100%">
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="试卷名" prop="taskTestPaperId"></el-table-column>
          <el-table-column label="班级" prop="className"></el-table-column>
          <el-table-column label="出卷人" prop="userName"></el-table-column>
          <el-table-column label="测试开始时间" prop="taskStartTime"></el-table-column>
          <el-table-column label="测试结束时间" prop="taskEndTime"></el-table-column>
          <el-table-column label="耗时（分钟）" prop="taskEscapeTime"></el-table-column>
          <el-table-column label="交卷人数" prop="counter"></el-table-column>
          <el-table-column prop="classId" label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="addUpdata(scope.$index,scope.row)"
                :disabled="scope.row.counter<=0"
                type="primary"
              >批阅试卷</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageIndex1"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="items"
          ></el-pagination>
        </div>
      </div>
    </el-card>

    <el-card class="box-card" v-if="hidden==!true">
      <!-- 批阅试卷 -->
      <div slot="header" class="clearfix">
        <table border="1" cellspacing="0" width="100%">
          <tr v-for="(item,index) in tableDatbNow" :key="index">
            <th width="100px" style="padding:10px 0px 10px 0px;">
              <el-tag :type="item.thStyle">{{item.title}}</el-tag>
            </th>
            <td style="padding-left:15px">
              <el-button
                round
                :type="item.sdStyle"
                v-for="(name,i) in item.name"
                :key="i"
                @click="studentEame(name.testUid)"
              >{{name.stuName}}</el-button>
            </td>
          </tr>
        </table>
      </div>
      <!-- 获取学员考试是否批阅结束 -->
      <!-- 个人考试信息 -->
      <div v-if="personalesTpaper">
        <h3 class="title" v-for="title in tableDatb1" :key="title.id">{{title.tpTitle}}</h3>
        <el-table :data="tableDatb1" border style="width:100%">
          <el-table-column label="姓名" prop="stuName"></el-table-column>
          <el-table-column label="班级" prop="className"></el-table-column>
          <el-table-column label="交卷" prop="testSubmitTime"></el-table-column>
          <el-table-column label="选择得分">{{choseQuestionsdata[1]}}</el-table-column>
          <el-table-column label="填空题得分" prop="fillQuestion"></el-table-column>
          <el-table-column label="问答题得分" prop="answer"></el-table-column>
          <el-table-column label="成绩" prop="testScore"></el-table-column>
        </el-table>
        <!-- 获取选择题 -->
        <!-- 选择题 -->
        <el-card class="box-card examination-questions">
          <div
            slot="header"
            class="clearfix"
          >选择题(本大题共{{choseQuestions.length}}道，共{{choseQuestionsdata[0]}}分,得分{{choseQuestionsdata[1]}})</div>
          <div v-for="(o,index) in choseQuestions" :key="o.id" class="item.id">
            <div class="opyty">{{index+1}}.{{o.questionTitle}}</div>
            <ul>
              <li v-for="(item,index) in o.choseQuestions.questions" :key="item.id">
                {{result[index]}}.{{item.cqOption}}
                <i class="el-icon-success" v-if="item.cqIsRight"></i>
              </li>
            </ul>
            <div class="answer">
              <el-tag type="info">{{o.choseQuestions | formatId}}</el-tag>
              <el-tag type="danger">得分</el-tag>
              <span class="score">{{o.score}}</span>
            </div>
          </div>
        </el-card>
        <!-- 填空题 -->
        <el-card class="box-card examination-questions">
          <div
            slot="header"
            class="clearfix"
          >填空题(本大题共{{reversedMessage[0]}}道,共{{reversedMessage[1]}}分,得分{{reversedMessage[2]}})</div>
          <div
            v-for="(o,i) in reversedMessage[3]"
            :key="i"
            class="text item fillQuestion-result"
          >
            <div class="opyty">
              {{i+1}}
              <span v-html="o"></span>
            </div>
            <el-tag type="warning">学生答案</el-tag>
            <ul>
              <li v-for="(item,index) in fillQuestion[i].fillQuestion.myFill" :key="item.id">
                空{{index+1}}
                <i
                  style="display: inline-block;padding: 0px 20px 0px 20px; border-bottom:1px solid red;text-align: center;"
                >{{item.fillAnswer}}</i>
                <el-tag type="danger">得分</el-tag>
                <el-input-number
                  v-model="item.fillScore"
                  controls-position="right"
                  :step="fillQuestion[i].fillQuestion.questions[index].socre"
                  :min="0"
                  :max="fillQuestion[i].fillQuestion.questions[index].socre"
                ></el-input-number>
              </li>
            </ul>
          </div>
        </el-card>
        <!-- 问答题 -->
        <el-card class="box-card examination-questions">
          <div
            slot="header"
            class="clearfix"
          >问答题（本大题共{{answerData[0]}}道，共{{answerData[1]}}分，得分{{answerData[2]}}）</div>
          <div v-for="(o,i) in answer" :key="o.id" class="text item fillQuestion-result">
            <div class="opyty">{{i+1}}.{{o.questionTitle}}({{o.testPaperScore}}分)</div>
            <el-row>
              <el-col :span="24">
                <div class="grid-content bg-purple">
                  <h4>学生答案</h4>
                  <span>{{o.myAnswer}}</span>
                </div>
              </el-col>
            </el-row>
            <el-tag type="danger">得分</el-tag>
            <el-input-number
              v-model="o.score"
              controls-position="right"
              :step="o.testPaperScore"
              :min="0"
              :max="o.testPaperScore"
            ></el-input-number>
            <el-row>
              <el-col :span="24">
                <div class="grid-content bg-purple">
                  <h4>参考答案</h4>
                  <span>{{o.answer}}</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <!-- 是否保存批阅 -->
        <div class="preserve">
          <el-tag type="info">
            学生成绩
            <span>{{studentachievementchange}}</span>分
          </el-tag>
          <el-button type="primary" @click="onSubmit">保存阅卷</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableDatb: [], //获取所有试卷信息
      //获取已批阅和未批阅信息
      tableDatbNow: [
        {
          title: "未阅读", //未批阅
          thStyle: "info", //标题的样式
          sdStyle: "", //学员名单的样式
          name: [] //学员的名称
        },
        {
          title: "已阅读",
          thStyle: "success",
          sdStyle: "success",
          name: []
        }
      ],
      pageIndex1: 1, //默认当前页面第一条
      pageSize: 10, //默认初始化为10条数据
      items: 0, //获取总共多少条数据
      hidden: true, //判断是所以试卷详情隐藏显示
      tableDatb1: [], //获取个人考试信息
      fillQuestion: [], //批阅填空
      choseQuestions: [], //批阅选择题
      answer: [], //批阅问答题
      result: ["A", "B", "C", "D", "E", "F"], //选择的答案
      totalPoints: [], //获取填空题的和问答题的分数和id
      personalesTpaper: false //学生考试详情隐藏显示
    };
  },
  methods: {
    /**
     * apply获取所有试卷信息
     */
    apply() {
      var _this = this;
      _this.axios
        .get(
          "/api/TestPaper/GetTestTask?pageIndex=" +
            _this.pageIndex1 +
            "&pageSize=" +
            _this.pageSize
        )
        .then(function(data) {
          _this.tableDatb = data.data.data;
          _this.items = data.data.items;
        });
    },
    /**
     * 设置当前分页数
     * @param val {string}当前分页数
     */
    handleSizeChange(val) {
      this.pageSize = val;
      this.apply();
    },
    /**
     * 设置当前数据
     * @param val {string}当前分页每页多少条数据
     */
    handleCurrentChange(val) {
      this.pageIndex1 = val;
      this.apply();
    },
    /**
     * 获取指定的考试信息
     * @param index {Number}下标
     * @param row {object}获取试卷的信息
     */
    addUpdata(index, row) {
      var _this = this;
      _this.hidden = false;
      _this.axios
        .get("/api/TestResult/GetStudentTest?taskId=" + row.taskId)
        .then(res => {
          for (let i in res.data) {
            if (res.data[i].hasView) {
              _this.tableDatbNow[1].name.push(res.data[i]);
            } else {
              _this.tableDatbNow[0].name.push(res.data[i]);
            }
          }
        });
    },
    /**
     * 获取学员个人信息
     *@param testUid {object} 学生的标识符
     */
    studentEame(testUid) {
      // console.log(testUid)
      var _this = this;
      _this.personalesTpaper = true;
      _this.axios
        .get("/api/TestResult/GetStudentTestPaper?testUid=" + testUid)
        .then(res => {
          // console.log(res.data);
          let fillQuestion1 = 0; //填空题
          let choseQuestions1 = 0; //选择题
          let answer1 = 0; //问答题
          let choseQuestionstotalponints = 0; //计算选择题总共多少分
          let choseQuestionsdata = []; //获取选择题的问题和答案
          let fillQuestiondata = []; //获取选择题的内容
          let answerdata = []; //获取问答题的内容
          //循环判断题目
          for (let i in res.data.questions) {
            if (res.data.questions[i].fillQuestion != null) {
              fillQuestion1 += res.data.questions[i].score;
              fillQuestiondata.push(res.data.questions[i]); //把填空题的内容存储起来
              _this.fillQuestion = fillQuestiondata; //把填空题的值赋值给this
            } else if (res.data.questions[i].choseQuestions != null) {
              choseQuestions1 += res.data.questions[i].score;
              choseQuestionsdata.push(res.data.questions[i]); //获取答案
              _this.choseQuestions = choseQuestionsdata;
              _this.studentachievement = _this.choseQuestions.score;
            } else if (res.data.questions[i].answer != null) {
              answer1 += res.data.questions[i].score; //得到问答题的分数
              answerdata.push(res.data.questions[i]);
              _this.answer = answerdata;
            }
          }
          _this.tableDatb1 = [res.data];
          _this.tableDatb1[0].fillQuestion = fillQuestion1;
          _this.tableDatb1[0].choseQuestions = choseQuestions1;
          _this.tableDatb1[0].answer = answer1;
        });
    },
    /**
     * 保存阅卷
     */
    onSubmit() {
      let _this = this;
      let userUid = JSON.parse(sessionStorage.getItem("userProfile")).userUid; //获取阅卷老师的标识符
      let sdata = "[";
      //循环拼接数据为json格式
      for (let i in _this.totalPoints.answerscore) {
        //循环获取问答题每道题的id以及分数
        sdata +=
          "{'id':" +
          _this.totalPoints.answerscore[i].id +
          ",'score':" +
          _this.totalPoints.answerscore[i].score +
          "},";
      }
      for (let i in _this.totalPoints.fillQuestionscore) {
        //循环获取填空题每道题目的id以及分数
        sdata +=
          "{'id':" +
          _this.totalPoints.fillQuestionscore[i].id +
          ",'score':" +
          _this.totalPoints.fillQuestionscore[i].score +
          ",'fillOption': [";
        for (let j in _this.totalPoints.fillQuestionscore[i].fillQuestion
          .myFill) {
          //循环获取填空题每个空的id以及分数
          sdata +=
            "{'id': " +
            _this.totalPoints.fillQuestionscore[i].fillQuestion.myFill[j].id +
            ",'fillScore': " +
            _this.totalPoints.fillQuestionscore[i].fillQuestion.myFill[j]
              .fillScore +
            "},";
        }
        sdata = sdata.substring(0, sdata.lastIndexOf(","));
        sdata += "]},";
      }
      sdata = sdata.substring(0, sdata.lastIndexOf(","));
      sdata += "]";
      var str = eval("(" + sdata + ")");
      let arr = {
        id: _this.tableData1[0].id, //学生答卷的主键编号
        testScore: _this.studentachievementchange, //总分
        studentAnswer: str
      };
      _this.axios
        .post("/api/TestResult/SetTestPaperScore?userUid=" + userUid, arr)
        .then(res => {
          _this.tableData1[0].answer = _this.answerData[2]; //获取问答题分数
          _this.tableData1[0].testScore = _this.studentachievementchange; // //总分
          _this.tableData1[0].fillQuestion = _this.reversedMessage[2]; //获取填空题分数
          _this.tableData1.splice(0, 1, _this.tableData1[0]); //把旧的数据替换成新的数据
          document.querySelector(".el-main").scrollTop = 0; //保存阅卷回到顶部
        });
    }
  },
  /**
   * 加载前
  */
  beforeMount() {
    this.apply();
  },
  computed: {
    // 计算属性计算填空题
    reversedMessage: function() {
      let _this = this;
      let testPaperScore = 0; //计算填空题的总分数
      let score = 0; //计算填空题所得到的分数
      let quantity = _this.fillQuestion.length; //计算有多少个填空题
      let result = ""; //用于存储数组添加标签转成字符串
      let results = []; //存储添加好标签的字符串
      let index = 0; //获取分数的下标
      for (let i in _this.fillQuestion) {
        testPaperScore += _this.fillQuestion[i].testPaperScore; //计算填空题的总分数
        for (let j in _this.fillQuestion[i].fillQuestion.myFill) {
          score += _this.fillQuestion[i].fillQuestion.myFill[j].fillScore; //计算填空题所得到的分数
        }
        //循环判断把下划线切换成标签
        for (let j in _this.fillQuestion[i].questionTitle.split("")) {
          if (_this.fillQuestion[i].questionTitle[j] == "▁") {
            result +=
              "<i style='display: inline-block;padding: 0px 20px 0px 20px; border-bottom:1px solid red;text-align: center;'>" +
              "</i>(" +
              "分)";
            index++;
          } else {
            result += _this.fillQuestion[i].questionTitle[j];
          }
        }
        index = 0; //刷新下标
        results.push(result); //把标签字符串添加到数组
        result = ""; //刷新标签字符串
      }
      _this.totalPoints.fillQuestionscore = _this.fillQuestion; //获取所有填空题的内容
      return [quantity, testPaperScore, score, results];
    },
    //计算属性计算问答题答案
    answerData: function() {
      let _this = this;
      let quantity = _this.answer.length;
      let testPaperScore = 0;
      let score = 0;
      for (let i in _this.answer) {
        testPaperScore += _this.answer[i].testPaperScore;
        score += _this.answer[i].score;
      }
      _this.totalPoints.answerscore = _this.answer; //获取所有问答题的内容
      return [quantity, testPaperScore, score];
    },
    //计算属性计算选择题的分数
    choseQuestionsdata: function() {
      let _this = this;
      let testPaperScore = 0;
      let score = 0;
      for (let i in _this.choseQuestions) {
        testPaperScore += _this.choseQuestions[i].testPaperScore;
        score += _this.choseQuestions[i].score;
      }
      return [testPaperScore, score];
    },
    //计算学生成绩
    studentachievementchange: function() {
      let _this = this;
      let studentachievement = 0;
      studentachievement = _this.answerData[2]; //获取问答题获得的分数
      studentachievement += _this.reversedMessage[2]; //获取填空题获得的分数
      studentachievement += _this.choseQuestionsdata[1]; //获取选择题得到的分数
      return studentachievement;
    }
  },
  filters: {
    //管道监听选择题答案
    formatId: function(value) {
      //获取学生选择的答案
      var _this = this;
      var result = ["A", "B", "C", "D", "E", "F"];
      var choiceQuestionresult = "";
      for (let i in value.questions) {
        for (let j in value.myChoose) {
          if (value.questions[i].cqId == value.myChoose[j]) {
            choiceQuestionresult += result[i];
          }
        }
      }
      return "我的答案" + "[" + choiceQuestionresult + "]";
    },
    date: function(value) {
      //清除时间里面T
      return value.replace("T", " ");
    }
  }
};
</script>

<style lang="less" scoped>
#mian {
  // 清除ul，li默认样式
  ul,
  li {
    list-style: none;
  }
  // 设置分页的样式
  .el-pagination {
    text-align: center;
    padding-top: 20px;
  }
  //设置题目盒子的样式
  .examination-questions {
    margin-top: 20px;
  }
  //设置选择题正确答案样式
  .el-icon-success {
    color: #096;
  }
  // 设置选择题答案部分的样式
  .answer {
    margin: 15px 0px;
    .score {
      padding: 0px 5px 0px 5px;
      border-radius: 50%;
      color: white;
      background: red;
    }
    span {
      margin: 0px 5px;
    }
  }
  // 设置填空题和问答题的部分样式
  .fillQuestion-result {
    margin: 15px 0px 15px 0px;
    h4 {
      margin: 15px 0px 15px 0px;
    }
    li {
      margin: 10px 0px 0px 10px;
    }
    .el-tag {
      margin-right: 10px;
    }
  }
  // 设置问答题答案显示区域的样式
  .el-row {
    margin: 20px 0px 20px 0px;
  }
  // 问答题答案的样式
  .bg-purple {
    background: #f4f4f5;
    padding: 10px 0px 10px 20px;
    h4 {
      margin: 0px 0px 5px 0px;
      color: #9193a3;
    }
    span {
      font-size: 15px;
      color: #9193a3;
    }
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  //保存阅卷样式
  .preserve {
    text-align: center;
    margin: 20px 0px;
    .el-tag {
      margin-right: 15px;
      span {
        background: red;
        border-radius: 15px;
        padding: 3px 5px;
      }
    }
  }
  // 个人考试的标题样式
  .title {
    text-align: center;
    color: #2196f3;
    margin-bottom: 20px;
  }
}
</style>
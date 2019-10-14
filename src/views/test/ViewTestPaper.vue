<!--
    测试成绩页面
-->
<template>
  <!-- 页面主体 -->
  <div class="main">
    <!-- 左卡片框 -->
    <el-card class="box-card">
      <!-- 左卡片框头部 -->
      <div slot="header" class="clearfix">
        <!-- 班级列表下拉框 -->
        <el-select
          v-model="classId"
          placeholder="请选择班级"
          @change="options(classId)"
          style="width:100%;"
        >
          <el-option
            v-for="item in getAllClass"
            :key="item.classId"
            :label="item.className"
            :value="item.classId"
          ></el-option>
        </el-select>
      </div>
      <el-table :data="tableData" @row-click="right" style="width:100%;">
        <el-table-column prop="courseName" label="课程" width="140"></el-table-column>
        <el-table-column prop="tpTitle" label="试卷" width="140"></el-table-column>
        <el-table-column prop="date" label="日期" width="140"></el-table-column>
        <el-table-column prop="counter" label="提交人数"></el-table-column>
      </el-table>
    </el-card>
    <!-- 右卡片框 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-row>
          <el-col :span="8" style="text-align:center;">
            <el-radio-group v-model="radio" @change="shows">
              <el-col :span="12">
                <el-radio :label="1" style="margin-right:10px;">列表</el-radio>
              </el-col>
              <el-col :span="12">
                <el-radio :label="2">图表</el-radio>
              </el-col>
            </el-radio-group>
          </el-col>
          <el-col :span="3" style="margin-right:10px;">
            <download-excel
              class="export-excel-wrapper"
              :data="json_data"
              :fields="json_fields"
              name="测试成绩表.xls"
            >
              <!-- 上面可以自定义自己的样式，还可以引用其他组件button -->
              <el-button type="primary" size="mini" @click="exportEXCEL()">导出表</el-button>
            </download-excel>
          </el-col>
          <el-col :span="3">
            <!-- v-print ====> 要打印的部分，指定id或class, 打印该节点下（包括该节点）的所有内容 -->
            <el-button type="primary" size="mini" v-print="'#right-card'">打印表</el-button>
          </el-col>
        </el-row>
      </div>
      <!-- 列表 -->
      <el-table :data="tableDatb" v-show="list" id="right-card">
        <el-table-column prop="stuName" label="姓名" width="130"></el-table-column>
        <el-table-column prop="submitTime" label="提交时间" width="160"></el-table-column>
        <el-table-column prop="testScore" label="成绩" width="120"></el-table-column>
        <el-table-column prop="userName" label="阅卷"></el-table-column>
      </el-table>
      <!-- 图表 -->
      <div v-show="!list" id="myChart" style="height:425px;"></div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // excel
      json_fields: {
        // 要显示导出的的内容，可以做到根据HTML结构分类别导出
        姓名: "stuName", //常规字段
        提交时间: "submitTime",
        成绩: "testScore",
        阅卷: "userName" 
      },
      json_data: [ // 导出的对象数据
        {
          stuName: [],
          submitTime: [],
          testScore: [],
          userName: []
        }
      ],
      json_meta: [ //要导出的编码格式
       {" key ": " charset "," value ": " utf- 8 "}
      ],
      // excel
      getAllClass: [], //所有班级数据
      radio: 1, //选中的单选框
      tableData: [], //左模态框
      tableDatb: [], //右模态框
      classId: "", //班级编号
      list: true //单选框点击隐藏显示
    };
  },
  methods: {
    exportEXCEL() {
      let _this = this;
      let json = _this.tableDatb;
      _this.json_data = json.map(item => ({
        stuName: item.stuName,
        submitTime: item.submitTime,
        testScore: item.testScore,
        userName: item.userName
      }));
    },

    //渲染左列表数据
    options(classId) {
      var _this = this;
      _this.axios
        .get("/api/TestResult/GetTestPaperByClassId?classId=" + _this.classId)
        .then(res => {
          _this.tableData = res.data;
        });
    },
    //渲染右列表与图表数据,list参数是左列表的数据
    right(list) {
      var _this = this;
      _this.axios
        .get("/api/TestResult/GetTestResultByTaskId?taskId=" + list.taskId)
        .then(res => {
          _this.tableDatb = res.data;
          var stuName = []; //学生姓名
          var testScore = []; //测试分数
          for (let index in _this.tableDatb) {
            stuName.push(_this.tableDatb[index].stuName); //把列表中选中的学生姓名推送到变量
            testScore.push(_this.tableDatb[index].testScore); //把列表中选中的测试成绩推送到变量
          }
          //获取图表的id
          var myChart = document.getElementById("myChart");
          //计算图表的宽度
          myChart.style.width = myChart.parentNode.offsetWidth + "px";
          //当视图窗口发生改变时触发该方法
          window.onresize = function() {
            myChart.resize({
              width: myChart._dom.parentNode.offsetWidth + "px"
            });
          };
          var myChart = _this.$echarts.init(myChart); //初始化图表
          // 指定图表的配置项和数据
          myChart.setOption({
            title: {
              //头部
              text: list.tpTitle + "(成绩表)", //头部标题
              left: "center" //头部标题居中
            },
            tooltip: {}, //悬停柱提示信息
            xAxis: {
              //坐标轴x
              data: stuName, //学生名字
              axisLabel: {
                interval: 0
              }
            },
            yAxis: {}, //坐标轴y
            series: [
              //数据
              //系列列表，每个系列通过type决定自己的图表类型
              {
                name: "分数",
                type: "bar", //bar表示柱形图类型
                label: {
                  show: true, //开启显示
                  position: "top", //在柱形图上显示
                  textStyle: {
                    //数值样式
                    color: "#C23531" //字体颜色
                  }
                },
                data: testScore //测试分数
              }
            ]
          });
        });
    },
    //判断单选框隐藏显示
    shows() {
      var _this = this;
      _this.list = !_this.list;
    }
  },
  // 渲染所有班级数据
  created() {
    var _this = this;
    _this.axios.get("/api/Class/GetAllClass").then(res => {
      _this.getAllClass = res.data;
    });
  }
};
</script>

<style lang="less" scoped>
.main {
  display: flex;
}
.box-card {
  margin-left: 1%;
  width: 49%;
}
.el-table--fit {
  font-size: 12px;
}
</style>
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
        <el-radio-group v-model="radio" @change="shows">
          <el-radio :label="1">列表</el-radio>
          <el-radio :label="2">图表</el-radio>
        </el-radio-group>
      </div>
      <!-- 列表 -->
      <el-table :data="tableDatb" v-show="list">
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
      getAllClass: [], //所有班级数据
      radio: 1, //选中的单选框
      tableData: [], //左模态框
      tableDatb: [], //右模态框
      classId: "", //班级编号
      list: true //单选框点击隐藏显示
    };
  },
  methods: {
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
          var myChart = _this.$echarts.init(myChart);  //初始化图表
          // 指定图表的配置项和数据
          myChart.setOption({
            title: {
              //头部
              text: list.tpTitle + "(成绩表)",  //头部标题
              left: "center"  //头部标题居中
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
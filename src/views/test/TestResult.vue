<template>
  <el-card class="box-card">
    <!-- 安排测试表单 -->
    <div slot="header" class="clearfix">
      <!-- 试卷名 -->
      <el-form :model="form" ref="form" label-width="80px" class="demo-ruleForm">
        <el-form-item label="试卷名称" prop="TestPaperId">
          <TestPaperId @childTestPaperId="getTestPaperId" :TestPaperId="`null`"/>
        </el-form-item>

        <!-- 班级名 -->
        <el-form-item label="班级名称" prop="ClassId">
          <ClassId @childClassId="getClassId" :classId="`null`"  />
        </el-form-item>

        <!-- 考试时间 -->
        <el-form-item label="考试时间" prop="testTime" class="demonstration">
          <el-date-picker
            v-model="form.testTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy/MM/dd HH:mm"
            @change="DateMinus"
          ></el-date-picker>
          <el-tag type="danger">用时：{{form.elapsedTime}} 分钟</el-tag>
        </el-form-item>

        <!-- 操作按钮 -->
        <el-form-item>
          <el-button @click="resetForm('form')">重置</el-button>
          <el-button type="primary" @click="submit()">立即创建</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表单结束 ======================================= -->
    <div class="text item">
      <div>
        <el-table :data="testTaskList.data" style="width: 100%;" class="text item">
          <el-table-column label="#" prop type="index"></el-table-column>
          <el-table-column label="试卷名" prop="tpTitle"></el-table-column>
          <el-table-column label="班级" prop="className"></el-table-column>
          <el-table-column label="出卷人" prop="userName"></el-table-column>
          <el-table-column label="测试开始时间" prop="taskStartTime">
            <!-- 过滤时间格式 -->
            <template slot-scope="scope">{{scope.row.taskStartTime | timeFilter}}</template>
          </el-table-column>
          <el-table-column label="测试结束时间" prop="taskEndTime">
            <template slot-scope="scope">{{scope.row.taskEndTime | timeFilter}}</template>
          </el-table-column>
          <el-table-column label="耗时（分钟）" prop="taskEscapeTime"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row),centerDialogVisible = true"
              >编辑</el-button>
              <el-button size="mini" type="danger" @click="handleIdit(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页 -->
    <div class="block" style="vertical-align:bottom;text-align:center;">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-count="1"
        :page-size="pageSizes"
        layout="total, sizes, prev, pager, next, jumper"
        :total="testTaskList.items"
      ></el-pagination>
    </div>

    <!-- 编辑弹框 -->
    <div>
      <template>
        <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center>
          <!-- 试卷名 -->
          <el-form :model="form" ref="form" label-width="80px" class="demo-ruleForm">
            <el-form-item label="试卷名称" prop="TestPaperId">
              <TestPaperId @childTestPaperId="getTestPaperId" :taskTestPaperId="edit.taskTestPaperId" v-if="centerDialogVisible" />
            </el-form-item>

            <!-- 班级名 -->
            <el-form-item label="班级名称" prop="ClassId">
              <ClassId @childClassId="getClassId" :className="edit.classId" v-if="centerDialogVisible" />
            </el-form-item>

            <!-- 考试时间 -->
            <el-form-item label="考试时间" prop="testTime" class="demonstration" id="testTime">
              <el-date-picker
                v-model="form.testTime"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy/MM/dd HH:mm"
                @change="DateMinus"
              ></el-date-picker>
              <el-tag type="danger">用时：{{form.elapsedTime}} 分钟</el-tag>
            </el-form-item>
            </el-form>
              <span slot="footer" class="dialog-footer">
              <el-button @click="centerDialogVisible = false">取消</el-button>
              <el-button
                type="primary"
                @click="amend(),centerDialogVisible = false"
              >修改</el-button>
              </span>
            
          
        </el-dialog>
      </template>
    </div>
  </el-card>
</template>

<script>
import TestPaperId from "@/components/TestPaperId";
import ClassId from "@/components/ClassId";
export default {
  components: {
    // 注册子组件
    TestPaperId,
    ClassId
  },
  data() {
    return {
      
      edit:"", // 点击编辑保存当前行的所有数据

      form: {
        TestPaperId: "", // 试卷Id 子组件
        classId: "", // 班级Id 子组件
        testTime: [
          new Date().getTime(), // 开始时间
          new Date().getTime() + 1 * 60 * 60 * 1000 - 1
        ], // 结束时间
        elapsedTime: [] // 总用时

        /**
         * 默认时间没有监听到testTime的值  bug
         */
        // defaultTime:[
        //   new Date().getHours() + ":" +new Date().getMinutes(),
        //   new Date().getHours() +":" +new Date().getMinutes()+ 1 * 60 * 60 * 1000
        // ], // 默认时间
      },
      rules: {
        TestPaperId: [
          { required: true, message: "请选择试卷", trigger: "change" }
        ],
        ClassId: [{ required: true, message: "请选择班级", trigger: "change" }],
        testTime: [
          { required: true, message: "请选择考试日期", trigger: "change" }
        ]
      },
      testTaskList: [], // 测试列表
      centerDialogVisible: false, // 编辑弹框
      currentPage: 1, // 分页 当前页
      pageSizes: 10, // 分页 当前页的显示数据条数
      
    };
  },
  methods: {
    /**
     * @Function getClassId 接收子组件传过来的班级ID并保存到父组件data
     * @param classId {number} 班级Id
     */
    getClassId(classId) {
      let that = this;
      that.form.classId = classId;
      console.log(classId);
    },
    /**
     * @Function getTestPaperId 接收子组件传过来的试卷Id并保存到父组件data
     * @param TestPaperId {number} 试卷Id
     */
    getTestPaperId(TestPaperId) {
      let that = this;
      that.form.TestPaperId = TestPaperId;
      console.log(TestPaperId);
    },
    /**
     * ======================================================================
     * @计算考试时间范围
     * @param  date {Array} 开考时间与结束时间
     */
    DateMinus(time) {
      let that = this;
      that.form.elapsedTime = parseInt(
        Math.abs(time[1] - time[0]) / 1000 / 60 + 1
      ); //把相差的毫秒数转换为分钟
      // if(that.form.elapsedTime > 60){
      //   that.form.elapsedTime = that.form.elapsedTime / 60
      // }
    },

    // 测试列表部分
    /**
     * @Function 获取测试列表
     */
    getTestTaskList() {
      let that = this;
      that.axios
        .get(
          `/api/TestPaper/GetTestTask?pageIndex=${that.currentPage}&pageSize=${that.pageSizes}`
        )
        .then(res => {
          that.testTaskList = res.data; // 测试列表
          console.log(res.data)
        });
    },
    /**
     * ===================================================================================
     * @event 点击编辑测试列表数据
     * @param index {number} 当前行索引
     * @param row {Object} 当前行对象
     */
    handleEdit(index, row) {
      let that = this;
      that.edit = row
      console.log(row)
    },
    /**
     * @event 确认修改
     */
    amend(){
      console.log('修改')
      let that = this;
      that.axios.post(`/api/TestPaper/ModifyTestTask`,{
          taskId: that.edit.taskId, //主键编号
          taskTestPaperId:that.edit.taskTestPaperId,//试卷编号
          taskClassId: that.edit.classId, //班级编号，可修改
          taskStartTime: that.testTime[0], //测试开始时间，可修改
          taskEndTime: that.testTime[1]  //测试结束时间，可修改
      }).then(res => {
        console.log(res.data)
      })
      .catch((error) => {
        console.log
      })
    },
    /**
     * ======================================================================
     * @event 点击删除测试列表数据
     * @param index {number} 当前行索引
     * @param row {Object} 当前行对象
     */
    handleIdit(index, row) {
      let that = this;
      that
        .$confirm("删除后数据将永久无法恢复", "提示", {
          distinguishCancelAndClose: true,
          confirmButtonText: "永久删除",
          cancelButtonText: "取消删除",
          type: "warning",
          center: true
        })
        .then(() => {
          that.axios
            .post(`/api/TestPaper/RemoveTestTask?taskId=${row.taskId}`)
            .then(res => {
              if (res.data.code == 1) {
                that.$message({
                  type: "success ",
                  message: "删除成功"
                });
                return that.testTaskList.data.splice(index, 1); // 前端实时刷新列表
              }
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(action => {
          that.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    /**
     * @event handleSizeChange {change} 每页显示的内容
     * @param sizeVal {number} 每页多少条
     */
    handleSizeChange(sizeVal) {
      let that = this;
      that.pageSizes = sizeVal;
      that.getTestTaskList(); // 改变分页显示数据数量后重新请求接口
    },
    /**
     * @event handleCurrentChange {change} 分页跳转
     * @param currentVal {number} 当前页
     */
    handleCurrentChange(currentVal) {
      let that = this;
      that.currentPage = currentVal;
      that.getTestTaskList(); // 分页跳转后重新请求接口
    },
    /**
     * @重置表单内容和验证提示
     * @param formName {Object} 需要重置的表单对象
     */
    resetForm(formName) {
      let that = this;
      that.$refs[formName].resetFields();
    },
    /**
     * @event p 给不足10的日期时间前面加0
     */
    p(s) {
      return s < 10 ? "0" + s : s;
    },
    /**
     * 新增测试任务
     * @提交表单内容 表单验证提示 请求数据成功后添加到测试列表 第一位
     * @param formName {Object} 需要验证的表单对象
     * @param valid {Boolean} 验证通过为true 反之为false
     */
    submit() {
      let that = this;
      // console.log(`03213545351432341214`)
      // console.log(that.form.ClassId)
        // if (that.form.ClassId != "" && that.form.TestPaperId != "") {
        // 时间格式化
        const d = new Date(that.form.testTime[0]);
        const t = new Date(that.form.testTime[1]);
        let taskStartTime = (that.form.testTime[0] =
          d.getFullYear() +
          "/" +
          that.p(d.getMonth() + 1) +
          "/" +
          that.p(d.getDate()) +
          " " +
          that.p(d.getHours()) +
          ":" +
          that.p(d.getMinutes()));
        let taskEndTime = (that.form.testTime[1] =
          t.getFullYear() +
          "/" +
          that.p(t.getMonth() + 1) +
          "/" +
          that.p(t.getDate()) +
          " " +
          that.p(t.getHours()) +
          ":" +
          that.p(t.getMinutes()));
        // 获取本地存储的userUid
        let userUid = sessionStorage.getItem("userUid");
        // 验证成功请求安排测试的接口
        that.axios
          .post("/api/TestPaper/SetTest?uid=" + userUid, {
            taskTestPaperId: that.form.TestPaperId, //试卷编号
            taskClassId: that.form.classId, //班级编号
            taskStartTime: taskStartTime, //开始时间
            taskEndTime: taskEndTime //结束时间
          })
          .then(res => {
            // console.log(`asdfasdfasdfadddddddddddddddd`)
            if (res.data.code == 1) {
              that.testTaskList.data.unshift(res.data.data);
              that.testName = false;
              that.className = false;
            }
          });
      // } else {
      //   that.$message({
      //     type: "success ",
      //     message: "试卷、班级、测试时间不能为空！！！"
      //   });
      //   return false;
      // }
      
        // that.axios.post(`/api/TestPaper/ModifyTestTask`,{
        //               "taskId": 0, //主键编号
        //               taskTestPaperId:0,//试卷编号
        //               "taskClassId": 0, //班级编号，可修改
        //               "taskStartTime": "2019-03-07T03:38:37.635Z", //测试开始时间，可修改
        //               "taskEndTime": "2019-03-07T03:38:37.635Z", //测试结束时间，可修改
        //               }).then(res => {
        //                 console.log(res.data)
        //               })
      
    },
    /**
     * @event handleSizeChange {change} 每页显示的内容
     * @param sizeVal {number} 每页多少条
     */
    handleSizeChange(sizeVal) {
      let that = this;
      that.pageSizes = sizeVal;
      that.getTestTaskList(); // 改变分页显示数据数量后重新请求接口
    },
    /**
     * @event handleCurrentChange {change} 分页跳转
     * @param currentVal {number} 当前页
     */
    handleCurrentChange(currentVal) {
      let that = this;
      that.currentPage = currentVal;
      that.getTestTaskList(); // 分页跳转后重新请求接口
    }
  },

  created() {
    let that = this;
    that.DateMinus(that.form.testTime);
    that.getTestTaskList();
  },
  filters: {
    // 使用正则表达式过滤格式化时间
    timeFilter(val) {
      let that = this;
      return val.replace("T", " ");
    }
  }
};
</script>

<style lang="less" scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 100%;
}

.el-tag {
  height: 40px;
  line-height: 40px;
}
/deep/ #testTime .el-date-editor{
  width: 100%;
}
</style>
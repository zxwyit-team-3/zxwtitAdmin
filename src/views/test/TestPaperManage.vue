<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom:30px;">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>在线测试</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/TestPaperManage">试卷管理</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table :data="userList" border style="width: 100%">
        <el-table-column type="index" :index="indexMethod" width="50px"></el-table-column>
        <el-table-column prop="tpTitle" label="标题" width="130px"></el-table-column>
        <el-table-column prop="userName" label="出卷人" width="120px"></el-table-column>
        <el-table-column prop="courseName" label="课程"></el-table-column>
        <el-table-column prop="tpDate" label="出卷时间" width="140px">
          <template slot-scope="scope">{{ scope.row.tpDate | dateFormat }}</template>
        </el-table-column>
        <el-table-column label="操作" >
            <template slot-scope="scope">
                <el-button size="small" @click="upData(scope.$index)">编辑</el-button>
                <el-button size="small" @click="Particulars(scope.$index)">详情</el-button>
                <el-button size="small" type="danger" @click="deleteDate(scope.$index)">删除</el-button>
	        </template>
          
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 40]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="AllTotal"
      ></el-pagination>
    </el-card>
    <el-dialog title="修改试卷信息" :visible.sync="centerDialogVisible" width="30%" center>
    <el-form ref="form" :model="form" >
  <el-form-item>
      <p>试卷标题</p>
    <el-input v-model="form.name"></el-input>
  </el-form-item>
  <el-form-item style="width:100%;">
      <p>专业课程</p>
    <el-select v-model="form.region" placeholder="请选择活动区域" @change="getCourserId(form.region)">
      <el-option v-for="item in courseArr" :label="item.courseName" :value="item.courseName" :key="item.courseId"></el-option>
    </el-select>
  </el-form-item>
    </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setUpData()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
export default {
  name: "TestPaperManage",
  data() {
    return {
      currentPage: 1, //初始页
      pagesize: 10, //每页的数据
      AllTotal: 0,
      userList: [],
      centerDialogVisible: false,
      form: {
          name: '',
          region: '',
        },
        courseArr:[],
        courseId:"", //课程id
        tpId:""
    };
  },
  mounted() {},
  created() {
    this.handleUserList(this.pagesize, this.currentPage);
    this.getCourse()
  },
  methods: {
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function(size) {
      this.pagesize = size;
      this.handleUserList(this.pagesize, this.currentPage);
      console.log(this.pagesize); //每页下拉显示数据
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.handleUserList(this.pagesize, this.currentPage);
      console.log(this.currentPage); //点击第几页
    },
    handleUserList(pagesize, currentPage) {
      var _this = this;
      _this.$http
        .get(
          "/api/TestPaper/GetTestPaperList?pageIndex=" +
            currentPage +
            "&pageSize=" +
            pagesize
        )
        .then(res => {
          //这是从请求的数据接口，
        //   console.log(res)
          _this.userList = res.data.data;
          _this.AllTotal = res.data.items;
        });
    },
    indexMethod(index) {
      return index + 1;
    },
    getCourse(){    //获取课程方法
             var _this = this
             _this.axios.get("/api/Class/GetAllCourse")
            .then((res) => {
                 _this.courseArr = res.data
            }).catch((error) => {
                console.log(error)
            })
      },
      upData(i){
          var _this = this
          _this.centerDialogVisible = true
          _this.form.name = _this.userList[i].tpTitle
          _this.form.region = _this.userList[i].courseName
          _this.tpId = _this.userList[i].tpId
          _this.getCourserId(_this.userList[i].courseName)
      },
      setUpData(){
          var _this = this
          _this.centerDialogVisible = false
          _this.axios.post('/api/TestPaper/ModifyTestPaper',
          {
            tpId:_this.tpId,//试卷编号
            tpCourseId:_this.courseId,//课程编号，可修改
            tpTitle:_this.form.name,//试卷标题，可修改
          })
          .then((res) => {
              _this.$message({
                message: '修改成功',
                type: 'success'
            });
            // console.log(_this.form.name)
            var index = 0;
           for (let i = 0; i < _this.userList.length; i++) {
               if(_this.userList[i].tpId == _this.tpId){
                   index = i
               }
           }
             _this.userList[index].tpTitle = _this.form.name
             if(_this.courseId == 1){
                  _this.userList[index].courseName = "WEB前端开发"
             }else if(_this.courseId == 2){
                 _this.userList[index].courseName = ".NET后台开发"
             }else{
                 _this.userList[index].courseName = "软件测试"
             }
          })
          .catch((error) => {
              console.log(error)
              _this.$message.error('修改失败')
          })
      },
      getCourserId(cName){ //获取课程id方法
        if(cName == "Web前端开发"){
            this.courseId = 1
        }else if(cName == ".NET后台开发"){
            this.courseId = 2
        }else{
            this.courseId = 3
        }
      },
      deleteDate(i){
        this.$confirm('此操作将永久删除该试卷, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           var _this = this
          _this.centerDialogVisible = false
          _this.axios.post('/api/TestPaper/RemoveTestPaper?id='+_this.userList[i].tpId)
          .then((res) => {
            if(res.data.code ==1){
                _this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.handleUserList(_this.pagesize, _this.currentPage)
            }
               
              
          })
          .catch((error) => {
              _this.$message.error('删除失败')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
         
          
      },
      Particulars(i){
        var _this = this
        _this.axios.get('/api/TestPaper/GetTestPaper?id='+this.userList[i].tpId)
        .then((res) => {
          // console.log(res)
          // console.log(res.data)
           this.$router.push({
            name: 'TestPaperParticulars',
            params: {
              TestPaperName: this.userList[i].tpTitle, 
              TestPaperId: this.userList[i].tpId,
              courseName:this.userList[i].courseName,
              allTestInfo:res.data.questions
            }
          })
            
        })
        .catch((error) => {
           console.log(error)
        })
       
      }
  },
  filters: {
    dateFormat(val) {
      return val.substring(0, val.indexOf("T"));
    }
  }
};
</script>


<style lang="less" scoped>
/deep/ .el-select{
    width: 100%;
}
</style>
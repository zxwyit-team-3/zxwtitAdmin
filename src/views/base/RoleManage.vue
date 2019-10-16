<!--
    用户角色页面
-->
<template>
  <!-- 页面主体 -->
  <div class="main">
    <!-- 面包屑 -->
    <div class="top">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>基础数据</el-breadcrumb-item>
        <el-breadcrumb-item>用户角色</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <!-- 头部添加 -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <div class="add">
            <i class="el-icon-circle-plus-outline"></i>
            <span @click="add()">新增角色</span>
          </div>
          <div>
            <el-checkbox @change="destRoy" v-model="checked">允许拖拽</el-checkbox>
          </div>
        </div>
        <!-- 添加模态框 -->
        <el-dialog title="新增角色信息" :visible.sync="increase" width="30%" center>
          <span>角色名称</span>
          <el-input class="users" v-model="user"></el-input>
          <span slot="footer" class="dialog-footer">
            <el-button @click="increase = false">取 消</el-button>
            <el-button type="primary" @click="increases()">添加</el-button>
          </span>
        </el-dialog>

        <!-- 编辑模态框 -->
        <el-dialog title="修改角色信息" :visible.sync="compile" width="30%" center>
          <span>角色名称</span>
          <el-input class="users" v-model="userUpdata"></el-input>
          <span slot="footer" class="dialog-footer">
            <el-button @click="compile = false">取 消</el-button>
            <el-button type="primary" @click="compiles()">修改</el-button>
          </span>
        </el-dialog>

        <!-- 角色信息 -->
        <el-table :data="tableData" style="width: 100%;" row-key="userTypeId">
          <el-table-column label="#" width="80" type="index"></el-table-column>
          <el-table-column label="角色名称">
            <template slot-scope="scope">
              <el-popover placement="top">
                <div slot="reference" class="name-wrapper">
                  <span>{{ scope.row.userTypeTypeName }}</span>
                </div>
              </el-popover>
            </template>
          </el-table-column>

          <!-- 操作 -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
import Sortable from "sortablejs";
export default {
  data() {
    return {
      tableData: [],
      increase: false, // 添加弹出框
      compile: false, //编辑弹出框
      user: "", // 添加角色名称
      userUpdata: "", //修改角色名称
      value: "", // 角色信息
      values: "",
      checked: false
    };
  },
  methods: {
    destRoy() {
      var _this = this;
      if (_this.checked) {
        _this.damage();
      } else {
        _this.values.destroy();
      }
    },
    /**
     * 拖拽排序
     */
    damage() {
      var tbody = document.querySelector(".el-table__body-wrapper tbody");  //获取table里面的数据
      var _this = this;
      //Sortable排序事件
      _this.values = Sortable.create(tbody, {
        animation: 500,
        //拖拽完成后发生事件
        onEnd({ newIndex, oldIndex }) {
          //splice方法newIdex是添加或者删除的新下标，0是要删除newIdex的数量，0是不删除
          _this.tableData.splice(
            newIndex,
            0,
            _this.tableData.splice(oldIndex, 1)[0]  //删除当行选中旧的下标
          );
          var newArray = _this.tableData.slice(0);  //从你选中的下标开始选取
          var newArr = newArray.map((value, i) => {  //映射出newArray的数据
            return {
              userTypeSortNo: i++,
              userTypeId: value.userTypeId
            };
          });
          _this.axios
            .post("/api/UserType/OrderUserRoleNo", newArr)
            .then(res => {
              if (res.data.code == 1) {
                _this.$message({
                  type: "success",
                  message: "排序成功"
                });
              } else if (res.data.code == 0) {
                _this.$message({
                  type: "info",
                  message: "数据没有变化"
                });
              }
            });
        }
      });
    },
    /**
     * 编辑
     * @param index {object} 当前行的下标
     * @param row {object} 角色名称
     */
    handleEdit(index, row) {
      var _this = this;
      this.compile = true;
      this.value = row;
      this.userUpdata = row.userTypeTypeName; //修改角色名称
    },
    /**
     * 模态框编辑
     */
    compiles() {
      var _then = this;
      _then.axios
        .post(
          "/api/UserType/ModifyUserRole?id=" +
            _then.value.userTypeId +
            "&userRoleName=" +
            _then.userUpdata
        )
        .then(res => {
          _then.compile = false;
          if (res.data.code == 1) {
            _then.value.userTypeTypeName = _then.userUpdata;
            _then.$message({
              type: "success",
              message: "修改成功!"
            });
          } else if (res.data.code == 0) {
            _then.$message({
              type: "info",
              message: "名称没有变化!"
            });
          }
        });
    },

    /**
     * 删除
     * @param index {number} 当前行的下标
     * @param row {object} 用户名称
     */
    handleDelete(index, row) {
      var _then = this;
      _then
        .$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
        .then(() => {
          _then.axios
            .post("/api/UserType/RemoveUserRole?userRoleId=" + row.userTypeId)
            .then(res => {
              if (res.data.code == 1) {
                _then.tableData.splice(index, 1);
                _then.$message({
                  type: "success",
                  message: "删除成功!"
                });
              } else if (res.data.code == -1) {
                _then.$message.error("权限不够!");
              } else {
                _then.$message.error("删除错误!");
              }
            });
        })
        .catch(() => {
          _then.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    /**
     * 新增
     */
    add() {
      this.increase = true;
    },
    /**
     * 模态框新增
     */
    increases() {
      var _then = this;
      _then.axios
        .post("/api/UserType/AddUserRole?userRoleName=" + _then.user)
        .then(function(res) {
          _then.tableData.push(res.data.data);
          _then.increase = false;
          if (res.data.code == 1) {
            _then.$message({
              type: "success",
              message: "添加成功!"
            });
          } else if (res.data.code == -2) {
            _then.$message.error("角色名称已存在!");
          }
        });
    }
  },

  // 渲染页面
  created() {
    var _then = this;
    _then.axios.get("/api/UserType/GetUserRoles").then(res => {
      _then.tableData = res.data;
    });
  }
};
</script>

<style lang="less" scoped>
.main {
  .content {
    margin-top: 2%;
    display: flex;
    .box-card {
      width: 100%;
      .increase {
        color: #40a1ff;
        font-size: 13px;
      }
      .el-icon-circle-plus-outline {
        color: #40a1ff;
        margin-right: 5px;
        font-size: 13px;
      }
      .users {
        width: 75%;
        margin-left: 5%;
      }
      .clearfix {
        width: 200px;
        margin-left: 30px;
        color: #409eff;
        font-size: 13px;
      }
      .add {
        float: left;
        margin-right: 20px;
      }
    }
  }
}
</style>
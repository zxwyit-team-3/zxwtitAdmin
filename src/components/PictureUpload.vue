<template>
  <div id="mian">
    <el-avatar
      @click.native="upload =true"
      :src="circleUrl"
      style="vertical-align: middle;margin-top:10px;"
    ></el-avatar>
    <!-- 模态框 -->
    <el-dialog title="上传头像" :visible.sync="upload" width="260px" center>
      <!-- 文本input方法 -->
      <input
        type="file"
        name="image"
        @change="beforeAvatarUpload"
        class="header-upload-btn user-header-com"
      />
      <img :src="circleUrl" class="user-header-img user-header-com" />
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "",
  data() {
    return {
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png", //头像
      upload: false //头像模态框默认值
    };
  },
  methods: {
    /**
     * 上传头像
     * @param {object} e 获取要上传的图片信息全部
     */
    beforeAvatarUpload(e) {
      var _this = this;
      var file = e.target.files[0]; //获取图片要上传的信息
      var fileType = file.type; //图片类型
      var fileSize = file.size; //图片大小
      const isLt2M = file.size / 1024 / 1024 < 2; //限制大小
      //图片类型限制
      if (fileType != "image/jpeg" && fileSize != "image/png") {
        _this.$message.error("上传头像图片只能是 JPG 格式!");
        return;
      }
      if (!isLt2M) {
        _this.$message.error("上传头像图片大小不能超过 2MB!");
        return;
      }
      //表单数据，这里是文件域
      var fm = new FormData();
      //添加文件内容
      fm.append("userImg", file);
      var userUid = sessionStorage.getItem("userUid");
      _this.axios
        .post("/api/User/UploadHeader?userUid=" + userUid, fm)
        .then(res => {
          var msg = res.data.message;
          _this.circleUrl = res.data.data + "?q=" + new Date().getTime();
          _this.upload = false;
          _this.$message({ type: "success", message: msg });
        })
        .catch(res => {
          console.log(res);
        });
    }
  },
  mounted() {
    //更新后获取本地临时储存的图片
    this.circleUrl = sessionStorage.getItem("userHeader");
  }
};
</script>
<style lang="less" scoped>
.user-header {
  position: relative;
  display: inline-block;
}
.user-header-com {
  width: 144px;
  height: 144px;
  display: inline-block;
}
/* 通过定位把input放在img标签上面，通过不透明度隐藏 */
.header-upload-btn {
  position: absolute;
  left: 20px;
  top: 70px;
  opacity: 0;
}
.tip {
  font-size: 14px;
  color: #666;
}
/* error是用于错误提示 */
.error {
  font-size: 12px;
  color: tomato;
  margin-left: 10px;
}
</style>
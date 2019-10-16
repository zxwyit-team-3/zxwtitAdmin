<template>
    <div id="mian">
             <el-avatar  @click.native="upload =true" :src="circleUrl" style="vertical-align: middle;margin-top:10px;"></el-avatar>
                        <!-- 模态框 -->
                <el-dialog
                title="上传头像"
                :visible.sync="upload"
                width="260px"
                center
                >
                <!-- 
                必选参数，上传的地址
                是否显示已上传文件列表
                上传文件之前的钩子
                是否在选取文件后立即进行上传
                是否启用拖拽上传
                -->
                <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :auto-upload ="true"
                :drag = "true"
                >
                <img :src="circleUrl"  width="90%">
                </el-upload>
                </el-dialog>
    </div>
</template>
<script>
export default {
    name:"",
    data(){
        return{
         circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png", //头像
          upload:false,//头像模态框默认值
            
        }
    },methods:{
        /**
       * 上传头像
       * @param {object} file 要上传的图片信息
      */
      beforeAvatarUpload(file) {
        var _this = this;
        var fileType = file.type;//图片类型
        var fileSize = file.size;//图片大小
        const isLt2M = file.size / 1024 / 1024 < 2; //限制大小
          //图片类型限制
        if (fileType != 'image/jpeg' && fileSize != 'image/png') {
          _this.$message.error('上传头像图片只能是 JPG 格式!');
          return
        }
        if (!isLt2M) {
          _this.$message.error('上传头像图片大小不能超过 2MB!');
          return
        }
        //表单数据，这里是文件域
        var fm = new FormData();
        //添加文件内容
        fm.append("userImg",file);
        //  var userUid = _this.$store.state.userUid;
         var userUid = sessionStorage.getItem("userUid");
        _this.axios.post("/api/User/UploadHeader?userUid="+ userUid,fm).then(res => {
          // console.log(res)
          // console.log(_this.circleUrl)
          var msg = res.data.message
          _this.circleUrl = res.data.data + "?q=" + new Date().getTime();
          _this.upload = false;
          _this.$message({type:"success",message:msg})
            // console.log(res.data.message)
        }).catch(res => {
          console.log(res);
        })
      }
    },
    mounted(){
      this.circleUrl = sessionStorage.getItem("userHeader")
    },
}
</script>
<style lang="less" scoped>
/deep/.el-upload-dragger{
  width: 95%;
  border:0px;
}
</style>
<template>
    <div id="ShortAnswerInfo">
    <el-form
      v-for="(item,index) in msg"
      :key="item.tpqId"
      status-icon
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item  :label="index+1+'、'">
        
       
        <el-input type="textarea" rows="1" v-model="item.tpqQuestion.questionTitle" :disabled = "isDisabled!=index" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="info" size="small">参考答案</el-button>
        <div v-if="isDisabled!=index" v-html="item.tpqQuestion.answerQuestion.aqAnswer"></div>
        <!-- <template> -->
            <div class="edit_container">
                <quill-editor 
                  v-if="isDisabled==index"
                    v-model="item.tpqQuestion.answerQuestion.aqAnswer" 
                    :disabled = "isDisabled!=index" autocomplete="off"
                    ref="myQuillEditor" 
                    :options="editorOption" 
                    @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                    @change="onEditorChange($event)">
                </quill-editor>
            </div>

        <!-- </template> -->
      </el-form-item>
      <el-form-item label="分值">
        <el-input-number size="small" v-model="item.tpqScore" :disabled = "isDisabled!=index"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="setShortAnswerInfo(index)"  plain round >编辑</el-button>
        <el-button  round v-if="isDisabled==index" @click="cancelShortAnswerInfo()">取消</el-button>
        <el-button type="primary" plain round v-if="isDisabled==index" @click="saveShortAnswerInfo(index)">保存修改</el-button>
        <el-button type="danger" plain round v-if="isDisabled==index" @click="removeShortAnswerInfo(index)">删除题目</el-button>
      </el-form-item>
    </el-form>
    </div>
</template>

<script>


import { quillEditor } from "vue-quill-editor"; //调用编辑器
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

export default {
    name:"ShortAnswerInfo",
    components: {
        quillEditor
    },
    data(){
        return {
            isDisabled:9999,
            // 富文本
            // content: `<p></p><p><br></p><ol><li><strong><em>Or drag/paste an image here.</em></strong></li><li><strong><em>rerew</em></strong></li><li><strong><em>rtrete</em></strong></li><li><strong><em>tytrytr</em></strong></li><li><strong><em>uytu</em></strong></li></ol>`,
            editorOption: {}
            
        }
    },
    props:{
        msg:String
    },
    methods:{
       onEditorReady(editor) { // 准备编辑器
 
        },
        onEditorBlur(){}, // 失去焦点事件
        onEditorFocus(){}, // 获得焦点事件
        onEditorChange(){
          // console.log(this.content)
        }, // 内容改变事件

      setShortAnswerInfo(i){
          this.isDisabled = i
      },
      cancelShortAnswerInfo(){
          this.isDisabled = 9999
      },
      saveShortAnswerInfo(i){
        console.log(this.msg[i])
          var _this = this
          _this.axios.post('/api/TestPaper/ModifyQuestion?paperQuestionId'+this.msg[i].tpqPaperId,{
              "questionId":_this.msg[i].tpqQuestion.questionId,
              "questionTitle": _this.msg[i].tpqQuestion.questionTitle,
              "questionTypeId": 3,
              "answerQuestion": {
              "aqAnswer": _this.msg[i].tpqQuestion.answerQuestion.aqAnswer
              } 
          })
          .then((res) => {
            console.log(res)
             if(res.data.code == 1){
                _this.$message({
                message: '修改成功',
                type: 'success'
              });
             }else if(res.data.code == 1){
                _this.$message({
                message: '数据没有变化',
                type: 'success'
              });
             }
             let Mnum =_this.msg[i].tpqScore-_this.$store.state.ShortAnswerNum
               _this.$store.state.ShortAnswerNum+=Mnum
             _this.$store.state.allTestNum+=Mnum
             this.isDisabled = 9999
          })
          .catch((error) => {
              _this.$message.error('修改失败')
          })
      },
      removeShortAnswerInfo(i){
        var _this = this
          console.log(_this.msg)
          _this.axios.post("/api/TestPaper/RemoveQuestionFromTestPaper?paperQuestionId="+_this.msg[i].tpqId)
          .then((res) => {
             if(res.data.code == 1){
                _this.$message({
                message: '删除成功',
                type: 'success'
              });
             }
          _this.$store.state.ShortAnswerNum-=_this.msg[i].tpqScore
         _this.$store.state.allTestNum-=_this.msg[i].tpqScore
             this.isDisabled = 99999
            this.msg.splice(i,1)
          })
          .catch((error) => {
            _this.$message.error('删除失败')
             console.log(error)
          })
<<<<<<< HEAD
      },
      computed: {
        editor() {
            return this.$refs.myQuillEditor.quill;
        },
    }

=======
      }
    },
    mounted(){
       var editor = new E('#editor')
          // editor.customConfig.onchange = (html) => {
          //   // this.formArticle = html
          // }
          // editor.customConfig.uploadImgServer = '<%=path%>/Img/upload'; //上传URL
          // editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;
          // editor.customConfig.uploadImgMaxLength = 5;    
          // editor.customConfig.uploadFileName = 'myFileName';
          // editor.customConfig.uploadImgHooks = {
          // customInsert: function (insertImg, result, editor) {
          //             // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
          //             // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
               
          //             // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
          //             var url =result.data;
          //             insertImg(url);
               
          //             // result 必须是一个 JSON 格式字符串！！！否则报错
          //         }
          //     }
              editor.create();
>>>>>>> master
    }
}
</script>

<style scoped>
#noclick{
		/* pointer-events: none; */
    cursor:not-allowed;
    background: #F5F7FA;
    border-radius: 5px;
    border: 1px solid #E4E7ED;
    padding-left: 10px;
}
</style>

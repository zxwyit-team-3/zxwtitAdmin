<template>
    <div>
        <!--
            面包屑
        -->
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>在线测试</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/MakeTestPaper">老师出卷</a></el-breadcrumb-item>
        </el-breadcrumb>

         <!--
            试卷信息
         -->
        <el-card class="box-card" v-if="active == 0">
        <!--
            步骤条
        -->
            <el-steps :active="active" finish-status="success">
            <el-step title="试卷信息"></el-step>
            <el-step title="添加题目"></el-step>
            <el-step title="完成制作"></el-step>
            </el-steps>
        <!--
            试卷信息表单
        -->
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" >
                <el-form-item label="试卷名称" prop="name" >
                    <el-input v-model="ruleForm.name" placeholder="请输入试卷名称"></el-input>
                </el-form-item>
                <el-form-item label="课程名称" prop="region">
                    <el-select v-model="ruleForm.region" placeholder="请选择课程">
                    <el-option v-for="(item,index) in GetAllCourse" :label="item.courseName" :value="item.courseName" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">下一步</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <!--
            添加题目
        -->
        <el-card class="box-card" v-if="active == 1">
         <!--
            步骤条
        -->
            <div slot="header" class="clearfix">
                <el-steps :active="active" finish-status="success">
                <el-step title="试卷信息"></el-step>
                <el-step title="添加题目"></el-step>
                <el-step title="完成制作"></el-step>
                </el-steps>
            </div>
        <!--
            添加题目表单
        -->
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span style="display:inline-block;line-height:30px;">
                        <span style="font-size:13px;margin-right:10px;">题目类型</span>
                        <el-radio v-for="(item,index) in GetQuestionType" v-model="radio" :label="item.typeId" :key="index">{{item.typeName}}</el-radio>
                    </span>
                    <el-button style="float: right;" type="primary" @click="submitForm('dynamicValidateForm')">完成制卷</el-button>
                </div>
                <!--
                    选择题
                -->
                <div v-if="radio == 1">
                    <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
                        <el-form-item
                            prop="choiceQuestion"
                            label="题干"
                            :rules="[
                            { required: true, message: '请输入题干', trigger: 'blur' }
                            ]"
                        >
                            <el-input type="textarea" :rows="1" v-model="dynamicValidateForm.choiceQuestion"></el-input>
                        </el-form-item>

                        <el-form-item
                            v-for="(domain, index) in dynamicValidateForm.domains"
                            :key="domain.key"
                            :prop="'domains.' + index + '.cqOption'"
                            :rules="{
                            required: true, message: '选项不能为空', trigger: 'blur'
                            }"
                        > 
                    <el-checkbox v-model="domain.cqIsRight">{{options[index] }}</el-checkbox>    <!-- 增加多选-->
                    <el-input v-model="domain.cqOption" style="width:89%;margin-right:1%"></el-input>
                    <el-button type="danger" icon="el-icon-delete" @click.prevent="removeDomain(domain)" circle size="small" :disabled="isRemoveDisabled"></el-button>
                        </el-form-item>
                        <el-form-item label="分值">
                        <el-input-number size="small" v-model="choiceQuestionNum"></el-input-number>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="resetForm('dynamicValidateForm')" round>重置</el-button>
                            <el-button @click="addDomain" :disabled="isAddDisabled" type="info" round>新增选项</el-button>
                            <el-button type="primary" icon="el-icon-folder-checked" round @click="saveOptionQuestion()">保存题目</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <!--
                    填空题
                -->
                <div  v-if="radio == 2">
                    <el-form  label-width="100px" class="demo-dynamic">
                            <el-form-item label="题干" style="margin-bottom:0px;height:35px;">
                                <el-button type="info" size="small" icon="el-icon-edit-outline" @click="addEmpty()" round>插入填空</el-button>
                            </el-form-item>
                            <el-form-item
                            >
                                <el-input type="textarea" :rows="1" id="contentFour" v-model="deleteEmpty"></el-input>
                            </el-form-item>

                            <el-form-item
                            v-for="(domain, index) in gapFillings"
                            :key="index"
                            > 
                            <el-badge :value="index+1" class="item"></el-badge>
                            <el-input v-model="domain.value" style="width:89%;margin-right:1%" class="gapFillingsInput"></el-input>
                            <el-input-number size="small" v-model="domain.num"></el-input-number>    
                            </el-form-item>

                            <el-form-item
                            label="题目预览"
                            >
                             <div id="showGapFill"  v-html="gapFillingsInputLook"></div>   
                             
                            </el-form-item>

                            <el-form-item>
                                    <el-button @click="resetForm('dynamicValidateForm')" round>重置</el-button>
                                    <el-button type="primary" icon="el-icon-folder-checked" round @click="savagapFillings">新增题目</el-button>
                            </el-form-item>
                    </el-form>
                </div>
                <!--
                    问答题
                -->
                <div  v-if="radio == 3">
                    <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
                        <el-form-item
                            prop="essayQuestion"
                            label="题干"
                            :rules="[
                            { required: true, message: '请输入题干', trigger: 'blur' }
                            ]"
                            >
                                <el-input type="textarea" :rows="1" v-model="dynamicValidateForm.essayQuestion"></el-input>
                            </el-form-item>
                            <el-form-item
                            prop="reference"
                            label="参考答案"
                            :rules="[
                            { required: true, message: '请输入参考答案', trigger: 'blur' }
                            ]"
                            >
                                <el-input type="text"  v-model="dynamicValidateForm.reference"></el-input>
                            </el-form-item>
                            <el-form-item label="分值">
                            <el-input-number size="small" v-model="essayQuestionNum"></el-input-number>
                            </el-form-item>
                            <el-form-item>
                                    <el-button  round>重置</el-button>
                                    <el-button type="primary" icon="el-icon-folder-checked" round @click="savaessayQuestion">新增题目</el-button>
                            </el-form-item>
                    </el-form>
                </div>
            </el-card>
            <el-card class="box-card" style="margin-top:20px;">
                <div slot="header" class="clearfix" style="font-size:13px;">
                    <span>一、选择题（本题共{{allgetchoiceQuestionLen}}道小题，共<el-badge :value="allgetchoiceQuestionNum+'/'+allNum" :max="100" class="item"></el-badge>分）</span>
                     <el-form :model="getchoiceQuestion" v-for="(item,index) in getchoiceQuestion" ref="getchoiceQuestion" label-width="100px" class="demo-dynamic" :key="index"  style="margin-top:20px;">
                            <el-form-item
                            
                            label="题干"
                            
                            >
                                <el-input type="textarea" :rows="1" :disabled="item.isActive" v-model="item.GetchoiceQuestionTitle"></el-input>
                            </el-form-item>
                            
                            <el-form-item
                            v-for="(t, i) in item.choiceQuestion"
                            :key="i"
                            > 
                           
                            <el-checkbox v-model="t.cqIsRight" :disabled="item.isActive" >{{options[i] }}</el-checkbox>    <!-- 增加多选-->
                            <el-input v-model="t.cqOption" :disabled="item.isActive" style="width:89%;margin-right:1%"></el-input>
                            <el-button type="danger" :disabled="item.isActive" icon="el-icon-delete" @click.prevent="removeGetchoiceQuestion(t,index)" circle size="small" ></el-button>
                        </el-form-item>
                        <el-form-item
                            label="分值"
                            >
                                <el-input-number size="small" :disabled="item.isActive" @change="ChangechoiceNum(index)" v-model="item.GetchoiceQuestionNum"></el-input-number>
                            </el-form-item> 
                            <el-form-item :disabled="item.upData">
                                <el-button @click="GetchoiceQuestionupData(index)" round>编辑</el-button>
                            <el-button @click="cancel(index)" v-if="item.upData" round>取消</el-button>
                            <el-button @click="addGetchoiceQuestionupData(index)"  :disabled="isAddDisabled" v-if="item.upData" type="info" round>新增选项</el-button>
                            <el-button type="primary"  v-if="item.upData" round @click="rightchoiceQuestion(index)">保存修改</el-button>
                            <el-button type="danger"  v-if="item.upData" round @click="removeGetchoice(index)">删除题目</el-button>
                            </el-form-item>    
                    </el-form>
                </div>
                <div>
                    
                </div>
            </el-card>
            <el-card class="box-card" style="margin-top:20px;">
                <div slot="header" class="clearfix" style="font-size:13px;">
                    <span>二、填空题（本题共{{getGapLen}}道小题，共<el-badge :value="getGapNum+'/'+allNum" :max="100" class="item"></el-badge>分）</span>
                    <el-form :model="getGap" v-for="(item,index) in getGap" ref="getGap" label-width="100px" class="demo-dynamic" :key="index"  style="margin-top:20px;">
                            <el-form-item
                            
                            label="题干"
                            
                            >
                                <el-input type="textarea" :rows="1" :disabled="item.isActive" v-model="item.questionTitle"></el-input>
                            </el-form-item>
                            <el-form-item
                            v-for="(t,i) in item.fillQuestion"
                            :key="i"
                            label="参考答案"
                            >
                                <el-input type="textarea" :rows="1"  :disabled="item.isActive" v-model="t.fqAnswer"></el-input>
                            </el-form-item>
                        <el-form-item
                            label="分值"
                            >
                                <el-input-number size="small" @change="ChnagefillQuestionNum(index)" :disabled="item.isActive" v-model="item.tpqScore"></el-input-number>
                            </el-form-item> 
                            <el-form-item :disabled="item.upData">
                                <el-button @click="setGap(index)" round>编辑</el-button>
                            <el-button @click="cancelsetGap(index)" v-if="item.upData" round>取消</el-button>
                            <el-button type="primary"  v-if="item.upData" round @click="rightsetGap(index)">保存修改</el-button>
                            <el-button type="danger"  v-if="item.upData" round @click="removesetGap(index)">删除题目</el-button>
                            </el-form-item>    
                    </el-form>
                </div>
                <div>
                    
                </div>
            </el-card>
            <el-card class="box-card" style="margin-top:20px;">
                <div slot="header" class="clearfix" style="font-size:13px;">
                    <span>三、问答题（本题共{{getessayQuestionLen}}道小题，共<el-badge :value="allgetessayQuestionNum+'/'+allNum" :max="0" class="item"></el-badge>分）</span>
                   <el-form :model="getessayQuestion" v-for="(item,index) in getessayQuestion" ref="getessayQuestion" label-width="100px" class="demo-dynamic" :key="index"  style="margin-top:20px;">
                            <el-form-item
                            
                            label="题干"
                            
                            >
                                <el-input type="textarea" :rows="1" :disabled="item.isActive" v-model="item.questionTitle"></el-input>
                            </el-form-item>
                            <el-form-item
                           
                            label="参考答案"
                            
                            >
                                <el-input type="textarea" :rows="1" :disabled="item.isActive" v-model="item.aqAnswer"></el-input>
                            </el-form-item>
                        <el-form-item
                            label="分值"
                            >
                                <el-input-number size="small" @change="changegetessayQuestion(index)" :disabled="item.isActive" v-model="item.tpqScore"></el-input-number>
                            </el-form-item> 
                            <el-form-item :disabled="item.upData">
                                <el-button @click="getessayQuestions(index)" round>编辑</el-button>
                            <el-button @click="cancelgetessayQuestion(index)" v-if="item.upData" round>取消</el-button>
                            <el-button type="primary"  v-if="item.upData" round @click="rightgetessayQuestion(index)">保存修改</el-button>
                            <el-button type="danger"  v-if="item.upData" round @click="removegetessayQuestion(index)">删除题目</el-button>
                            </el-form-item>    
                    </el-form>
                </div>
                <div>
                    
                </div>
            </el-card>
        </el-card>
        <!--完成-->
        <el-card class="box-card" v-if="active == 2">
        <div slot="header" class="clearfix">
           <div slot="header" class="clearfix">
                <el-steps :active="active" finish-status="success">
                <el-step title="试卷信息"></el-step>
                <el-step title="添加题目"></el-step>
                <el-step title="完成制作"></el-step>
                </el-steps>
            </div>
        </div>
        <div>
            <h4 style="text-align:center;margin-bottom:30px;">{{ruleForm.name}}</h4>
            <el-table
                :data="tableData"
                :span-method="arraySpanMethod"
                border
                style="width: 80%;margin:0px auto;text-align:center;">
                <el-table-column
                prop="name"
                label="科目"
                width="180"
                align="center">
                </el-table-column>
                <el-table-column
                prop="optionNum"
                label="选择题"
                width="180"
                align="center">
                </el-table-column>
                <el-table-column
                prop="fillNum"
                label="填空题"
                align="center">
                </el-table-column>
                <el-table-column
                prop="quesNum"
                label="问答题"
                align="center">
                </el-table-column>
                <el-table-column
                prop="allNum"
                label="总分"
                align="center">
                </el-table-column>
            </el-table>
             <div style="border:1px solid  #EBEEF5;border-top:0px;width:77.9%;margin:0px auto;text-align:center;padding:1%;">
                 <el-button type="primary" @click="prve">上一步</el-button>
             </div>
        </div>
        </el-card>
    </div>
</template>
{
   
}

<script>
    export default {
        name:"MakeTestPaper",
        data(){
            return {
                tableData:[],//完成制作后数据数组
                gapFillingsInputLook:"", //填空题目预览文本
                counts:0,
                testPaperId:"", //试卷id
                active: 0, //步骤条步骤
                ruleForm: { 
                name: '', //试卷名称
                region: '',  //课程选项
                },
                radio: 1, //单选
                rules: {  //表单验证规则
                    name: [
                        { required: true, message: '请输入试卷名称', trigger: 'blur' },
                    ],
                    region: [
                        { required: true, message: '请选择课程', trigger: 'change' }
                    ]
                },
                dynamicValidateForm: {  //选择题
                domains: [
                    {
                    cqOption: '',
                    cqIsRight:false
                    },
                    {
                    cqOption: '',
                    cqIsRight:false
                    },
                    {
                    cqOption: '',
                    cqIsRight:false
                    },
                    {
                    cqOption: '',
                    cqIsRight:false
                    }
                ],
                
                choiceQuestion: '', //选择题题目预览
                gapFilling:'',  //填空题题目预览
                essayQuestion:"",   //简答题题目预览
                reference:''
                },
                choiceQuestionNum:2, //选择题默认分值
                gapFillingNum:2,    //填空题默认分值
                essayQuestionNum:5, //简答题默认分值
                options:["A、","B、","C、","D、","E、","F、"], //选项
                isAddDisabled:false,  //新增选项是否禁用
                isRemoveDisabled:false,//删除选项是否禁用
                GetQuestionType:[], //题目类型数组
                GetAllCourse:[],    //科目类型数组
                checkList: [],
                gapFillings:[], //填空插入题空数组
                counts:0, //题目计数
                getchoiceQuestion:[],//选择题接口请求成功内容防止数组
                getessayQuestion:[],//简答题接口请求成功内容防止数组
                allgetchoiceQuestionNum:0,//选择分数
                allgetchoiceQuestionLen:0,//选择题数量
                allgetessayQuestionNum:0,//简答题分数
                getessayQuestionLen:0,//简答题数量
                getGapNum:0,//填空题分数
                getGapLen:0,//填空题数量
                allNum:0,//总分数
                getGap:[]
            }
        },
         methods: {
             //完成制卷上一步
             prve() {
                 this.active--
                 this.tableData = []
            },
            //布置条切换布置
            submitForm(formName) {
              
                    if(this.active == 0){
                            this.testInfo()
                            this.MakeTestPaper()
                    }else if(this.active == 1){
                            //  this.saveOptionQuestion()
                            // this.savaessayQuestion()
                            // this.savagapFillings()
                            this.tableData.push({
                                name:this.ruleForm.region,
                                optionNum:this.allgetchoiceQuestionNum,
                                fillNum:this.getGapNum,
                                quesNum:this.allgetessayQuestionNum,
                                allNum:this.allNum
                            })
                           
                    }else{
                            console.log("完成制作")
                    }
                    if (this.active++ > 2) this.active = 0; 
            },
            resetForm(formName) {
                 this.$refs[formName].resetFields();
            },
            //删除选项
            removeDomain(item) {
                var index = this.dynamicValidateForm.domains.indexOf(item)
                if (index !== -1) {
                this.dynamicValidateForm.domains.splice(index, 1)
                }
                if(this.dynamicValidateForm.domains.length == 2){
                    this.isRemoveDisabled = true;
                    
                }else{
                    this.isRemoveDisabled = false;
                    this.isAddDisabled = false
                }
            },
            //新增选项
            addDomain() {
                this.dynamicValidateForm.domains.push({
                value: '',
                key: Date.now()
                });
                if(this.dynamicValidateForm.domains.length == 6){
                      this.isAddDisabled = true
                      
                }else{
                    this.isRemoveDisabled = false;
                    this.isAddDisabled = false
                }
            },
            testInfo(){   //题目类型
                var _this = this
                this.axios.get("/api/TestPaper/GetQuestionType")
                .then((res) => {
                        _this.GetQuestionType = res.data
                }).catch((error) => {
                    console.log(error)
                })
            },
            courserInfo(){  //课程
                var _this = this
                this.axios.get("/api/Class/GetAllCourse")
                .then((res) => {
                    // console.log(res.data)
                        _this.GetAllCourse = res.data
                }).catch((error) => {
                    console.log(error)
                })
            },
            MakeTestPaper(){    //制作试卷
                var _this = this
                var typeNum = 0
                if(_this.ruleForm.region == "Web前端开发"){
                       typeNum = 1
                }else if(_this.ruleForm.region == ".NET后台开发"){
                     typeNum = 2
                }else{
                   typeNum = 3
                }
                // console.log(typeNum)
                // console.log(_this.ruleForm.name)
                this.axios.post('/api/TestPaper/MakeTestPaper?uid='+_this.$store.userUid,
                {
                    "tpTitle":_this.ruleForm.name,
                    "tpCourseId":typeNum
                }).then((res) => {
                    // console.log(res.data)
                    _this.testPaperId = res.data.data.testPaperId
                }).catch((error) => {
                    console.log(error)
                })
            },
            //添加题空
            addEmpty(){
                this.counts++
                this.gapFillings.push({
                value: '',
                num:2
                });
                var content = document.getElementById("contentFour")
                var index = content.selectionStart//获取光标
                var strArr = this.deleteEmpty.split("") //分割成数组
                strArr.splice(content.selectionStart, 0, "▂")  //添加
                this.deleteEmpty = strArr.join("")
                
                
            },
            //保存选择题
            saveOptionQuestion(){
                var _this = this
               
                this.axios.post('/api/TestPaper/AddQuestionToTestPaper',{ 
                    "tpqPaperId": 3322,//试卷主键编号
                    "tpqScore": _this.choiceQuestionNum,//分值
                    "tpqQuestion": {
                    "questionTitle": _this.dynamicValidateForm.choiceQuestion, //题目的标题
                    "questionTypeId": 1,//题目的类型 1=选择题 2=填空题 3=问答题
                    "chooseQuestion": _this.dynamicValidateForm.domains
                    }
                }).then((res) => {
                    // console.log(res)
                     console.log(res.data.data.tpqQuestion.chooseQuestion)
                    var choiceQuestions = {
                    choiceQuestion:res.data.data.tpqQuestion.chooseQuestion,
                    GetchoiceQuestionNum:res.data.data.tpqScore,
                    GetchoiceQuestionTitle:res.data.data.tpqQuestion.questionTitle,
                    GetchoiceQuestionId:res.data.data.tpqId,
                    Id:res.data.data.tpqQuestion.questionId,
                    isActive:true,
                    upData:false,
                    }
                    _this.getchoiceQuestion.push(choiceQuestions)
                    console.log(_this.getchoiceQuestion)
                    _this.allgetchoiceQuestionNum+=res.data.data.tpqScore
                    _this.allNum+=res.data.data.tpqScore
                   _this.allgetchoiceQuestionLen +=1
                   if(res.data.code == 0||res.data.code == 1){
                       _this.dynamicValidateForm.choiceQuestion = ""
                       _this.dynamicValidateForm.domains = [ {
                    cqOption: '',
                    cqIsRight:false
                    },
                    {
                    cqOption: '',
                    cqIsRight:false
                    },
                    {
                    cqOption: '',
                    cqIsRight:false
                    },
                    {
                    cqOption: '',
                    cqIsRight:false
                    }]
                                 _this.$message({
                                    message: '添加成功',
                                    type: 'success'
                                    });
                            }else{
                                     _this.$message({
                                        message: '添加失败',
                                        type: 'warning'
                                    });
                            }
                }).catch((error) => {
                    console.log(error)
                })
            },
            GetchoiceQuestionupData(i){
                    this.getchoiceQuestion[i].isActive = false
                     this.getchoiceQuestion[i].upData = true
            },
            //取消
            cancel(i){

                    this.getchoiceQuestion[i].isActive = true
                     this.getchoiceQuestion[i].upData = false
            },
            //修改新增选项
            addGetchoiceQuestionupData(i){
                // console.log(this.getchoiceQuestion)
                if(this.getchoiceQuestion[i].choiceQuestion.length == 6){
                    this.$message({
                    message: '最多添加六个选项',
                    type: 'warning'
                    });
                    return
                }
                this.getchoiceQuestion[i].choiceQuestion.push({
                    cqOption: '',
                    cqIsRight:false
                });
            },
            //修改删除选项
            removeGetchoiceQuestion(item,i){
                     if(this.getchoiceQuestion[i].choiceQuestion.length == 2){
                        this.$message({
                        message: '最少要有两个选项',
                        type: 'warning'
                        });
                        return
                    }
                    var index = this.getchoiceQuestion[i].choiceQuestion.indexOf(item)
                    if (index !== -1) {
                    this.getchoiceQuestion[i].choiceQuestion.splice(index, 1)
                    }
                   
            },
            //删除题目
            removeGetchoice(i){
                 var _this = this
                  this.axios.post('/api/TestPaper/RemoveQuestionFromTestPaper?paperQuestionId='+this.getchoiceQuestion[i].GetchoiceQuestionId).then(
                      (res) => {
                        if(res.data.code == 1){
                           this.allgetchoiceQuestionLen--
                            this.allNum-=this.getchoiceQuestion[i].GetchoiceQuestionNum
                            this.allgetchoiceQuestionNum-=this.getchoiceQuestion[i].GetchoiceQuestionNum
                            this.getchoiceQuestion.splice(i, 1)
                            _this.$message({
                            message: '删除成功',
                            type: 'warning'
                            });
                        }
                      }
                  ).catch((error) => {
                        console.log(error)
                  })
                 
            },
            //保存题目
            rightchoiceQuestion(i){
               var _this = this
               var arr = []
               for (let j = 0; j < _this.getchoiceQuestion[i].choiceQuestion.length; j++) {
                   arr.push({
                       cqId:_this.getchoiceQuestion[i].choiceQuestion[j].cqId,
                       cqOption:_this.getchoiceQuestion[i].choiceQuestion[j].cqOption,
                       cqIsRight:_this.getchoiceQuestion[i].choiceQuestion[j].cqIsRight
                   })
               }
            //    console.log(arr)
                 this.axios.post('/api/TestPaper/ModifyQuestion',{
                            "questionId": _this.getchoiceQuestion[i].Id,
                            "questionTitle": _this.getchoiceQuestion[i].GetchoiceQuestionTitle,
                            "questionTypeId":1,
                            "chooseQuestion": arr
                            }).then((res) => {
                                console.log(res)
                            if(res.data.code == 0||res.data.code == 1){
                                 _this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                    });
                            }else{
                                     _this.$message({
                                        message: '修改失败',
                                        type: 'warning'
                                        });
                            }
                    }).catch((error) => {
                        _this.$message({
                            message: '系统异常',
                            ype: 'warning'
                         });
                    })
                this.getchoiceQuestion[i].isActive = true
                this.getchoiceQuestion[i].upData = false
               
            },
            //选择题分数改变
            ChangechoiceNum(i){
                    if(this.allgetchoiceQuestionNum<this.getchoiceQuestion[i].GetchoiceQuestionNum){
                        this.allgetchoiceQuestionNum++
                        this.allNum++
                    }else{
                        this.allgetchoiceQuestionNum--
                        if(this.getchoiceQuestion[i].GetchoiceQuestionNum == 0){
                            this.removeGetchoice(i)
                        }
                        this.allNum--
                    }
            },
            //简答题保存题目
            savaessayQuestion(){
                var _this = this
               
                this.axios.post('/api/TestPaper/AddQuestionToTestPaper',{
                        "tpqPaperId": 3322, //试卷主键编号
                        "tpqScore": _this.essayQuestionNum,//分值
                        "tpqQuestion": {
                        "questionTitle":_this.dynamicValidateForm.essayQuestion, //题目的标题
                        "questionTypeId": 3,//题目的类型 1=选择题 2=填空题 3=问答题
                        "answerQuestion": {
                        "aqAnswer": _this.dynamicValidateForm.essayQuestion //问答题的答案
                        }
                    }
                }).then((res) => {
                    // console.log(res) 
                     _this.$message({
                                    message: '添加成功',
                                    type: 'success'
                        });
                        _this.dynamicValidateForm.essayQuestio = ""
                        _this.dynamicValidateForm.essayQuestion = ""
                    var essayQuestions = {
                        questionTitle:res.data.data.tpqQuestion.questionTitle,
                        tpqScore:res.data.data.tpqScore,
                        aqAnswer:res.data.data.tpqQuestion.answerQuestion.aqAnswer,
                        isActive:true,
                        upData:false,
                        essayQuestionId:res.data.data.tpqId,
                        Id:res.data.data.tpqQuestion.questionId
                    }
                     
                        
                    _this.getessayQuestionLen+=1
                    _this.allNum+=res.data.data.tpqScore
                    _this.allgetessayQuestionNum+=res.data.data.tpqScore
                    _this.getessayQuestion.push(essayQuestions)
                }).catch((error) => {
                    console.log(error)
                })
            },
            getessayQuestions(i){
                        this.getessayQuestion[i].isActive = false
                        this.getessayQuestion[i].upData = true
            },
            cancelgetessayQuestion(i){
                        this.getessayQuestion[i].isActive = true
                        this.getessayQuestion[i].upData = false
            },
            rightgetessayQuestion(i){
                var _this = this
                 this.axios.post('/api/TestPaper/ModifyQuestion',{
                        "questionId":_this.getessayQuestion[i].Id,
                        "questionTitle": _this.getessayQuestion[i].questionTitle,
                        "questionTypeId": 3,
                        "answerQuestion": {
                        "aqAnswer": _this.getessayQuestion[i].aqAnswer
                        }
                    }).then((res) => {
                            if(res.data.code == 0||res.data.code == 1){
                                 _this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                    });
                            }else{
                                     _this.$message({
                                        message: '修改失败',
                                        type: 'warning'
                                        });
                            }
                    }).catch((error) => {
                        _this.$message({
                            message: '系统异常',
                            ype: 'warning'
                         });
                    })
                     this.getessayQuestion[i].isActive = true
                        this.getessayQuestion[i].upData = false
            },
            changegetessayQuestion(i){
                
                 if(this.allgetessayQuestionNum<this.getessayQuestion[i].tpqScore){
                        this.allgetessayQuestionNum++
                        this.allNum++
                    }else{
                        this.allgetessayQuestionNum--
                        if(this.getessayQuestion[i].tpqScore == 0){
                            this.removegetessayQuestion(i)
                        }
                        this.allNum--
                    }
            },
            removegetessayQuestion(i){
                var _this = this
                  this.axios.post('/api/TestPaper/RemoveQuestionFromTestPaper?paperQuestionId='+this.getessayQuestion[i].essayQuestionId).then(
                      (res) => {
                        if(res.data.code == 1){
                            this.getessayQuestionLen-=1
                            this.allNum -=this.getessayQuestion[i].tpqScore
                            this.allgetessayQuestionNum-=this.getessayQuestion[i].tpqScore
                            this.getessayQuestion.splice(i, 1)
                            _this.$message({
                            message: '删除成功',
                            type: 'success'
                            });
                        }else{
                             _this.$message({
                            message: '删除失败',
                            type: 'warning'
                            });
                        }
                      }
                  ).catch((error) => {
                         _this.$message({
                            message: '系统异常',
                            ype: 'warning'
                         });
                  })
                
            },
            savagapFillings(){
                var _this = this
                this.axios.post('/api/TestPaper/AddQuestionToTestPaper',{
                    "tpqPaperId": 3322,//试卷的编号
                    "tpqScore": 4, //题目的分值
                    "tpqQuestion": {
                    "questionTitle":_this.deleteEmpty,//填空题的标题
                    "questionTypeId": 2,//题目类型 1=选择题 2=填空题 3=问题
                    "fillQuestion": [
                    {
                    "fqOrder": 1,//填空序号
                    "fqAnswer": "行级标签",//第一个空的答案
                    "fillQuestionScore": [
                    {
                    "fqsScore": 2 //第一个空的分值
                    }
                    ]
                    },
                    {
                    "fqOrder": 2,//填空序号
                    "fqAnswer": "块级标签",//第二个空的答案
                    "fillQuestionScore": [
                    {
                    "fqsScore": 2 //第二个空的分值
                    }
                    ]
                    }
                    ]
                    }
                    }).then((res) => {
                    console.log(res) 
                    var gap = {
                            questionTitle:res.data.data.tpqQuestion.questionTitle,
                            tpqScore:res.data.data.tpqScore,
                            fillQuestion:res.data.data.tpqQuestion.fillQuestion,
                            isActive:true,
                            upData:false,
                            fillQuestionId:res.data.data.tpqId,
                            Id:res.data.data.tpqQuestion.questionId
                        }
                        _this.getGapNum+=res.data.data.tpqScore
                         _this.allNum+=res.data.data.tpqScore
                        _this.getGapLen+=1
                        _this.getGap.push(gap)
                }).catch((error) => {
                    console.log(error)
                })
            },
            setGap(i){
                this.getGap[i].isActive = false
                this.getGap[i].upData = true
            },
            cancelsetGap(i){
                this.getGap[i].isActive = true
                 this.getGap[i].upData = false
            },
            rightsetGap(i){
                var _this = this
                this.axios.post('/api/TestPaper/ModifyQuestion',{
                            "questionId":this.getGap[i].Id,
                            "questionTitle": this.getGap[i].questionTitle,
                            "questionTypeId": 2,
                            "fillQuestion": [
                            {
                            "fqAnswer": "ID选择器***",///表示新增
                            "FqOrder":1,//填空的序号
                            },
                            {
                            "fqId": 349,
                            "fqAnswer": "其它选择器",///表示修改
                            "fqOrder":2,//填空的序号
                            }
                            ]
                            }).then((res) => {
                            console.log(res)
                            if(res.data.code == 0||res.data.code == 1){
                                 _this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                    });
                            }else{
                                     _this.$message({
                                        message: '修改失败',
                                        type: 'warning'
                                        });
                            }
                    }).catch((error) => {
                            console.log(error)
                        _this.$message({
                            message: '系统异常',
                            ype: 'warning'
                         });
                    })
                 this.getGap[i].isActive = true
                 this.getGap[i].upData = false
            },
            removesetGap(i){
                var _this = this
                  this.axios.post('/api/TestPaper/RemoveQuestionFromTestPaper?paperQuestionId='+this.getGap[i].fillQuestionId).then(
                      (res) => {
                        if(res.data.code == 1){
                           this.getGapLen-=1
                            this.allNum-=this.getGap[i].tpqScore
                            this.getGapNum-=this.getGap[i].tpqScore
                            this.getGap.splice(i, 1)
                            _this.$message({
                            message: '删除成功',
                            type: 'warning'
                            });
                        }
                      }
                  ).catch((error) => {
                        console.log(error)
                  })
                    
            },
            ChnagefillQuestionNum(i){
                   
                    if(this.getGapNum<this.getGap[i].tpqScore){
                        this.getGapNum++
                        this.allNum++
                    }else{
                        this.getGapNum--
                        if(this.getGap[i].tpqScore == 0){
                            this.removesetGap(i)
                        }
                        this.allNum--
                    }
            }

            
        },
        created(){
            this.courserInfo()
        },
        computed:{
            deleteEmpty:{
                 // getter
                get: function () {
                return this.dynamicValidateForm.gapFilling
                },
                // setter
                set: function (newValue) {
                   this.dynamicValidateForm.gapFilling = newValue
                   this.gapFillingsInputLook = newValue
                   var strArr = this.dynamicValidateForm.gapFilling.split("▂") 
                   if(this.counts == strArr.length-1){
                    }else{
                        this.gapFillings.splice(strArr.length-1,1)
                        this.counts--
                    }
                    this.gapFillingsInputLook = this.gapFillingsInputLook.replace(/▂/gim,"<input v-model='"+JSON.parse(JSON.stringify(this.gapFillings))[0].value+"' style='border:0px;border-bottom:1px solid #ccc;'/>("+JSON.parse(JSON.stringify(this.gapFillings))[0].num+"分)" )
                    
                    
                }
            }
        }
        
    }
</script>


<style lang="less" scoped>
@width:20px;  //基本内外间距
@margin:0px auto; //居中
@stepsWidth:80%; //进度条宽度
@fromWidth:60%; //表单宽度
@selectWidth:100%;//多选框宽度
/deep/ .el-breadcrumb{
    margin-bottom: @width;
}
/deep/ .el-steps.el-steps--horizontal{
    width:@stepsWidth;
    margin:@margin ;
}
/deep/.el-form.demo-ruleForm{
    width:@fromWidth;
    margin:@margin;
    margin-top: 50px;
        .el-select{
            width:@selectWidth;
        }
        .el-form-item.is-required{
            div{
                margin-left: 0px !important;
            }
            .el-form-item__label{
                float:none;
            } 
        }
        .el-form-item:nth-child(3){
            text-align: center;
        }
        .el-form-item:nth-child(3) .el-form-item__content{
            margin-left: 0px !important;
        }
        
}
        /deep/ .el-step__head.is-success{
                    margin-left:@width;
                }
        /deep/  .el-step__head.is-process{
                    margin-left:@width;
                }
        /deep/  .el-step__head.is-wait{
            margin-left:@width;
        }
        /deep/ .el-form-item__content{
            display: flex;
            margin-left: 100px !important;
        }
        /deep/ #showGapFill{
            border:0px;
        }
        /deep/ .gapFillingsInput input{
            border:0px;
            border-bottom: 1px solid #ccc;
            height: 28px;
            border-radius: 0px;
        }
</style>
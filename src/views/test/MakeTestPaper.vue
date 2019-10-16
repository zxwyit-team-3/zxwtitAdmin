<template>
    <div id="MakeTestPaper">
        <el-card class="box-card">
        <div slot="header" class="clearfix">
            <el-steps :active="active" finish-status="success">
                <el-step :title="$t('message.MackTestPaper.testInfo')"></el-step>
                <el-step :title="$t('message.MackTestPaper.addTitle')"></el-step>
                <el-step :title="$t('message.MackTestPaper.completion')"></el-step>
            </el-steps>
        </div>
        <!-- 试卷信息 -->
        <PaperInformation @activeNum = "getActive" v-if="active == 0" />
        <AddTitle v-if="active == 1" @activeNum = "getActive"/>
        <ProductionCompleted v-if="active == 2" @activeNum = "getActive" />
        </el-card>
        
    </div>
</template>


<script>
    import PaperInformation from '../../components/MakeTestPaper/PaperInformation'  //试卷信息组件
    import AddTitle from '../../components/MakeTestPaper/AddTitle'  //完成制作试卷组件
    import ProductionCompleted from '../../components/MakeTestPaper/ProductionCompleted'  //完成制作试卷组件
    export default {
        name:"MakeTestPaper",
        data(){
            return {
                active: 0,  //步骤条进度
            }
        },
        components:{
            /**
             * @param {PaperInformation} 试卷信息
             * @param {AddTitle} 添加题目
             * @param {ProductionCompleted} 完成制作
             */
            PaperInformation,
            AddTitle,
            ProductionCompleted
        },
        methods:{
            getActive(num){  //获取试卷信息传过来的步骤条值
                this.active = num
            }
        }

    }
</script>


<style lang="less" scoped>
/deep/ .el-step__head.is-wait{
    margin-left: 20px;
    }
/deep/ .el-step__head.is-process{
    margin-left: 20px;
    }
/deep/ .el-step__head.is-success{
        margin-left: 20px;
    }
</style>
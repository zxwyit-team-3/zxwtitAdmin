<template>
  <div id="TestPaperId">
    <el-select v-model="val" filterable :placeholder="$t('message.MackTestPaper.selectTest')" @change="changeTestPaperId">
      <el-option v-for="item in getAllTestPaper" :key="item.tpId" :label="item.tpTitle" :value="item.tpId"></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
    data(){
        return {
           getAllTestPaper:[],
           val:'',
        }
    },
    props:{
        TestPaperId:null,
        taskTestPaperId :Number
        }, // 初始化下拉框
    created(){
        let that = this;
        that.val = that.taskTestPaperId
        console.log(that.val)
        that.axios.get(`/api/TestPaper/GetAllTestPaper`).then(res => {
            if(res.data != null) {
                that.getAllTestPaper = res.data;
            }
        })
    },
    methods:{
        changeTestPaperId(){
            let that  = this;
            that.$emit(`childTestPaperId`,that.val)
        },
        // testId(){
        //     let that = this;
        //     that.val = that.TestPaperId = null;
        // }
    },
    // watch:{
    //     TestPaperId(v){
    //         let that = this;
    //         that.testId(v)
    //     }
    // }
};
</script>

<style lang="less" scoped>
.el-select{
    width: 100%;
}
</style>
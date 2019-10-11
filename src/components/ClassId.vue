<template>
  <div id="ClassId">
    <el-select v-model="value" filterable placeholder="请选择班级" @change="changeClass()">
      <el-option v-for="item in getAllClass" :key="item.classId" :label="item.className" :value="item.classId"></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
    data(){
        return {
           getAllClass:[],
           value:Number,
        }
    },
    props:{
        classId:null,
        className:Number
        }, // 初始化下拉框
    created(){
        let that = this;
        // console.log( that.classId)
        that.value = that.className
        that.axios.get(`/api/Class/GetAllClass`).then(res => {
            if(res.data != null) {
                that.getAllClass = res.data;
            }
        })
        
    },
    methods:{
        changeClass(){
            let that  = this;
            that.$emit(`childClassId`,that.value)
            
        },
        
    },
};
</script>

<style lang="less" scoped>
.el-select{
    width: 100%;
}
</style>

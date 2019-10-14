<template>
    <div id="CourseSelect">
            <el-select v-model="course.courseName" placeholder="请选择专业课程">
            <el-option v-for="item in allCourse" :label="item.courseName" :value="item.courseId" :key="item.courseId"></el-option>
            </el-select>
    </div>
</template>

<script>
export default {
    data(){
        return {
            course:{
                courseName:"",
                courseId:0
            },
            allCourse:[]
        }
    },
    methods:{
        getAllCoruse(){
            var _this = this;
            _this.axios.get('/api/Class/GetAllCourse')
            .then((res) => {
                _this.allCourse = res.data
                console.log(_this.allCourse)
                // console.log(res.data)
            })
            .catch((error) => {
                cnosole.log(error)
            })
        }
    },
    created(){
        this.getAllCoruse()
        // console.log(this.allCourse)
    }
}
</script>

<style lang="less" scoped>

</style>
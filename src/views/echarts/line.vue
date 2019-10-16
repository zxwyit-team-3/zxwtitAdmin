<template>
    <div id="line">
        <h2>线性图</h2>
        <div id="myChart" :style="{width: '500px', height: '300px'}"></div>
    </div>
</template>


<script>
    export default {
        name:"classManage",
        data(){
            return {
                
            }
        },
        mounted(){
            this.drawLine();
        },
        methods: {
    drawLine(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption({
            //折线图
            xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] //数据名
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [820, 932, 901, 934, 1290, 1330, 1320], //属性值
                type: 'line'  //类型 有bar柱形 line折线  pie圆饼形式
            }]
            
        });
        }
    }
    }
</script>


<style lang="less" scoped>

</style>
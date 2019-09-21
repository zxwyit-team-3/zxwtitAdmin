<template>
    <div id="bar">
        <h2>柱形图</h2>
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
            
            //柱形图
            title: { text: "" },
            tooltip: {},
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]

           
        });
        }
    }
    }
</script>


<style lang="less" scoped>

</style>
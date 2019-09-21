<template>
    <div id="Circle">
        <h2>环形圆</h2>
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
            //环形圆
             color:['#4472C5','#ED7C30','#80FF80','#FF8096','#800080'],//配置颜色
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎'],
                textStyle: {//------------此处更改表格中的字体颜色
                  fontSize: '12',
                  color:'#fff'
                }
            },
            series: [
                {
                    name:'访问来源',
                    type:'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:[
                        {value:335, name:'直接访问'},
                        {value:310, name:'邮件营销'},
                        {value:234, name:'联盟广告'},
                        {value:135, name:'视频广告'},
                        {value:1548, name:'搜索引擎'}
                    ]
                }
            ]
        });
        }
    }
    }
</script>


<style lang="less" scoped>

</style>
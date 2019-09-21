<!--
   班级管理页面
-->
<template>
    <div id="login">
        <h2><p>{{ $t('language.navbar.contact') }}</p></h2>
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
            //柱形图
            // title: { text: "" },
            // tooltip: {},
            // xAxis: {
            //     data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            // },
            // yAxis: {},
            // series: [{
            //     name: '销量',
            //     type: 'bar',
            //     data: [5, 20, 36, 10, 10, 20]
            // }]

            //环形圆
            //  color:['#4472C5','#ED7C30','#80FF80','#FF8096','#800080'],//配置颜色
            // tooltip: {
            //     trigger: 'item',
            //     formatter: "{a} <br/>{b}: {c} ({d}%)"
            // },
            // legend: {
            //     orient: 'vertical',
            //     x: 'left',
            //     data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎'],
            //     textStyle: {//------------此处更改表格中的字体颜色
            //       fontSize: '12',
            //       color:'#fff'
            //     }
            // },
            // series: [
            //     {
            //         name:'访问来源',
            //         type:'pie',
            //         radius: ['50%', '70%'],
            //         avoidLabelOverlap: false,
            //         label: {
            //             normal: {
            //                 show: false,
            //                 position: 'center'
            //             },
            //             emphasis: {
            //                 show: true,
            //                 textStyle: {
            //                     fontSize: '30',
            //                     fontWeight: 'bold'
            //                 }
            //             }
            //         },
            //         labelLine: {
            //             normal: {
            //                 show: false
            //             }
            //         },
            //         data:[
            //             {value:335, name:'直接访问'},
            //             {value:310, name:'邮件营销'},
            //             {value:234, name:'联盟广告'},
            //             {value:135, name:'视频广告'},
            //             {value:1548, name:'搜索引擎'}
            //         ]
            //     }
            // ]
        });
        }
    }
    }
</script>


<style lang="less" scoped>

</style>
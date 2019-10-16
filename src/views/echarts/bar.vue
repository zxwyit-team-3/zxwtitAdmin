<template>
    <div id="bar">
        <h2>柱形图</h2>
        <div id="EchartsBox">
             <ul id="allMyCharts" :style="MarginLeft">
                <li id="myChart1" :style="{width: '500px', height: '300px'}"></li>
                <li id="myChart2" :style="{width: '500px', height: '300px'}"></li>
                <li id="myChart3" :style="{width: '500px', height: '300px'}"></li>
             </ul>
        </div>
       <ul>
           <li @mouseover="indicatorScroll(0)" class="hoverNum">1</li>
           <li @mouseover="indicatorScroll(1)" class="hoverNum">2</li>
           <li @mouseover="indicatorScroll(2)" class="hoverNum">3</li>
       </ul>
    </div>
</template>


<script>
import { setInterval } from 'timers';
    export default {
        name:"classManage",
        data(){
            return {
                MarginLeft:"",  //控制样式
                num:[0,-500,-1000],//控制外边距
                index:0,  //控制下标
                timer: '', //定时器
                transitionNum:2  //控制过渡
            }
        },
        mounted(){
            this.drawLine();
            // this.timer = setInterval(this.scrollEcharts,3000);
            
        },
       
        methods: {
            //绘制图表方法
            drawLine(){
                // 基于准备好的dom，初始化echarts实例
                let myChart1 = this.$echarts.init(document.getElementById('myChart1'))
                let myChart2 = this.$echarts.init(document.getElementById('myChart2'))
                let myChart3 = this.$echarts.init(document.getElementById('myChart3'))
                // 绘制图表
                myChart1.setOption({               
                        title : {
                                // text: '某站点用户访问来源',
                                // subtext: '纯属虚构',
                                // x:'center'
                            },
                            tooltip : {
                                trigger: 'item',
                                formatter: "{a} <br/>{b} : {c} ({d}%)"
                            },
                            legend: {
                                orient: 'vertical',
                                left: 'left',
                                data: ['图表一','邮件营销','联盟广告','视频广告','搜索引擎']
                            },
                            series : [
                                {
                                    name: '访问来源',
                                    type: 'pie',
                                    radius : '55%',
                                    center: ['50%', '60%'],
                                    data:[
                                        {value:335, name:'图表一'},
                                        {value:310, name:'邮件营销'},
                                        {value:234, name:'联盟广告'},
                                        {value:135, name:'视频广告'},
                                        {value:1548, name:'搜索引擎'}
                                    ],
                                    itemStyle: {
                                        emphasis: {
                                            shadowBlur: 10,
                                            shadowOffsetX: 0,
                                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                                        }
                                    }
                                }
                            ]
                        });
                        myChart2.setOption({               
                        title : {
                                // text: '某站点用户访问来源',
                                // subtext: '纯属虚构',
                                // x:'center'
                            },
                            tooltip : {
                                trigger: 'item',
                                formatter: "{a} <br/>{b} : {c} ({d}%)"
                            },
                            legend: {
                                orient: 'vertical',
                                left: 'left',
                                data: ['图表二','邮件营销','联盟广告','视频广告','搜索引擎']
                            },
                            series : [
                                {
                                    name: '访问来源',
                                    type: 'pie',
                                    radius : '55%',
                                    center: ['50%', '60%'],
                                    data:[
                                        {value:335, name:'图表二'},
                                        {value:310, name:'邮件营销'},
                                        {value:234, name:'联盟广告'},
                                        {value:135, name:'视频广告'},
                                        {value:1548, name:'搜索引擎'}
                                    ],
                                    itemStyle: {
                                        emphasis: {
                                            shadowBlur: 10,
                                            shadowOffsetX: 0,
                                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                                        }
                                    }
                                }
                            ]
                        });
                        myChart3.setOption({               
                        title : {
                                // text: '某站点用户访问来源',
                                // subtext: '纯属虚构',
                                // x:'center'
                            },
                            tooltip : {
                                trigger: 'item',
                                formatter: "{a} <br/>{b} : {c} ({d}%)"
                            },
                            legend: {
                                orient: 'vertical',
                                left: 'left',
                                data: ['图表三','邮件营销','联盟广告','视频广告','搜索引擎']
                            },
                            series : [
                                {
                                    name: '访问来源',
                                    type: 'pie',
                                    radius : '55%',
                                    center: ['50%', '60%'],
                                    data:[
                                        {value:335, name:'图表三'},
                                        {value:310, name:'邮件营销'},
                                        {value:234, name:'联盟广告'},
                                        {value:135, name:'视频广告'},
                                        {value:1548, name:'搜索引擎'}
                                    ],
                                    itemStyle: {
                                        emphasis: {
                                            shadowBlur: 10,
                                            shadowOffsetX: 0,
                                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                                        }
                                    }
                                }
                            ]
                        });
                },
                //轮播方法
                scrollEcharts(){
                  this.MarginLeft = "margin-left:"+this.num[this.index]+"px;transition: "+this.transitionNum+"s;"
                   this.index ++
                   if(this.index>2){
                       this.index = 0
                       this.transitionNum = 0
                   }else{
                       this.transitionNum = 2
                   }
                },
                //指示器切换
                indicatorScroll(i){
                    this.timer = ""
                    this.MarginLeft = "margin-left:"+this.num[i]+"px;transition: "+this.transitionNum+"s;"
                     
                }
        }
    }
</script>


<style lang="less" scoped>
@barWidth:500px; //设置图表容器的宽度为一个让其overflow的时候只显示一个
@barHeight:300px;
@allMyChartsWidth:1500px; //ul宽度设置成三个echarts的宽度让三个图表浮动的平铺
@allMyChartsHeight:300px; //ul高度度设置成一个echarts的宽度
#EchartsBox{
    height: @barHeight;
    width: @barWidth;
    overflow: hidden;
}
#allMyCharts{
    height: @allMyChartsHeight;
    width: @allMyChartsWidth;
    
}
#allMyCharts li{
    list-style: none;
    float: left;
}
.hoverNum{
    list-style: none;
    float: left;
    padding: 0px 10px;
    background-color: red;
    color: white;
    margin: 0px 5px;
    cursor: pointer;
}
</style>
<template>
    <div>
     
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
           
         
            
        },
        methods:{
           
        },

    }
</script>


<style lang="less" scoped>
@slideBoxWidth:400px;//盒子宽度
@slideBoxHeight:190px;//盒子高度
#slideBox{
     width: @slideBoxWidth;
    height: @slideBoxHeight;
    overflow: hidden;
     margin:0px auto;
}
.slide2{
    width: @slideBoxWidth;
    
}
.slide2 li {
    list-style: none;
}
.slide2 li span{
    margin: 0px 5px;
}
.slide2 li span:nth-child(3){
    float: right;
}
</style>
<template>
  <div id="app">
    <div id="nav">
    <router-view />
    </div>
   
  </div>
</template>

<script>
export default {
   data(){
     return {

     }
   },
   components:{
    
   }
}
</script>


<style lang="less">
*{
  padding:0px;
  margin: 0px;
}
html,body{
    width:100%;
    height:100%;
}
#app{
  height:100%;

}
#nav{
  height:100%;
  
}
</style>

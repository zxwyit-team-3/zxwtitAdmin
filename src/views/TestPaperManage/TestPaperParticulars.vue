<template>
    <div id="TestPaperParticulars">

        <AddTitle />
    </div>
</template>

<script>

import AddTitle from '../../components/MakeTestPaper/AddTitle'
import ProductionCompleted from '../../components/MakeTestPaper/ProductionCompleted'
export default {
    data(){
        return {
            page:"",
            code:""
        }
    },
    created() {
    this.getRouterData()
    },
    methods: {
    getRouterData() {
      this.page = this.$route.params.page
      this.code = this.$route.params.code
      console.log('page', this.page)
      console.log('code', this.code)
    }

  },
  components:{
      AddTitle,
      ProductionCompleted
  }
}
</script>


<style lang="less" scoped>

</style>
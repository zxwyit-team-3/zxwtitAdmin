<template>
  <div>
    <!-- 面包屑导航 -->
    <div style="height:30px; line-height:30px;">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>在线测试</el-breadcrumb-item>
        <el-breadcrumb-item>安排测试</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </div>
</template>


<script>
export default {
  name: "classManage",
  data() {
    return {};
  }
};
</script>


<style lang="less" scoped>
</style>
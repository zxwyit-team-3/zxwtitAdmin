<template>
  <div id="ClassId">
    <el-select
      v-model="classId"
      filterable
      placeholder="请选择班级"
      @change="changeClass()"
      ref="classSelect"
    >
      <el-option :value="0" placeholder="请选择班级" :key="0"></el-option>
      <el-option
        v-for="item in getAllClass"
        :key="item.classId"
        :label="item.className"
        :value="item.classId"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  model: {
    prop: "classId", //课程对象，使用v-model，给这个属性赋值
    event: "change" //触发事件，名称可自定义，作用：触发这个事件，将事件的值传递给prop属性
  },
  data() {
    return {
      getAllClass: [],
      classId: undefined
    };
  },
  props: {
    class: {
      required: true,
      type: Object,
    },
    // classId: {
    //   required: true,
    //   type: Number
    // }
  }, // 初始化下拉框
  created() {
    let that = this;
    that.getClass();
  },
  watch: {
    //监听classId的变化，从而改变当前选项
    "course.classId": function (value, old) { 
      this.classId = value;
    }
  },
  methods: {
    getClass() {
      let that = this;
      that.value = that.classId;
      that.axios.get(`/api/Class/GetAllClass`).then(res => {
        if (res.data != null) {
          that.getAllClass = res.data;
        }
      });
      //等待绑定的数据渲染后，重新改变当前选中的值
      that.$nextTick(() => {
        //使用v-model传进来的值，表示当前选中的项
        that.classId = that.class.classId;
      });
    },
    /**
     * 获取焦点
     */
    focus() {
      this.$refs.classSelect.focus();
    },
    changeClass() {
      var that = this;
      var classId = that.getAllClass.find(p => p.classId == that.classId);
      if (!course) {
        course = { classId: 0, className: "请选择课程" }
      } else {
        //深度拷贝副本,目的防止被外界改变
        course = JSON.parse(JSON.stringify(classId))
      }
      that.$emit("childClassId", classId)
    }
  }
};
</script>

<style lang="less" scoped>
.el-select {
  width: 100%;
}
</style>

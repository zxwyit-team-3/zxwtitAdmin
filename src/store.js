import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    access_token:"", //token
    userName:"",    //用户名
    userUid:"",   //用户id
    userHeader:"",  //用户头像
    testPaperId:"", //试卷id
    MultipleChoiceNum:0,
    FillInTheBlanksNum:0,
    ShortAnswerNum:0,
    allTestNum:0,
    testPaperName:"",
    courseId:1
  },
  getters:{
    
  },
  mutations: {

  },
  actions: {

  }
})

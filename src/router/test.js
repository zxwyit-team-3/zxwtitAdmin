import MakeTestPaper from '../views/test/MakeTestPaper.vue';
import TestPaperManage from '../views/test/TestPaperManage.vue';
import TestResult from '../views/test/TestResult.vue';
import TestSetter from '../views/test/TestSetter.vue';
import ViewTestPaper from '../views/test/ViewTestPaper.vue';
export default  [
    {
        path:'/MakeTestPaper',
        name:'MakeTestPaper',
        component:MakeTestPaper
      },
      {
        path:'/TestPaperManage',
        name:'TestPaperManage',
        component:TestPaperManage
      },
      {
        path:'/TestResult',
        name:'TestResult',
        component:TestResult
      },
      {
        path:'/TestSetter',
        name:'TestSetter',
        component:TestSetter
      },
      {
        path:'/ViewTestPaper',
        name:'ViewTestPaper',
        component:ViewTestPaper
      }
]

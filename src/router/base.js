import ClassManage from '../views/base/ClassManage.vue';
import MondifyPassword from '../views/base/MondifyPassword.vue';
import StudentManage from '../views/base/StudentManage.vue';
import TeacherManage from '../views/base/TeacherManage.vue';
import RoleManage from '../views/base/RoleManage.vue';
export default  [
    {
        path:'/ClassManage',
        name:'ClassManage',
        meta:{btnPermissions:[1]},
        component:ClassManage
      },
      {
        path:'/MondifyPassword',
        name:'MondifyPassword',
        component:MondifyPassword
      },
      {
        path:'/StudentManage',
        name:'StudentManage',
        component:StudentManage
      },
      {
        path:'/TeacherManage',
        name:'TeacherManage',
        component:TeacherManage
      },
      {
        path:'/RoleManage',
        name:'RoleManage',
        component:RoleManage
      }
]

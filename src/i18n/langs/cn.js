import zhLocale from 'element-ui/lib/locale/lang/zh-CN' //引入element语言包
const cn = {
    message: {
        'Title': "智学无忧IT教育",
        "TestTitle":"在线测试",
        "BaseTitle":"基本数据",
        "test":[
           
            {"name":"老师出卷"},
            {"name":"试卷管理"},
            {"name":"安排测试"},
            {"name":"批阅试卷"},
            {"name":"测试成绩"}
        ],
        "base":[
            {"name":"班级管理"},
            {"name":"学生管理"},
            {"name":"老师管理"},
            {"name":"修改密码"},
            {"name":"用户管理"}
        ],
        
    },
    ...zhLocale
}
 
export default cn;
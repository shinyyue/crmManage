import Vue from 'vue'
import Router from 'vue-router'
const Login = (resolve) => require(['@/view/Login'], resolve)
const ColumnList = (resolve) => require(['@/view/Column/list'], resolve)
const ColumnSchoolList = (resolve) => require(['@/view/Column/schoolList'], resolve)
const ColumnContentList = (resolve) => require(['@/view/ColumnContent/list'], resolve)
const ColumnContentUpdate = (resolve) => require(['@/view/ColumnContent/update'], resolve)
const CollegeList = (resolve) => require(['@/view/College/list'], resolve)
// const CollegeUpdate = (resolve) => require(['@/view/College/update'], resolve)
Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [{
        path: '*',
        redirect: '/column/list'
    }, {
        path: '/login',
        name: 'Login',
        component: Login
    }, {
        path: '/column/list',
        name: 'columnList',
        component: ColumnList
    }, {
        path: '/column/schoollist',
        name: 'columnSchoolList',
        component: ColumnSchoolList

    }, {
        path: '/columncontent/list',
        name: 'columnContentList',
        component: ColumnContentList
    }, {
        path: '/columncontent/update',
        name: 'columnContentUpdate',
        component: ColumnContentUpdate
    }, {
        path: '/college/list',
        name: 'collegeList',
        component: CollegeList
    }]
})

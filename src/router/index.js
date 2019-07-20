import Vue from 'vue'
import Router from 'vue-router'
const Login = (resolve) => require(['@/view/Login'], resolve)
const ColumnList = (resolve) => require(['@/view/Column/list'], resolve)
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
        // meta: {
        //     requiresAuth: true
        // }
    }, {
        path: '/columncontent/list',
        name: 'columnContentList',
        component: ColumnContentList
        // meta: {
        //     requiresAuth: true
        // }
    }, {
        path: '/columncontent/update',
        name: 'columnContentUpdate',
        component: ColumnContentUpdate
        // meta: {
        //     requiresAuth: true
        // }
    }, {
        path: '/college/list',
        name: 'collegeList',
        component: CollegeList
    }
        // , {
        //     path: '/college/update',
        //     name: 'collegeUpdate',
        //     component: CollegeUpdate
        // }
    ]
})

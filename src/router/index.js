import Vue from 'vue'
import Router from 'vue-router'
const Home = (resolve) => require(['@/view/Home'], resolve)
const Login = (resolve) => require(['@/view/Login'], resolve)
// const IMIndex = (resolve) => require(['@/view/IMService/index'], resolve)
// const IMManage = (resolve) => require(['@/view/IMService/manage'], resolve)
const PatientList = (resolve) => require(['@/view/Patient/list'], resolve)
const PatientDetails = (resolve) => require(['@/view/Patient/details'], resolve)
Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [{
        path: '*',
        redirect: '/home'
    }, {
        path: '/home',
        name: 'Home',
        component: Home,
        meta: {
            requiresAuth: true
        }
    }, {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/patient_list',
        name: 'patientList',
        component: PatientList,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/patient_list/patient_details',
        name: 'patientDetails',
        component: PatientDetails,
        meta: {
            requiresAuth: true
        }
    }
    ]
})

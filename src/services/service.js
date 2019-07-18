import Vue from 'vue'
import {
    API_ROOT
} from '../config'

const loginIn = (data) => {
    return Vue.axios.post(API_ROOT + 'login/login', data)
}

const getColumnList = (data) => {
    return Vue.axios.post(API_ROOT + 'column/columnList', data)
}

const getColumnContentList = (data) => {
    return Vue.axios.post(API_ROOT + 'columnContent/listFront', data)
}

const getCollegeList = (data) => {
    return Vue.axios.post(API_ROOT + 'crmColleController/queryList', data)
}

const getColumnListById = (data) => {
    return Vue.axios.post(API_ROOT + 'crmColleController/queryColumnList', data)
}

// 获得操作权限列表
const getAuthList = (data) => {
    return Vue.axios.post('', data)
}
export default {
    loginIn,
    getAuthList,
    getColumnList,
    getColumnContentList,
    getCollegeList,
    getColumnListById
}

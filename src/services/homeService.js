import Vue from 'vue'
import {
    API_ROOT
} from '../config'

const loginIn = (data) => {
    return Vue.axios.post(API_ROOT + 'login/login', data)
}

// 获得操作权限列表
const getAuthList = (data) => {
    return Vue.axios.post('', data)
}

const getMenus = (data) => {
    return new Promise((resolve) => {
        resolve([])
    })
}
export default {
    loginIn,
    getMenus,
    getAuthList
}

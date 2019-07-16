import Vue from 'vue'
import {
    API_ROOT
} from '../config'

const loginIn = (data) => {
    return Vue.axios.post(API_ROOT + 'im/account/login', data)
}

// 获得操作权限列表
// todo 调用操作权限接口
const getAuthList = (data) => {
    return Vue.axios.post('', data)
}

const getMenus = (data) => {
    // todo 替换为菜单接口
    return Vue.axios.post(API_ROOT + 'newapi/patient/list', data)
}
export default {
    loginIn,
    getMenus,
    getAuthList
}

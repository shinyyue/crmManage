import Vue from 'vue'
import service from '../services/service'
import Common from '../utilities/common'
import {
    MENUS_LIST
} from './mutation-types'

const actions = {
    getLoginIn({
        commit
    }, data) {
        return new Promise((resolve, reject) => {
            service
                .loginIn(data)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },

    manuallyLoginOut({
        commit
    }) {
        localStorage.removeItem('userId')
        localStorage.removeItem('userName')
        return new Promise((resolve) => {
            resolve(true)
        })
    },

    getColumnList({
        commit
    }, data) {
        return new Promise((resolve, reject) => {
            service
                .getColumnList(data)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },

    getColumnContentList({
        commit
    }, data) {
        return new Promise((resolve, reject) => {
            service
                .getColumnContentList(data)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },

    getCollegeList({
        commit
    }, data) {
        return new Promise((resolve, reject) => {
            service
                .getCollegeList(data)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },

    getColumnListById({
        commit
    }, data) {
        return new Promise((resolve, reject) => {
            service
                .getColumnListById(data)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },

    getMenus({
        commit
    }, data) {
        return new Promise((resolve, reject) => {
            const a = [{
                displayName: '栏目列表',
                key: 'column'
            }, {
                displayName: '学院列表',
                key: 'college'
            }]
            commit(MENUS_LIST, a)
            resolve(a)
        })
    },
    getAuthList({
        commit
    }, data) {
        return new Promise((resolve, reject) => {
            service
                .getAuthList(data)
                .then(res => {
                    localStorage.setItem('authList', res)
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
}

const getters = {
    menusList: state => {
        const allMenus = Common.allMenus
        // 菜单权限限制
        state.menusList.map(menu => {
            const index = allMenus.findIndex(allmenu => {
                return allmenu.key === menu.key
            })
            if (menu.subMenu && index >= 0) {
                menu.subMenu.filter(sub => {
                    return allMenus[index].subMenu.indexOf(sub.key) >= 0
                })
            } else {
                return menu
            }
        })
    }
}

const initSate = {
    menusList: []
}

const mutations = {
    [MENUS_LIST](state, data) {
        Vue.set(state, 'menusList', data)
    }
}
export default {
    state: initSate,
    actions,
    getters,
    mutations
}

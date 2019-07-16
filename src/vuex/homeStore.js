import Vue from 'vue'
import service from '../services/homeService'
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
                    if (res.status === 0) {
                        localStorage.setItem('token', res.data.token)
                        localStorage.setItem('userId', res.data.id)
                        localStorage.setItem('userName', res.data.name)
                        localStorage.setItem('product_code', res.data.product_code)
                        localStorage.setItem('userAvt', res.data.avt)
                    }
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
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('product_code')
        localStorage.removeItem('userName')
        return new Promise((resolve) => {
            resolve(true)
        })
    },

    getMenus({
        commit
    }, data) {
        return new Promise((resolve, reject) => {
            service
                .getMenus(data)
                .then(res => {
                    // todo 删除测试数据
                    const a = [{
                        displayName: '患者管理',
                        key: 'patient',
                        subMenu: [{
                            displayName: '患者列表',
                            key: 'patient_list'
                        }]
                    },
                    {
                        displayName: '医学顾问模块',
                        key: 'im',
                        subMenu: [{
                            displayName: '医学顾问会话',
                            key: 'im_index'
                        },
                        {
                            displayName: '医学顾问快捷回复管理',
                            key: 'im_manage'
                        }
                        ]
                    }
                    ]
                    commit(MENUS_LIST, a)
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    getAuthList({
        commit
    }, data) {
        return new Promise((resolve, reject) => {
            service
                .getAuthList(data)
                .then(res => {
                    // todo: 将权限列表存到localStorage
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

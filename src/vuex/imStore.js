import Vue from 'vue'
import {
    WS_INSTANCE,
    WS_KEFUAVATOR,
    WS_THEMELIST
} from './mutation-types'
import service from '../services/imService'

const actions = {
    // wss实例
    setWs({
        commit
    }, data) {
        commit(WS_INSTANCE, data)
    },

    setKefuAvator({
        commit
    }, data) {
        commit(WS_KEFUAVATOR, data)
    },

    getThemeList({
        commit
    }, data) {
        commit(WS_THEMELIST, data)
    },

    addReplyText({
        commit
    }, data) {
        return new Promise((resolve, reject) => {
            service.addReplyText(data).then((res) => {
                resolve(res)
            }).catch((err) => {
                reject(err)
            })
        })
    },

    delReplyText({
        commit
    }, data) {
        return new Promise((resolve, reject) => {
            service.delReplyText(data).then((res) => {
                resolve(res)
            }).catch((err) => {
                reject(err)
            })
        })
    },

    editReplyText({
        commit
    }, data) {
        return new Promise((resolve, reject) => {
            service.editReplyText(data).then((res) => {
                resolve(res)
            }).catch((err) => {
                reject(err)
            })
        })
    },

    addReplyLink({
        commit
    }, data) {
        return new Promise((resolve, reject) => {
            service.addReplyLink(data).then((res) => {
                resolve(res)
            }).catch((err) => {
                reject(err)
            })
        })
    },

    delReplyLink({
        commit
    }, data) {
        return new Promise((resolve, reject) => {
            service.delReplyLink(data).then((res) => {
                resolve(res)
            }).catch((err) => {
                reject(err)
            })
        })
    },

    editReplyLink({
        commit
    }, data) {
        return new Promise((resolve, reject) => {
            service.editReplyLink(data).then((res) => {
                resolve(res)
            }).catch((err) => {
                reject(err)
            })
        })
    },

    getReplyTextList({
        commit
    }, data) {
        return new Promise((resolve, reject) => {
            service.getReplyTextList(data).then((res) => {
                resolve(res)
            }).catch((err) => {
                reject(err)
            })
        })
    },

    getReplyLinkList({
        commit
    }, data) {
        return new Promise((resolve, reject) => {
            service.getReplyLinkList(data).then((res) => {
                resolve(res)
            }).catch((err) => {
                reject(err)
            })
        })
    }
}

const getters = {
    ws: (state) => {
        return state.ws
    },

    kefuAvator: (state) => {
        return state.kefuAvator
    }
}
const initState = {
    ws: null,
    kefuAvator: '',
    themeList: []
}

const mutations = {
    [WS_INSTANCE](state, data) {
        Vue.set(state, 'ws', data)
    },
    [WS_KEFUAVATOR](state, data) {
        Vue.set(state, 'kefuAvator', data)
    },
    [WS_THEMELIST](state, data) {
        Vue.set(state, 'themeList', data)
    }
}
export default {
    state: initState,
    actions,
    getters,
    mutations
}

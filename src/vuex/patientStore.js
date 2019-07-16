import service from '../services/patientService'
// import Vue from 'vue'
// import {
// } from './mutation-types'

const actions = {
    // 获取患者列表
    getPatientLists({
        commit
    }, data) {
        return new Promise((resolve, reject) => {
            service.getPatientLists(data).then((res) => {
                resolve(res)
            }).catch((err) => {
                reject(err)
            })
        })
    },

    getPatientDetails({
        commit
    }, data) {
        return new Promise((resolve, reject) => {
            service.getPatientDetails(data).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },

    changePatientCycle({
        commit
    }, data) {
        return new Promise((resolve, reject) => {
            service.changePatientCycle(data).then((res) => {
                resolve(res)
            }).catch((err) => {
                reject(err)
            })
        })
    },

    updatePatientInfo({
        commit
    }, data) {
        return new Promise((resolve, reject) => {
            service.updatePatientInfo(data).then((res) => {
                resolve(res)
            }).catch((err) => {
                reject(err)
            })
        })
    },

    getCycleRecorList({
        commit
    }, data) {
        return new Promise((resolve, reject) => {
            service.getCycleRecorList(data).then((res) => {
                resolve(res)
            }).catch((err) => {
                reject(err)
            })
        })
    },

    changeCurrentDoctor({
        commit
    }, data) {
        return new Promise((resolve, reject) => {
            service.changeCurrentDoctor(data).then((res) => {
                resolve(res)
            }).catch((err) => {
                reject(err)
            })
        })
    },

    getTodoList({
        commit
    }, data) {
        return new Promise((resolve, reject) => {
            service.getTodoList(data).then((res) => {
                resolve(res)
            }).catch((err) => {
                reject(err)
            })
        })
    },


    // 获取试管档案列表
    getRecordList({
        commit
    }, data) {
        return new Promise((resolve, reject) => {
            service.getRecordList(data).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 获取用户周期数列表
    getPatientCycleList({
        commit
    }, data) {
        return new Promise((resolve, reject) => {
            service.getPatientCycleList(data).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }


} // const getters = {//     getPatientLists: (state) => {//         return state.patientLists//     }// }// const initState = {//     patientLists: []// }// const mutations = {// }
export default {
    // state: initState,
    // getters,
    // mutations,
    actions
}

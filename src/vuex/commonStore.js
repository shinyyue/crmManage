// import Vue from 'vue'
import service from '../services/commonService'

const actions = {
    // 上传图片
    uploadImg({
        commit
    }, data) {
        return new Promise((resolve, reject) => {
            service.uploadImg(data).then((res) => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },

    // 周期状态列表
    getCycleList({
        commit
    }, data) {
        return new Promise((resolve, reject) => {
            service.getCycleList(data).then((res) => {
                resolve(res)
            }).catch((err) => {
                reject(err)
            })
        })
    },

    // 所有的医院列表
    getHospitalList({
        commit
    }, data) {
        return new Promise((resolve, reject) => {
            service.getHospitalList(data).then((res) => {
                resolve(res)
            }).catch((err) => {
                reject(err)
            })
        })
    },

    // 所有的医生列表
    getDoctorList({
        commit
    }, data) {
        return new Promise((resolve, reject) => {
            service.getDoctorList(data).then((res) => {
                resolve(res)
            }).catch((err) => {
                reject(err)
            })
        })
    },

    // 所有的系统标签列表
    getSystemTagList({
        commit
    }, data) {
        return new Promise((resolve, reject) => {
            service.getSystemTagList(data).then((res) => {
                resolve(res)
            }).catch((err) => {
                reject(err)
            })
        })
    },

    // 家族病史列表
    getFamilyDeseaseList({
        commit
    }, data) {
        return new Promise((resolve, reject) => {
            service.getFamilyDeseaseList(data).then((res) => {
                resolve(res)
            }).catch((err) => {
                reject(err)
            })
        })
    }
}

const getters = {}
const initState = {}

const mutations = {}
export default {
    state: initState,
    actions,
    getters,
    mutations
}

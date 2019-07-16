import Vue from 'vue'

import {
    API_ROOT
} from '../config'

const uploadImg = (data) => {
    return Vue.axios.post('https://api.func.futurefertile.com/file/upload', data)
}

// 所有的周期状态列表
const getCycleList = (data) => {
    return Vue.axios.post(API_ROOT + 'base/options/get/type', data)
}

// 所有的医院列表
const getHospitalList = (data) => {
    return Vue.axios.post(API_ROOT + 'user/hospital/all', data)
}

// 所有的医生列表
const getDoctorList = (data) => {
    return Vue.axios.post(API_ROOT + 'user/doctor/all', data)
}

// 所有的系统标签列表
const getSystemTagList = (data) => {
    return Vue.axios.post(API_ROOT + 'base/tag/all', data)
}

// 女方既往病史列表
// const ladyDeseaseList = (data) => {
//     return Vue.axios.post(API_ROOT + '', data)
// }
// 受孕方式列表// const getPregTypeList = (data) => {//     return Vue.axois.post(API_ROOT + '', data)// }

// 家族病史列表
const getFamilyDeseaseList = (data) => {
    return Vue.axios.post(API_ROOT + 'base/option/get/type', data)
}
export default {
    uploadImg,
    getCycleList,
    getHospitalList,
    getDoctorList,
    getSystemTagList,
    // ladyDeseaseList,
    getFamilyDeseaseList
}

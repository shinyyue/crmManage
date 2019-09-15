import Vue from 'vue'
import {
    API_ROOT
} from '../config'

const loginIn = (data) => {
    return Vue.axios.post(API_ROOT + 'login/login', data)
}

const getColumnList = (data) => {
    return Vue.axios.post(API_ROOT + 'crmColleController/querySchoolColumnList', data)
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

const updateCollege = (data) => {
    return Vue.axios.put(API_ROOT + 'crmColleController/updateCrmCollege', data)
}

const addCollege = (data) => {
    return Vue.axios.post(API_ROOT + 'crmColleController/addCrmCollege', data)
}

const deleteCollege = (data) => {
    return Vue.axios.delete(API_ROOT + 'crmColleController/deleteCrmCollege', data)
}

const editCollege = (data) => {
    return Vue.axios.post(API_ROOT + 'crmColleController/updateCrmCollege', data)
}


const editColumn = (data) => {
    return Vue.axios.put(API_ROOT + 'crmColleController/updateColumn', data)
}

const editSchoolColumn = (data) => {
    return Vue.axios.put(API_ROOT + 'crmColleController/updateSchoolColumn', data)
}

const addColumnContent = (data) => {
    return Vue.axios.post(API_ROOT + 'columnContent/add', data)
}

const delColumnContent = (data) => {
    return Vue.axios.delete(API_ROOT + 'columnContent/del', data)
}
const editColumnContent = (data) => {
    return Vue.axios.put(API_ROOT + 'columnContent/update', data)
}

const getColumnContentDetails = (data) => {
    // return Vue.axios.post(API_ROOT + 'columnContent/queryOne', data)
    return Vue.axios.get(API_ROOT + 'columnContent/queryContentById', data)
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
    getColumnListById,
    updateCollege,
    addCollege,
    deleteCollege,
    editCollege,
    editColumn,
    addColumnContent,
    editColumnContent,
    getColumnContentDetails,
    delColumnContent,
    editSchoolColumn
}

import Vue from 'vue'

import {
    API_ROOT
} from '../config'

const getPatientLists = data => {
    return Vue.axios.post(API_ROOT + 'user/patient/all', data)
}

const getPatientDetails = data => {
    return Vue.axios.post(API_ROOT + 'user/patient/view', data)
}

const changePatientCycle = data => {
    return Vue.axios.post(
        API_ROOT + 'user/pcycle/update/pid/' + data.data.pid,
        data
    )
}

const updatePatientInfo = data => {
    return Vue.axios.post(
        API_ROOT + 'user/patient/update/id/' + data.data.patient_id,
        data
    )
}

const getCycleRecorList = data => {
    return Vue.axios.post('http://user.local:8888/cyclerecord/list', data)
}

const changeCurrentDoctor = data => {
    return Vue.axios.post('http://user.local:8888/patient/changedoctor', data)
}

const getTodoList = data => {
    return Vue.axios.post(
        API_ROOT + 'record/todos/pid/' + data.data.patient_id,
        data
    )
}

const getRecordList = data => {
    return Vue.axios.post(API_ROOT + 'user/patient/record', data)
}

const getPatientCycleList = data => {
    return Vue.axios.post(API_ROOT + 'user/patient/cyclelist', data)
}
export default {
    getPatientLists,
    getPatientDetails,
    changePatientCycle,
    updatePatientInfo,
    getCycleRecorList,
    changeCurrentDoctor,
    getTodoList,
    getRecordList,
    getPatientCycleList
}

import Vue from 'vue'
import {
    API_ROOT
} from '../config'

// 快速回复语句列表
const getReplyTextList = (data) => {
    return Vue.axios.post(API_ROOT + 'base/quickreplay/list', data)
}

// 新增快速回复语句
const addReplyText = (data) => {
    return Vue.axios.post(API_ROOT + 'base/quickreplay/add', data)
}

// 删除快速回复语句
const delReplyText = (data) => {
    return Vue.axios.post(API_ROOT + 'base/quickreplay/del', data)
}

// 修改快速回复语句
const editReplyText = (data) => {
    return Vue.axios.post(API_ROOT + 'base/quickreplay/edit', data)
}

// 快速回复链接列表
const getReplyLinkList = (data) => {
    return Vue.axios.post(API_ROOT + 'base/quickhref/list', data)
}

// 新增快速回复语句
const addReplyLink = (data) => {
    return Vue.axios.post(API_ROOT + 'base/quickhref/add', data)
}

// 删除快速回复语句
const delReplyLink = (data) => {
    return Vue.axios.post(API_ROOT + 'base/quickhref/del', data)
}

// 修改快速回复语句
const editReplyLink = (data) => {
    return Vue.axios.post(API_ROOT + 'base/quickhref/edit', data)
}
export default {
    getReplyTextList,
    addReplyText,
    delReplyText,
    editReplyText,
    addReplyLink,
    delReplyLink,
    editReplyLink,
    getReplyLinkList
}

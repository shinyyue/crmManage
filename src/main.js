// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 按需引入组件，减少打包后的vendor体积
import 'element-ui/lib/theme-chalk/index.css'
import '../theme/index.css'
import {
    Collapse,
    CollapseItem,
    Row,
    Col,
    Main,
    Button,
    Form,
    FormItem,
    Input,
    Pagination,
    Table,
    TableColumn,
    Loading,
    Menu,
    Submenu,
    MenuItem,
    MenuItemGroup,
    Slider,
    Notification,
    Upload,
    Dialog,
    Message, // eslint-disable-line
    MessageBox, // eslint-disable-line
    Popover,
    DatePicker,
    Select,
    Option,
    OptionGroup,
    Tabs,
    TabPane,
    TimePicker,
    Cascader,
    Checkbox,
    CheckboxButton,
    CheckboxGroup,
    Tag,
    Alert
} from 'element-ui'
import axios from './utilities/custom-axios'
import VueAxios from 'vue-axios'
import Vuex from 'vuex'
import store from './vuex/store'
import Layout from './view/Layout'
import TimeFormat from './utilities/timeFormat'
import TableList from './components/tableList'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Row)
Vue.use(Col)
Vue.use(Main)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Pagination)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Loading)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Slider)
Vue.use(Upload)
Vue.use(Dialog)
Vue.use(Popover)
Vue.use(DatePicker)
Vue.use(Select)
Vue.use(Option)
Vue.use(OptionGroup)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(TimePicker)
Vue.use(Cascader)
Vue.use(Checkbox)
Vue.use(CheckboxButton)
Vue.use(CheckboxGroup)
Vue.use(Tag)
Vue.use(Alert)
Vue.use(VueQuillEditor)

Vue.prototype.$msgbox = MessageBox
Vue.prototype.$notify = Notification
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message
Vue.prototype.$alert = MessageBox.alert

Vue.use(VueAxios, axios)
Vue.use(Vuex)
Vue.use(TimeFormat)

Vue.config.productionTip = false

Vue.component(Layout.name, Layout)
Vue.component(TableList.name, TableList)

Vue.prototype.API_ROOT = (process.env.NODE_ENV === 'production') ?
    'http://47.105.130.130:8080/' : 'http://47.105.130.130:8080/'

// 路由拦截
router.beforeEach((to, from, next) => {
    // const user = localStorage.getItem('userId') && localStorage.getItem('userId') !== 'undefined' && JSON.parse(localStorage.getItem('userId'))
    // const isNotLogined = !user // 无token去登录
    // if (!isNotLogined && to.name !== 'Login') {
    //     next({
    //         path: '/login',
    //         query: {
    //             redirect: to.fullPath
    //         }
    //     })
    // } else {
    next()
    // }
})

// 接口请求拦截
Vue.axios.interceptors.request.use(conf => Object.assign({}, conf, {
    headers: {
        // token: ''
    }
}), err => Promise.reject(err))

// 响应拦截
Vue.axios.interceptors.response.use((res) => {
    if (res && res.status.toString() === '500') {
        return Promise.reject(new Error('服务器错误'))
    } else if (res && res.status.toString() === '200') {
        return Promise.resolve(res.data)
    } else {
        return Promise.reject(res)
    }
}, (err) => {
    if (err && err.code === 'ECONNABORTED') {
        return Promise.reject(err)
    } else if (err && err.message === 'Network Error') {
        return Promise.reject(err)
    } else {

        return Promise.reject(err)
    }
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: {
        App
    },
    template: '<App/>'
})

import Vue from 'vue'
import Vuex from 'vuex'

import homeStore from './homeStore'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        homeStore
    },
    strict: process.env.NODE_ENV !== 'production'
})

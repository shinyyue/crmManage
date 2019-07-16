import Vue from 'vue'
import Vuex from 'vuex'

import homeStore from './homeStore'
import commonStore from './commonStore'
import imStore from './imStore'
import patientStore from './patientStore'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        homeStore,
        commonStore,
        imStore,
        patientStore
    },
    strict: process.env.NODE_ENV !== 'production'
})

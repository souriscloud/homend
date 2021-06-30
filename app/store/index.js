import Vue from 'nativescript-vue'
import Vuex from 'vuex'

import auth from './auth.store'
import channels from './channels.store'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    someGlobalStateVariable: false
  },
  modules: {
    auth,
    channels
  }
})

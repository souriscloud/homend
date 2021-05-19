import Vue from 'nativescript-vue'

import { FontIcon, fonticon } from '@nativescript-community/fonticon'

// NativeScript plugins imports
import RadSideDrawer from 'nativescript-ui-sidedrawer/vue'

// NativeScript plugins init
Vue.use(RadSideDrawer)

import App from './App'
import store from './store'

// FontIcon plugin
FontIcon.paths = {
  fa: './fonts/fa.css'
}
FontIcon.loadCss()
Vue.filter('fonticon', fonticon)

new Vue({
  render: h => h(App),
  store
}).$start()

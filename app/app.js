import Vue from 'nativescript-vue'

// NativeScript plugins imports
import { FontIcon, fonticon } from '@nativescript-community/fonticon'
import RadSideDrawer from 'nativescript-ui-sidedrawer/vue'
import { firebase } from '@nativescript/firebase'

import App from './App'
import store from './store'

// NativeScript plugins init
Vue.use(RadSideDrawer)

// FontIcon plugin
FontIcon.paths = {
  fa: './fonts/fa.css'
}
FontIcon.loadCss()
Vue.filter('fonticon', fonticon)

let vueFirebaseWasInit = false

// Firebase
firebase.init({
  showNotifications: false,
  showNotificationsWhenInForeground: false
})
  .then(() => {
    vueFirebaseWasInit = true
  })
  .catch(err => {
    vueFirebaseWasInit = false
    console.error('firebase.init error')
    console.log(err)
  })

// Vue prototype alterations
Vue.prototype.$firebaseWasInit = () => { return vueFirebaseWasInit }

new Vue({
  render: h => h(App),
  store
}).$start()

import { firebase } from '@nativescript/firebase'
import { crashlytics } from '@nativescript/firebase/crashlytics'

export default {
  namespaced: true,

  state: {
    loggedIn: false,
    busy: false,
    test: 'abc',
    data: {},
    fcmToken: null
  },

  mutations: {
    setBusy (state, busy = true) {
      state.busy = busy
    },

    setLoggedIn (state, loggedIn = true) {
      state.loggedIn = loggedIn
    },

    setData (state, data = {}) {
      state.data = data
    },

    setFCMToken (state, fcmToken = null) {
      state.fcmToken = fcmToken
      console.log('FCMToken was updated to:', fcmToken)
    }
  },

  actions: {
    async logIn ({ commit, dispatch }) {
      commit('setBusy')
      try {
        const firebaseResult = await firebase.login({
          type: firebase.LoginType.GOOGLE
        })
        console.log('firebase.login OK', firebaseResult)
        commit('setData', firebaseResult)
        crashlytics.setUserId(firebaseResult.uid)
        await firebase.registerForPushNotifications({
          onPushTokenReceivedCallback: fcmToken => {
            dispatch('fcmTokenReceived', { fcmToken })
          },
          showNotifications: true,
          showNotificationsWhenInForeground: true,
          onMessageReceivedCallback: message => {
            console.log('message received')
            console.log(message)
          }
        })
        console.log('FCM registered')
        commit('setLoggedIn')
        commit('setBusy', false)
        return true
      } catch (firebaseError) {
        console.error('firebase.login error')
        console.log(firebaseError)
        commit('setLoggedIn', false)
        commit('setBusy', false)
        return false
      }
    },

    async logOut ({ commit }) {
      await firebase.logout()
      await firebase.unregisterForPushNotifications()
      commit('setLoggedIn', false)
    },

    fcmTokenReceived({ commit }, { fcmToken }) {
      commit('setFCMToken', fcmToken)
    }
  }
}

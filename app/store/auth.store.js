import { firebase } from '@nativescript/firebase'
import { crashlytics } from '@nativescript/firebase/crashlytics'

export default {
  namespaced: true,

  state: {
    loggedIn: false,
    busy: false,
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
      console.log('[Firebase] [FCM] Token was updated to:', fcmToken)
    }
  },

  actions: {
    async logIn ({ commit, dispatch }) {
      commit('setBusy')
      let alreadyLoggedIn = null
      try {
        alreadyLoggedIn = await firebase.getCurrentUser()
        if (alreadyLoggedIn) {
          console.log('[Firebase] [GoogleAuth] User was previously logged in.')

        }
      } catch (notLoggedInErr) {
        console.log('[Firebase] [GoogleAuth] User was not previously logged in, let him do so.')
      }

      const onLoginSuccess = async userResponse => {
        console.log('[Firebase] [GoogleAuth] User is authenticated!')
        commit('setData', userResponse)
        crashlytics.setUserId(userResponse.uid)
        await firebase.registerForPushNotifications({
          onPushTokenReceivedCallback: fcmToken => {
            dispatch('fcmTokenReceived', { fcmToken })
          },
          showNotifications: false,
          showNotificationsWhenInForeground: false
        })
        commit('setLoggedIn')
        console.log(userResponse)
        commit('setBusy', false)
      }

      if (!!alreadyLoggedIn) {
        console.log('[Firebase] [GoogleAuth] Skipping login dialog.')
        await onLoginSuccess(alreadyLoggedIn)
        return true
      }

      try {
        const firebaseResult = await firebase.login({
          type: firebase.LoginType.GOOGLE
        })
        await onLoginSuccess(firebaseResult)
        return true
      } catch (firebaseError) {
        console.error('[Firebase] [GoogleAuth] Error when authenticating user!')
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
      console.log('[Firebase] [GoogleAuth] Sign out was completed!')
    },

    fcmTokenReceived({ commit }, { fcmToken }) {
      commit('setFCMToken', fcmToken)
    }
  }
}

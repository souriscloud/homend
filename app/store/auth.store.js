import { firebase } from '@nativescript/firebase'
import { crashlytics } from '@nativescript/firebase/crashlytics'

export default {
  namespaced: true,

  state: {
    loggedIn: false,
    busy: false,
    test: 'abc',
    data: {}
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
    }
  },

  actions: {
    async logIn ({ commit }) {
      commit('setBusy')
      try {
        const firebaseResult = await firebase.login({
          type: firebase.LoginType.GOOGLE
        })
        console.log('firebase.login OK', firebaseResult)
        commit('setData', firebaseResult)
        crashlytics.setUserId(firebaseResult.uid)
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
      commit('setLoggedIn', false)
    }
  }
}

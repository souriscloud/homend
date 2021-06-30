import { firebase } from '@nativescript/firebase'
import { crashlytics } from '@nativescript/firebase/crashlytics'
import { createOrFetchUser, updateFCM, updateFriendList, isUserValid } from '~/api/users.api'

export default {
  namespaced: true,

  state: {
    loggedIn: false,
    busy: false,
    data: {},
    storeData: {},
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

    setStoreData (state, storeData = {}) {
      state.storeData = storeData
    },

    setFCMToken (state, fcmToken = null) {
      state.fcmToken = fcmToken
      console.log('[Firebase] [FCM] Token was updated to:', fcmToken)
    },

    setFriendList(state, friendList = []) {
      state.storeData.friendList = friendList
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
        let firestoreUser = await createOrFetchUser(userResponse)
        commit('setStoreData', firestoreUser)
        crashlytics.setUserId(userResponse.uid)
        await firebase.registerForPushNotifications({
          onPushTokenReceivedCallback: async fcmToken => {
            dispatch('fcmTokenReceived', { fcmToken })
            if (!firestoreUser.fcmToken || firestoreUser.fcmToken !== fcmToken) {
              console.log('[Firebase] [Firestore] Updating user token!')
              await updateFCM(userResponse.uid, fcmToken)
              let firestoreUser = await createOrFetchUser(userResponse)
              commit('setStoreData', firestoreUser)
            }
          },
          showNotifications: false,
          showNotificationsWhenInForeground: false
        })
        commit('setLoggedIn')
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

    async reloadStoreData ({ commit, state }) {
      let firestoreUser = await createOrFetchUser(state.data.uid)
      commit('setStoreData', firestoreUser)
    },

    async logOut ({ commit }) {
      await firebase.logout()
      await firebase.unregisterForPushNotifications()
      commit('setLoggedIn', false)
      console.log('[Firebase] [GoogleAuth] Sign out was completed!')
    },

    fcmTokenReceived({ commit }, { fcmToken }) {
      commit('setFCMToken', fcmToken)
    },

    async addFriend ({ commit, state }, { friendUID }) {
      if (state.storeData.friendList && state.storeData.friendList.includes(friendUID)) {
        console.log('user exists')
        return false
      }

      if (!await isUserValid(friendUID)) {
        console.log('not valid user')
        return false
      }

      const friendList = [...state.storeData.friendList || [], friendUID]
      commit('setFriendList', friendList)
      await updateFriendList(state.data.uid, friendList)
      return true
    }
  }
}

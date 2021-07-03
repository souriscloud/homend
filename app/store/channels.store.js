import { ObservableArray } from '@nativescript/core'
import { retrieveFriendsFromFriendList } from '~/api/channels.api'

export default {
  namespaced: true,

  state: {
    friends: new ObservableArray([]),
    target: null
  },

  mutations: {
    updateFriends (state, friends = []) {
      state.friends = new ObservableArray(friends)
    },

    setTarget (state, target = null) {
      state.target = target
    }
  },

  actions: {
    async refreshFriends ({ commit, rootState }) {
      const retrieved = await retrieveFriendsFromFriendList(rootState.auth.storeData.friendList)
      console.log('[Channels] FriendList refreshed!')
      commit('updateFriends', retrieved)
    },

    resetTarget ({ commit }) {
      commit('setTarget')
    },

    setTarget ({ commit }, target) {
      commit('setTarget', target)
    }
  }
}

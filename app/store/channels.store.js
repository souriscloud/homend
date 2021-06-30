import { ObservableArray } from '@nativescript/core'
import { retrieveFriendsFromFriendList } from '~/api/channels.api'

export default {
  namespaced: true,

  state: {
    friends: new ObservableArray([])
  },

  mutations: {
    updateFriends (state, friends = []) {
      state.friends = new ObservableArray(friends)
    }
  },

  actions: {
    async refreshFriends ({ commit, rootState }) {
      const retrieved = await retrieveFriendsFromFriendList(rootState.auth.storeData.friendList)
      console.log('[Channels] FriendList refreshed!')
      commit('updateFriends', retrieved)
    }
  }
}

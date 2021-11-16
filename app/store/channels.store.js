import { ObservableArray } from '@nativescript/core'
// import { Sound } from 'nativescript-forgm-sound'
import { TNSPlayer } from 'nativescript-audio'
import { Vibrate } from 'nativescript-vibrate'
import { retrieveFriendsFromFriendList, retrieveUserChannel, retrieveChannelMessages, retrieveOmniChannel, sendMessage, updateChannelUnread } from '~/api/channels.api'
import ChannelMessagesDb from "~/firestore/channel-messages.db";

export default {
  namespaced: true,

  state: {
    friends: new ObservableArray([]),
    target: null,
    channels: new ObservableArray([]),
    messages: new ObservableArray([]),
    currentChannel: null,
    loadingMessages: false,
    loadingMessagesStateCallback: null,
    messagesListener: null
  },

  mutations: {
    updateFriends (state, friends = []) {
      state.friends = new ObservableArray(friends)
    },

    setTarget (state, target = null) {
      state.target = target
    },

    updateChannels (state, channels = []) {
      state.channels = new ObservableArray(channels)
    },

    updateMessages (state, messages = []) {
      state.messages = new ObservableArray(messages)
      state.loadingMessages = false
      if (state.loadingMessagesStateCallback) state.loadingMessagesStateCallback(false)
    },

    updateCurrentChannel (state, currentChannel = null) {
      state.currentChannel = currentChannel
    },

    updateLoadingMessages (state, loadingMessages = true) {
      if (state.loadingMessagesStateCallback) state.loadingMessagesStateCallback(loadingMessages)
      state.loadingMessages = loadingMessages
    },

    updateLoadingMessagesStateCallback (state, loadingMessagesStateCallback = null) {
      state.loadingMessagesStateCallback = loadingMessagesStateCallback
    },

    updateMessageListener (state, messageListener = null) {
      state.messagesListener = messageListener
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
    },

    async loadChannels ({ commit, rootState }) {
      console.log('[Channels] Loading all available channels for UID:', rootState.auth.data.uid)
      commit('updateChannels', rootState.auth.storeData.channelList || [])
    },

    async selectOmniChannel ({ commit }) {
      const channel = await retrieveOmniChannel()
      commit('updateCurrentChannel', channel)
      commit('updateLoadingMessages')
      const messages = await retrieveChannelMessages('omnichannel')
      commit('updateMessages', messages)
      console.log('[Channels] OmniChannel has been fetched')
    },

    async switchChannel ({ commit, dispatch, rootState }, otherParticipantUID) {
      const channel = await retrieveUserChannel(rootState.auth.data.uid, otherParticipantUID)
      if (!channel) return

      commit('updateCurrentChannel', channel)
      dispatch('subscribeMessages')
      if (await dispatch('auth/addChannel', channel.id, { root: true })) console.log('[Channels] Channel was not in list, so now has been added!')
      // await dispatch('reloadMessages')
      console.log('[Channels] Channel has been fetched', channel.id)
    },

    async reloadMessages ({ commit, state }) {
      commit('updateLoadingMessages')
      const messages = await retrieveChannelMessages(state.currentChannel.id)
      commit('updateMessages', messages)
      if (state.currentChannel.id === 'omnichannel') return
      await updateChannelUnread(state.currentChannel.id, state.currentChannel.otherParticipantUID);
    },

    async clearChannel ({ commit }) {
      commit('updateLoadingMessages')
      commit('updateMessages', [])
      commit('unsubscribeMessages')
      commit('updateCurrentChannel', null)
    },

    async sendMessage ({ dispatch, rootState, state }, messageBody) {
      console.log('[Channels] sending message')
      const message = await sendMessage(rootState.auth.data.uid, state.currentChannel.id, messageBody)
      console.log('[Channels] should be sent')
      // dispatch('reloadMessages')
    },

    setLoadingMessagesStateCallback ({ commit }, callback = null) {
      commit('updateLoadingMessagesStateCallback', callback)
    },

    async playMessageReceivedEvents () {
      const snd = new TNSPlayer()
      const vbr = new Vibrate()

      vbr.vibrate([1000, 333, 666, 333])

      try {
        await snd.playFromFile({
          audioFile: '~/audio/msg-rec.mp3',
          loop: false
        })
      } catch (snderr) {
        console.log('SoundError')
        console.log(snderr)
      }
    },

    subscribeMessages ({ commit, state }) {
      const unsubscribe = (new ChannelMessagesDb(state.currentChannel.id)).simpleSub(async mapped => {
        commit('updateMessages', mapped)
        await updateChannelUnread(state.currentChannel.id, state.currentChannel.otherParticipantUID);
      })
      commit('updateMessageListener', unsubscribe)
    },

    unsubscribeMessages ({ commit, state }) {
      if (state.messagesListener) {
        state.messagesListener()
        commit('updateMessageListener')
      }
    }
  }
}

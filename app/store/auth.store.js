export default {
  namespaced: true,

  state: {
    loggedIn: false,
    busy: false,
    test: 'abc'
  },

  mutations: {
    setBusy (state, busy = true) {
      state.busy = busy
    },

    setLoggedIn (state, loggedIn = true) {
      state.loggedIn = loggedIn
    }
  },

  actions: {
    async logIn ({ commit }, { success, failure }) {
      commit('setBusy')
      await (new Promise((res, rej) => { setTimeout(res, 2000) }))
      commit('setBusy', false)
      commit('setLoggedIn')
      if (success) {
        success()
      }
    },

    logOut ({ commit }, { done }) {
      commit('setLoggedIn', false)
      done()
    }
  }
}

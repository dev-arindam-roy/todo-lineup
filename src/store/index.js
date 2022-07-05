import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoggedIn: false,
    authUser: {}
  },
  getters: {
  },
  mutations: {
    setIsLoggedIn (state, payload) {
      state.isLoggedIn = payload
    },
    setAuthUser (state, payload) {
      state.authUser = payload
    }
  },
  actions: {
  },
  modules: {
  }
})

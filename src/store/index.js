import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authorized: false,
    loginInfo: { 
      userID: 'defaultID',
      userName: '七海nana7mi',
      password: 'default password',
      token: 'default token'
    },
  },
  mutations: {
    login(state,loginInfo) {
      state.loginInfo = loginInfo
      state.authorized = true
    },
    leave(state) {
      state.authorized = false
    }
  },
  actions: {
  },
  modules: {
  }
})

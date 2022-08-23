import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  actions: {},
  mutations: {
    //设置用户个人信息
    SetUserInfo(state, value) {
      state.userInfo = value;
    },
  },
  state: {
    userInfo: {},
  },
});

import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
var sessionState = JSON.parse(window.sessionStorage.getItem("state"));

export default new Vuex.Store({
  actions: {},
  mutations: {
    //设置用户个人信息
    SetUserInfo(state, value) {
      state.userInfo = value;
    },

    //更改用户的账户余额
    SetUserCoinCount(state, value) {
      state.userInfo.count = value;
    },
  },
  state: sessionState
    ? sessionState
    : {
        userInfo: {},
      },
});

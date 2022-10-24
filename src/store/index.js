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

    //设置用户盒子表示信息
    SetUserBoxSigns(state, value) {
      state.boxSigns = value;
    },
  },
  state: sessionState
    ? sessionState
    : {
        //用户信息
        userInfo: {},
        //用户盒子标识信息,包括盒子标题和Id
        boxSigns: [],
        //文件上传的类型限制
        uploadFileTypeLimits: {
          box: ".c, .cpp, .cs, .css, .excel, .exe, .html, .java, .jif, .jpeg, .jpg, .png, .js, .md, .mp3, .mp4, .php, .png, .ppt , .pptx, .ps, .ps1, .py, .rar, .sql, .txt, .vue, .webp, .xml, .zip, .pdf, .doc, .docx, .xls, .xlsx",
          image: " .jif, .jpeg, .jpg, .webp, .png",
        },
        baseUrl: "http://localhost:3006/"
      },
});

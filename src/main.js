import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/element.js";
import "./assets/css/global.css";
import axios from "axios";
import moment from "moment";
import Nprogress from "nprogress";
import "nprogress/nprogress.css";
import VueCookies from "vue-cookies";
import { v4 as uuid } from "uuid";

Vue.use(VueCookies);

//设置避免生产环境错误提示
Vue.config.productionTip = false;
//绑定axios到原型对象实例属性http上
Vue.prototype.$http = axios;
//设置axios的默认地址
axios.defaults.baseURL = "/api";
//绑定moment到原型对象实例属性moment上
Vue.prototype.$moment = moment;
//绑定uuid到原型对象实例属性uuid上
Vue.prototype.$uuid = uuid;

// 在request拦截器中展示进度条,NProgress.start()
axios.interceptors.request.use(
  (config) => {
    const token = JSON.parse(window.sessionStorage.getItem("token"));
    // 判断是否存在token，如果存在的话，则每个http header都加上token
    if (token) config.headers.token = token; //请求头加上token
    Nprogress.start();
    return config;
  },
  (error) => {
    return Promise.error(error);
  }
);

// 在response拦截器中隐藏进度条,NProgress.done()
axios.interceptors.response.use(
  (response) => {
    if (response.data.code == 403) {
      ElementUI.Message({
        message: "当前登录已失效，请重新登录",
        center: true,
        type: "error",
      });
      router.replace({ path: "/login" });
    }
    Nprogress.done();
    return response;
  },
  (error) => {
    return Promise.error(error);
  }
);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

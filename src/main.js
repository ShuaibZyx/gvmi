import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/element.js";
import "./assets/css/global.less";
import axios from "axios";
import moment from "moment";
import Nprogress from "nprogress";
import "nprogress/nprogress.css";
import VueCookies from "vue-cookies";
import { v4 as uuid } from "uuid";
import methods from "./assets/js/methods";
import VideoPlayer from "vue-video-player";
import ElementUI from "element-ui";

require("video.js/dist/video-js.css");
require("vue-video-player/src/custom-theme.css");

Vue.use(VideoPlayer);
Vue.use(VueCookies);
Vue.mixin(methods);

//设置避免生产环境错误提示
Vue.config.productionTip = false;
//绑定axios到原型对象实例属性http上
Vue.prototype.$http = axios;
//设置axios的默认地址和最长请求时间
axios.defaults.baseURL = "/api";
axios.defaults.timeout = 10000;
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
    ElementUI.Loading.service({
      text: "努力加载中🥶...",
      background: "rgba(0, 0, 0, 0)",
    });
    return config;
  },
  (error) => {
    return Promise.error(error);
  }
);

// 在response拦截器中隐藏进度条,NProgress.done()
axios.interceptors.response.use(
  (response) => {
    if (response.data.code === 403) {
      ElementUI.Message({
        message: "当前登录已失效，请重新登录",
        center: true,
        type: "error",
      });
      window.sessionStorage.removeItem("userId");
      window.sessionStorage.removeItem("token");
      router.replace({ path: "/login" });
    }
    Nprogress.done();
    Vue.nextTick(() => {
      // 以服务的方式调用的 Loading 需要异步关闭
      ElementUI.Loading.service().close();
    });
    return response;
  },
  (error) => {
    return Promise.error(error);
  }
);

//全局过滤器---时间格式转换
Vue.filter("dateFormat", function (time) {
  return moment(time).format("YYYY-MM-DD");
});

//全局过滤器---字节单位转换
Vue.filter("bytesToSize", function (bytes) {
  if (bytes === 0) return "0 B";
  var k = 1000,
    sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
});

//全局过滤器---数量单位转换
Vue.filter("numberFormat", function (number) {
  if (number > 100000) number = parseInt(number / 10000) + "万";
  return number;
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

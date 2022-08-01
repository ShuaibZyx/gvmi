import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/global.css'
import axios from "axios"
import moment from "moment";
import Nprogress from "nprogress";
import "nprogress/nprogress.css";
import VueCookies from "vue-cookies";

Vue.use(VueCookies);

Vue.config.productionTip = false
Vue.prototype.$http = axios;
Vue.prototype.$moment = moment;

// 在request拦截器中展示进度条,NProgress.start()
axios.interceptors.request.use((config) => {
  Nprogress.start();
  return config;
});

// 在response拦截器中隐藏进度条,NProgress.done()
axios.interceptors.response.use((config) => {
  Nprogress.done();
  return config;
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

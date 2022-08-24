import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const Layout = () => import("../components/Layout.vue");
const Login = () => import("../components/Login.vue");
const Home = () => import("../views/Home.vue");
const Forum = () => import("../views/Forum.vue");
const Carton = () => import("../views/Carton.vue");

const originalPush = VueRouter.prototype.push;

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

const router = new VueRouter({
  routes: [
    { path: "/", redirect: "/layout" },
    { path: "/login", component: Login },
    {
      path: "/layout",
      component: Layout,
      redirect: "/home",
      children: [
        {
          path: "/home",
          component: Home,
        },
        {
          path: "/forum",
          component: Forum,
        },
        {
          path: "/carton",
          component: Carton,
        },
      ],
    },
  ],
});

// 挂载路由前置守卫
router.beforeEach((to, from, next) => {
  // to表示将要访问的路径
  // from表示从哪个路径而来
  // next表示是否放行next()放行 或 next('')跳转走

  //首先判断用户是否已经登录
  const token = JSON.parse(window.sessionStorage.getItem("token"));
  if (to.path !== "/login") {
    if (token) {
      //已经登录
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

export default router;

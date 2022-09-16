<template>
  <div id="app">
    <router-view />
    <el-backtop />
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      unloadTime: 0,
      beforeUnloadTime: 0,
      offlineUrl: "http://localhost:3006/user/offline",
    };
  },
  methods: {
    handleUserAutoLogin() {
      const token = this.$cookies.get("token");
      if (token) {
        window.sessionStorage.setItem("token", JSON.stringify(token));
      }
    },
  },
  mounted() {
    //处理用户是否7天免登录
    this.handleUserAutoLogin();
    //判断用户是否为关闭页面，如果关闭则向后端发送用户下线请求
    window.addEventListener("beforeunload", () => {
      this.beforeUnloadTime = new Date().getTime();
    });
    window.addEventListener("unload", () => {
      window.sessionStorage.setItem("state", JSON.stringify(this.$store.state));
      this.unloadTime = new Date().getTime();
      const diffTime = this.unloadTime - this.beforeUnloadTime;
      const token = window.sessionStorage.getItem("token");
      const userId = window.sessionStorage.getItem("userId");
      //一般情况下，刷新页面diffTime > 10ms,而关闭页面 diffTime < 3ms
      //window.navigator.sendBeacon发送的请求为异步post请求
      //关闭页面且用户是登陆状态则发送下线请求
      if (diffTime <= 5 && token && userId) {
        var formdata = new FormData();
        formdata.append("userId", userId);
        window.navigator.sendBeacon(this.offlineUrl, formdata);
      }
    });

    window.addEventListener("load", () => {
      window.sessionStorage.removeItem("state");
    });
  },
  beforeDestroy() {
    window.removeEventListener("beforeunload");
    window.removeEventListener("unload");
    window.removeEventListener("load");
  },
};
</script>

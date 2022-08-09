<template>
  <div id="app">
    <router-view></router-view>
    <el-backtop></el-backtop>
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
    handleUserAutoLogin(){
      const token = this.$cookies.get("token")
      if(token) {
        window.sessionStorage.setItem("token", JSON.stringify(token))

      }
    }
  },
  mounted() {
    //处理用户是否7天免登录
    this.handleUserAutoLogin()
    //判断用户是否为关闭页面，如果关闭则向后端发送用户下线请求
    window.addEventListener("beforeunload", () => {
      this.beforeUnloadTime = new Date().getTime();
    });
    window.addEventListener("unload", () => {
      this.unloadTime = new Date().getTime();
      const diffTime = this.unloadTime - this.beforeUnloadTime;
      //一般情况下，刷新页面diffTime > 10ms,而关闭页面 diffTime < 3ms
      //window.navigator.sendBeacon发送的请求为异步post请求
      if (diffTime <= 5) {
        var formdata = new FormData();
        formdata.append("userId", "a8c7c4e4-f389-4aab-9fb4-de1f310003e0");
        window.navigator.sendBeacon(this.offlineUrl, formdata);
      }
    });
  },
  beforeDestroy() {
    window.removeEventListener("beforeunload");
    window.removeEventListener("unload");
  },
};
</script>

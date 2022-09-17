<template>
  <el-card>
    <div class="header">
      <div class="logo">
        <el-link type="primary" :underline="false" href="#/home"
          ><i class="el-icon-box"> GVMI </i></el-link
        >
        <!-- 路由导航 -->
        <div class="guide">
          <el-button
            class="button-group-item"
            type="primary"
            icon="el-icon-arrow-left"
            size="mini"
            @click="switchRoute('back')"
            circle
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-arrow-right"
            size="mini"
            @click="switchRoute('forward')"
            circle
          ></el-button>
        </div>
      </div>

      <div class="right">
        <div class="menu">
          <el-menu
            mode="horizontal"
            :router="true"
            :default-active="$route.path"
          >
            <el-menu-item index="/forum">休闲论坛</el-menu-item>
<!--             <el-menu-item index="2">资源共享</el-menu-item>
            <el-menu-item index="3">消息中心</el-menu-item>
            <el-menu-item index="4">我的收藏</el-menu-item> -->
            <el-menu-item index="/carton">文件仓库</el-menu-item>
          </el-menu>
        </div>

        <div class="vertical">
          <el-tooltip
            effect="light"
            content="首页"
            :open-delay="200"
            :enterable="false"
            placement="bottom"
          >
            <i class="el-icon-house home" @click="$router.push('home')" />
          </el-tooltip>
          <el-divider direction="vertical" />
        </div>

        <!-- 用户操作区 -->
        <div class="user">
          <!-- 账户余额 -->
          <el-tooltip
            effect="light"
            content="账户余额"
            :open-delay="500"
            :enterable="false"
            placement="bottom"
          >
            <i class="el-icon-coin coin"> {{ count }}</i>
          </el-tooltip>

          <!-- 下拉菜单 -->
          <el-dropdown trigger="click" placement="bottom">
            <span class="el-dropdown-link">
              <i class="el-icon-user nickname"> {{ nickname }}</i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-table-lamp">
                <span @click="logout">退出登录</span>
              </el-dropdown-item>
              <el-dropdown-item icon="el-icon-house">
                <span @click="$router.push('home')">返回主页</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { Message } from "element-ui";
export default {
  name: "Header",
  data() {
    return {
      tip: null,
    };
  },
  computed: {
    nickname() {
      const nickname = this.$store.state.userInfo.nickname;
      return nickname ? nickname : "自由蝶";
    },
    count() {
      const coinCount = this.$store.state.userInfo.count;
      return coinCount ? coinCount : 0;
    },
  },
  methods: {
    async logout() {
      await this.$http.post("user/offline", {
        userId: window.sessionStorage.getItem("userId"),
      });
      window.sessionStorage.removeItem("userId");
      window.sessionStorage.removeItem("token");
      this.$router.push("login");
    },

    //路由切换。后退，前进
    switchRoute(state) {
      if (state === "back") {
        this.$router.back();
      } else if (state === "forward") {
        this.$router.forward();
      }
    },

    close() {
      this.hint(2);
      setTimeout(async () => {}, 2000);
    },

    coutTime(index) {
      setTimeout(() => {
        if (index == -1) {
          //index s结束后的操作
        } else {
          this.tip.message = `${index}秒后退出系统`;
          this.coutTime(--index);
        }
      }, 1000);
    },

    //倒计时提示
    hint(index) {
      this.tip = Message({
        showClose: false,
        message: `${index}秒后退出系统`,
        type: "warning",
        duration: `${index}000`,
        center: true,
      });
      index--;
      this.coutTime(index);
    },
  },
};
</script>

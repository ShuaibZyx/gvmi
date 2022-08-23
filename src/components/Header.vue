<template>
  <el-card>
    <div class="header">
      <div class="logo">
        <el-link type="primary" :underline="false" href="#/home"
          ><i class="el-icon-box"> GVMI </i></el-link
        >
      </div>
      <div class="right">
        <div class="menu">
          <el-menu mode="horizontal" :router="true">
            <el-menu-item index="forum">休闲论坛</el-menu-item>
            <el-menu-item index="2">资源共享</el-menu-item>
            <el-menu-item index="3">消息中心</el-menu-item>
            <el-menu-item index="4">我的收藏</el-menu-item>
            <el-menu-item index="5">文件仓库</el-menu-item>
          </el-menu>
        </div>
        <el-divider direction="vertical" />
        <div class="user">
          <i class="el-icon-coin coin"> 200</i>
          <i class="el-icon-user nickname"> {{nickname}}</i>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "Header",
  computed: {
    nickname() {
      const nickname = this.$store.state.userInfo.nickname;
      return nickname ? nickname : "自由蝶";
    },
  },
};
</script>

<style scoped></style>

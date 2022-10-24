<template>
  <el-card>
    <div class="home">
      <el-carousel indicator-position="outside">
        <el-carousel-item>
          <el-image
            :src="require('../assets/imgs/background.jpg')"
            fit="contain"
          />
        </el-carousel-item>
      </el-carousel>
      <div class="products">
        <div class="item" v-for="item in 5" :key="item">
          <el-image
            :src="require('../assets/imgs/background.jpg')"
            fit="fill"
          />
        </div>
      </div>
      <div class="features">
        <div class="item" v-for="item in 2" :key="item">
          <el-image
            :src="require('../assets/imgs/background.jpg')"
            fit="contain"
          />
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {};
  },
  methods: {
    //获取用户的个人信息
    async getUserInfo() {
      const userId = window.sessionStorage.getItem("userId");
      const { data: userInfoResult } = await this.$http.post("user/userInfo", {
        userId,
      });
      if (userInfoResult.code !== 200) {
        this.$message({
          message: "获取用户个人信息失败",
          type: "warning",
          center: true,
        });
        return;
      }
      this.$store.commit("SetUserInfo", userInfoResult.data[0]);
    },
  },
  mounted() {
    this.getUserInfo();
  },
};
</script>

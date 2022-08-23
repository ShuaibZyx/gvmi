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
      if (userInfoResult.code === 200) {
        this.$store.commit("SetUserInfo", userInfoResult.data[0]);
        return;
      }
      this.$message({
        message: "获取用户个人信息失败",
        type: "warning",
        center: true,
      });
    },
  },
  mounted() {
    this.getUserInfo();
  },
};
</script>

<style scoped>
.home {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.home .features {
  width: 96%;
  height: auto;
  margin: 1% 2%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.home .features .item {
  width: 46%;
  margin: 1% 2%;
  height: 10em;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  opacity: 0.9;
}
.home .products {
  width: 96%;
  height: auto;
  margin: 1% 2%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.home .products .item {
  width: 18%;
  margin: 1% 1%;
  height: 10em;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: antiquewhite;
  opacity: 0.9;
}
.el-carousel {
  width: 100%;
}
</style>

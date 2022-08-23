<template>
  <div>
    <el-container>
      <el-header>
        <Header/>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
      <el-footer>
        <Footer/>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import Header from "./Header.vue";
import Footer from "./Footer.vue";
export default {
  name: "Layout",
  components: {
    Header,
    Footer,
  },
};
</script>

<style scoped></style>

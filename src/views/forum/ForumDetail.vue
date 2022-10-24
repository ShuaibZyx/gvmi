<template>
  <el-card>
    <div class="forumDetail">
      <div class="catalog"></div>
      <div class="article"></div>
      <div class="user"></div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "ForumDetail",
  data() {
    return {
      article: {},
    };
  },
  computed: {
    //当前盒子Id
    articleId() {
      return this.$route.query.articleId;
    },
  },
  methods: {
    async getArticleDetail() {
      const { data: articleRes } = await this.$http.get(
        "article/detail/" + this.articleId
      );
      if (articleRes.code === 200) this.article = articleRes.data;
      console.log(this.article)
    },
  },
  mounted() {
    this.getArticleDetail()
  },
};
</script>

<style lang="less">
.forumDetail {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-start;
  padding: 10px;
  width: 100%;
  height: auto;
  .catalog {
    width: 15%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background-color: aqua;
    height: 10em;
    padding: 5px;
  }
  .article {
    width: 67%;
    background-color: antiquewhite;
    height: 10em;
    padding: 5px;
  }
  .user {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 15%;
    background-color: blue;
    height: 10em;
    padding: 5px;
  }
}
</style>

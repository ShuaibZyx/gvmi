<template>
  <el-card>
    <div class="forum">
      <!-- 菜单 -->
      <el-menu :collapse="true" :collapse-transition="false">
        <el-menu-item v-for="(item, index) in categorys" :key="index">
          {{ item }}
        </el-menu-item>
      </el-menu>
      <!-- 论坛主内容 -->
      <div class="content">
        <div
          v-infinite-scroll="loadArticle"
          :infinite-scroll-distance="20"
          :infinite-scroll-delay="300"
          class="articles"
        >
          <div class="operation">
            <el-input
              v-model="searchForum"
              placeholder="输入关键词搜索文章"
              class="input-with-select"
              style="width: 40%"
              @keyup.enter.native="searchArticle"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="searchArticle"
              />
            </el-input>
          </div>
          <div
            class="item"
            v-for="(article, index) in articles"
            :key="index"
            :style="{
              backgroundImage: 'url(' + article.coverUrl + ')',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: '0.85',
            }"
            @click="goArticleDetail(article.articleId)"
          >
            <div class="top">
              <span class="title">
                <span class="word">{{ article.title }}</span>
                <el-divider direction="vertical" />
                <span class="date">{{ article.updateTime | dateFormat }}</span>
              </span>
              <div class="sign">
                <el-tag
                  size="small"
                  v-for="(sign, index) in article.signs"
                  :key="index"
                  >{{ sign }}</el-tag
                >
              </div>
            </div>
            <div class="bottom">
              <div class="user">
                <span class="nickname"
                  >{{ article.ownerNickname }}于{{
                    article.createTime | dateFormat
                  }}发布</span
                >
                <i
                  class="el-icon-folder"
                  v-if="article.articleInfo?.fileId !== ''"
                />
                <i
                  class="el-icon-box"
                  v-if="article.articleInfo?.boxId !== ''"
                />
                <i class="el-icon-view">
                  {{ article.stats?.pvc | numberFormat }}</i
                >
                <i class="el-icon-star-off">
                  {{ article.stats?.sc | numberFormat }}</i
                >
                <i class="el-icon-chicken">
                  {{ article.stats?.ac | numberFormat }}</i
                >
              </div>
              <div class="state">
                <el-tooltip
                  effect="light"
                  content="收藏"
                  placement="left"
                  :open-delay="500"
                  :enterable="false"
                >
                  <el-button
                    type="primary"
                    icon="el-icon-star-off"
                    circle
                    size="mini"
                  />
                </el-tooltip>
                <el-tooltip
                  effect="light"
                  content="加鸡腿"
                  placement="right"
                  :open-delay="500"
                  :enterable="false"
                >
                  <el-button
                    type="warning"
                    icon="el-icon-chicken"
                    circle
                    size="mini"
                    @click.stop="praise(article.articleId)"
                  />
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "Forum",
  data() {
    return {
      categorys: ["生活日常", "码农专区", "游戏分享", "奇妙技术"],
      //无限加载相关数据对象
      pagination: {
        totalCount: 0,
        limit: 3,
        offset: 0,
      },
      //已加载的文章
      articles: [],
      //文章搜索所用关键词
      searchForum: "",
      //是否处于搜索状态
      isSearchState: false,
    };
  },
  methods: {
    //加载文章方法
    loadArticle() {
      this.pagination.offset += 2;
      if (
        this.pagination.limit + this.pagination.offset >=
        this.pagination.totalCount
      )
        this.pagination.offset = 0;
      this.getArticleNext();
    },

    //获取接下来的文章
    async getArticleNext(keyword = "") {
      const { data: articleRes } = await this.$http.post("/article/next", {
        limit: this.pagination.limit,
        offset: this.pagination.offset,
        keyword,
      });
      this.articles.push.apply(this.articles, articleRes.data);
      console.log(this.articles);
    },

    //获取文章的总数量
    async getArticleTotalCount() {
      const { data: totalCountRes } = await this.$http.get("/article/total");
      this.articles = [];
      this.pagination.totalCount = totalCountRes.data;
    },

    //文章点赞
    async praise(articleId) {
      const { data: praiseRes } = await this.$http.post("article/praise", {
        articleId,
      });
      for (let i = 0; i < this.articles.length; i++) {
        if (this.articles[i].articleId === articleId) {
          this.articles[i].stats.ac += 1;
          break;
        }
      }
      this.$message({
        message: `${praiseRes.code !== 200 ? "点赞失败" : "点赞成功!"}`,
        type: `${praiseRes.code !== 200 ? "error" : "success"}`,
        center: true,
      });
    },

    //跳转文章详情页面并使文章点击量加1
    async goArticleDetail(articleId) {
      //1.增加浏览数目
      await this.$http.post("article/view", {
        articleId,
      });
      for (let i = 0; i < this.articles.length; i++) {
        if (this.articles[i].articleId === articleId) {
          this.articles[i].stats.pvc += 1;
          break;
        }
      }
      //2.跳转文章详情页面
      this.$router.push({
        path: "forumdetail",
        query: {
          articleId,
        },
      });
    },

    //根据条件搜索文章
    searchArticle() {
      //搜索逻辑:1.搜索条件为空且当前文章列表不为空且不处于搜索状态则无效。
      //2.搜索条件不为空且当前文章列表不为空且当前不处于搜索状态则搜索有效
      //3.搜索条件为空且当前列表为空则返回正常列表
      //4.搜索条件为空且当前列表不为空且处于搜索状态则返回正常列表
      if (
        this.searchForum === "" &&
        this.articles.length > 0 &&
        !this.isSearchState
      )
        return;
      this.isSearchState = this.searchForum === "" ? false : true;
      this.articles = [];
      this.getArticleNext(this.searchForum);
    },
  },
  mounted() {
    this.getArticleNext();
    this.getArticleTotalCount();
  },
};
</script>

<style lang="less">
.forum {
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 5px;
  margin: 0.7% 0;
  height: 40em;
  .el-menu {
    width: 20%;
    text-align: center;
    .el-menu-item {
      font-size: larger;
    }
  }
  .content {
    padding: 5px;
    width: 100%;
    height: auto;
    overflow: hidden;
    .operation {
      direction: ltr;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    .articles {
      width: 100%;
      direction: rtl;
      overflow: auto;
      height: 85vh;
      .item {
        padding: 15px;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 25px auto;
        width: 80%;
        height: 200px;
        border-radius: 5px;
        overflow: hidden;
        background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
        font-size: 18px;
        .top {
          height: 50%;
          width: 100%;
          display: flex;
          align-items: flex-start;
          flex-direction: row-reverse;
          justify-content: space-between;
          .title {
            width: 50%;
            height: auto;
            display: flex;
            align-items: center;
            flex-direction: row-reverse;
            flex-wrap: wrap-reverse;
            justify-content: flex-start;
            .word {
              font-weight: bold;
              font-size: 1.4em;
            }
            .date {
              font-size: 0.7em;
            }
          }
          .sign {
            width: 50%;
            height: auto;
            padding: 5px;
            display: flex;
            flex-direction: row-reverse;
            flex-wrap: wrap;
            align-items: center;
            justify-content: flex-end;
            .el-tag {
              margin: 2px 5px;
            }
          }
        }
        .bottom {
          height: 50%;
          width: 100%;
          display: flex;
          flex-direction: row-reverse;
          justify-content: space-between;
          align-items: flex-end;
          .user {
            font-size: 0.9em;
            width: 40%;
            height: auto;
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
            justify-content: space-around;
          }
          .state {
            width: 55%;
            height: auto;
            display: flex;
            flex-direction: row-reverse;
            justify-content: flex-end;
            align-items: center;
          }
        }
      }
      .item:hover {
        cursor: pointer;
        background-image: linear-gradient(
          -225deg,
          #69eacb 0%,
          #eaccf8 48%,
          #6654f1 100%
        );
        box-shadow: 5px 5px 10px gray;
        opacity: 1 !important;
        transform: translateY(-2%);
      }
    }
    /* 蓝色的滚条 */
    .articles::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 10px; /*高宽分别对应横竖滚动条的尺寸 width是竖滚动条*/
      height: 1px;
    }
    .articles::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      background-color: skyblue;
      background-image: -webkit-linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.2) 25%,
        transparent 25%,
        transparent 50%,
        rgba(255, 255, 255, 0.2) 50%,
        rgba(255, 255, 255, 0.2) 75%,
        transparent 75%,
        transparent
      );
    }
    .articles::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: #ededed;
      border-radius: 10px;
    }
  }
}
</style>

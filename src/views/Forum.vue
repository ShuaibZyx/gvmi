<template>
  <el-card>
    <div class="forum">
      <el-menu :collapse="true" :collapse-transition="false">
        <el-menu-item
          v-for="item in categorys"
          :key="item.categoryId"
          :index="item.categoryId.toString()"
        >
          {{ item.name }}
        </el-menu-item>
      </el-menu>

      <div class="content">
        <div
          v-infinite-scroll="load"
          :infinite-scroll-distance="20"
          :infinite-scroll-delay="300"
          class="articles"
        >
          <div class="item" v-for="i in count" :key="i">
            <div class="top">
              <span class="title">
                <span class="word">标题</span>
                <el-divider direction="vertical" />
                <span class="date">2022-8-24日</span>
              </span>
              <div class="sign">
                <el-tag size="small" v-for="i in 6" :key="i">{{ i }}</el-tag>
              </div>
            </div>
            <div class="bottom">
              <div class="user">
                <span class="nickname">Shuaib于2022-8-23日发布</span>
                <i class="el-icon-folder">2</i>
                <i class="el-icon-box">1</i>
                <i class="el-icon-view">1000</i>
                <i class="el-icon-star-off">100</i>
                <i class="el-icon-chicken">100</i>
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
      categorys: [],
      count: 0,
    };
  },
  methods: {
    async getArticleCategory() {
      const { data: getArticleCaregorysRes } = await this.$http.get(
        "article/categorys"
      );
      if (getArticleCaregorysRes.code !== 200) {
        this.$message({
          message: `${getArticleCaregorysRes.msg}`,
          type: "error",
          center: true,
        });
        return;
      }
      this.categorys = getArticleCaregorysRes.data;
    },
    load() {
      this.count += 2;
    },
  },
  mounted() {
    this.getArticleCategory();
  },
};
</script>

<style scoped lang="less">
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
        height: 150px;
        border-radius: 5px;
        overflow: hidden;
        background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
        font-size: 18px;
        box-shadow: 5px 5px 10px gray;
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
            font-size: 0.7em;
            width: 45%;
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

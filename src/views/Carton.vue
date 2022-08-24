<template>
  <el-card>
    <div class="carton">
      <div class="operate">
        <div class="btns">
          <el-button type="warning" size="small" plain>编辑</el-button>
          <el-button type="danger" size="small" plain>删除</el-button>
        </div>
        <div class="add green" @click="createCartonVisible = true">
          创建新盒子
        </div>
        <div class="search">
          <el-input placeholder="盒子名称" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" />
          </el-input>
        </div>
      </div>
      <el-divider />
      <div class="boxes">
        <div class="item" v-for="i in 10" :key="i">
          <div class="title">Shuaib的第一个盒子</div>
          <div class="size">
            <!-- 以图标来区别不同类型的盒子 -->
            <i class="el-icon-files">5/10</i>
            <span>2022/8/24</span>
          </div>
        </div>
      </div>
      <div class="page">
        <el-pagination
          background
          hide-on-single-page
          layout="prev, pager, next"
          :total="1000"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog
      :visible.sync="createCartonVisible"
      width="40%"
      custom-class="newCartonDialog"
    >
      <div slot="title" class="title">
        <i class="el-icon-box"></i>
        <span> 新盒子</span>
      </div>
      <el-form
        :model="newCartonFrom"
        label-width="auto"
        class="createCartonForm"
      >
        <div class="flag">
          <el-form-item>
            <el-input
              v-model="newCartonFrom.title"
              autocomplete="off"
              maxlength="10"
              minlength="1"
              placeholder="盒子名称"
              clearable
              prefix-icon="el-icon-s-flag"
            />
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="newCartonFrom.type"
              placeholder="盒子类型"
              clearable
              autocomplete="off"
              filterable
            >
              <el-option label="图片" value="0" />
              <el-option label="小文件" value="1" />
              <el-option label="大文件" value="2" />
            </el-select>
          </el-form-item>
        </div>
        <div class="size__cover">
          <div class="corver">
            <el-upload action="#" list-type="picture-card" :auto-upload="false">
              <i slot="default" class="el-icon-plus"></i>
              <div slot="file" slot-scope="{ file }">
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url"
                  alt=""
                />
                <span class="el-upload-list__item-actions">
                  <span class="el-upload-list__item-preview">
                    <i class="el-icon-zoom-in"></i>
                  </span>
                  <Layout class="el-upload-list__item-delete">
                    <i class="el-icon-download"></i>
                  </Layout>
                  <span class="el-upload-list__item-delete">
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
            </el-upload>
          </div>
          <div class="size">
            <el-input v-model="newCartonFrom.size" readonly>
              <el-button slot="append" icon="el-icon-folder-add"
                >扩容</el-button
              >
            </el-input>
            <span class="rules">
              <span>&lt;--盒子封面⭐|不同类型兑换规则如下:</span>
              <span>1.图片:</span>
              <span>2.小文件:</span>
              <span>3.大文件:</span>
            </span>
          </div>
        </div>
        <div class="discription">
          <el-form-item>
            <el-input
              type="textarea"
              placeholder="描述一下新盒子吧✨"
              v-model="newCartonFrom.description"
              maxlength="200"
              show-word-limit
              clearable
              rows="6"
            >
            </el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="cartonDialogFooter">
        <el-button size="small">取 消</el-button>
        <el-button type="primary" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  name: "Carton",
  data() {
    return {
      createCartonVisible: false,
      newCartonFrom: {
        typeId: 0,
        size: 0,
        title: "",
        description: "",
        coverUrl: "",
      },
    };
  },
  methods: {},
  mounted() {},
};
</script>

<style lang="less">
.carton {
  width: 100%;
  height: auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .operate {
    width: 98%;
    height: auto;
    margin: 15px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    .btns {
      padding: 0 10px;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
    }
    .add {
      width: 8em;
      text-align: center;
      cursor: pointer;
      border: 0;
      text-transform: uppercase;
      font-size: 20px;
      font-weight: bold;
      padding: 15px 50px;
      border-radius: 50px;
      color: white;
      outline: none;
      position: relative;
    }
    .add:before {
      content: "";
      display: block;
      background: linear-gradient(
        to left,
        rgba(255, 255, 255, 0) 50%,
        rgba(255, 255, 255, 0.4) 50%
      );
      background-size: 210% 100%;
      background-position: right bottom;
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      border-radius: 50px;
      transition: all 1s;
      -webkit-transition: all 1s;
    }
    .green {
      background-image: linear-gradient(to right, #25aae1, #40e495);
      box-shadow: 0 4px 15px 0 rgba(49, 196, 190, 0.75);
    }
    .green:hover:before {
      background-position: left bottom;
    }
  }
  .boxes {
    width: 100%;
    padding: 10px;
    height: auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    .item {
      min-width: 16em;
      min-height: 16em;
      margin: 15px;
      padding: 4px;
      background-image: linear-gradient(to top, #a8edea 0%, #fed6e3 100%);
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 1px 1px 1px gray;
      border: 0.5px pink solid;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      .title {
        padding: 20px 0;
        font-family: 楷体;
        font-weight: bold;
        font-size: 1.3em;
      }
      .size {
        width: 90%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
      }
    }
    .item:hover {
      cursor: pointer;
      background-image: linear-gradient(
        -225deg,
        #2cd8d5 0%,
        #c5c1ff 56%,
        #ffbac3 100%
      );
      box-shadow: 5px 5px 10px gray;
    }
  }
  .page {
    width: 100%;
    height: auto;
    margin: 15px 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
}

.newCartonDialog {
  border-radius: 10px;
  .title {
    font-family: 楷体;
    font-weight: bold;
    font-size: 1.3em;
  }
  .createCartonForm {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    .el-form-item {
      margin: 0;
    }
    .flag {
      padding: 5px 15px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin: 10px 0;
    }
    .discription {
      margin: 10px 0;
      padding: 5px 15px;
    }
    .size__cover {
      padding: 5px 15px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .size {
        width: 70%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        .rules {
          margin: 10px 0;
          font-family: 楷体;
          font-weight: bold;
          font-size: 16.5px;
          line-height: 22px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
        }
      }
    }
  }
  .cartonDialogFooter {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
}
</style>

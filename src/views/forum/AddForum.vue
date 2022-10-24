<template>
  <el-card>
    <div class="addForum">
      <!-- 输入文章内容 -->
      <div class="content">
        <vue-editor
          v-model="articleFrom.articleInfo.content"
          :editorToolbar="customToolbar"
        />
        <div class="ql-container ql-snow preview">
          <div class="ql-editor" v-html="articleFrom.articleInfo.content" />
        </div>
      </div>

      <!-- 附件 -->
      <div class="appendix-box">
        <!-- 文章附件 -->
        <div class="appendix">
          <span class="title">添加文章附件:</span>
          <el-upload
            action
            :class="{
              hide: appendixFileList.length === 1,
            }"
            :accept="uploadFileTypeLimits.box"
            list-type="picture-card"
            :file-list="appendixFileList"
            :auto-upload="false"
            :http-request="uploadAppendixFile"
            :on-change="handleAppendixFileChange"
            ref="uploadAppendixFile"
          >
            <i slot="default" class="el-icon-plus" style="font-size: 0.7em"
              >文章附件</i
            >
            <div slot="file" slot-scope="{ file }">
              <el-image
                v-if="
                  uploadFileTypeLimits.image
                    .split(',')
                    .includes(
                      ' ' + file.name.substring(file.name.lastIndexOf('.'))
                    )
                "
                class="el-upload-list__item-thumbnail"
                :src="file.url"
                fit="cover"
              />
              <el-image
                v-else
                class="el-upload-list__item-thumbnail"
                :src="
                  require('../../assets/fileicons/' +
                    `${file.name.substring(file.name.lastIndexOf('.') + 1)}` +
                    '.png')
                "
                fit="cover"
              />
              <el-tooltip
                :content="file.name"
                placement="bottom"
                effect="light"
              >
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-delete"
                    @click="handleFileDownload(file)"
                  >
                    <i class="el-icon-download"></i>
                  </span>
                  <span
                    class="el-upload-list__item-delete"
                    @click="handleAppendixFileRemove()"
                  >
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </el-tooltip>
            </div>
          </el-upload>
        </div>

        <!-- 文章封面 -->
        <div class="cover">
          <span class="title">选择文章封面(必选):</span>
          <el-upload
            action
            :class="{
              hide: coverFileList.length === 1,
            }"
            :accept="uploadFileTypeLimits.image"
            list-type="picture-card"
            :file-list="coverFileList"
            :auto-upload="false"
            :http-request="uploadCoverFile"
            :on-change="handleCoverFileChange"
            ref="uploadCoverFile"
          >
            <i slot="default" class="el-icon-plus" style="font-size: 0.7em"
              >文章封面</i
            >
            <div slot="file" slot-scope="{ file }">
              <el-image
                class="el-upload-list__item-thumbnail"
                :src="file.url"
                fit="cover"
              />
              <el-tooltip
                :content="file.name"
                placement="bottom"
                effect="light"
              >
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-delete"
                    @click="handleFileDownload(file)"
                  >
                    <i class="el-icon-download"></i>
                  </span>
                  <span
                    class="el-upload-list__item-delete"
                    @click="handleCoverFileRemove()"
                  >
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </el-tooltip>
            </div>
          </el-upload>
        </div>
      </div>

      <el-divider>我是分割线哦😛</el-divider>

      <!-- 选择文章类型以及填入文章标签 -->
      <div class="operation">
        <el-form
          :model="articleFrom"
          :rules="articleFromRules"
          ref="articleFromRef"
          class="articleFrom"
          :inline-message="true"
        >
          <div class="category">
            <!-- 文章标题 -->
            <el-form-item
              prop="articleInfo.title"
              :rules="{
                required: true,
                message: '请输入文章标题',
                trigger: ['change', 'blur'],
              }"
            >
              <el-input
                class="title"
                style="width: 20em"
                :maxlength="15"
                :minlength="1"
                placeholder="文章标题(1-15)"
                v-model="articleFrom.articleInfo.title"
                clearable
                prefix-icon="el-icon-s-flag"
                size="small"
              />
            </el-form-item>

            <!-- 文章类型 -->
            <el-form-item prop="categoryId">
              <el-select
                v-model="articleFrom.categoryId"
                placeholder="文章分类"
                clearable
                size="small"
                filterable
              >
                <el-option
                  v-for="item in categorys"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <!-- 关联的盒子 -->
            <el-form-item>
              <el-select
                v-model="articleFrom.articleInfo.boxId"
                placeholder="关联盒子"
                clearable
                size="small"
                filterable
              >
                <el-option
                  v-for="box in boxSigns"
                  :key="box.boxId"
                  :label="box.title"
                  :value="box.boxId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="signs">
            <el-form-item prop="signs">
              <el-tag
                :key="sign"
                v-for="sign in articleFrom.signs"
                closable
                :disable-transitions="false"
                @close="addNewSignClose(sign)"
              >
                {{ sign }}
              </el-tag>
              <!-- 输入tag名称所用的input -->
              <el-input
                class="input-new-sign"
                v-if="addArticleTag"
                v-model="newArticleTagName"
                :maxlength="10"
                clearable
                prefix-icon="el-icon-s-flag"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputTagNameConfirm"
                @blur="handleInputTagNameConfirm"
              />
              <el-button
                v-else
                class="button-new-sign"
                size="small"
                @click="showInput"
                >+文章标签</el-button
              >
            </el-form-item>
          </div>
        </el-form>
      </div>

      <!-- 提交按钮 -->
      <div class="submit">
        <el-button size="small" type="primary" plain @click="submit"
          >发布文章</el-button
        >
      </div>
    </div>
  </el-card>
</template>

<script>
import { VueEditor } from "vue2-editor";
import "../../assets/css/quill.snow.css";
export default {
  name: "AddForum",
  components: {
    VueEditor,
  },
  data() {
    return {
      //富文本编辑器配置项
      customToolbar: [
        [{ header: [false, 1, 2, 3, 4, 5, 6] }], //标题
        ["bold", "italic", "underline"], //加粗\斜体\下划线
        ["italic"], //斜体----也可以拆开来写，用于换位置顺序
        [{ align: "" }, { align: "center" }, { align: "right" }], //对齐
        [{ indent: "-1" }, { indent: "+1" }],
        [{ list: "ordered" }, { list: "bullet" }, { list: "check" }], //有序无序列表
        [{ background: [] }, { color: [] }], //背景色
        ["image", "link"], //图片、链接
        ["strike"], //作废（文字中间一横）
        ["underline"],
        ["clean"], //清楚格式（所谓去掉背景色这些花里胡巧）
        ["code"], //代码
        ["code-block"], //代码块
        ["video"], //视频
        [{ size: ["small", false, "large", "huge"] }], //文字大小
      ],
      //文章分类
      categorys: [
        {
          label: "生活日常",
          value: 1,
        },
        {
          label: "码农专区",
          value: 2,
        },
        {
          label: "游戏分享",
          value: 3,
        },
        {
          label: "奇妙技术",
          value: 4,
        },
      ],
      //添加文章标签输入框可见性
      addArticleTag: false,
      //新的文章标签名
      newArticleTagName: "",
      //文章表单对象
      articleFrom: {
        categoryId: "",
        signs: [],
        coverId: "",
        articleInfo: {
          fileId: "",
          boxId: "",
          title: "",
          content: "",
        },
      },
      //文章表单验证规则
      articleFromRules: {
        signs: [
          {
            required: true,
            message: "请输入至少一个文章标签",
            trigger: "blur",
          },
        ],
        categoryId: [
          {
            required: true,
            message: "请输入文章类型",
            trigger: ["change", "blur"],
          },
        ],
        title: [],
      },
      //上传的附件绑定数组
      appendixFileList: [],
      //上传文章附件的formdata
      appendixFileFormdata: new FormData(),
      //上传的文章封面绑定数组
      coverFileList: [],
      //上传文章封面的formdata
      coverFileFormdata: new FormData(),
    };
  },
  computed: {
    //盒子信息标识
    boxSigns() {
      return this.$store.state.boxSigns;
    },
    //可上传的文件类型
    uploadFileTypeLimits() {
      return this.$store.state.uploadFileTypeLimits;
    },
  },
  methods: {
    //上传的附件文件数组发生变化时
    handleAppendixFileChange(file) {
      const fileType = file.name.substring(file.name.lastIndexOf("."));
      const typeList = this.uploadFileTypeLimits.box.split(",");
      //文件小于5M
      const size = file.size / 1024 / 1024 < 5;
      if (!typeList.includes(" " + fileType)) {
        this.$message({
          message: "暂不支持该类型文件",
          center: true,
          type: "warning",
        });
        this.$refs.uploadAppendixFile.uploadFiles.pop();
        return;
      }
      if (!size) {
        this.$message({
          message: "文件大小不能超过 5MB",
          center: true,
          type: "warning",
        });
        this.$refs.uploadAppendixFile.uploadFiles.pop();
        return;
      }
      this.appendixFileList = this.$refs.uploadAppendixFile.uploadFiles;
    },

    //上传的文章封面文件数组发生变化时
    handleCoverFileChange(file) {
      const fileType = file.name.substring(file.name.lastIndexOf("."));
      const typeList = this.uploadFileTypeLimits.image.split(",");
      //图片文件小于1M
      const size = file.size / 1024 / 1024 < 1;
      if (!typeList.includes(" " + fileType)) {
        this.$message({
          message: "仅允许上传小于1M的图片类型文件",
          center: true,
          type: "warning",
        });
        this.$refs.uploadCoverFile.uploadFiles.pop();
        return;
      }
      if (!size) {
        this.$message({
          message: "图片大小不能超过 1MB",
          center: true,
          type: "warning",
        });
        this.$refs.uploadCoverFile.uploadFiles.pop();
        return;
      }
      this.coverFileList = this.$refs.uploadCoverFile.uploadFiles;
    },

    //处理图片下载
    handleFileDownload(file) {
      let tempa = document.createElement("a");
      tempa.href = file.url;
      tempa.download = file.name;
      document.body.append(tempa);
      tempa.click();
      tempa.remove();
    },

    //处理已经上传的附件文件删除事件
    handleAppendixFileRemove() {
      this.$refs.uploadAppendixFile.uploadFiles.pop();
      this.appendixFileList.pop();
    },

    //处理已经上传的封面图片删除事件
    handleCoverFileRemove() {
      this.$refs.uploadCoverFile.uploadFiles.pop();
      this.coverFileList.pop();
    },

    //文章附件自定义上传行为
    uploadAppendixFile(file) {
      this.appendixFileFormdata.append("file", file.file);
    },

    //文章封面自定义上传行为
    uploadCoverFile(file) {
      this.coverFileFormdata.append("file", file.file);
    },

    //添加新的文章标签关闭时
    addNewSignClose(sign) {
      this.articleFrom.signs.splice(this.articleFrom.signs.indexOf(sign), 1);
    },

    //展示输入新文章标签名的输入框时
    showInput() {
      //最多存在五个标签
      if (this.articleFrom.signs.length === 5) {
        this.$message({
          message: "最多添加五个标签",
          type: "info",
          center: true,
        });
        return;
      }
      this.addArticleTag = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    //确定添加新文章标签名时
    handleInputTagNameConfirm() {
      //重复标签限制
      if (this.articleFrom.signs.includes(this.newArticleTagName)) {
        this.$message({
          message: "请勿添加重复标签",
          type: "info",
          center: true,
        });
        this.newArticleTagName = "";
        this.$refs.saveTagInput.$refs.input.focus();
        return;
      }
      let newArticleTagName = this.newArticleTagName;
      if (newArticleTagName) {
        this.articleFrom.signs.push(newArticleTagName);
      }
      this.addArticleTag = false;
      this.newArticleTagName = "";
    },

    //点击发布文章触发方法(上传文件 + 创建文章)
    submit() {
      if (this.articleFrom.articleInfo.content.length <= 10) {
        this.$message({
          message: "文章内容不少于10个字",
          type: "info",
          center: true,
        });
        return;
      }
      if (this.$refs.uploadCoverFile.uploadFiles.length === 0) {
        this.$message({
          message: "请选择文章封面图片",
          type: "warning",
          center: true,
        });
        return;
      }
      this.$refs.articleFromRef.validate(async (valid) => {
        if (!valid) return;
        this.$refs.uploadAppendixFile.submit();
        if (this.appendixFileList.length === 1) {
          const { data: uploadAppendixFileRes } = await this.$http.post(
            "file/upload",
            this.appendixFileFormdata
          );
          this.articleFrom.articleInfo.fileId =
            uploadAppendixFileRes.file.fileId;
        }
        this.$refs.uploadCoverFile.submit();
        const { data: uploadCoverFileRes } = await this.$http.post(
          "file/upload",
          this.coverFileFormdata
        );
        this.articleFrom.coverId = uploadCoverFileRes.file.fileId;
        this.createNewArticle();
      });
    },

    //文件上传完成后上传文章
    async createNewArticle() {
      var article = {};
      Object.assign(article, this.articleFrom);
      article.signs = this.articleFrom.signs.join(",");
      const userId = window.sessionStorage.getItem("userId");
      const coinId = this.$store.state.userInfo.coinId;
      const relativeLength = Math.abs(
        parseInt(this.articleFrom.articleInfo.content.length / 200)
      );
      const value = parseInt(
        relativeLength === 0 ? 1 : relativeLength >= 5 ? 5 : relativeLength
      );
      const { data: createArticleRes } = await this.$http.post("article/new", {
        userId,
        value,
        article,
        coinId,
      });
      if (createArticleRes.code === 200) {
        Object.keys(this.articleFrom.articleInfo).forEach(
          (key) => (this.articleFrom.articleInfo[key] = "")
        );
        this.articleFrom.categoryId = "";
        this.articleFrom.coverId = "";
        this.articleFrom.signs = [];
      }
      this.$refs.uploadCoverFile.uploadFiles.pop();
      this.$refs.uploadAppendixFile.uploadFiles.pop();
      this.appendixFileList.pop();
      this.coverFileList.pop();
      this.$refs.articleFromRef.resetFields();
      this.appendixFileFormdata = new FormData();
      this.coverFileFormdata = new FormData();
      this.coinCount();
      this.$message({
        message: `${createArticleRes.code !== 200 ? "发布失败" : "发布成功"}`,
        type: `${createArticleRes.code !== 200 ? "error" : "success"}`,
        center: true,
      });
    },
  },
};
</script>

<style lang="less">
.addForum {
  height: auto;
  width: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .content {
    width: 100%;
    height: auto;
    padding: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    .quillWrapper {
      width: 48%;
    }
    .preview {
      width: 48%;
      height: auto;
      border: solid 1px #ccc;
      .ql-editor {
        min-height: 280px;
      }
    }
  }
  .appendix-box {
    width: 100%;
    padding: 5px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    .appendix {
      height: auto;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      .title {
        margin: 5px 0;
        font-family: 楷体;
        font-weight: bold;
      }
    }
    .cover {
      height: auto;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      .title {
        margin: 5px 0;
        font-family: 楷体;
        font-weight: bold;
      }
    }
  }
  .operation {
    width: 100%;
    .articleFrom {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-content: center;
      padding: 10px;
      .el-form-item {
        margin: 0;
      }
      .category {
        width: 60%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        flex-direction: row;
      }

      .signs {
        width: 40%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
        .el-tag + .el-tag {
          margin-left: 10px;
        }
        .button-new-sign {
          margin-left: 10px;
        }
        .input-new-sign {
          width: 150px;
          margin-left: 10px;
        }
      }
    }
  }
  .submit {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    margin: 10px 0;
  }
}
</style>


<template>
  <el-card>
    <div class="boxContent">
      <!-- 盒子信息 -->
      <div class="cartonInfo">
        <!-- 左 -->
        <div class="left">
          <el-image
            style="width: 100%; opacity: 0.8"
            :src="boxInfo?.coverUrl || ''"
            fit="cover"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </div>

        <!-- 左中 -->
        <div class="middleleft">
          <span class="title"> 盒子名称: {{ boxInfo.title }} </span>
          <div class="birth">
            <span class="nickname">
              {{ boxInfo.userInfo?.nickname }}
            </span>
            <span class="createTime">
              {{ boxInfo.createTime | dateFormat }}创建
            </span>
          </div>
          <span class="size">
            盒子大小:
            <el-tag size="small">
              <span>{{ boxInfo.size }}个</span>
              <span v-if="boxInfo.size >= boxMaxSize">/已满</span>
            </el-tag>
          </span>
          <span class="type">
            盒子类型: <el-tag size="small">{{ boxInfo.typeName }}盒子</el-tag>
          </span>
          <span class="desc"> 描述: {{ boxInfo.description }} </span>
          <span class="updateTime">
            最近更新于: {{ boxInfo.updateTime | dateFormat }}
          </span>
        </div>

        <!-- 右中 -->
        <div class="middleright">
          <el-alert
            :title="`最多同时上传${boxRemainSize}个文件,且每个文件不超过${boxFilesSize}M`"
            type="warning"
            center
            show-icon
            v-if="boxRemainSize > 0"
            class="uploadTip"
          />
          <el-alert
            title="盒子已满"
            type="error"
            center
            show-icon
            :closable="false"
            v-else
            class="uploadTip"
          />
          <div class="uploadFile">
            <el-upload
              class="upload"
              action
              :accept="uploadFileTypeLimits.box"
              :http-request="uploadFiles"
              :on-change="handleChange"
              :on-exceed="handleExceed"
              :multiple="true"
              :auto-upload="false"
              :limit="boxRemainSize"
              list-type="text"
              ref="upload"
            >
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-folder-add"
                v-show="boxRemainSize > 0"
                :disabled="boxRemainSize === 0"
                >选择文件</el-button
              >
            </el-upload>

            <!-- 清空已选择文件按钮 -->
            <el-button
              type="danger"
              size="mini"
              @click="clearSelectedFiles"
              icon="el-icon-circle-close"
              >清除</el-button
            >
            <!-- 上传文件按钮 -->
            <el-button
              type="primary"
              size="mini"
              @click="upload"
              icon="el-icon-upload2"
              style="margin-right: 1em"
              :disabled="boxRemainSize === 0"
              >上传</el-button
            >
          </div>
        </div>

        <!-- 右 -->
        <div class="right">
          <div class="search">
            <el-input
              v-model="searchFile"
              size="medium"
              clearable
              placeholder="请输入文件名称"
            >
              <el-button slot="append" icon="el-icon-search" />
            </el-input>
          </div>

          <div
            :class="{
              capacity: boxRemainSize > 0,
              capacityRed: boxRemainSize === 0,
            }"
          >
            盒子剩余可存放文件数:
            <i class="el-icon-picture-outline" v-if="boxInfo.typeId === 1"
              >{{ boxFileCount }}/{{ boxInfo.size }}</i
            >
            <i class="el-icon-files" v-else-if="boxInfo.typeId === 2"
              >{{ boxFileCount }}/{{ boxInfo.size }}</i
            >
            <i class="el-icon-folder-opened" v-else
              >{{ boxFileCount }}/{{ boxInfo.size }}</i
            >
          </div>
        </div>
      </div>

      <!-- 文件操作区域 -->
      <div class="filesOperate">
        <div class="left">
          <el-button
            type="success"
            plain
            size="medium"
            icon="el-icon-folder-add"
            @click="expandCartonVisible = true"
            :disabled="coinExpandMaxSize === 0"
            >盒子扩容</el-button
          >
        </div>
        <div class="middle">
          <el-popconfirm
            title="删除选中的所有文件 确定吗？"
            style="margin-right: 10px"
            @confirm="deleteBoxFiles"
          >
            <el-button
              type="danger"
              slot="reference"
              size="medium"
              plain
              icon="el-icon-delete"
              :disabled="selectedFileList.length <= 0"
              >批量删除</el-button
            >
          </el-popconfirm>
          <el-button
            type="primary"
            size="medium"
            plain
            icon="el-icon-download"
            :disabled="selectedFileList.length <= 0"
            @click="downloadCompressedFiles"
            >打包下载</el-button
          >
        </div>
        <div class="right">
          <el-checkbox
            label="全选"
            border
            size="medium"
            :indeterminate="isIndeterminate"
            v-model="checkAllFiles"
            @change="handleCheckAllChange"
            :disabled="boxFileCount === 0"
          />
        </div>
      </div>

      <!-- 文件区域 -->
      <div class="files" v-if="boxInfo.files?.length">
        <el-checkbox-group
          v-model="selectedFileList"
          @change="handleCheckedChange"
        >
          <div
            class="file"
            v-for="file in boxInfo.files.filter(
              (data) =>
                !searchFile ||
                data.originalfilename
                  .toLowerCase()
                  .includes(searchFile.toLowerCase())
            )"
            :key="file.fileId"
          >
            <div class="seclectbtn">
              <el-checkbox :label="file.fileId" :key="file.fileId">
                <br />
              </el-checkbox>
              <el-popconfirm
                title="确定删除吗？"
                @confirm="deleteBoxFile(file.fileId)"
              >
                <i class="el-icon-delete" slot="reference" />
              </el-popconfirm>
            </div>
            <div class="icon">
              <el-image
                v-if="
                  uploadFileTypeLimits.image
                    .split(',')
                    .includes(
                      ' ' +
                        file.originalfilename.substring(
                          file.originalfilename.lastIndexOf('.')
                        )
                    )
                "
                style="width: 100%; height: 100%"
                :src="file.fileUrl"
                fit="cover"
                :preview-src-list="boxFilePreviewList"
              />
              <el-image
                v-else
                style="width: 100%; height: 100%"
                :src="
                  require('../assets/fileicons/' +
                    `${file.originalfilename.substring(
                      file.originalfilename.lastIndexOf('.') + 1
                    )}` +
                    '.png')
                "
                @click="toToWithFile(file)"
                fit="cover"
              />
            </div>
            <div class="filename">{{ file.originalfilename }}</div>
            <div class="fileinfo">
              <div class="filesize">大小: {{ file.size | bytesToSize }}</div>
              <div class="download">
                <el-link
                  type="primary"
                  :underline="false"
                  icon="el-icon-download"
                  @click="download(file)"
                  >下载</el-link
                >
              </div>
            </div>
          </div>
        </el-checkbox-group>
      </div>

      <!-- 盒子文件数量为空时 -->
      <el-empty :image-size="200" description="暂无文件" v-else />
    </div>

    <!-- 用于盒子扩容的Dialog -->
    <el-dialog
      :visible.sync="expandCartonVisible"
      width="25%"
      top="30vh"
      :close-on-click-modal="false"
      custom-class="expandDialogFromBoxInfo"
    >
      <div slot="title" class="title">
        <i class="el-icon-chicken"></i>
        <span> 扩容盒子</span>
      </div>
      <el-input
        v-model="cartonExpandSize"
        type="number"
        autocomplete="off"
        :max="coinExpandMaxSize"
        :min="1"
        placeholder="请输入您的扩容大小"
        clearable
        @input="exceedCaronExpandSize"
        prefix-icon="el-icon-chicken"
        style="width: 100%"
      />
      <div class="value">
        <span style="margin-right: 5px"> 总价值: {{ coinConsume }} </span>
        <i class="el-icon-coin" style="color: gold"></i>
      </div>
      <div slot="footer" class="cartonDialogFooter">
        <el-button size="small" @click="expandCartonVisible = false"
          >取 消</el-button
        >
        <el-button
          type="primary"
          size="small"
          @click="confirmExpandCarton"
          :disabled="cartonExpandSize === 0"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 播放视频的dialog -->
    <el-dialog
      :visible.sync="videoPlayDialogVisable"
      width="40%"
      :close-on-click-modal="false"
      custom-class="videoPlayDialog"
    >
      <div slot="title">
        <i class="el-icon-video-camera-solid"></i>
        <span> {{ currentVideoName }}/视频预览</span>
      </div>
      <video-player
        class="video-player vjs-custom-skin myvideo"
        ref="videoPlayer"
        :playsinline="true"
        :options="playerOptions"
      />
    </el-dialog>

    <!-- 音乐播放 -->
    <div class="myaudiocontrol" v-if="audioVisible">
      <audio :src="audioUrl" controls />
      <el-tooltip
        effect="light"
        content="关闭"
        :open-delay="200"
        :enterable="false"
        placement="bottom"
      >
        <i class="el-icon-close audioClose" @click="audioVisible = false" />
      </el-tooltip>
    </div>

    <!-- 文档预览 -->
    <el-dialog
      :visible.sync="filePreviewVisable"
      width="60%"
      top="0vh"
      :close-on-click-modal="false"
      custom-class="filePreview"
      @close="handleFilePreviewClosed(filePreview)"
    >
      <div slot="title">
        <i class="el-icon-document"> {{ filePreview.fileName }}</i>
        <span></span>
      </div>
      <docx
        v-if="filePreview.fileType === 'word'"
        :fileId="filePreview.fileId"
        :type="filePreview.type"
      />
      <pdf v-if="filePreview.fileType === 'pdf'" :src="filePreview.fileUrl" />
    </el-dialog>
  </el-card>
</template>

<script>
import docx from "../components/WordPreview.vue";
import pdf from "../components/PdfPreview.vue";
export default {
  name: "BoxContent",
  components: {
    docx,
    pdf,
  },
  data() {
    return {
      //当前盒子信息(包含文件)
      boxInfo: {},
      //自定义上传时所用的formdate
      formdata: "",
      //文件搜索条件
      searchFile: "",
      //可上传的文件类型
      uploadFileTypeLimits: {
        box: ".c, .cpp, .cs, .css, .excel, .exe, .html, .java, .jif, .jpeg, .jpg, .png, .js, .md, .mp3, .mp4, .php, .png, .ppt , .pptx, .ps, .ps1, .py, .rar, .sql, .txt, .vue, .webp, .xml, .zip, .pdf, .doc, .docx, .xls, .xlsx",
        image: " .jif, .jpeg, .jpg, .webp, .png",
      },
      //当前选中的文件Id列表
      selectedFileList: [],
      //是否全选文件
      checkAllFiles: false,
      //是否未完全全选文件
      isIndeterminate: false,
      //扩容新盒子的dialog弹窗可见性
      expandCartonVisible: false,
      //视频播放器可见性
      audioVisible: false,
      //文件预览的dialog可见性
      filePreviewVisable: false,
      //视频播放器可见性
      videoPlayDialogVisable: false,
      //盒子额外扩容的大小
      cartonExpandSize: 0,
      //图片类型的盒子预览数组
      boxFilePreviewList: [],
      //视频播放器的配置
      playerOptions: {
        playbackRates: [0.5, 0.7, 1.0, 1.25, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "video/mp4",
            src: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4", //url地址
          },
        ],
        poster: "", //你的封面地址
        // width: document.documentElement.clientWidth,
        notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true, //全屏按钮
        },
      },
      //当前正在播放的视频名称
      currentVideoName: "",
      //当前播放的音乐
      audioUrl: "",
      //文件预览的对象
      filePreview: {
        fileName: "",
        fileType: "",
        fileId: "",
        fileUrl: "",
        type: "",
      },
    };
  },
  computed: {
    //当前盒子Id
    boxId() {
      return this.$route.query.boxId;
    },

    //不同盒子的文件上传大小限制
    boxFilesSize() {
      const typeId = this.boxInfo.typeId;
      return typeId === 1 ? 1 : typeId === 2 ? 5 : 200;
    },

    //盒子当前的文件数量
    boxFileCount() {
      return this.boxInfo?.files?.length;
    },

    //当前盒子剩余可用文件数
    boxRemainSize() {
      var size = this.boxInfo?.size - this.boxFileCount;
      return size > 0 ? size : 0;
    },

    //当前盒子内所有文件的Id数组
    boxFileIds() {
      var fileIds = [];
      this.boxInfo?.files.forEach((file) => {
        fileIds.push(file.fileId);
      });
      return fileIds;
    },

    //不同盒子类型最大剩余扩容容量
    coinExpandMaxSize() {
      var size = this.boxInfo.size;
      var cartonType = this.boxInfo.typeId;
      var remainExpandSize =
        (cartonType === 1 ? 100 : cartonType === 2 ? 20 : 5) - size;
      return remainExpandSize >= 0 ? remainExpandSize : 0;
    },

    //不同盒子类型最大扩容容量
    boxMaxSize() {
      var cartonType = this.boxInfo.typeId;
      return cartonType === 1 ? 100 : cartonType === 2 ? 20 : 5;
    },

    //总金币消费
    coinConsume() {
      var cartonType = this.boxInfo.typeId;
      return (
        this.cartonExpandSize *
        (cartonType === 1 ? 10 : cartonType === 2 ? 20 : 100)
      );
    },
  },
  methods: {
    //获取当前盒子的详情信息,包括用户信息与所包含的文件信息
    async getBoxInfo() {
      const { data: boxInfoRes } = await this.$http.post("box/boxinfo", {
        boxId: this.boxId,
      });
      this.boxInfo = boxInfoRes.data;
      this.boxInfo.files.forEach((file) => {
        this.boxFilePreviewList.push(file.fileUrl);
      });
    },

    //文件/文件列表状态发生改变时触发的方法
    handleChange(file) {
      //文件大小，小于100M
      const size = file.size / 1024 / 1024 < this.boxFilesSize;
      if (!size) {
        this.$message({
          message: `单个文件不得超过${this.boxFilesSize}M 不符合的文件已被忽略`,
          center: true,
          type: "warning",
        });
        this.$refs.upload.uploadFiles.pop();
        return;
      }
    },

    //选择的文件超过盒子剩余文件数时触发
    handleExceed() {
      this.$message({
        message: `最多同时选择${this.boxRemainSize}个文件`,
        center: true,
        type: "warning",
      });
      return;
    },

    //自定义上传行为
    uploadFiles(file) {
      this.formdata.append("files", file.file);
    },

    //发起请求上传文件
    async upload() {
      if (this.$refs.upload.uploadFiles.length === 0) {
        this.$message({
          message: "请选择文件",
          center: true,
          type: "warning",
        });
        return;
      }
      if (this.boxRemainSize === 0) {
        this.$message({
          message: "盒子空间不足 请扩容",
          center: true,
          type: "error",
        });
        return;
      }
      this.formdata = new FormData();
      this.formdata.append("boxId", this.boxId);
      this.$refs.upload.submit();
      await this.$http
        .post("http://localhost:3006/file/boxuploads", this.formdata)
        .then(({ data }) => {
          if (data.code == 201) {
            this.$refs.upload.uploadFiles = [];
            this.$message({
              message: "上传成功!",
              center: true,
              type: "success",
            });
          }
          this.getBoxInfo();
        });
    },

    //清除已经选中的文件
    clearSelectedFiles() {
      this.$refs.upload.clearFiles();
    },

    //下载文件方法
    async download(file) {
      await this.$http({
        url: "/file/download",
        method: "POST",
        responseType: "blob",
        data: {
          fileId: file.fileId,
          type: "box",
        },
      }).then((response) => {
        // 将响应回来的数据下载为文件，固定代码
        // 将响应数据处理为Blob类型
        var blob = new Blob([response.data]);
        // 创建一个URL对象
        var url = window.URL.createObjectURL(blob);
        // 创建一个a标签
        var a = document.createElement("a");
        a.href = url;
        a.download = file.originalfilename; // 这里指定下载文件的文件名
        a.click();
        // 释放之前创建的URL对象
        window.URL.revokeObjectURL(url);
      });
    },

    //从盒子中删除文件
    async deleteBoxFile(fileId) {
      const { data: deleteBoxFileRes } = await this.$http.post("file/delete", {
        fileId,
        type: "box",
      });
      this.$message({
        message: `${
          deleteBoxFileRes.code !== 200 ? "文件删除失败" : "文件删除成功"
        }`,
        center: true,
        type: `${deleteBoxFileRes.code !== 200 ? "error" : "success"}`,
      });
      this.getBoxInfo();
    },

    //从盒子中批量删除文件
    async deleteBoxFiles() {
      if (this.selectedFileList.length <= 0) {
        this.$message({
          message: "请选择文件",
          center: true,
          type: "warning",
        });
        return;
      }
      const { data: deleteBoxFilesRes } = await this.$http.post(
        "file/deletebatch",
        {
          fileIds: this.selectedFileList,
          type: "box",
        }
      );
      this.$message({
        message: `${
          deleteBoxFilesRes.code !== 200
            ? "批量删除文件失败"
            : "批量删除文件成功"
        }`,
        center: true,
        type: `${deleteBoxFilesRes.code !== 200 ? "error" : "success"}`,
      });
      this.getBoxInfo();
    },

    //打包下载多个盒子文件
    async downloadCompressedFiles() {
      if (this.selectedFileList.length <= 0) {
        this.$message({
          message: "请选择文件",
          center: true,
          type: "warning",
        });
        return;
      }
      await this.$http({
        url: "/file/downloadzip",
        method: "POST",
        responseType: "blob",
        data: {
          fileIds: this.selectedFileList,
          type: "box",
        },
      }).then((response) => {
        // 将响应回来的数据下载为文件，固定代码
        // 将响应数据处理为Blob类型
        var blob = new Blob([response.data]);
        // 创建一个URL对象
        var url = window.URL.createObjectURL(blob);
        // 创建一个a标签
        var a = document.createElement("a");
        a.href = url;
        a.download = response.headers.filename; // 这里指定下载文件的文件名
        a.click();
        // 释放之前创建的URL对象
        window.URL.revokeObjectURL(url);
        this.$message({
          message: `${
            response.status !== 200 ? "批量下载失败" : "批量下载成功"
          }`,
          center: true,
          type: `${response.status !== 200 ? "error" : "success"}`,
        });
      });
    },

    //全选与全不选
    handleCheckAllChange(value) {
      this.selectedFileList = value ? this.boxFileIds : [];
      this.isIndeterminate = false;
    },

    //checkbox组所绑定的数组内值发生变化时
    handleCheckedChange(value) {
      let checkedCount = value.length;
      this.checkAllFiles = checkedCount === this.boxFileCount;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.boxFileCount;
    },

    //控制用户输入的扩容最大容量不超过
    exceedCaronExpandSize() {
      //控制多0输入
      if (
        this.cartonExpandSize.toString().length > 1 &&
        this.cartonExpandSize.toString() === "00"
      )
        this.cartonExpandSize = this.cartonExpandSize.toString().slice(0, 1);
      //控制最大输入值
      if (this.cartonExpandSize > this.coinExpandMaxSize)
        this.cartonExpandSize = this.coinExpandMaxSize;
    },

    //用户确定扩容点击事件
    async confirmExpandCarton() {
      if (this.cartonExpandSize === 0) {
        this.expandCartonVisible = false;
        return;
      }
      const { data: expandBoxRes } = await this.$http.post("box/expand", {
        boxId: this.boxId,
        expandSize: this.cartonExpandSize,
        coinConsume: this.coinConsume,
        userId: this.boxInfo.userId,
      });
      this.expandCartonVisible = false;
      this.$message({
        message: `${
          expandBoxRes.code !== 200 ? "盒子扩容失败" : "盒子扩容成功"
        }`,
        center: true,
        type: `${expandBoxRes.code !== 200 ? "error" : "success"}`,
      });
      this.coinCount();
      this.getBoxInfo();
    },

    //不同文件预览
    toToWithFile(file) {
      var fileName = file.originalfilename;
      var fileType = fileName.slice(
        fileName.lastIndexOf(".") + 1,
        fileName.length
      );
      if (fileType === "mp4") {
        this.playerOptions.sources[0].src = file.fileUrl;
        this.currentVideoName = fileName;
        this.videoPlayDialogVisable = true;
      } else if (fileType === "mp3") {
        this.$message({
          message: "点击左下角的播放按钮开始播放哦💕",
          type: "success",
          center: true,
          showClose: true,
          duration: 2000,
        });
        this.audioUrl = file.fileUrl;
        this.audioVisible = true;
      } else if (fileType === "doc" || fileType === "docx") {
        this.filePreview.fileId = file.fileId;
        this.filePreview.fileName = fileName;
        this.filePreview.type = "box";
        this.filePreview.fileType = "word";
        this.filePreviewVisable = true;
      } else if (fileType === "pdf") {
        this.filePreview.fileUrl = file.fileUrl;
        this.filePreview.fileType = "pdf";
        this.filePreviewVisable = true;
      } else {
        this.$message({
          message: `${fileType}类型文件暂不支持预览`,
          type: "info",
          center: true,
          duration: 1500,
        });
      }
    },

    //文档文件预览关闭时触发
    handleFilePreviewClosed(object) {
      Object.keys(object).forEach((key) => (object[key] = ""));
    },
  },
  mounted() {
    this.getBoxInfo();
  },
};
</script>

<style lang="less">
.boxContent {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .cartonInfo {
    width: 96%;
    padding: 10px;
    margin-top: 10px;
    height: auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border: solid 1px#e3e5e8;
    background-image: linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%);
    border-radius: 7px;
    overflow: hidden;
    .left {
      width: 13%;
      height: 13em;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .el-image {
        border-radius: 5px;
        padding: 1px;
        background: black;
      }
    }
    .middleleft {
      width: 25%;
      padding: 10px;
      height: auto;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      font-family: 楷体;
      font-weight: bold;
      .title {
        font-size: 1.5em;
      }
      .birth {
        display: inline-block;
        .nickname {
          font-size: 1.2em;
        }
        .createTime {
          font-size: 0.7em;
          vertical-align: text-bottom;
        }
      }
    }
    .middleleft > * {
      margin: 5px 0;
    }
    .middleright {
      width: 37%;
      height: 13em;
      padding: 10px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      font-family: 楷体;
      font-weight: bold;
      .uploadFile {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-direction: row;
        overflow-y: scroll;
        .upload {
          width: 100%;
          margin: 0 5px;
          .el-upload-list {
            width: 100%;
          }
        }
      }
      .uploadTip {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin: 5px;
        font-family: 楷体;
        font-size: 0.9em;
        color: rgb(76, 76, 76);
        font-weight: bold;
      }
    }
    .right {
      width: 20%;
      height: 13em;
      padding: 10px 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      .search {
        padding: 0 10px;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        .el-input {
          width: 100%;
        }
        .el-input__inner {
          text-align: center;
        }
      }
      .capacity {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        font-family: 楷体;
        font-weight: bold;
      }
      .capacityRed {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        font-family: 楷体;
        font-weight: bold;
        color: red;
      }
    }
  }
  .filesOperate {
    width: 97%;
    height: auto;
    padding: 10px 10px 0 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .left {
      width: 25%;
    }
    .middle {
      width: 50%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    .right {
      display: flex;
      justify-content: flex-end;
      width: 25%;
    }
  }
  .files {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .el-checkbox-group {
      padding: 10px;
      width: 100%;
      height: auto;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      font-size: unset;
      .file {
        width: 11em;
        height: 13.6em;
        border: solid 1px#e3e5e8;
        border-radius: 2px;
        margin: 1%;
        padding: 3px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .seclectbtn {
          width: 100%;
          height: 10%;
          margin-bottom: 1%;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        }
        .icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 70%;
          height: 63%;
          .el-image {
            border-radius: 3px;
            overflow: hidden;
          }
        }
        .filename {
          width: 100%;
          text-align: center;
          height: 8%;
          margin-bottom: 2px;
          font-family: 楷体;
          font-weight: bolder;
          font-size: 0.9em;
          word-break: break-all;
        }
        .fileinfo {
          width: 90%;
          padding: 10px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          height: 7%;
          font-size: small;
        }
      }
      .file:hover {
        background: #dffeff;
        cursor: pointer;
        box-shadow: 1px 1px 1px skyblue;
        transform: translateY(-1.5%);
      }
    }
  }
}

.expandDialogFromBoxInfo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  .el-dialog__body {
    width: 90%;
    padding: 10px;
  }
  .el-input__inner {
    text-align: center;
  }
  .title {
    font-family: 楷体;
    font-weight: bold;
    font-size: 1.3em;
  }
  .value {
    margin-top: 15px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-family: 楷体;
    font-weight: bold;
    font-size: 1.2em;
  }
}

.videoPlayDialog {
  border-radius: 10px;
  overflow: hidden;
  .myvideo {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    box-shadow: 5px 5px 8px #888888;
    border-radius: 5px;
    overflow: hidden;
  }
}

.myaudiocontrol {
  width: auto;
  height: auto;
  padding: 0 5px;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  .audioClose {
    font-size: 1.4em;
    cursor: pointer;
    margin: 0 5px;
    font-weight: bolder;
    border-radius: 5px;
    overflow: hidden;
  }
}

.filePreview {
  border-radius: 10px;
  overflow: hidden;
}
</style>

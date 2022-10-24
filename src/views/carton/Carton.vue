<template>
  <el-card>
    <div class="carton">
      <div class="operate">
        <div class="btns">
          <div class="top">
            <el-switch
              :disabled="userBoxs.length === 0"
              v-model="boxEditAvailable"
              active-text="编辑"
            />
          </div>
          <div class="bottom">
            <el-checkbox
              label="全选"
              border
              size="small"
              :indeterminate="isIndeterminate"
              v-model="checkAllBoxs"
              @change="handleCheckAllChange"
              :disabled="userBoxs.length === 0 || !boxEditAvailable"
            />
          </div>
        </div>
        <div class="add green" @click="createCartonVisible = true">
          创建新盒子
        </div>
        
        <div class="search">
          <div class="top">
            <!-- 搜索按钮 -->
            <el-input
              v-model="searchCarton"
              placeholder="盒子名称"
              class="input-with-select"
            >
              <el-button slot="append" icon="el-icon-search" />
            </el-input>
          </div>
          <div class="bottom">
            <el-button
              icon="el-icon-delete"
              type="danger"
              size="small"
              plain
              :disabled="selectedBoxList.length === 0"
              style="margin-left: 1em"
              @click="deleteBoxs"
              >删除</el-button
            >
          </div>
        </div>
      </div>
      <el-divider />

      <!-- 展示盒子 -->
      <div class="boxes" v-if="userBoxs.length > 0">
        <el-checkbox-group
          v-model="selectedBoxList"
          @change="handleCheckedChange"
        >
          <div
            class="item"
            v-for="box in userBoxs.filter(
              (data) =>
                !searchCarton ||
                data.title.toLowerCase().includes(searchCarton.toLowerCase())
            )"
            :key="box.boxId"
          >
            <div class="introduce">
              <div class="title">名称:{{ box.title }}</div>
              <el-checkbox
                v-if="boxEditAvailable"
                :label="box.boxId"
                :key="box.boxId"
                class="mycheckbox"
              >
                <br />
              </el-checkbox>
              <div class="size">
                <!-- 以图标来区别不同类型的盒子 -->
                <i class="el-icon-picture-outline" v-if="box.typeId === 1"
                  >-{{ box.public === 0 ? "私有" : "公开" }}</i
                >
                <i class="el-icon-files" v-else-if="box.typeId === 2"
                  >-{{ box.public === 0 ? "私有" : "公开" }}</i
                >
                <i class="el-icon-folder-opened" v-else
                  >-{{ box.public === 0 ? "私有" : "公开" }}</i
                >
                <span>{{ box.createTime | dateFormat }}创建</span>
              </div>
            </div>
            <div
              class="shade"
              @click="toBoxContent(box.boxId)"
              :style="{
                'background-image': 'url(' + box.coverUrl + ')',
                'background-repeat': 'no-repeat',
                'background-size': 'cover',
                'background-color': 'rgba(255, 255, 255, 0.45)',
              }"
            />
          </div>
        </el-checkbox-group>
      </div>

      <!-- 盒子数量为空时 -->
      <el-empty :image-size="200" description="暂无盒子" v-else />

      <!-- 分页 -->
      <div class="page">
        <el-pagination
          background
          small
          hide-on-single-page
          layout="prev, pager, next"
          :total="userBoxs.length"
          :page-size="10"
        >
        </el-pagination>
      </div>
    </div>

    <!-- 创建新盒子的Dialog -->
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
        ref="newCartonFromRef"
        :rules="newCartonFromRules"
      >
        <div class="flag">
          <el-form-item prop="title">
            <el-input
              v-model="newCartonFrom.title"
              autocomplete="off"
              maxlength="6"
              minlength="1"
              placeholder="盒子名称"
              clearable
              prefix-icon="el-icon-s-flag"
            />
          </el-form-item>
          <el-form-item prop="typeId">
            <el-select
              v-model="newCartonFrom.typeId"
              placeholder="盒子类型"
              clearable
              autocomplete="off"
              filterable
              @change="handleCartonType"
            >
              <el-option label="图片" :value="1" />
              <el-option label="小文件" :value="2" />
              <el-option label="大文件" :value="3" />
              <span slot="prefix">类型:</span>
            </el-select>
          </el-form-item>
        </div>
        <div class="size__cover">
          <div class="cover">
            <el-upload
              :class="{
                hide: addBoxfileList.length === 1,
              }"
              accept=".jpeg,.png,.jpg,.bmp,.gif"
              list-type="picture-card"
              class="upload"
              :file-list="addBoxfileList"
              action
              :http-request="uploadFile"
              :on-change="handleFileChange"
              :auto-upload="false"
              ref="upload"
            >
              <i slot="default" class="el-icon-plus" style="font-size: 0.7em"
                >封面</i
              >
              <div slot="file" slot-scope="{ file }">
                <el-image
                  class="el-upload-list__item-thumbnail"
                  :src="file.url"
                  fit="cover"
                />
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <i class="el-icon-zoom-in"></i>
                  </span>
                  <span
                    class="el-upload-list__item-delete"
                    @click="handleDownload(file)"
                  >
                    <i class="el-icon-download"></i>
                  </span>
                  <span
                    class="el-upload-list__item-delete"
                    @click="handleRemove()"
                  >
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
            </el-upload>
          </div>
          <div class="size">
            <el-input v-model="newCartonFrom.size" readonly>
              <el-button
                slot="append"
                icon="el-icon-folder-add"
                @click="expandCarton"
                >扩容</el-button
              >
              <span slot="prefix">容量:</span>
            </el-input>
            <span class="rules">
              <span>不同类型盒子兑换规则如下(文件-金币):</span>
              <span>1.图片:1-10</span>
              <span>2.小文件:1-20</span>
              <span>3.大文件:1-100</span>
            </span>
          </div>
        </div>
        <div class="discription">
          <el-form-item>
            <el-input
              type="textarea"
              placeholder="描述一下新盒子吧✨"
              v-model="newCartonFrom.description"
              maxlength="50"
              show-word-limit
              clearable
              rows="2"
            />
            <el-switch
              v-model="newCartonFrom.public"
              active-text="公开"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
          <div class="value">
            <span style="margin-right: 5px"> 总价值: {{ coinConsume }} </span>
            <i class="el-icon-coin" style="color: gold"></i>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="cartonDialogFooter">
        <el-button size="small" @click="createCartonVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" size="small" @click="upload">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 创建新盒子时的图片预览 -->
    <el-dialog :visible.sync="previewImgDialogVisible">
      <img width="100%" :src="previewImageUrl" />
    </el-dialog>

    <!-- 用于盒子扩容的Dialog -->
    <el-dialog
      :visible.sync="expandCartonVisible"
      width="25%"
      top="30vh"
      :close-on-click-modal="false"
      custom-class="expandCartonDialog"
    >
      <div slot="title" class="title">
        <i class="el-icon-chicken"></i>
        <span> 扩容盒子</span>
      </div>
      <el-input
        v-model="cartonExpandSize"
        type="number"
        autocomplete="off"
        maxlength="10"
        minlength="1"
        :max="coinExpandMaxSize"
        :min="0"
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
        <el-button type="primary" size="small" @click="confirmExpandCarton"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  name: "Carton",
  data() {
    return {
      //创建新盒子的dialog弹窗可见性
      createCartonVisible: false,
      //扩容新盒子的dialog弹窗可见性
      expandCartonVisible: false,
      //新盒子数据对象
      newCartonFrom: {
        typeId: 1,
        size: 0,
        title: "",
        description: "",
        public: 0,
        coverUrl: "",
        coverId: "",
      },
      //盒子额外扩容的大小
      cartonExpandSize: 0,
      //预览上传的图片的dialog弹窗可见性
      previewImgDialogVisible: false,
      //预览所用的图片url
      previewImageUrl: "",
      //创建新盒子时添加的文件数组
      addBoxfileList: [],
      //当前用户的所有盒子
      userBoxs: [],
      //添加新盒子表单验证规则
      newCartonFromRules: {
        title: [
          { required: true, message: "请输入盒子名称", trigger: "blur" },
          {
            min: 1,
            max: 6,
            message: "长度在 1 到 6 个字符",
            trigger: "blur",
          },
        ],
        typeId: [
          { required: true, message: "请选择盒子类型", trigger: "blur" },
        ],
      },
      formdata: new FormData(),
      //搜索盒子的条件
      searchCarton: "",
      //已经选中的盒子的Id
      selectedBoxList: [],
      //是否全选盒子
      checkAllBoxs: false,
      //是否有盒子选中
      isIndeterminate: false,
      //盒子是否可编辑
      boxEditAvailable: false,
    };
  },

  computed: {
    //当前盒子类型应有的默认容量
    currentCartonSize() {
      var cartonType = this.newCartonFrom.typeId;
      return cartonType === 1 ? 10 : cartonType === 2 ? 5 : 0;
    },

    //总金币消费
    coinConsume() {
      var cartonType = this.newCartonFrom.typeId;
      return (
        100 +
        this.cartonExpandSize *
          (cartonType === 1 ? 10 : cartonType === 2 ? 20 : 100)
      );
    },

    //不同盒子类型最大扩容容量
    coinExpandMaxSize() {
      var cartonType = this.newCartonFrom.typeId;
      return cartonType === 1 ? 90 : cartonType === 2 ? 15 : 5;
    },

    //当前用户的所有盒子Id
    userBoxIds() {
      var boxIdArr = [];
      this.userBoxs.forEach((box) => {
        boxIdArr.push(box.boxId);
      });
      return boxIdArr;
    },

    //默认上传路径
    baseUrl() {
      return this.$store.state.baseUrl;
    },
  },

  methods: {
    //获取当前用户的所有盒子
    async getCurrentUserBoxs() {
      const userId = window.sessionStorage.getItem("userId");
      const { data: getCurrentUserBoxsRes } = await this.$http.get(
        "box/userboxs/" + userId
      );
      if (getCurrentUserBoxsRes.code !== 200) {
        this.$message({
          message: "获取盒子失败",
          center: true,
          type: "error",
        });
        return;
      }
      this.userBoxs = getCurrentUserBoxsRes.data;
      var boxSigns = [];
      getCurrentUserBoxsRes.data.forEach((box) => {
        boxSigns.push({
          boxId: box.boxId,
          title: box.title,
        });
      });
      this.$store.commit("SetUserBoxSigns", boxSigns);
    },

    //处理图片预览
    handlePictureCardPreview(file) {
      this.previewImageUrl = file.url;
      this.previewImgDialogVisible = true;
    },

    //处理图片下载
    handleDownload(file) {
      let tempa = document.createElement("a");
      tempa.href = file.url;
      tempa.download = file.name;
      document.body.append(tempa);
      tempa.click();
      tempa.remove();
    },

    //处理已经上传的图片删除事件
    handleRemove() {
      this.$refs.upload.uploadFiles.pop();
      this.addBoxfileList.pop();
    },

    //文件/文件列表状态发生改变时触发的方法
    handleFileChange(file) {
      const fileType = file.name.substring(file.name.lastIndexOf("."));
      const typeList = [".jpeg", ".jpg", ".png", ".bmp", ".gif"];
      //文件小于1M
      const size = file.size / 1024 / 1024 < 1;
      if (!typeList.includes(fileType)) {
        this.$message({
          message: "只可选择图片类型文件",
          center: true,
          type: "warning",
        });
        this.$refs.upload.uploadFiles.pop();
        return;
      }
      if (!size) {
        this.$message({
          message: "图片大小不能超过 1MB",
          center: true,
          type: "warning",
        });
        this.$refs.upload.uploadFiles.pop();
        return;
      }
      this.addBoxfileList = this.$refs.upload.uploadFiles;
    },

    //选择的文件超过规定限制(1个)时触发的方法
    handleFileExceed() {
      this.$message({
        message: "最多选择1张图片",
        center: true,
        type: "warning",
      });
      return;
    },

    //自定义上传行为
    uploadFile(file) {
      this.formdata.append("file", file.file);
    },

    //发起请求上传文件
    upload() {
      if (this.$refs.upload.uploadFiles.length === 0) {
        this.$message.warning("请选择图片");
        return;
      }
      this.$refs.newCartonFromRef.validate(async (valid) => {
        if (!valid) return;
        this.formdata = new FormData();
        this.$refs.upload.submit();
        await this.$http.post("file/upload", this.formdata).then(({ data }) => {
          this.newCartonFrom.coverUrl = data.file.fileUrl;
          this.newCartonFrom.coverId = data.file.fileId;
          this.createCarton();
        });
      });
    },

    //创建新盒子
    async createCarton() {
      //验证通过
      const userId = window.sessionStorage.getItem("userId");
      const boxInfo = this.newCartonFrom;
      const { data: createCartonRes } = await this.$http.post("box/newbox", {
        boxInfo,
        userId,
        coinConsume: this.coinConsume,
      });

      this.$message({
        message: `${
          createCartonRes.code !== 200 ? "创建盒子失败" : "创建盒子成功"
        }`,
        center: true,
        type: `${createCartonRes.code !== 200 ? "error" : "success"}`,
      });
      this.coinCount();
      this.getCurrentUserBoxs();
      this.createCartonVisible = false;
    },

    //处理盒子类型发生变化时盒子大小改变的方法
    handleCartonType(typeId = 1) {
      this.newCartonFrom.size = typeId === 1 ? 10 : typeId === 2 ? 5 : 0;
    },

    //点击创建新盒子时扩容按钮触发事件
    expandCarton() {
      this.expandCartonVisible = true;
      this.exceedCaronExpandSize();
    },

    //控制用户输入的扩容最大容量不超过
    exceedCaronExpandSize() {
      //控制多0输入
      if (
        this.cartonExpandSize.toString().length > 1 &&
        this.cartonExpandSize.toString() === "00"
      )
        this.cartonExpandSize = this.cartonExpandSize.toString().slice(0, 1);
      var cartonType = this.newCartonFrom.typeId;
      if (cartonType === 1 && this.cartonExpandSize > 90)
        this.cartonExpandSize = 90;
      else if (cartonType === 2 && this.cartonExpandSize > 15)
        this.cartonExpandSize = 15;
      else if (cartonType === 3 && this.cartonExpandSize > 5)
        this.cartonExpandSize = 15;
    },

    //用户确定扩容点击事件
    confirmExpandCarton() {
      if (
        this.cartonExpandSize === 0 ||
        this.cartonExpandSize.toString() === ""
      ) {
        this.expandCartonVisible = false;
        return;
      }
      this.newCartonFrom.size = this.currentCartonSize;
      this.newCartonFrom.size += parseInt(this.cartonExpandSize);
      this.expandCartonVisible = false;
      this.$message({
        message: "盒子扩容成功",
        center: true,
        type: "success",
      });
    },

    //盒子详情页面
    toBoxContent(boxId) {
      this.$router.push({
        path: "boxcontent",
        query: {
          boxId,
        },
      });
    },

    //checkbox组所绑定的数组内值发生变化时
    handleCheckedChange(value) {
      let checkedCount = value.length;
      this.checkAllBoxs = checkedCount === this.userBoxs.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.userBoxs.length;
    },

    //全选与全不选
    handleCheckAllChange(value) {
      this.selectedBoxList = value ? this.userBoxIds : [];
      this.isIndeterminate = false;
    },

    //删除盒子
    deleteBoxs() {
      this.$confirm(
        "永久删除选中的盒子和其中的文件,所花费的金币将不会返还,是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(async () => {
          const { data: deleteBoxsRes } = await this.$http.post(
            "box/deleteboxs",
            {
              boxIds: this.selectedBoxList,
              type: "box",
            }
          );
          this.$message({
            message: `${
              deleteBoxsRes.code !== 200 ? "删除盒子失败" : "删除盒子成功"
            }`,
            type: `${deleteBoxsRes.code !== 200 ? "error" : "success"}`,
            center: true,
          });
          this.getCurrentUserBoxs();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
            center: true,
          });
        });
    },
  },
  mounted() {
    this.coinCount();
    this.handleCartonType();
    this.getCurrentUserBoxs();
  },
};
</script>

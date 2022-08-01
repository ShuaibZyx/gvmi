<template>
  <el-card>
    <div class="uploadFile">
      <el-upload
        class="upload"
        action
        :http-request="uploadFiles"
        :on-change="handleChange"
        :on-exceed="handleExceed"
        :multiple="true"
        :auto-upload="false"
        :limit="5"
        list-type="text"
        ref="upload"
      >
        <el-button size="mini" type="primary">选择文件</el-button>
        <div slot="tip" class="uploadTip">
          最多同时上传5个文件,且每个文件不超过100M,我好帅
        </div>
      </el-upload>
      <el-button type="primary" size="mini" @click="upload">上传</el-button>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "Test",
  data() {
    return {
      formdata: "",
    };
  },
  methods: {
    //文件/文件列表状态发生改变时触发的方法
    handleChange(file) {
      //文件大小，小于100M
      const size = file.size / 1024 / 1024 < 100;
      if (!size) {
        this.$message.warning("单个文件的大小不能超过 100MB");
        this.$refs.upload.uploadFiles.pop();
        return;
      }
    },

    //选择的文件超过规定限制(5个)时触发的方法
    handleExceed() {
      this.$message.warning("最多同时选择5个文件");
      return;
    },

    //自定义上传行为
    uploadFiles(file) {
      this.formdata.append("files", file.file);
    },

    //发起请求上传文件
    async upload() {
      if (this.$refs.upload.uploadFiles.length === 0) {
        this.$message.warning("请选择文件");
        return;
      }
      this.formdata = new FormData();
      this.$refs.upload.submit();
      await this.$http
        .post("http://localhost:3006/file/uploads", this.formdata)
        .then(({ data }) => {
          console.log(data);
        });
    },
  },
};
</script>

<style scoped>
.uploadFile {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.uploadFile .upload {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border: 2px dashed antiquewhite;
  background-color: aliceblue;
}
.uploadFile .uploadTip {
  margin: 5px;
  font-size: 1.2em;
  line-height: 1.3em;
  font-family: 楷体;
  color: rgb(76, 76, 76);
  font-weight: bold;
}
</style>

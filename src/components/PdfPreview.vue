<template>
  <div class="pdfPreview">
    <pdf
      v-if="src !== ''"
      :page="pageNum"
      :src="src"
      @progress="loadedRatio = $event"
      @num-pages="pageTotalNum = $event"
    />
    <div v-else>文件无法预览</div>
    <el-divider />
    <div style="margin-bottom: 15px; color: #409eff">
      {{ pageNum }} / {{ pageTotalNum }}
    </div>
    <el-button-group>
      <el-button
        type="primary"
        icon="el-icon-arrow-left"
        size="mini"
        @click="prePage"
        plain
        >上一页</el-button
      >
      <el-button type="primary" size="mini" @click="nextPage" plain>
        下一页
        <i class="el-icon-arrow-right el-icon--right"></i>
      </el-button>
    </el-button-group>
  </div>
</template>

<script>
import pdf from "vue-pdf";
export default {
  name: "PdfPreview",
  components: {
    pdf,
  },
  props: ["src"],
  data() {
    return {
      pageNum: 1,
      pageTotalNum: 1, //总页数
      loadedRatio: 0, // 当前页面的加载进度，范围是0-1 ，等于1的时候代表当前页已经完全加载完成了
    };
  },
  methods: {
    // 上一页
    prePage() {
      let page = this.pageNum;
      page = page > 1 ? page - 1 : this.pageTotalNum;
      this.pageNum = page;
    },

    // 下一页
    nextPage() {
      let page = this.pageNum;
      page = page < this.pageTotalNum ? page + 1 : 1;
      this.pageNum = page;
    },
  },
};
</script>

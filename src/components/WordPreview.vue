<template>
  <div>
    <!-- 预览文件的地方（用于渲染） -->
    <div v-if="fileId !== ''" ref="file" />
    <div v-else>文件无法预览</div>
  </div>
</template>

<script>
let docx = require("docx-preview");
export default {
  name: "WordPreview",
  props: ["fileId", "type"],
  data() {
    return {
      options: {
        className: "docx", // 默认和文档样式类的类名/前缀
        inWrapper: true, // 启用围绕文档内容渲染包装器
        ignoreWidth: false, // 禁止页面渲染宽度
        ignoreHeight: false, // 禁止页面渲染高度
        ignoreFonts: false, // 禁止字体渲染
        breakPages: true, // 在分页符上启用分页
        ignoreLastRenderedPageBreak: true, //禁用lastRenderedPageBreak元素的分页
        experimental: false, //启用实验性功能（制表符停止计算）
        trimXmlDeclaration: true, //如果为真，xml声明将在解析之前从xml文档中删除
        debug: false, // 启用额外的日志记录
      },
    };
  },
  methods: {
    async preview() {
      await this.$http({
        url: "/file/preview",
        method: "post",
        responseType: "blob",
        data: {
          fileId: this.fileId,
          type: this.type,
        },
      }).then(({ data }) => {
        docx.renderAsync(data, this.$refs.file, null, this.options); // 渲染到页面
      });
    },
  },
  created() {
    this.preview();
  },
};
</script>

<style lang="less">
.docx-wrapper {
  border-radius: 5px;
  background: white !important;
}
</style>

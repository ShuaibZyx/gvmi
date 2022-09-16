<template>
  <el-card>
    <div class="footer">
      <div class="links"></div>
      <el-divider direction="vertical" />
      <div class="declare"></div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style lang="less">
.footer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  border-radius: 5px;
  overflow: hidden;
  background-color: dimgray;
  .links {
    width: 50%;
    height: 100%;
    background-color: dimgray;
    display: flex;
  }
  .declare {
    width: 50%;
    height: 100%;
    background-color: dimgray;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .el-divider--vertical {
    width: 2px;
    height: 7em;
  }
}
</style>

<template>
  <el-steps :active="active" direction="vertical" finish-status="success">
    <el-step
        :description="`${progressData.reportRelease == null?'--':progressData.reportRelease.release == null?'--':progressData.reportRelease.release.operator}:
      ${progressData.reportRelease == null?'--':progressData.reportRelease.release == null?'--':moment(progressData.reportRelease.release.opTime).format('YYYY-MM-DD HH:mm')}`"
        title="发布"
    ></el-step>
  </el-steps>
</template>

<script>
export default {
  name: "seven",
  props: {
    progressData: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
  data() {
    return {};
  },
  computed: {
    active() {
      let num = 0;
      if (this.progressData.reportRelease != null) {
        if (this.progressData.reportRelease.release != null) {
          num = 1;
        }
      }
      return num;
    }
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-step__title.is-process {
  color: #409eff !important;

}

/deep/ .is-process {
  border-color: #409eff !important;

  .is-text {
    // background: #409eff;
    // color: #fff;
    border-color: #409eff !important;

    .el-step__icon-inner {
      color: #409eff !important;
    }
  }
}

/deep/ .el-step__main {
  .el-step__description.is-process {
    color: #409eff !important;
  }
}
</style>

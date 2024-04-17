<!-- 报告管理 -->
<template>
  <el-steps :active="active" direction="vertical" finish-status="success">
    <el-step
        title="编制"
    >
      <template slot="description">
        <span v-if="progressData.reportManagement == null">-- : --</span>
        <span v-else-if="progressData.reportManagement.compile == null">-- : --</span>
        <span
            v-else>{{ progressData.reportManagement.compile.operator }}:{{ moment(progressData.reportManagement.compile.opTime).format('YYYY-MM-DD HH:mm') }}</span>
      </template>
    </el-step>
    <el-step
        title="审核"
    >
      <template slot="description">
        <span v-if="progressData.reportManagement == null">-- : --</span>
        <span v-else-if="progressData.reportManagement.audit == null">-- : --</span>
        <span
            v-else>{{ progressData.reportManagement.audit.operator }}:{{ moment(progressData.reportManagement.audit.opTime).format('YYYY-MM-DD HH:mm') }}</span>
      </template>
    </el-step>
    <el-step
        title="批准"
    >
      <template slot="description">
        <span v-if="progressData.reportManagement == null">-- : --</span>
        <span v-else-if="progressData.reportManagement.approval == null">-- : --</span>
        <span
            v-else>{{ progressData.reportManagement.approval.operator }}:{{ moment(progressData.reportManagement.approval.opTime).format('YYYY-MM-DD HH:mm') }}</span>
      </template>
    </el-step>
  </el-steps>
</template>

<script>
export default {
  name: "six",
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
      if (this.progressData.reportManagement != null) {
        if (this.progressData.reportManagement.compile != null) {
          num = 1;
        }
        if (this.progressData.reportManagement.audit != null && this.progressData.reportManagement.compile != null) {
          num = 2;
        }
        if (this.progressData.reportManagement.audit != null && this.progressData.reportManagement.compile != null && this.progressData.reportManagement.approval != null) {
          num = 3;
        }
      }
      return num;
    },
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

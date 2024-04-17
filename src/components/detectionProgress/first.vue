<template>
  <el-steps :active="active" direction="vertical" finish-status="success">
    <el-step
        title="编制"
    >
      <template slot="description">
        <span v-if="progressData.entrustAgreement == null">-- : --</span>
        <span v-else-if="progressData.entrustAgreement.start == null">-- : --</span>
        <span
            v-else>{{ progressData.entrustAgreement.start.operator }}:{{ moment(progressData.entrustAgreement.start.opTime).format('YYYY-MM-DD HH:mm') }}</span>
      </template>
    </el-step>
    <el-step
        title="审核"
    >
      <template slot="description">
        <span v-if="progressData.entrustAgreement == null">-- : --</span>
        <span v-else-if="progressData.entrustAgreement.end == null">-- : --</span>
        <span
            v-else>{{ progressData.entrustAgreement.end.operator }}:{{ moment(progressData.entrustAgreement.end.opTime).format('YYYY-MM-DD HH:mm') }}</span>
      </template>
    </el-step>
  </el-steps>
</template>

<script>
export default {
  name: "first",
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
      if (this.progressData.entrustAgreement != null) {
        if (this.progressData.entrustAgreement.start != null) {
          num = 1;
        }
        if (this.progressData.entrustAgreement.start != null && this.progressData.entrustAgreement.end != null) {
          num = 2;
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

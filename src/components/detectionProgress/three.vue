<template>
  <el-steps :active="active" direction="vertical" finish-status="success">
    <el-step
        title="开始"
    >
      <template slot="description">
        <span v-if="progressData.sampleHandover == null">-- : --</span>
        <span v-else-if="progressData.sampleHandover.start == null">-- : --</span>
        <span
            v-else>{{ progressData.sampleHandover.start.operator }}:{{ moment(progressData.sampleHandover.start.opTime).format('YYYY-MM-DD HH:mm') }}</span>
      </template>
    </el-step>
    <el-step
        title="结束"
    >
      <template slot="description">
        <span v-if="progressData.sampleHandover == null">-- : --</span>
        <span v-else-if="progressData.sampleHandover.end == null">-- : --</span>
        <span
            v-else>{{ progressData.sampleHandover.end.operator }}:{{ moment(progressData.sampleHandover.end.opTime).format('YYYY-MM-DD HH:mm') }}</span>
      </template>
    </el-step>
  </el-steps>
</template>

<script>
export default {
  name: "three",
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
      if (this.progressData.sampleHandover != null) {
        if (this.progressData.sampleHandover.start != null) {
          num = 1;
        }
        if (this.progressData.sampleHandover.start != null && this.progressData.sampleHandover.end != null) {
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

  .el-step__description.is-process {
    color: #409eff !important;
  }
}

/deep/ .el-step__main {
  .el-step__description.is-process {
    color: #409eff !important;
  }
}
</style>

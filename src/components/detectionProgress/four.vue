<!-- 样品领用 -->
<template>
  <el-steps :active="active" direction="vertical" finish-status="success">
    <el-step
        title="开始"
    >
      <template slot="description">
        <span v-if="progressData.sampleCollect == null">-- : --</span>
        <span v-else-if="progressData.sampleCollect.start == null">-- : --</span>
        <span
            v-else>{{ progressData.sampleCollect.start.operator }}:{{ moment(progressData.sampleCollect.start.opTime).format('YYYY-MM-DD HH:mm') }}</span>
      </template>
    </el-step>
    <el-step
        :description="`${progressData.sampleCollect == null?'':progressData.sampleCollect.end == null?'':progressData.sampleCollect.end.operator}:
      ${progressData.sampleCollect == null?'':progressData.sampleCollect.end == null?'':moment(progressData.sampleCollect.end.opTime).format('YYYY-MM-DD HH:mm')}`"
        title="结束"
    >
      <template slot="description">
        <span v-if="progressData.sampleCollect == null">-- : --</span>
        <span v-else-if="progressData.sampleCollect.end == null">-- : --</span>
        <span
            v-else>{{ progressData.sampleCollect.end.operator }}:{{ moment(progressData.sampleCollect.end.opTime).format('YYYY-MM-DD HH:mm') }}</span>
      </template>
    </el-step>
  </el-steps>
</template>

<script>
export default {
  name: "four",
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
      if (this.progressData.sampleCollect != null) {
        if (this.progressData.sampleCollect.start != null) {
          num = 1;
        }
        if (this.progressData.sampleCollect.start != null && this.progressData.sampleCollect.end != null) {
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

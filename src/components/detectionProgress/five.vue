<!-- 监测管理 -->
<template>
  <el-steps :active="active" direction="vertical" finish-status="success">
    <el-step title="开始">
      <template slot="description">
        <span v-if="progressData.detectManagement == null">-- : --</span>
        <span v-else-if="progressData.detectManagement.start == null">-- : --</span>
        <span
            v-else>{{ progressData.detectManagement.start.operator }}:{{ moment(progressData.detectManagement.start.opTime).format('YYYY-MM-DD HH:mm') }}</span>
      </template>
    </el-step>
    <el-step title="结束">
      <template slot="description">
        <span v-if="progressData.detectManagement == null">-- : --</span>
        <span v-else-if="progressData.detectManagement.end == null">-- : --</span>
        <span
            v-else>{{ progressData.detectManagement.end.operator }}:{{ moment(progressData.detectManagement.end.opTime).format('YYYY-MM-DD HH:mm') }}</span>
      </template>
    </el-step>
  </el-steps>
</template>

<script>
export default {
  name: "five",
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
      if (this.progressData.detectManagement != null) {
        if (this.progressData.detectManagement.start != null) {
          num = 1;
        }
        if (this.progressData.detectManagement.start != null && this.progressData.detectManagement.end != null) {
          num = 2;
        }
      }
      return num;
    }
  }
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

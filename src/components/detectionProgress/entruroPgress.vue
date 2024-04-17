<template>
  <div class="progress">
    <el-dialog :before-close="close" :modal-append-to-body="false" :visible.sync="dialogVisible"
               center title="检测进度" width="50%" @close="close"
    >
      <!-- 提示消息 -->
      <el-row>
        <el-col :span="3" style="display: flex">
          <span class="span">
            <div style="
                width: 10px;
                height: 10px;
                background: #d6d9df;
                margin-right: 5px;
              "
            ></div>
            未开始的步骤
          </span>
        </el-col>
        <el-col :span="3">
          <span class="span">
            <div style="
                width: 10px;
                height: 10px;
                background: #409eff;
                margin-right: 5px;
              "
            ></div>
            进行中的步骤
          </span>
        </el-col>
        <el-col :span="3">
          <span class="span">
            <div style="
                width: 10px;
                height: 10px;
                background: #13ce66;
                margin-right: 5px;
              "
            ></div>
            已完成的步骤
          </span>
        </el-col>

      </el-row>
      <!-- 进度条 -->
      <el-row>
        <el-steps :active="active" finish-status="success" simple style="margin-top: 20px">
          <el-step>
            <template slot="title">
              <span style="cursor: pointer" @click="e_click(0)">报检管理</span>
            </template>
          </el-step>
          <el-step v-show="false">
            <!--            <template slot="title">-->
            <!--              <span style="cursor: pointer" @click="e_click(1)">样品交接</span>-->
            <!--            </template>-->
          </el-step>
          <el-step>
            <template slot="title">
              <span style="cursor: pointer" @click="e_click(2)">样品交接</span>
            </template>
          </el-step>
          <el-step>
            <template slot="title">
              <span style="cursor: pointer" @click="e_click(3)">样品领用</span>
            </template>
          </el-step>
          <el-step>
            <template slot="title">
              <span style="cursor: pointer" @click="e_click(4)">检测管理</span>
            </template>
          </el-step>
          <el-step>
            <template slot="title">
              <span style="cursor: pointer" @click="e_click(5)">报告管理</span>
            </template>
          </el-step>
          <el-step>
            <template slot="title">
              <span style="cursor: pointer" @click="e_click(6)">报告发布</span>
            </template>
          </el-step>
        </el-steps>
      </el-row>
      <!-- 进度条具体信息 -->
      <div style="height: 300px; padding-top: 30px">
        <!-- 委托协议 -->
        <first v-if="index === 0" :progressData="progressData.data"/>
        <!-- 样品交接 -->
        <three v-if="index === 2" :progressData="progressData.data"/>
        <!-- 样品领用 -->
        <four v-if="index === 3" :progressData="progressData.data"/>
        <!-- 监测管理 -->
        <five v-if="index === 4" :progressData="progressData.data"/>
        <!-- 报告管理 -->
        <six v-if="index === 5" :progressData="progressData.data"/>
        <!-- 报告发布 -->
        <seven v-if="index === 6" :progressData="progressData.data"/>
      </div>
      <!--  -->
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="close">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import first from './first.vue'
import three from './three.vue'
import four from './four.vue'
import five from './five.vue'
import six from './six.vue'
import seven from './seven.vue'

export default {
  name: 'entruroPgress',
  components: {
    first,
    three,
    four,
    five,
    six,
    seven
  },
  props: {
    distinguishCode: null, //识别码
    processProgressID: null,
    processProgressSource: null
  },
  data() {
    return {
      index: 0,
      progressData: {}, //进度数据
      active: null,
      dialogVisible: false,
      datalist: []
    }
  },
  methods: {
    init(selectionList) {
      this.dialogVisible = true
      this.datalist = selectionList
      this.getEntrustTrackDetail()
    },
    close() {
      this.$emit('close')
    },
    async getEntrustTrackDetail() {
      this.progressData = await this.$net(`/progress/selectEntrustProgress/${this.datalist[0].agreementId}`, 'get')
      this.active = this.progressData.data.active
      this.index = this.active
    },
    e_click(num) {
      if (num <= this.active) {
        this.index = num
      }
    }
  },
}
</script>

<style lang="less" scoped>
.span {
  display: flex;
  align-items: center;
}

/deep/ .el-step__title.is-process {
  color: #409eff !important;

}

/deep/ .el-step.is-simple {
  .is-process {
    border-color: #409eff !important;

    .is-text {
      // background: #409eff;
      // color: #fff;
      border-color: #409eff !important;
    }
  }
}
</style>

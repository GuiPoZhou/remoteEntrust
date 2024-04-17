<template>
  <div class="app-container">

    <el-dialog
        :before-close="close"
        :visible.sync="entrustBookShow"
        center
        @open="open"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        title="委托书管理"
    >
      <a class="agreement-download" @click="downloadAgreementSource()">委托书源文件下载</a>
      <!-- 统一样式 - 主列表区域 -->
      <div class="a-c-bottom">
        <el-table ref="multipleTable" :data="tableData1">
          <el-table-column label="" prop="agreementType"></el-table-column>
          <el-table-column label="文件名称" prop="agreementName">
          </el-table-column>
          <el-table-column label="操作人" prop="operatorName">
          </el-table-column>
          <el-table-column label="创建/更新时间" prop="updateTime">
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template v-slot="scope">
              <el-button
                  size="small"
                  text type="primary"
                  v-show="scope.row.agreementType == '委托方'"
                  icon="el-icon-edit"
                  @click="handleUpload(scope.row)"
              >上传
              </el-button>
              <el-button
                  size="small"
                  text type="primary"
                  v-show="(scope.row.agreement == 2 && scope.row.agreementType == '受理方')||(scope.row.agreement == 1 && scope.row.agreementType == '委托方')||(scope.row.agreement == 3)"
                  icon="el-icon-edit"
                  @click="handleDown(scope.row)"
              >下载
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close()">关 闭</el-button>
      </div>
      <!-- 分页 -->
      <!--<pagination-->
      <!--v-show="total > 0"-->
      <!--:total="total"-->
      <!--:page.sync="queryData.pageNum"-->
      <!--:limit.sync="queryData.pageSize"-->
      <!--@pagination="init()"-->
      <!--/>-->
    </el-dialog>
    <upload
        :rowData='rowData'
        :upload="upload"
        :visible.sync="upload.open"
        ref="upload"
        @afterImport="init"
    />
  </div>
</template>
<script>
import upload from "./upload.vue";
import {downloadAgreementList, downloadAgreement, uploadAgreement} from "@/api/entrust/entrustConfirm.js";

export default {
  name: "noConfirm",
  components: {upload},
  data() {
    return {
      //查询参数
      queryData: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      loading: false,
      agreementType: undefined,
      tableData1: [],
      // 导入参数配置
      upload: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: "",
        // 是否禁用上传
        isUploading: false,
      },
    };
  },
  props: {
    rowData: {
      type: Object,
      default: () => ({}),
    },
    entrustBookShow: {
      type: Boolean,
      default: false,
    },
  },
  methods: {

    //委托书源文件下载
    downloadAgreementSource() {
      window.location.href =
          process.env.VUE_APP_BASE_API +
          "/base/v1/taskConfirm/downloadAgreement?agreementType=0"
          + "&taskIdCode=" + this.rowData.idCode;
    },
    //上传
    handleUpload(row) {
      this.upload.title = "委托书上传";
      this.upload.open = true;
    },
    //下载
    handleDown(row) {
      this.agreementType = row.agreementType
      // let parmas = {
      //   agreementType:this.agreementTypeNum,
      //   taskIdCode:this.rowData.idCode
      // }
      // downloadAgreement(parmas).then(
      //   (res) => {
      //     // this.tableData1 = res.rows;
      //     // this.total = res.total;
      //     // this.loading = false;
      //   },
      //   (err) => {}
      // );
      if (row.agreementName) {

        window.location.href =
            process.env.VUE_APP_BASE_API +
            "/base/v1/taskConfirm/downloadAgreement?agreementType=" +
            this.agreementTypeNum + "&taskIdCode=" + this.rowData.idCode;
      } else {
        this.$message.error('无下载文件')
      }

    },

    close() {
      this.$emit("update:entrustBookShow", false);
    },
    open() {
      this.init();
    },

    //页面初始化
    init() {
      this.loading = true;
      downloadAgreementList(this.rowData.idCode).then(
          (res) => {
            this.tableData1 = res.rows;
            this.total = res.total;
            this.loading = false;
          },
          (err) => {
          }
      );
    },
  },
  computed: {
    agreementTypeNum() {
      switch (this.agreementType) {
        case "原版":
          return "0";
          break;
        case "委托方":
          return "1";
          break;
        case "受理方":
          return "2";
          break;
      }
    },
  },
  created() {
  },
  mounted() {
  },
};
</script>
<style lang="less" scoped>
/deep/ .dialog-footer {
  // background-color: pink;
  display: flex;
  align-items: center;
  height: 50px;
  line-height: 16px;
  font-size: 16px;

  /deep/ .left {
    border-right: 2px solid rgb(156, 153, 153);
    padding-right: 10px;

    /deep/ span {
      color: blue;
    }
  }

  /deep/ .right {
    display: flex;

    /deep/ span {
      display: block;
      margin-right: 10px;
    }

    align-items: center;
    margin-left: 10px;
  }
}

/deep/ .el-row-toolbar {
  margin: 5px;
}
</style>

<template>
  <div class="app-container">
    <el-dialog
        :before-close="close"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="downReportShow"
        center
        title="下载报告"
        @open="open"
    >
      <!-- 统一样式 - 主列表区域 -->
      <div class="a-c-bottom">
        <el-col :span="1.5" style="margin-bottom: 10px">
          <el-button :disabled="multiple" type="primary" @click="handleDownfile">批量下载</el-button>
        </el-col>
        <el-table ref="multipleTable" :data="tableData1" @selection-change="handleSelectionChange">
          <el-table-column align="center" type="selection" width="55"/>
          <el-table-column label="报告编号" prop="pageId">
          </el-table-column>
          <el-table-column label="样品编号" prop="sampleIdCode">
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button
                  icon="el-icon-edit"
                  size="small"
                  type="text"
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
    </el-dialog>
  </div>
</template>
<script>
import {downloadReportList, downloabUrl} from "@/api/entrust/entrustConfirm";

export default {
  name: "noConfirm",
  components: {},
  data() {
    return {
      //查询参数
      queryData: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      loading: false,
      tableData1: [],
      ids: [],
      multiple: true
    };
  },
  props: {
    rowData: {
      type: Object,
      default: () => ({}),
    },
    downReportShow: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    //下载
    handleDown(row) {
      if (row.url) {
        window.location.href = row.url;
      } else {
        this.$message.error('无下载文件')
      }

    },

    close() {
      this.$emit("update:downReportShow", false);
    },
    open() {
      this.init();
    },

    //页面初始化
    init() {
      this.loading = true;
      let param = {"idCode": this.rowData.idCode}
      downloadReportList(param).then(
          (res) => {
            console.log(res)
            this.tableData1 = res.rows;
            this.total = res.total;
            this.loading = false;
          },
          (err) => {
          }
      );
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.pageId);
      this.multiple = !selection.length;
    },
    // 批量下载
    handleDownfile() {
      downloabUrl().then(res => {
        if (res.code === 200) {
          const ids = this.ids.join(',')
          // 打开下载链接
          window.location.href =
              res.msg + "?pageIds=" + ids + '&remoteNo=' + this.rowData.idCode
        }
      })
    }
  },
  computed: {},
  created() {
  },
  mounted() {
  },
};
</script>
<style lang="less" scoped>
:deep(.dialog-footer) {
  // background-color: pink;
  display: flex;
  align-items: center;
  height: 50px;
  line-height: 16px;
  font-size: 16px;

  :deep(.left) {
    border-right: 2px solid rgb(156, 153, 153);
    padding-right: 10px;

    :deep(span) {
      color: blue;
    }
  }

  :deep(.right) {
    display: flex;

    :deep(span) {
      display: block;
      margin-right: 10px;
    }

    align-items: center;
    margin-left: 10px;
  }
}

:deep(.el-row-toolbar) {
  margin: 5px;
}
</style>

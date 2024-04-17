<template>
  <div class="app-container">
    <el-dialog
        :before-close="close"
        :visible.sync="sampleCategoryShow"
        center
        @open="open"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        title="样品类别"
    >
      <!-- 统一样式 - 查询区域 -->
      <div class="a-c-top">
        <el-form
            ref="queryForm"
            :inline="true"
            :model="queryData"
            label-width="100px"
            @submit.native.prevent
        >
          <!-- 搜索栏 -->
          <el-form-item>
            <el-input
                @keyup.enter.native="handleQuery"
                v-model="queryData.keyword"
                clearable
                placeholder="请输入关键字搜索"
            >
            </el-input>
          </el-form-item>
          <div class="a-c-t-btnarea">
            <el-form-item>
              <el-button
                  type="cyan"
                  icon="el-icon-search"
                  size="small"
                  @click="handleQuery"
              >搜索
              </el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>

      <!-- 统一样式 - 主列表区域 -->
      <div class="a-c-top">
        <el-table ref="multipleTable" :data="tableData" @row-click="selectOne">
          <el-table-column label="" width="40">
            <template scope="scope">
              <el-radio
                  :label="scope.row.id"
                  v-model="currentRow"
                  @change.native="getCurrentRow(scope.row)"
                  style="color: #fff; padding-left: 10px; margin-right: -25px"
              ></el-radio>
            </template>
          </el-table-column>
          <el-table-column label="产品名称" prop="name"></el-table-column>
          <el-table-column label="产品编号" prop="searchCode">
          </el-table-column>
          <el-table-column label="产品类别" prop="type"></el-table-column>
          <el-table-column :formatter="statusFormatter" label="产品状态" prop="status"></el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
        <el-button @click="close()">取 消</el-button>
      </div>
      <!-- 分页 -->
      <pagination
          v-show="total > 0"
          :page.sync="queryData.pageNum"
          :total="total"
          :limit.sync="queryData.pageSize"
          @pagination="init()"
      />
    </el-dialog>
    <selectItem :selectItemShow.sync="selectItemShow"/>
  </div>
</template>
<script>
import selectItem from "./selectItem";
import {getSampleCate} from "@/api/entrust/entrustConfirm";

export default {
  name: "noConfirm",
  components: {
    selectItem,
    // entrustInfo,
    // selectDetectName
  },
  data() {
    return {
      //查询参数
      queryData: {
        pageNum: 1,
        pageSize: 10,
        keyword: "", //搜索内容
      },
      currentRow: null, //当前选择的行
      rowData: {}, //单选按钮选择的数据

      dateRange: [],
      total: 0,

      loading: false,
      selectItemShow: false, //选择的检验项目
      tableData: [],
      entrustInfoShow: false,
    };
  },
  props: {
    sampleCategoryShow: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    statusFormatter(row, column) {
      if (row.status == 0) {
        return '正常';
      } else {
        return '停用';
      }
    },
    selectOne(row) {
      this.rowData = row;
      this.currentRow = row.id;
    },
    //单选按钮
    getCurrentRow(row) {
      this.rowData = row;
    },

    close() {
      this.$emit("update:sampleCategoryShow", false);
    },
    open() {
      this.init();
    },
    //确认按钮操作
    handleConfirm() {
      this.$emit("backfillCategory", this.rowData);
      this.close();
    },
    //搜索按钮操作
    handleQuery() {
      this.queryData.pageNum = 1;
      this.init();
    },

    //页面初始化
    init() {
      this.loading = true;
      this.loading = true;
      getSampleCate(this.queryData).then(
          (res) => {
            this.tableData = res.rows;
            this.total = res.total;
            this.loading = false;
          },
          (err) => {
          }
      );
    },
  },
  computed: {},
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

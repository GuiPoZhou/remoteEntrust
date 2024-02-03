<template>
  <div class="app-container">
    <el-dialog
        :before-close="close"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="copyAddItemShow"
        center
        title="复制添加项目"
        @open="open"
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
          <el-form-item label="委托编号">
            <el-input
                v-model="queryData.taskIdCode"
                clearable
                placeholder="请输入搜索"
                @keyup.enter.native="handleQuery"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="样品名称">
            <el-input
                v-model="queryData.productionName"
                clearable
                placeholder="请输入搜索"
                @keyup.enter.native="handleQuery"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="样品类别:">
            <el-input
                v-model="queryData.category"
                clearable
                @focus="sampleCategoryShow = true">
              <i
                  slot="suffix"
                  class="el-input__icon el-icon-search"
                  @click="sampleCategoryShow = true"
              ></i>
            </el-input>
          </el-form-item>
          <!--<el-form-item label="样品类别">-->
          <!--<el-select v-model="queryData.productionId" placeholder="请选择">-->
          <!--<el-option label="全部" value="全部"></el-option>-->
          <!--<el-option label="暂存" value="暂存"></el-option>-->
          <!--<el-option label="已撤回" value="已撤回"></el-option>-->
          <!--<el-option label="被退回" value="被退回"></el-option>-->
          <!--<el-option label="待受理" value="待受理"></el-option>-->
          <!--<el-option label="已受理" value="已受理"></el-option>-->
          <!--<el-option label="检测中" value="检测中"></el-option>-->
          <!--<el-option label="检测完成" value="检测完成"></el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
          <!-- 统一样式 - 查询区域 按钮 -->
          <div class="a-c-t-btnarea">
            <el-form-item>
              <el-button
                  icon="el-icon-search"
                  size="mini"
                  type="cyan"
                  @click="handleQuery"
              >搜索
              </el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >重置
              </el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>

      <!-- 统一样式 - 主列表区域 -->
      <div class="a-c-bottom">

        <el-table ref="multipleTable" :data="tableData1" @row-click="selectOne">
          <el-table-column label="" width="40">
            <template scope="scope">
              <el-radio
                  v-model="currentRow"
                  :label="scope.row.idCode"
                  style="color: #fff; padding-left: 10px; margin-right: -25px"
              ></el-radio>
            </template>
          </el-table-column>
          <!-- <el-table-column
            type="index"
            width="55"
            align="center"
            label="序号"
          /> -->
          <el-table-column align="center" label="序号" type="index" width="55">
            <template slot-scope="scope">
              <span>{{ (queryData.pageNum - 1) * queryData.pageSize + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="样品编号" prop="idCode"></el-table-column>
          <el-table-column label="样品名称" prop="productionName">
          </el-table-column>
          <el-table-column label="样品类别" prop="productionNameStr">
          </el-table-column>
          <el-table-column :formatter="extDataFormat" label="样品量" prop="dataCount"></el-table-column>
          <el-table-column label="检测项目数量" prop="itemCount">
            <template scope="scope">
              <div
                  style="text-decoration: underline; cursor: pointer"
                  @click="detailItem(scope.row)"
              >
                {{ scope.row.itemCount }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="close()">取 消</el-button>
      </div>
      <!-- 分页 -->
      <pagination
          v-show="total > 0"
          :limit.sync="queryData.pageSize"
          :page.sync="queryData.pageNum"
          :total="total"
          @pagination="init()"
      />
    </el-dialog>
    <selectItem :itemRowData='itemRowData' :selectItemShow.sync="selectItemShow"/>
    <sampleCategory
        :sampleCategoryShow.sync="sampleCategoryShow"
        @backfillCategory="backfillCategory"
    />
  </div>
</template>
<script>
import selectItem from "./selectItem";
import {samplesList, cloneItem} from "@/api/entrust/entrustConfirm";
import sampleCategory from "./sampleCategory";

export default {
  name: "noConfirm",
  components: {
    selectItem,
    sampleCategory
    // entrustInfo,
    // selectDetectName
  },
  data() {
    return {
      sampleCategoryShow: false,
      //查询参数
      queryData: {
        pageNum: 1,
        pageSize: 10,
        taskIdCode: "", //委托编号
        productionName: "",
        productionId: "",
        category: "",
      },

      dateRange: [],
      total: 0,
      currentRow: '',
      loading: false,
      selectItemShow: false, //选择的检验项目
      tableData1: [],
      entrustInfoShow: false,
      itemRowData: {},
    };
  },
  props: {
    copyAddItemShow: {
      type: Boolean,
      default: false,
    },
    targetSampleIdCode: '',//目标样品编号
  },
  methods: {
    //扩展属性 样品量拼接
    extDataFormat(row, column) {
      let str = '-';
      if (row.extData) {
        let extDataObj = JSON.parse(row.extData);
        if (extDataObj["sample_Amout"] && extDataObj["sampleAmout"]) {
          str = extDataObj["sample_Amout"] + extDataObj["sampleAmout"];
        }
      }
      return str;
    },
    selectOne(row) {
      this.currentRow = row.idCode;
    },
    //回填检测类别
    backfillCategory(detectCategory) {
      this.queryData.productionId = detectCategory.id;//样品类别id   后台查询参数
      this.queryData.category = detectCategory.name;//名称  页面展示
    },
    detailItem(row) {
      if (!row.itemCount) {
        this.msgError("请先给样品添加检测项目")
        return false;
      }
      this.selectItemShow = true;
      this.itemRowData = row;
    },
    //确定按钮操作
    submitFileForm() {
      if (!this.currentRow) {
        this.msgError("请先选择要复制的样品数据")
        return false;
      }
      let params = {
        targetSampleIdCode: this.targetSampleIdCode,
        sourceSampleIdCode: this.currentRow
      }
      cloneItem(params).then(
          (res) => {
            if (res.code == 200) {
              this.msgSuccess("复制添加项目成功");
              this.$emit("saveItem", null);
              this.close()
            }
          },
          (err) => {
          }
      );


    },
    close() {
      this.$emit("update:copyAddItemShow", false);
    },
    open() {
      this.init();
    },

    //搜索按钮操作
    handleQuery() {
      this.queryData.pageNum = 1;
      this.init();
    },
    //重置按钮操作
    resetQuery() {
      this.queryData.taskIdCode = "";
      this.queryData.productionName = "";
      this.queryData.productionId = "";
      this.queryData.category = '';
      this.resetForm("queryForm");
      this.handleQuery();
    },
    //页面初始化
    init() {
      this.loading = true;
      samplesList(this.queryData).then(
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
  computed: {},
  created() {
  },
  mounted() {
  },
};
</script>
<style lang="scss" scoped>
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

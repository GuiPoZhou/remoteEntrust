<template>
  <div>
    <el-form layout="inline">
      <el-form-item label="项目名称:">
        <el-input
            v-model="queryParams.itemName"
            @keyup.enter.native="getItemList"
        />
      </el-form-item>
      <el-form-item label="方法编号:">
        <el-input
            v-model="queryParams.methodCode"
            @keyup.enter.native="getItemList"
        />
      </el-form-item>


    </el-form>

    <el-table
        :data="itemTableData"
        border
        ref="itemTable"
        v-loading="loading"
        element-loading-spinner="el-icon-loading"
        :cell-style="{ padding: '2px' }"
        :row-style="{ height: '20px' }"
        height="200"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        element-loading-text="拼命加载中"
        style="width: 100%"
        @select="parseSelectedItems()"
        @select-all="parseSelectedItems()"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column
          prop="itemName"
          label="项目名称"
          :show-overflow-tooltip="true"
      />
      <el-table-column
          prop="englishName"
          label="英文名称"
          :show-overflow-tooltip="true"
      />
      <el-table-column
          label="方法编号"
          prop="methodStandardCode"
          :show-overflow-tooltip="true"
      />
      <el-table-column
          :show-overflow-tooltip="true"
          label="方法名称"
          prop="methodStandardName"
      />
      <el-table-column
          label="所需样品量"
          prop="sampleSize"
          :show-overflow-tooltip="true"
      />
      <!--<el-table-column-->
      <!--prop="detectionLimit"-->
      <!--label="方法检出限"-->
      <!--:show-overflow-tooltip="true"-->
      <!--/>-->
      <!--<el-table-column-->

      <!--label="检出限单位"-->
      <!--:show-overflow-tooltip="true"-->
      <!--&gt;-->
      <!--<template v-slot="scope">-->
      <!--<span v-html="scope.row.detectionLimitUnit">{{scope.row.detectionLimitUnit}}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column-->
      <!--prop="stroma"-->
      <!--label="基质"-->
      <!--:show-overflow-tooltip="true"-->
      <!--/>-->
    </el-table>
    <pagination
        v-show="total > 0"
        :total="total"
        :limit.sync="queryParams.pageSize"
        :page.sync="queryParams.pageNum"
        @pagination="getItemList"
    />
  </div>
</template>

<script>
import {queryItemList} from "@/api/entrust/entrustConfirm";
export default {
  name: "itemList",
  data() {
    return {
      // 遮罩层
      loading: false,
      itemTableData: [
        {
          sampleName: "",
        },
      ],
      queryParams: {
        itemName: undefined,
        methodCode: undefined,
        //检测类别
        // detectCategory: undefined,
        // 记录单类别
        // recordType: undefined,
        pageNum: 1,
        pageSize: 10,
        sampleIdCode: this.sampleIdCode
      },
      total: 0,
    };
  },
  props: {
    selectedItems: Array,
    sampleIdCode: ""
  },
  methods: {
    getItemList() {
      // console.log('ddd',this.$store.state)
      // this.queryParams.detectCategory = this.$store.state.editPonit.detectType;
      queryItemList(this.queryParams).then((response) => {
        this.itemTableData = response.rows;
        this.total = response.total;

        // 初始化勾选项
        this.$nextTick(() => {
          let alreadySelectedItemIds = this.selectedItems.map(
              (item) => item.methodStandardItemId
          );
          this.itemTableData.forEach((itemMethod) => {
            if (
                alreadySelectedItemIds.indexOf(itemMethod.methodStandardItemId) >=
                0
            ) {
              this.$refs.itemTable.toggleRowSelection(itemMethod, true);
            } else {
              this.$refs.itemTable.toggleRowSelection(itemMethod, false);
            }
          });
        });
      });
    },
    initItemList() {
      // initItemList(detectType, recordType) {
      // this.queryParams.detectCategory = detectType;
      // this.queryParams.recordType = recordType;

      this.getItemList();
    },

    parseSelectedItems() {
      //所有项目列表中选中行
      let currentSelectedItems = this.$refs.itemTable.selection;
      this.$emit("parseSelectedItems", {
        currentSelectedItems: currentSelectedItems,
        allItem: this.itemTableData,
      });
    },
    unSelectItem(delItem) {
      //去掉勾选
      this.itemTableData.forEach((item) => {
        if (item.methodStandardItemId === delItem.methodStandardItemId) {
          this.$refs.itemTable.toggleRowSelection(item, false);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-form {
  display: flex;
  justify-content: flex-start;

  /deep/ .el-form-item {
    display: flex;
    margin-right: 10px;
  }
}
</style>

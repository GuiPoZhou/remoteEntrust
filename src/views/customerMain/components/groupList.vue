<template>
  <el-container style="height: 300px; border: 1px solid #eee">
    <el-aside width="300px">
      <el-row>
        <el-input v-model="name" placeholder="请输入分组名称" @keyup.enter.native="getGroupList"/>
      </el-row>
      <el-table
          :data="groupTableData"
          border
          ref="groupTable"
          v-loading="loading"
          :cell-style="{ padding: '5px' }"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          style="width: 100%"
          :row-style="{ height: '20px' }"
          @row-click="initGroupItemList"
          element-loading-spinner="el-icon-loading"
          element-loading-text="拼命加载中"
          height="230"
      >
        <el-table-column label="分组名称" prop="name"/>
      </el-table>
    </el-aside>
    <el-container style="margin-left: 10px">
      <div style="width: 100%">
        <el-table
            :data="groupItemTableData"
            border
            ref="groupItemTable"
            v-loading="loading"
            element-loading-spinner="el-icon-loading"
            :cell-style="{ padding: '2px' }"
            style="width: 100%"
            :row-style="{ height: '20px' }"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            element-loading-text="拼命加载中"
            height="230"
            @select="parseSelectedItems()"
            @select-all="parseSelectedItems()"
        >
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column
              label="项目名称"
              prop="itemName"
              :show-overflow-tooltip="true"
          />
          <el-table-column
              prop="englishName"
              label="英文名称"
              :show-overflow-tooltip="true"
          />
          <el-table-column
              prop="methodStandardCode"
              label="方法编号"
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
          <!--<el-table-column label="检出限单位" :show-overflow-tooltip="true">-->
          <!--<template v-slot="scope">-->
          <!--<span v-html="scope.row.detectionLimitUnit">{{-->
          <!--scope.row.detectionLimitUnit-->
          <!--}}</span>-->
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
            :limit.sync="queryParams.pageSize"
            :page.sync="queryParams.pageNum"
            :total="total"
            @pagination="getGroupItems"
        />
      </div>
    </el-container>
  </el-container>
</template>

<script>
import {
  queryGroupItemList,
  queryItemGroup,
} from "@/api/entrust/entrustConfirm";

export default {
  name: "groupList",
  data() {
    return {
      // 遮罩层
      loading: false,
      groupItemTableData: [],
      groupTableData: [],
      name: "",
      // 检测类别
      detectCategory: undefined,
      //记录单类别
      recordType: undefined,
      // 查询参数
      queryParams: {
        pageSize: 10,
        pageNum: 1,
        //记录单类别
        recordType: undefined,
      },
      groupId: undefined,
      total: 0,
    };
  },
  props: {
    selectedItems: Array,
    sampleIdCode: ""
  },
  methods: {
    initGroupList(detectType, recordType) {
      this.detectCategory = detectType;
      this.queryParams.recordType = recordType;
      this.getGroupList();
    },

    getGroupList() {
      let param = {
        groupName: this.name
      };
      queryItemGroup(param).then((response) => {
            this.groupTableData = response.data;
            this.groupItemTableData = [];
          },
      );
    },

    initGroupItemList(row, column, event) {
      this.groupId = row.id;
      this.getGroupItems();
    },

    getGroupItems() {
      let params = {
        groupId: this.groupId,
        pageSize: this.queryParams.pageSize,
        pageNum: this.queryParams.pageNum,
        sampleIdCode: this.sampleIdCode
      };
      queryGroupItemList(params).then((res) => {
        this.groupItemTableData = res.rows;
        this.total = res.total;

        // 初始化勾选项
        this.$nextTick(() => {
          let alreadySelectedItemIds = this.selectedItems.map(
              (item) => item.methodStandardItemId
          );
          this.groupItemTableData.forEach((itemMethod) => {
            if (
                alreadySelectedItemIds.indexOf(itemMethod.methodStandardItemId) >=
                0
            ) {
              this.$refs.groupItemTable.toggleRowSelection(itemMethod, true);
            } else {
              this.$refs.groupItemTable.toggleRowSelection(itemMethod, false);
            }
          });
        });
      });
    },
    parseSelectedItems() {
      //所有项目列表中选中行
      let currentSelectedItems = this.$refs.groupItemTable.selection;
      console.log("currentSelectedItems11", currentSelectedItems);

      this.$emit("parseSelectedItems", {
        currentSelectedItems: currentSelectedItems,
        allItem: this.groupItemTableData,
      });
    },
    unSelectItem(delItem) {
      //去掉勾选
      this.groupItemTableData.forEach((item) => {
        if (item.methodStandardItemId === delItem.methodStandardItemId) {
          this.$refs.groupItemTable.toggleRowSelection(item, false);
        }
      });
    },
  },
};
</script>

<style scoped>
.el-aside {
  padding: 5px !important;
  margin: 0px !important;
}
/*aside{*/
/*  padding:10px*/
/*}*/
</style>

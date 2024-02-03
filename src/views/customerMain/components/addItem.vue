<!--选择项目-->
<template>
  <el-dialog
      :before-close="close"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="true"
      :title="'已选择项目（共' + sampleNum + '个）'"
      :visible.sync="addItemShow"
      append-to-body
      center
      height="700px"
      width="1000px"
      @close="close"
  >
    <el-table
        ref="selectedItemTable"
        :cell-style="{ padding: '2px' }"
        :data="selectedItemTableData"
        :row-style="{ height: '20px' }"
        border
        element-loading-background="rgba(0, 0, 0, 0.8)"
        element-loading-spinner="el-icon-loading"
        element-loading-text="拼命加载中"
        height="300"
        style="width: 100%"
    >
      <el-table-column align="center" label="序号" type="index" width="55">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
          :show-overflow-tooltip="true"
          label="项目名称"
          prop="itemName"
      />
      <el-table-column
          :show-overflow-tooltip="true"
          label="英文名称"
          prop="englishName"
      />
      <el-table-column
          :show-overflow-tooltip="true"
          label="方法编号"
          prop="methodStandardCode"
      />
      <el-table-column
          :show-overflow-tooltip="true"
          label="方法名称"
          prop="methodStandardName"
      />
      <el-table-column
          :show-overflow-tooltip="true"
          label="所需样品量"
          prop="sampleSize"
      />
      <!--<el-table-column prop="detectionLimit" label="方法检出限" />-->
      <!--<el-table-column label="检出限单位" :show-overflow-tooltip="true">-->
      <!--<template slot-scope="scope">-->
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
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button
              icon="el-icon-delete"
              size="mini"
              type="text"
              @click="deleteItem(scope.$index, scope.row)"
          >删除
          </el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div style="margin-top: 10px; height: 300px">
      <el-tabs
          :value="selectItemType"
          tab-position="left"
          type="border-card"
          @tab-click="handleClick"
      >
        <el-tab-pane label="按项目" name="item">
          <itemList
              ref="itemList"
              :sampleIdCode="sampleIdCode"
              :selectedItems="selectedItemTableData"
              @parseSelectedItems="parseSelectedItems"
          />
        </el-tab-pane>

        <el-tab-pane label="按分组" name="group">
          <groupList
              ref="groupList"
              :sampleIdCode="sampleIdCode"
              :selectedItems="selectedItemTableData"
              @parseSelectedItems="parseSelectedItems"
          />
        </el-tab-pane>
      </el-tabs>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button center type="primary" @click="saveItem">保存</el-button>
      <el-button @click="close">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import itemList from "./itemList";
import groupList from "./groupList";
import {addItem} from "@/api/entrust/entrustConfirm";

export default {
  name: "selectItem",
  components: {
    // Template,
    itemList,
    groupList
  },
  computed: {
    //已选择项目样品数
    sampleNum() {
      return this.selectedItemTableData.length;
    }
  },
  props: {
    // addItemShow: {
    //   type: Boolean,
    //   default: false
    // },
    sampleIdCode: "", //样品编号
    taskIdCode: "" //委托编号
  },
  data() {
    return {
      addItemShow: false,
      //选中项目的方式 item:按项目选择 ，group:按组选择
      selectItemType: "item",
      //检测类别
      // detectType: undefined,
      //记录单类别
      // recordType: undefined,
      selectedItemTableData: []
    };
  },
  methods: {
    initItemList(selectedItems) {
      this.addItemShow = true;
      this.selectItemType = "item";
      this.selectedItemTableData = new Array(); //初始化 上半部分 以选中检测项目表格
      // this.selectedItemTableData = selectedItems;
      this.$nextTick(() => {
        this.$refs.itemList.initItemList();
      });
    },
    //保存选中项目
    saveItem() {
      if (this.selectedItemTableData.length == 0) {
        this.msgError("请选择要添加的检测项目");
        return false;
      }
      //前端校验所选检测项目是否存在相同的检查项目名称
      let measureItemIdArray = [];
      for (let i = 0; i < this.selectedItemTableData.length; i++) {
        measureItemIdArray[i] = this.selectedItemTableData[i].measureItemId;
      }
      if (new Set(measureItemIdArray).size != measureItemIdArray.length) {
        this.msgError("请不要选择相同检测项目");
        return false;
      }
      let params = [];

      this.selectedItemTableData.forEach((ele, index) => {
        params.push({
          detectionLimit: ele.detectionLimit,
          detectionLimitUnit: ele.detectionLimitUnit,
          unitName: ele.unitName,
          stroma: ele.stroma,
          showOrder: index + 1,
          methodStandardId: ele.methodStandardId,
          methodStandardItemId: ele.methodStandardItemId,
          measureItemId: ele.measureItemId,
          taskIdCode: this.taskIdCode, //委托编号
          sampleIdCode: this.sampleIdCode, //样品编号
          itemGroupId: ele.itemGroupId,
          itemName: ele.itemName
        });
      });
      addItem(params).then(response => {
        if (response.code == 200) {
          this.msgSuccess("添加检验项目成功");
          this.$emit("saveItem", this.selectedItemTableData);
          this.close();
        }
      });
    },
    //取消按钮操作
    close() {
      this.$emit("close", false);
    },
    handleClick(tab, event) {
      // alert(1)
      this.selectItemType = tab.name;
      this.$nextTick(() => {
        if (this.selectItemType === "group") {
          this.$refs.groupList.initGroupList(this.detectType, this.recordType);
        } else {
          this.$refs.itemList.initItemList(this.detectType, this.recordType);
        }
      });
    },

    //操作未选中项目时解析已选中项目
    parseSelectedItems({currentSelectedItems, allItem}) {
      // alert('调用')
      //所有项目列表--选中项目id
      let currentSelectedItemIds = currentSelectedItems.map(
          itemMethod => itemMethod.methodStandardItemId
      );

      //所有项目列表中--项目id
      let allItemIds = allItem.map(
          itemMethod => itemMethod.methodStandardItemId
      );

      //所有项目列表--未选中 项目id
      let currentUnSelectedItemIds = allItemIds.filter(methodStandardItemId => {
        return currentSelectedItemIds.indexOf(methodStandardItemId) < 0;
      });

      //已选项目列表中 项目id
      let alreadySelectedItemIds = this.selectedItemTableData.map(
          itemMethod => itemMethod.methodStandardItemId
      );

      //添加
      let addArray = [];
      currentSelectedItems.forEach(itemMethod => {
        if (
            alreadySelectedItemIds.indexOf(itemMethod.methodStandardItemId) < 0
        ) {
          console.log(itemMethod);
          addArray.push(itemMethod);
          this.selectedItemTableData.push(itemMethod);
        }
      });
      // if(addArray && addArray.length >0){
      //   this.$nextTick(() => {
      //     this.selectedItemTableData.push(addArray);
      //   });
      // }

      // console.log('this.selectedItemTableData',this.selectedItemTableData)

      //删除未选中项
      for (let i = this.selectedItemTableData.length - 1; i >= 0; i--) {
        let itemId = this.selectedItemTableData[i].methodStandardItemId;
        if (currentUnSelectedItemIds.indexOf(itemId) >= 0) {
          this.selectedItemTableData.splice(i, 1);
        }
      }
    },
    //删除项目
    deleteItem(index, item) {
      //删除选重行
      this.selectedItemTableData.splice(index, 1);

      this.$nextTick(() => {
        if (this.selectItemType === "group") {
          this.$refs.groupList.unSelectItem(item);
        } else {
          this.$refs.itemList.unSelectItem(item);
        }
      });
    }
  }
};
</script>

<style scoped></style>

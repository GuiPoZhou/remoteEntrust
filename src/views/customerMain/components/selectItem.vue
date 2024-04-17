<template>
  <div class="instrumentManage">
    <el-dialog
        :append-to-body="true"
        :visible.sync="selectItemShow"
        center
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="true"
        title=""
        @close="close"
        @open="open"
    >
      <div class="selected" style="text-align:center;font-size:18px;font-weight: 600;">
        <span>{{ `已选择检测项目(共${tableData.length}个)` }}</span>
      </div>
      <!-- 表格 -->
      <el-table
          v-loading="loading"
          :data="tableData"
          align="center"
      >
        <el-table-column label="序号" prop="id" type="index" width="55px"/>
        <el-table-column label="项目名称" prop="itemName"/>
        <el-table-column label="英文名称" prop="englishName"/>
        <el-table-column label="方法编号" prop="methodStandardCode"/>
        <el-table-column label="方法名称" prop="methodStandardName"/>

        <!--<el-table-column prop="detectionLimit" label="方法检出限" />-->
        <!--<el-table-column prop="unit" label="检出限单位" />-->
        <!--<el-table-column prop="stroma" label="基质" />-->
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {itemListBySample} from "@/api/entrust/entrustConfirm";
export default {
  name: "",
  components: {},
  data() {
    return {
      loading: false,
      tableData: [],
    };
  },
  props: {
    selectItemShow: {
      type: Boolean,
      default: false,
    },
    itemRowData: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    //取消按钮操作
    close() {
      this.$emit("update:selectItemShow", false);
    },
    open() {
      this.init()
      console.log('itemRowData', this.itemRowData)
    },
    init() {
      let temp = this.itemRowData.idCode;
      this.loading = true
      itemListBySample(temp).then(
          (res) => {
            if (res.code == 200) {
              this.tableData = res.data
              this.loading = false
            }
          },
          (err) => {
          }
      );

    }
  },
};
</script>

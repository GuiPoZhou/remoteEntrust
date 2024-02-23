<template>
  <div class="useDetect">
    <el-row>
      <el-col :span="8">
        <el-form ref="form" :model="form" label-width="80px" @submit.native.prevent>
          <el-row>
            <el-col :span="12">
              <el-form-item label="类别名称" prop="detectName">
                <el-input v-model="form.detectName" clearable style="width: 150px" @clear="e_getDetectList"
                          @keyup.enter.native="e_getDetectList"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table
            :data="detectList"
            :row-class-name="tableRowClassName"
            height="360"
            style="width: 100%">
          <el-table-column
              label="序号"
              type="index">
          </el-table-column>
          <el-table-column
              align="center"
              label="产品类别"
              prop="detectName">
          </el-table-column>
          <el-table-column
              align="center"
              label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="e_useType(scope.row,scope.$index)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
            v-show="total > 0"
            :limit.sync="form.pageSize"
            :page.sync="form.pageNum"
            :total="total"
            @pagination="e_getDetectList"
        />
      </el-col>
      <el-col :span="16" style="padding: 10px">
        <itemList ref="itemList" :selectedItems="selectedItems"
                  @parseSelectedItems="parseSelectedItems"/>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import itemList from './itemList'

export default {
  components: {
    itemList
  },
  props: {
    selectedItems: Array
  },
  data() {
    return {
      form: {
        detectName: undefined,
        pageNum: 1,
        pageSize: 10,
      },
      detectList: [],
      total: 0,
      currentRowIndex: -1
    }
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
      if (rowIndex === this.currentRowIndex) {
        return 'warning-row';
      }
      return '';
    },
    /**
     * @author Coder
     * @date 2023/3/30
     * @des 选择检测项目
     */
    parseSelectedItems(params) {
      this.$emit("parseSelectedItems", params)
    },
    /**
     * @author Coder
     * @date 2023/3/30
     * @des 选择type
     */
    e_useType(row, index) {
      this.currentRowIndex = index
      this.$refs.itemList.useDetectSearch(row.id)
    },
    /**
     * @author Coder
     * @date 2023/3/30
     * @des 获取检测类别
     */
    e_getDetectList() {
      this.$net("/standard/v1/detectCategorys/getCategoryList", 'get', this.form).then(re => {
        this.detectList = re.data.list
        this.total = re.data.total
        this.currentRowIndex = -1
        this.$refs.itemList.itemTableData = []
        this.$refs.itemList.total = 0
      })
    },
    /**
     * @author Coder
     * @date 2023/3/30
     * @des 重置
     */
    e_repeat() {
      this.form.detectName = undefined
      this.form.pageNum = 1
      this.form.pageSize = 10
      this.e_getDetectList()
    },
  },
  mounted() {
    this.e_getDetectList()
  }
}
</script>
<style lang="scss">
.useDetect {
  .el-table .warning-row {
    background: #66b1ff;

    .el-button--text {
      color: #fff;
    }
  }

}
</style>

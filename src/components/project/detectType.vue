<template>
  <el-dialog
      :before-close="close"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="visible"
      append-to-body
      center
      title="检测类别选择"
      width="800px"
  >
    <el-form
        ref="queryForm"
        :inline="true"
        :model="queryParams"
        label-width="100px"
    >
      <!-- 搜索栏 -->
      <el-form-item label="类别名称">
        <el-input
            v-model="queryParams.detectName"
            clearable
            placeholder="请输入选择类别名称"
            @keyup.enter.native="handleQuery"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
            icon="el-icon-search"
            size="mini"
            type="primary"
            @click="handleQuery"
        >搜索
        </el-button
        >
      </el-form-item>

      <!-- 表格 -->
      <el-table :data="tableData">
        <el-table-column label="序号" prop="id" type="index" width="50"/>
        <el-table-column label="类别名称" prop="detectName" width="180"/>
        <el-table-column label="上级类别名称" prop="parentName"/>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button
                :disabled="scope.row.disabled"
                round
                size="mini"
                type="primary"
                @click="handleClick(scope.row)"
            >选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="block">
        <pagination
            v-show="total > 0"
            :limit.sync="queryParams.pageSize"
            :page.sync="queryParams.pageNum"
            :total="total"
            @pagination="getTablelist"
        />
      </div>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {getCategoryList} from "@/api/envCheckScheme/config";

export default {
  data() {
    return {
      tableCurrentPagination: {
        hidden: false,
        pageNum: 1,
        pageSizes: [10, 20, 30, 40, 50],
        pageSize: 10,
      },
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        detectName: null,
      },
      // 参数表格数据
      tableData: [],
      //选择的类别名称
      selectDetectName: "",
    };
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    ids: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    /** input框搜索操作 */
    handleQuery() {
      // console.log('根据类别名称进行查询')
      this.queryParams.pageNum = 1;
      this.getTablelist();
    },
    //获取检测类别列表
    getTablelist() {
      getCategoryList(this.queryParams).then((response) => {
        console.log('response.data.list', response.data.list)
        console.log(this.ids)
        if (this.ids) {
          for (var i in response.data.list) {
            if (this.ids.indexOf(response.data.list[i].id) != -1) {
              response.data.list[i].disabled = true
            } else {
              response.data.list[i].disabled = false
            }
          }
        }
        this.tableData = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    //取消按钮操作
    close() {
      this.$emit("cancel")
      this.$emit("update:visible", false);
    },
    //选择按钮操作
    handleClick(row) {
      this.$emit("handleClick", row);
      this.close();
    },
  },
  computed: {},
  created() {
    this.getTablelist();
  },
  mounted() {
    this.tableCurrentPagination = this.pagination || {
      pageSize: this.tableCurrentPagination.total,
      pageNum: 1,
    };
  },
};
</script>

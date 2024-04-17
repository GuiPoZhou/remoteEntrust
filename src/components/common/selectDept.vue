<template>
  <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible" append-to-body
             center title="选择部门" width="80%" @close="close">
    <el-form ref="queryForm" :inline="true" :model="queryParams" @submit.native.prevent>
      <!-- 搜索栏 -->
      <el-form-item label="部门名称">
        <el-input
            v-model="queryParams.deptName"
            clearable
            placeholder="请输入选择部门名称"
            size="small"
            @keyup.enter.native="handleQuery">
        </el-input>

      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="small" type="cyan" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <div>
      <el-table :data="deptList" height="500">
        <el-table-column label="序号" prop="id" type="index" width="55px"/>
        <el-table-column align="center" label="部门名称" prop="deptName"/>
        <el-table-column align="center" label="上级部门" prop="parentName"/>
        <el-table-column fixed="right" label="操作">
          <template v-slot="scope">
            <el-button round size="small" type="primary" @click="handleClick(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {getLastDeptList} from "@/api/system/dept"

export default {
  data() {
    return {
      // 查询参数
      queryParams: {
        deptName: null,
        deptScope: null
      },
      //单位列表
      deptList: [],
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    deptScope: {
      type: Number,
      default: null,
    },
  },
  methods: {
    /** input框搜索操作 */
    // handleClose(){
    // 	this.$emit("update:visible", false);
    // },
    handleQuery() {
      this.getlist();
    },
    //获取部门列表
    getlist() {
      this.queryParams.deptScope = this.deptScope;
      getLastDeptList(this.queryParams).then(response => {
            if (response.code == 200) {
              this.deptList = response.data;
            } else {
              console.info(response.msg)
            }

          }
      );
    },
    //取消按钮操作
    close() {
      this.$emit("update:visible", false);
    },
    //选择按钮操作
    handleClick(row) {
      this.$emit('backfill', row)
      this.close()
    },

  },
  computed: {},
  created() {
    this.handleQuery();
  },
}
</script>

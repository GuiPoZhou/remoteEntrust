<template>
  <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="visible"
      append-to-body
      center
      title="选择人员"
      width="800px"
      @close="close"
  >
    <el-form
        ref="queryForm"
        :inline="true"
        :model="queryParams"
        @submit.native.prevent
    >
      <!-- 搜索栏 -->
      <el-form-item label="所属部门" prop="deptName">
        <el-input
            v-model="deptName"
            placeholder="请输入所属部门"
            size="small"
            suffix-icon="el-icon-search"
            @focus="deptShow = true"
            @keyup.enter.native="handleQuery"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="人员姓名" prop="nickName">
        <el-input
            v-model="queryParams.nickName"
            clearable
            placeholder="请输入人员姓名"
            size="small"
            @keyup.enter.native="handleQuery"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
            icon="el-icon-search"
            size="small"
            type="primary"
            @click="handleQuery"
        >搜索
        </el-button
        >
        <el-button icon="el-icon-refresh" size="small" @click="resetQuery"
        >重置
        </el-button
        >
      </el-form-item>

      <el-form-item v-show="false" prop="deptId">
        <el-input v-model="queryParams.deptId"></el-input>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <div>
      <el-table ref="multipleTable" :data="userList" height="500">
        <el-table-column v-if="selectType == null" type="selection" width="55"></el-table-column>
        <el-table-column v-if="selectType == 'radio'" label="" width="55">
          <template scope="scope">
            <el-radio v-model="radioData" :label="scope.row">{{ null }}</el-radio>
          </template>
        </el-table-column>
        <el-table-column align="center" label="人员名称" prop="userName"/>
        <el-table-column align="center" label="所属部门" prop="dept.deptName"/>
      </el-table>
      <pagination v-show="total > 0" :limit.sync="queryParams.pageSize" :page.sync="queryParams.pageNum"
                  :total="total" @pagination="getlist"/>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="commit">确认</el-button>
      <el-button @click="close">取消</el-button>
    </div>

    <selectDept :visible.sync="deptShow" @backfill="backfillDept"/>
  </el-dialog>
</template>
<script>

import selectDept from "@/components/common/selectDept.vue";

export default {
  data() {
    return {
      // 查询参数
      queryParams: {
        nickName: undefined,
        deptId: undefined,
        pageSize: 10,
        pageNum: 1
      },
      deptName: undefined,
      radioData: null,
      //类型列表
      userList: [],
      total: 0,
      deptShow: false,
    };
  },
  components: {
    selectDept,
  },
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    /*
     *@author: 焦政
     *@date: 2022-03-30 14:20:27
     *@description:是否设置当前登录用户所在的部门信息为默认值
     */
    showDefault: {
      type: Boolean,
      default: false,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    selectType: {
      type: String,
      default: null,
    },
  },
  mounted() {

  },
  methods: {
    clearSel() {
      this.$refs.multipleTable.clearSelection()
    },
    getDefault() {
      if (this.list.length > 0) {
        this.$nextTick(() => {
          this.list.map(item => {
            this.userList.forEach(item2 => {
              if (item.detectUserPostId === item2.userId) {
                this.$refs.multipleTable.toggleRowSelection(item2, true)
              }
            })
          })
        })
        this.$refs.multipleTable.selection = this.list.map(item => {
          item.userId = item.detectUserPostId
          item.nickName = item.detectUserPostName
        })
      }
      if (!this.queryParams.deptId && this.showDefault) {
        this.deptName = this.$store.state.BeiYuan.currentUserInfo.dept.deptName
        this.queryParams.deptId = this.$store.state.BeiYuan.currentUserInfo.dept.deptId
        this.getlist();
      }
    },
    /** input框搜索操作 */
    handleQuery() {
      this.getlist();
    },
    //获取用户列表
    getlist() {
      this.$net('system/user/list', 'get', this.queryParams).then((response) => {
        this.userList = response.rows
        this.total = response.total
        //原公用插件人员名称展示值为用户账号
        //现根据BUG:1441 沟通产品 统一改为用户昵称
        this.userList.forEach((item) => {
          item.userName = item.nickName;
        });
      });
    },
    //取消按钮操作
    close() {
      this.clearAll()
      this.$emit("update:visible", false);
    },
    //选择按钮操作
    commit() {
      let selectedUser = this.$refs.multipleTable.selection;
      if (this.selectType == 'radio') {
        selectedUser = this.radioData
      }
      this.$emit("backfill", selectedUser);
      this.clearAll()
      this.close();
    },
    //清空所有选中
    clearAll() {
      this.$refs.multipleTable.clearSelection();
      this.radioData = null
    },
    //填充检测单位
    backfillDept(dept) {
      this.queryParams.deptId = dept.deptId;
      this.deptName = dept.deptName;
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.deptName = undefined;
      this.handleQuery();
    },
  },

  computed: {},
  created() {
    this.handleQuery();
  },
};
</script>

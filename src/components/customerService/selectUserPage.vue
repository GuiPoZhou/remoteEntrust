<template>
  <div>
    <BoDialog ref="BoDialog" :dia-log-show="showlog" dia-log-title="选择责任人" dia-log-width="50%" @close="cancel">
      <template slot="bologbody">
        <el-form
            ref="queryForm"
            :inline="true"
            :model="queryParams"
            :prop="queryParams"
            label-width="100px"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="人员昵称">
                <el-input
                    v-model="queryParams.nickName"
                    placeholder="人员昵称"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="部门名称">
                <el-input v-model="queryParams.deptName"
                          placeholder="部门名称"
                          @focus="deptShow = true"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item class="buttons">
                <el-button
                    icon="el-icon-search"
                    size="small"
                    type="primary"
                    @click="e_getList">搜索
                </el-button>
                <el-button
                    icon="el-icon-refresh"
                    size="small"
                    @click="reset">重置
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table :data="list">
          <el-table-column label="" width="55">
            <template v-slot="scope">
              <el-radio
                  v-model="currentRow"
                  :label="scope.row"
                  @change="e_seleRow(scope.row)"
              ><i></i
              ></el-radio>
            </template>
          </el-table-column>
          <el-table-column align="center" label="序号" type="index" width="50"/>
          <el-table-column align="center" label="人员昵称" prop="nickName"></el-table-column>
          <el-table-column align="center" label="所属部门" prop="deptName"></el-table-column>
        </el-table>
        <pagination v-show="total > 0" :limit.sync="queryParams.pageSize" :page.sync="queryParams.pageNum"
                    :total="total" @pagination="e_getList"/>
      </template>
      <template slot="bologfooter">
        <el-button type="primary" @click="submit">确定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </template>
    </BoDialog>
    <selectDept v-if="deptShow" :visible.sync="deptShow" @backfill="backfillDept"/>
  </div>

</template>

<script>
import selectDept from '@/components/common/selectDept.vue'

export default {
  components: {selectDept},
  data() {
    return {
      total: 0,
      showlog: false,
      deptShow: false,
      list: [],
      userInfo: {},
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        nickName: '',
        deptId: undefined,
      },
      currentRow: {},
    };
  },
  props: {},
  mounted() {
    this.$net("/system/user/profile", "get").then(res => {
      this.userInfo = {
        deptName: res.data.dept.deptName,
        deptId: res.data.deptId
      }
      this.reset();
    })
  },
  methods: {
    init(callbackEvents) {
      this.callbackEvents = callbackEvents
      this.showlog = true
      this.$refs.BoDialog.isFullScreen = false
      this.e_getList()
    },
    reset() {
      this.queryParams.nickName = ''
      this.queryParams.deptId = undefined
      this.queryParams.deptName = undefined
      this.e_getList();
    },
    backfillDept(dept) {
      this.queryParams.deptId = dept.deptId
      this.queryParams.deptName = dept.deptName
      this.e_getList();
    },
    e_seleRow(row) {
      this.currentRow = row;
    },
    e_getList() {
      // getResponsible(this.queryParams).then((re) => {
      // 	this.list = re.data;
      // });
      this.$net('v1/phinxSysUser/list', 'get', this.queryParams).then(re => {
        this.list = re.data.list
        this.total = re.data.total
      })
    },
    submit() {
      if (typeof this.currentRow.userId == "undefined") {
        this.$message.info("请选择一名责任人");
        return;
      }
      this.$emit('confirm', this.currentRow, this.callbackEvents)
    },
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style lang="less" scoped>
.buttons /deep/ .el-form-item__content {
  width: 100% !important;
}
</style>

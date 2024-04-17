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
              <el-form-item label="人员姓名">
                <el-input
                    v-model="queryParams.userName"
                    placeholder="人员姓名"
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
          <el-table-column label="人员姓名" prop="userName"></el-table-column>
          <el-table-column label="所属部门" prop="deptName"></el-table-column>
        </el-table>
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
import selectDept from '@/components/common/selectDept'
import {getResponsible} from "@/api/customerService/index";

export default {
  components: {selectDept},
  data() {
    return {
      showlog: false,
      deptShow: false,
      list: [],
      userInfo: {},
      queryParams: {
        userName: ''
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
    init() {
      this.showlog = true
      this.$refs.BoDialog.isFullScreen = false
      this.e_getList()
    },
    /** 默认选择其他业务部门
     *  @param deptName: 业务部门
     * */
    otherDept(deptName) {
      this.showlog = true
      this.$refs.BoDialog.isFullScreen = false
      this.$net('/system/dept/getLastDeptList', 'get', {deptName: deptName}).then(res => {
        if (res.code === 200 && res.data.length > 0) {
          this.userInfo = {
            deptName: res.data[0].deptName,
            deptId: res.data[0].deptId
          }
          this.reset()
        }
      })
    },
    reset() {
      this.queryParams.userName = ''
      this.queryParams.deptId = this.userInfo.deptId
      this.queryParams.deptName = this.userInfo.deptName
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
      getResponsible(this.queryParams).then((re) => {
        console.log("责任人", re);
        this.list = re.data;
      });
    },
    submit() {
      if (typeof this.currentRow.userId == "undefined") {
        this.$message.info("请选择一名责任人");
        return;
      }
      this.$emit('confirm', this.currentRow)
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

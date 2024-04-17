<template>
  <div class="app-container">
    <div class="container">
      <div class="header-tip">
        <div class="tip">
          <div></div>
          <p>企业用户</p>
        </div>
        <el-button
            icon="el-icon-plus"
            size="small"
            type="primary"
            @click="handleAdd"
        >
          添加用户
        </el-button>
      </div>
      <div style="width: 95%; margin: 0 auto">
        <el-divider></el-divider>
      </div>
      <div class="a-c-bottom">
        <el-table ref="multipleTable" :data="tableData">
          <el-table-column label="登录账号" prop="userName"></el-table-column>
          <el-table-column label="员工姓名" prop="nickName"></el-table-column>
          <el-table-column label="联系电话" prop="phone">
          </el-table-column>
          <el-table-column
              :formatter="roleFormatter"
              label="数据权限"
              prop="roleName"
          >
          </el-table-column>
          <el-table-column label="用户状态" prop="status">
            <template v-slot="scope">
              <el-switch
                  v-model="scope.row.status"
                  active-color="#5B7BFA"
                  active-value="0"
                  inactive-color="#dadde5"
                  inactive-value="1"
                  @change="changeStatus($event, scope.row.userId, scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template v-slot="scope">
              <el-button
                  v-show="scope.row.status == 0"
                  icon="el-icon-edit"
                  size="small"
                  text type="primary"
                  @click="handleEdit(scope.row)"
              >编辑
              </el-button>
              <el-button
                  icon="el-icon-delete"
                  size="small"
                  text type="primary"
                  @click="handleDelete(scope.row)"
              >删除
              </el-button>
              <el-button
                  v-show="scope.row.status == 0"
                  icon="el-icon-refresh"
                  size="small"
                  text type="primary"
                  @click="handleReset(scope.row)"
              >重置密码
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination
            v-show="total > 0"
            :limit.sync="queryData.pageSize"
            :page.sync="queryData.pageNum"
            :total="total"
            @pagination="init()"
        />
      </div>
    </div>
    <addUser :addUserShow.sync="addUserShow" :userId="userId" @init="init"/>
  </div>
</template>

<script>
import {
  companyUserManager,
  deleteUser,
  updataStatus,
  resetPassword,
} from "@/api/index/index";
import indexCustomerNav from "./indexCustomerNav.vue";
import addUser from "./components/addUser";

export default {
  name: "users",
  components: {indexCustomerNav, addUser},
  data() {
    return {
      userId: 0,
      addUserShow: false,
      queryData: {
        idCode: "",
        pageNum: 1,
        pageSize: 10,
        status: "",
        serviceType: "",
        agreement: "",
        implementationDateStart: "",
        implementationDateEnd: "",
      },
      dateRange: [],

      tableData: [],
      total: 0,
      loading: false,
      taskStatusList: [],
      serviceTypeList: [],
      agreementStatusList: [],
    };
  },
  methods: {
    //更新状态
    changeStatus($event, userId) {
      let pramas = {
        userId: userId,
        status: $event,
      };
      updataStatus(pramas).then((response) => {
        if (response.code == 200) {
          this.msgSuccess("修改状态成功");
        }
      });
    },

    roleFormatter(row, column) {
      let rolesList = row.roles;
      let roleName = "个人数据";
      if (rolesList && rolesList.length > 0) {
        let isAdmin = rolesList.find((role) => role.roleKey === "company");
        if (isAdmin) roleName = "公司数据";
      }
      return roleName;
    },
    handleAdd() {
      this.userId = 0;
      this.addUserShow = true;
    },
    handleEdit(row) {
      this.userId = row.userId;
      this.addUserShow = true;
    },
    handleDelete(row) {
      if (!row) return;
      this.$confirm('确定要删除"' + row.nickName + '"用户？', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
          .then(() => {
            deleteUser([row.userId]).then((res) => {
              if (res.code == 200) {
                this.msgSuccess("删除成功");
                // 刷新表格
                this.init();
              }
            });
          })
          .catch(function () {
          });
    },
    handleReset(row) {
      if (!row) return;
      this.$confirm(
          '确定要将用户"' + row.nickName + '"密码重置为123456？',
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
      )
          .then(() => {
            resetPassword(row.userId).then((res) => {
              if (res.code == 200) {
                this.msgSuccess("重置密码成功");
              }
            });
          })
          .catch(function () {
          });
    },

    //页面初始化
    init() {
      this.loading = true;
      this.queryData.customerId = this.$store.state.user.user.customerId
      companyUserManager(this.queryData).then(
          (res) => {
            this.tableData = res.rows;
            this.total = res.total;
            this.loading = false;
          },
      );
    },
  },
  watch: {
    tableData(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.multipleTable.doLayout()
        })
      }
    }
  },
  computed: {},
  created() {
    this.init();
  },
  mounted() {
    //接收路由参数
    let type = this.$route.query.addUserShow;
    if (type) {
      this.addUserShow = true;
    }
  },
};
</script>

<style lang="less" scoped>
/deep/ .app-container {
  background-color: #f6f6f8;
}

/deep/ .header-tip {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 44px;
  margin-top: 32px;

  .tip {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    p {
      width: 72px;
      height: 25px;
      font-size: 18px;
      line-height: 25px;
      color: #3d4966;
    }

    div {
      width: 4px;
      height: 18px;
      background: #3377ff;
      border-radius: 2px;
      margin-right: 10px;
    }
  }

  button {
    margin-right: 44px;
  }
}

/deep/ .container {
  width: 80.1%;
  height: 100%;
  background: #ffffff;
  margin: 0 auto;
}
</style>

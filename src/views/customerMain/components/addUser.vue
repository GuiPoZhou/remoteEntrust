<template>
  <el-dialog
      :before-close="close"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="title"
      :visible.sync="addUserShow"
      center
      width="60%"
      @open="initDialog"
  >
    <div class="a-c-top">
      <!-- 表单 -->
      <el-form
          ref="userInfo"
          :inline="true"
          :model="userInfo"
          :rules="rules"
          class="demo-form-inline"
          label-width="120px"
      >
        <el-form-item label="登录账号:" prop="userName">
          <el-input
              v-model.trim="userInfo.userName"
              :disabled="userId != 0"
              clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="登录密码:" prop="password">
          <el-input
              v-model.trim="userInfo.password"
              :disabled="userId != 0"
              show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="员工姓名:" prop="nickName">
          <el-input v-model.trim="userInfo.nickName" clearable></el-input>
        </el-form-item>
        <el-form-item label="联系电话:" prop="phonenumber">
          <el-input v-model.trim="userInfo.phonenumber" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户状态:" prop="status">
          <el-select
              v-model="userInfo.status"
              placeholder="请选择"
              style="width: 200px"
          >
            <el-option label="启用" value="0"></el-option>
            <el-option label="禁用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属公司:" prop="companyName">
          <el-input
              v-model.trim="userInfo.companyName"
              :disabled="true"
              style="width:200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="数据权限:" prop="roleId">
          <el-select
              v-model="userInfo.roleId"
              :disabled="userInfo.manageFlag == 'Y'"
              placeholder="请选择"
              style="width: 200px"
          >
            <el-option
                v-for="dict in roleOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门:" prop="deptName">
          <el-input v-model.trim="userInfo.deptName" clearable></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button
          center
          style=" background: #f05656; border:none"
          type="primary"
          @click="submitForm()"
      >保存
      </el-button
      >
      <el-button type="" @click="close">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  companyManagerAdd,
  companyManagerUpdate
} from "@/api/customer/customer";
import {
  queryCompanyInfo,
  addUser,
  queryUserDetail,
  saveUser
} from "@/api/index/index";

export default {
  name: "addUser",
  components: {},
  data() {
    return {
      // 权限数据字典
      roleOptions: [],
      userInfo: {
        userName: "",
        password: "123456",
        phonenumber: "",
        status: "0", //启用
        companyName: "",
        roleId: "",
        roleIds: [],
        nickName: "",
        manageFlag: "N",
        deptName: ""
      },
      rules: {
        userName: [
          {required: true, message: "请输入登录账号", trigger: "blur"}
        ],
        deptName: [
          {required: true, message: "请输入所属部门", trigger: "blur"}
        ],
        password: [
          {required: true, message: "请输入登录密码", trigger: "blur"}
        ],
        nickName: [
          {required: true, message: "请输入员工姓名", trigger: "blur"}
        ],
        roleId: [
          {required: true, message: "请选择数据权限", trigger: "blur"}
        ],
        phonenumber: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  props: {
    addUserShow: {
      type: Boolean,
      default: false
    },

    userId: {
      type: Number,
      default: 0
    }
  },
  methods: {
    resetForm() {
      this.$refs.userInfo.resetFields();
    },
    //查询当前用户公司信息
    queryCurrentCompany() {
      queryCompanyInfo().then(
          response => {
            if (response.code === 200) {
              this.userInfo.companyName = response.data.name;
            }
          },
          err => {
          }
      );
    },
    //获取用户信息
    queryUser(userId) {
      queryUserDetail(this.userId).then(response => {
        this.userInfo.userName = response.data.userName;
        this.userInfo.nickName = response.data.nickName;
        this.userInfo.phonenumber = response.data.phonenumber;
        this.userInfo.status = response.data.status;
        this.userInfo.roleId = response.data.roles[0].roleId + "";
        this.userInfo.companyName = response.data.companyName;
        this.userInfo.manageFlag = response.data.manageFlag; //是否公司管理员标识  Y/N
        this.userInfo.deptName = response.data.deptName; //是否公司管理员标识  Y/N
      });
    },
    initDialog() {
      //数据权限字典值
      this.getDicts("COMPANY_DATA").then(response => {
        this.roleOptions = response.data;
        if (this.userId == 0) {
          //默认个人数据 取集合里最后一个
          this.userInfo.roleId =
              response.data[response.data.length - 1].dictValue;
          console.log(this.userInfo.roleId);
        }
      });
      //新增
      if (this.userId == 0) {
        //获取当前用户公司信息
        this.queryCurrentCompany();
      } else {
        this.queryUser(this.userId);
      }
    },
    //详情
    handleDetail() {
    },
    //提交
    submitForm() {
      let formCheck = false;
      this.$refs["userInfo"].validate(valid => {
        if (valid) {
          formCheck = true;
        }
      });
      if (!formCheck) return false;
      this.userInfo.roleIds = [this.userInfo.roleId];
      if (this.userId == 0) {
        this.userInfo.userId = null;
        addUser(this.userInfo).then(
            response => {
              if (response.code == 200) {
                this.msgSuccess("添加用户成功");
                this.$emit("init", null);
                this.close();
              }
            },
            err => {
            }
        );
      } else {
        //保存时把密码值清除并把用户id填充上
        this.userInfo.password = "";
        this.userInfo.userId = this.userId;
        saveUser(this.userInfo).then(
            response => {
              if (response.code == 200) {
                this.msgSuccess("修改用户成功");
                this.$emit("init", null);
                this.close();
              }
            },
            err => {
            }
        );
      }

      //
      //   if (this.userId == 0) {
      //   this.$refs["userInfo"].validate((valid) => {
      //     if (valid) {
      //       companyManagerAdd(this.userInfo).then(
      //         (response) => {
      //           if (response.code == 200) {
      //             this.msgSuccess("添加用户成功");
      //             this.$emit("init", null);
      //             this.close();
      //           }
      //         },
      //         (err) => {}
      //       );
      //     }
      //   });
      // }else{
      //   companyManagerUpdate(this.userInfo).then(
      //         (response) => {
      //           if (response.code == 200) {
      //             this.msgSuccess("修改用户成功");
      //             this.$emit("init", null);
      //             this.close();
      //           }
      //         },
      //         (err) => {}
      //       );
      //
      // }
    },
    close() {
      this.resetForm();
      this.$emit("update:addUserShow", false);
    }
  },
  created() {
  },
  computed: {
    title() {
      if (this.userId == 0) {
        return "添加用户";
      } else {
        return "编辑用户";
      }
    }
  }
};
</script>
<style lang="less" scoped>
:deep(.el-dialog) {
  width: 46.9%;
  // height: 560px;
  background: #ffffff;
  border-radius: 4px;
}

.a-c-top .el-input {
  width: 200px;
}
</style>

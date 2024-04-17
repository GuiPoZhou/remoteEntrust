<template>
  <div class="app-container">
    <div class="container">
      <div class="header-tip">
        <div class="tip">
          <div></div>
          <p>修改密码</p>
        </div>
      </div>

      <div style="width: 95%; margin: 0 auto">
        <el-divider></el-divider>
      </div>
      <div class="container">
        <el-form ref="form" :model="user" :rules="rules" label-width="80px">
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input
                v-model="user.oldPassword"
                placeholder="请输入旧密码"
                type="password"
            />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input
                v-model="user.newPassword"
                placeholder="请输入新密码"
                type="password"
            />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
                v-model="user.confirmPassword"
                placeholder="请确认密码"
                type="password"
            />
          </el-form-item>
          <el-form-item>
            <el-button :loading="isloading" size="small" type="primary" @click="submit"
            >保存
            </el-button
            >
            <el-button size="small" type="danger" @click="close">关闭</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {updateUserPwd} from "@/api/system/user";

export default {
  name: "Index",
  components: {},
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      test: "1test",
      isloading: false,
      user: {
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined,
      },
      // 表单校验
      rules: {
        oldPassword: [
          {required: true, message: "旧密码不能为空", trigger: "blur"},
        ],
        newPassword: [
          {required: true, message: "新密码不能为空", trigger: "blur"},
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur",
          },
        ],
        confirmPassword: [
          {required: true, message: "确认密码不能为空", trigger: "blur"},
          {required: true, validator: equalToPassword, trigger: "blur"},
        ],
      },
    };
  },
  methods: {
    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.isloading = true
          updateUserPwd(this.user.oldPassword, this.user.newPassword).then(
              (response) => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  // #6086
                  this.isloading = false
                  this.$store.dispatch("LogOut").then(() => {
                    location.href = "/weCompany/index";
                  });
                } else {
                  this.isloading = false
                }
              }
          ).catch(() => {
            this.isloading = false
          });
        }
      });
    },
    close() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({path: "/remote/customerMain"});
    },
    handleEdit() {
      this.formShow = false;
      this.buttonShow = false;
    },
    handleSave() {
      let formCheck = false;
      this.$refs["setForm"].validate((valid) => {
        if (valid) {
          formCheck = true;
        }
      });
      if (!formCheck) return false;
      saveCompany(this.setForm).then(
          (response) => {
            if (response.code == 200) {
              this.msgSuccess("企业信息修改成功");
              this.formShow = true;
              this.buttonShow = true;
            }
          },
          (err) => {
          }
      );
    },
    handleDelete() {
    },
    handleReset() {
    },

    //页面初始化
    init() {
      this.loading = true;
      queryCompanyInfo().then(
          (res) => {
            if (res.code == 200) {
              this.loading = false;
              this.setForm = res.data;
            }
          },
          (err) => {
            // this.$store.dispatch("LogOut").then(() => {
            //   location.href = "/remote/login";
            // });
          }
      );
    },
  },

  computed: {},
  created() {
    this.init();
  },
  mounted() {
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
  width: 50%;
  height: 100%;
  background: #ffffff;
  margin: 0 auto;
}

/deep/ .edit-container {
  width: 80.1%;
  height: 100%;
  background: #ffffff;
  margin: 0 auto 5px;
}

/deep/ .rule-input {
  .el-input__inner {
    border: 0;
    background-color: white;
    color: #1f2e4d;
    font-size: 16px;
    font-weight: 400;
    line-height: 16px;
  }
}

/deep/ .item .el-form-item__label {
  font-size: 16px;
  font-weight: 400;
  color: #8f9bb3;
}
</style>

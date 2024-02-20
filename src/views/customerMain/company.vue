<template>
  <div class="app-container">
    <div class="container">
      <div class="header-tip">
        <div class="tip">
          <div></div>
          <p>企业信息</p>
        </div>
        <el-button
            v-show="buttonShow"
            icon="el-icon-edit-outline"
            size="small"
            type="text"
            @click="handleEdit"
        >
          修改
        </el-button>
      </div>

      <div style="width: 95%; margin: 0 auto">
        <el-divider></el-divider>
      </div>
      <div v-show="formShow" class="container">
        <el-form
            ref="setForm"
            :inline="true"
            :model="setForm"
            :rules="rules"
            class="demo-form-inline"
            label-width="160px"
        >
          <el-form-item class="item" label="登录账号:" prop="passName">
            <el-input
                v-model.trim="setForm.passName"
                class="rule-input"
                disabled
            ></el-input>
          </el-form-item>
          <el-form-item class="item" label="登录密码:" prop="passWord">
            <el-input
                v-model.trim="setForm.passWord"
                class="rule-input"
                disabled
                show-password
                style="width:92.5%"
            ></el-input>
          </el-form-item>
          <el-form-item class="item" label="公司名称:" prop="customerName">
            <el-input
                v-model.trim="setForm.customerName"
                class="rule-input"
                disabled
            ></el-input>
          </el-form-item>
          <el-form-item class="item" label="通讯地址:" prop="customerAddress">
            <el-input
                v-model.trim="setForm.customerAddress"
                class="rule-input"
                disabled
            ></el-input>
          </el-form-item>
          <el-form-item class="item" label="联系人员:" prop="contact">
            <el-input
                v-model.trim="setForm.contact"
                class="rule-input"
                disabled
            ></el-input>
          </el-form-item>
          <el-form-item class="item" label="联系电话:" prop="contactPhone">
            <el-input
                v-model.trim="setForm.contactPhone"
                class="rule-input"
                disabled
            ></el-input>
          </el-form-item>
          <el-form-item class="item" label="公司电话:" prop="companyPhone">
            <el-input
                v-model.trim="setForm.companyPhone"
                class="rule-input"
                disabled
            ></el-input>
          </el-form-item>
          <el-form-item class="item" label="公司传真:" prop="companyFax">
            <el-input
                v-model.trim="setForm.companyFax"
                class="rule-input"
                disabled
            ></el-input>
          </el-form-item>
          <!--          <el-form-item label="公司邮编:" class="item" prop="companyPostcode">-->
          <!--            <el-input-->
          <!--              v-model.trim="setForm.companyPostcode"-->
          <!--              class="rule-input"-->
          <!--              disabled-->
          <!--            ></el-input>-->
          <!--          </el-form-item>-->
          <el-form-item class="item" label="开户银行:" prop="bank">
            <el-input
                v-model.trim="setForm.bank"
                class="rule-input"
                disabled
            ></el-input>
          </el-form-item>
          <el-form-item class="item" label="银行账号:" prop="bankNumber">
            <el-input
                v-model.trim="setForm.bankNumber"
                class="rule-input"
                disabled
            ></el-input>
          </el-form-item>
          <el-form-item
              class="item"
              label="统一社会信用代码:"
              prop="uscc"
          >
            <el-input
                v-model.trim="setForm.uscc"
                class="rule-input"
                disabled
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="!formShow" class="container edit-container">
        <el-form
            ref="setForm"
            :inline="true"
            :model="setForm"
            :rules="rules"
            class="demo-form-inline"
            label-width="140px"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="登录账号:" prop="passName">
                <el-input v-model.trim="setForm.passName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="登录密码:" prop="passWord">
                <el-input
                    v-model.trim="setForm.passWord"
                    show-password
                    style="width:92.5%"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="公司名称:" prop="customerName">
                <el-input v-model.trim="setForm.customerName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="通讯地址:" prop="customerAddress">
                <el-input v-model.trim="setForm.customerAddress"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系人员:" prop="contact">
                <el-input v-model.trim="setForm.contact"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系电话:" prop="contactPhone">
                <el-input v-model.trim="setForm.contactPhone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="公司电话:" prop="companyPhone">
                <el-input v-model.trim="setForm.companyPhone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="公司传真:" prop="companyFax">
                <el-input v-model.trim="setForm.companyFax"></el-input>
              </el-form-item>
            </el-col>
            <!--            <el-col :span="8">-->
            <!--              <el-form-item label="公司邮编:" prop="companyPostcode">-->
            <!--                <el-input v-model.trim="setForm.companyPostcode"></el-input>-->
            <!--              </el-form-item>-->
            <!--            </el-col>-->
            <el-col :span="8">
              <el-form-item label="开户银行:" prop="bank">
                <el-input v-model.trim="setForm.bank"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="银行账号:" prop="bankNumber">
                <el-input v-model.trim="setForm.bankNumber"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="统一社会信用代码:" prop="uscc">
                <el-input v-model.trim="setForm.uscc"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div style="display: flex; justify-content: center;">
          <el-button
              center
              size="small"
              style="
              width: 102px;
              height: 36px;
              background: #f05656;
              border: none;
              margin-bottom: 10px;
            "
              type="primary"
              @click="handleSave"
          >
            保存
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {queryCompanyInfo, saveCompany} from "@/api/index/index";
import indexCustomerNav from "./indexCustomerNav.vue";

export default {
  name: "Index",
  components: {indexCustomerNav},
  data() {
    return {
      formShow: true,
      buttonShow: true,
      setForm: {
        userId: null,
        id: "",
        loginName: null,
        password: "",
        name: "",
        certificateNo: "",
        address: "",
        contactPerson: "",
        phone: "",
        fax: "",
        postNumber: "",
        openBank: "",
        bankAccount: "",
        customerId: null,
        contactId: null,
      },
      tableData: [],
      loading: false,
      rules: {
        loginName: [
          {required: true, message: "请输入登录账号", trigger: "blur"}
        ],
        // password: [
        //   { required: true, message: "请输入登录密码", trigger: "blur" },
        // ],
        certificateNo: [
          {required: true, message: "请输入信用代码", trigger: "blur"}
        ],
        name: [{required: true, message: "请输入公司名称", trigger: "blur"}],
        address: [
          {required: true, message: "请输入通讯地址", trigger: "blur"}
        ],
        contactPerson: [
          {required: true, message: "请输入联系人员", trigger: "blur"}
        ],
        phone: [
          {required: true, message: "请输入联系人员", trigger: "blur"},
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    handleEdit() {
      this.formShow = false;
      this.buttonShow = false;
    },
    handleSave() {
      let formCheck = false;
      this.$refs["setForm"].validate(valid => {
        if (valid) {
          formCheck = true;
        }
      });
      if (!formCheck) return false;
      saveCompany(this.setForm).then(
          response => {
            if (response.code == 200) {
              this.msgSuccess("企业信息修改成功");
              this.formShow = true;
              this.buttonShow = true;
            }
          },
          err => {
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
      console.log(this.$store.state.user)
      let id = this.$store.state.user.user.userId
      queryCompanyInfo(id).then(
          res => {
            if (res.code == 200) {
              this.loading = false;
              this.setForm = res.data;
              this.setForm.customerId = this.$store.state.user.user.customerId
              this.setForm.contactId = this.$store.state.user.user.userId
            }
          },
          err => {
            // this.$store.dispatch("LogOut").then(() => {
            //   location.href = "/remote/login";
            // });
          }
      );
      this.$net('/v1/entrustCustomerUsers/queryUserInfo/' + this.$store.state.user.user.userId, 'get').then(res => {
        if (res.code === 200) {
          this.setForm.password = res.msg
        }
      })

    }
  },

  computed: {},
  created() {
    this.init();
  },
  mounted() {
  }
};
</script>

<style lang="less" scoped>
:deep(.app-container) {
  background-color: #f6f6f8;
}

:deep(.header-tip) {
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

:deep(.container) {
  width: 80.1%;
  height: 100%;
  background: #ffffff;
  margin: 0 auto;
}

:deep(.edit-container) {
  width: 95%;
  height: 100%;
  background: #ffffff;
  // margin: 0 auto 5px;
}

:deep(.rule-input) {
  .el-input__inner {
    border: 0;
    background-color: white;
    color: #1f2e4d;
    font-size: 16px;
    font-weight: 400;
    line-height: 16px;
  }
}

:deep(.item .el-form-item__label) {
  font-size: 16px;
  font-weight: 400;
  color: #8f9bb3;
}
</style>

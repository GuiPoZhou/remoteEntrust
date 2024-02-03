<template>
  <div class="newLogin">
    <div class="newLogin-center">
     <div class="n-c-left">
       <el-image class="n-c-l-bgi" fit="fill" :src="newLoginBgi" alt="" />
     </div>

        <el-form
            ref="loginFormRef"
            class="formStyle login-form"
            :model="loginForm"
            :rules="loginRules"
            @submit.prevent
        >
          <el-form-item prop="username">
            <el-input  :prefix-icon="User" v-model="loginForm.username" placeholder="账号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input :prefix-icon="Lock" v-model="loginForm.password" placeholder="密码" show-password></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input  :prefix-icon="Key" v-model="loginForm.code" @keyup.enter.native="handleLogin" placeholder="验证码" style="width: 150px;"></el-input>
            <img class="login-code" :src="codeUrl" @click="getCode" alt="">
          </el-form-item>
          <el-form-item>
            <el-button
                :loading="loading"
                size="default"
                type="primary"
                @click="handleLogin"
            >
              <span v-if="!loading">登 录</span>
              <span v-else>登 录 中...</span>
            </el-button>
          </el-form-item>
        </el-form>
    </div>


  </div>
<!--  &lt;!&ndash;  底部  &ndash;&gt;-->
<!--  <div class="el-login-footer">-->
<!--    <span>{{ `Copyright © 2009 - ${localYear} www.boshland.com All Rights Reserved.` }}</span>-->
<!--  </div>-->
</template>
<script setup>
import { getCodeImg } from "@/api/login";
import {useStore} from "vuex";
import {useRouter, isNavigationFailure, NavigationFailureType} from "vue-router";
import {getCurrentInstance, ref, reactive} from "vue";
import newLoginBgi from "@/assets/image/newloginbgi.png";
import {User, Lock, Key} from "@element-plus/icons-vue";
const { proxy } = getCurrentInstance();
const store = useStore();
const router = useRouter();
import {ElMessage} from 'element-plus'

let localYear = ref(proxy.$dayjs().format('YYYY'));

let loginForm = reactive({});
let loginRules = reactive({
  username: [
    { required: true, trigger: "blur", message: "用户名不能为空" }
  ],
  password: [
    { required: true, trigger: "blur", message: "密码不能为空" }
  ],
  code: [{ required: true, trigger: "change", message: "验证码不能为空" }]
});
let codeUrl = ref('');
let loading = ref(false);

const handleLogin =  () => {
   proxy.$refs.loginFormRef.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      loginForm.pageSource = "内部";
      store.dispatch("Login", loginForm).then(res => {
        console.log('跳转')
        router.push({
          path: '/remote/customerMain'
        }).catch(failure => {
          console.log(failure)
          if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
            // 向用户显示一个小通知
            ElMessage.error('Login in order to access the admin panel')
          }
        })
      }).catch(() => {
        loading.value = false;
      }).finally(_ => {
        loading.value = false
      })
    }
  });
};

const getCode =  () => {
   getCodeImg().then(res => {
    codeUrl.value = "data:image/gif;base64," + res.img;
    loginForm.uuid = res.uuid;
  })
};
getCode();
</script>

<style scoped lang="less">
.newLogin {
  height: 99%;
  width: 99%;
  position: absolute;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f6f6f8;
  .newLogin-center {
    width: 85.9%;
    height: 69.2%;
    background-color: rgba(255, 255, 255, 0.37);
    border-radius: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .n-c-left {
      flex: 1;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }

  }
}
.n-c-l-bgi {
  width: 44.2%;
  height: 66.4%;
}
.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 40.3%;
  height: 100%;
  padding: 0 6.9%;
  box-shadow: 0px 8px 16px rgba(51, 119, 255, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  .el-input {
    height: 38px;

    input {
      height: 38px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}

</style>

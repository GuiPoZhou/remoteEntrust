<template>
  <div class="errPage-container">
    <el-button class="pan-back-btn" icon="arrow-left" @click="back">
      返回
    </el-button>
    <el-row>
      <el-col :span="12">
        <h1 class="text-jumbo text-ginormous">
          401错误!
        </h1>
        <h2>您没有访问权限！</h2>
        <h6>对不起，您没有访问权限，请不要进行非法操作！您可以返回主页面</h6>
        <ul class="list-unstyled">
          <li class="link-type">
            <router-link to="/">
              回首页
            </router-link>
          </li>
        </ul>
      </el-col>
      <el-col :span="12">
        <img :src="errGif" alt="Girl has dropped her ice cream." height="428" width="313">
      </el-col>
    </el-row>
  </div>
</template>


<script setup>
import {ref} from 'vue'
import errGif from '@/assets/401_images/401.gif'

const errGifUrl = ref(errGif + '?' + Date.now())

function back() {
  if (route.query.noGoBack) {
    router.push({path: '/'})
  } else {
    router.go(-1)
  }
}

// 注意：在 Vue 3 中，需要使用 setup 语法糖，并通过 getCurrentInstance 获取 $route 和 $router
const {proxy} = getCurrentInstance()
const route = proxy.$route
const router = proxy.$router
</script>

<style lang="less" scoped>
.errPage-container {
  width: 800px;
  max-width: 100%;
  margin: 100px auto;

  .pan-back-btn {
    background: #008489;
    color: #fff;
    border: none !important;
  }

  .pan-gif {
    margin: 0 auto;
    display: block;
  }

  .pan-img {
    display: block;
    margin: 0 auto;
    width: 100%;
  }

  .text-jumbo {
    font-size: 60px;
    font-weight: 700;
    color: #484848;
  }

  .list-unstyled {
    font-size: 14px;

    li {
      padding-bottom: 5px;
    }

    a {
      color: #008489;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>

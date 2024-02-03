<template>
  <div class="box-card">
    <div class="flexStyle">
      <div class="top-text">
        <p>{{ staticData.test }}</p>
        <!--        <p>待检测</p>-->
        <p>检测中</p>
      </div>
      <el-image :src="iconSrc"></el-image>
    </div>
  </div>
</template>

<script setup>
import iconSrc from '@/assets/logos/icon_report.png'
import {ref, reactive, getCurrentInstance} from 'vue'

const {staticData} = defineProps(['staticData'])
const instance = getCurrentInstance()
// 获取vue实例相当于this
const vm = instance['proxy']
</script>
<style lang="less" scoped>
.box-card {
  background: #f6f6f8;
  border-radius: 4px;

  .flexStyle {
    display: flex;
    align-items: center;
    height: 100%;
  }
}

.icon {
  margin-left: 20px;
  display: inline-block;
  font-size: 2vw;
}

.top-text {
  width: 140px;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  p {
    margin: 0;
    display: flex;
    justify-content: center;
    font-size: .8vw;
    font-weight: bolder;
    text-align: center;
  }

  p + p {
    padding-top: 10px
  }
}
</style>

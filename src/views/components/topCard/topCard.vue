<template>
  <el-card class="box-card">
    <div>
      <el-row>
        <p class="entrust">委托进度</p>
      </el-row>
      <el-row :gutter="10" class="cardStyle">
        <el-col :span="6">
          <topCardWait :staticData="$store.state.menu.staticData"></topCardWait>
        </el-col>
        <el-col :span="6">
          <topCardWaitCheck :staticData="$store.state.menu.staticData"></topCardWaitCheck>
        </el-col>
        <!--        <el-col :span="6">-->
        <!--          <topCardWaitComplate :staticData="$store.state.menu.staticData"></topCardWaitComplate>-->
        <!--        </el-col>-->
        <el-col :span="6">
          <topCardWaitDetecting :staticData="$store.state.menu.staticData"></topCardWaitDetecting>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script setup>
import topCardWait from '@/views/components/topCard/topCardWait.vue'
import topCardWaitCheck from '@/views/components/topCard/topCardWaitCheck.vue'
import topCardWaitComplate from '@/views/components/topCard/topCardWaitComplate.vue'
import topCardWaitDetecting from '@/views/components/topCard/topCardWaitDetecting.vue'
import {ref, reactive, getCurrentInstance} from 'vue'

const instance = getCurrentInstance()
// 获取vue实例相当于this
const vm = instance['proxy']
</script>
<style lang="less" scoped>
.box-card {
  width: 100%;
  height: 100%;
}

.cardStyle {
  height: 100px;
}

.entrust {
  font-size: 12px;
}
</style>

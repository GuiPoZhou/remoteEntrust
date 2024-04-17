<template>
  <div class="app-container">
    <el-form :model="queryParams">
      <el-form-item label="名称">
        <el-input v-model="queryParams.name" placeholder="请输入名称" size="small"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.status" clearable>
          <el-option label="未完成" value="0"></el-option>
          <el-option label="已完成" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型"></el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import {ref, reactive, getCurrentInstance} from 'vue'

const instance = getCurrentInstance()
// 获取vue实例相当于this
const vm = instance['proxy']

let queryParams = ref({
  name: '',

})
</script>
<style scoped>

</style>

<template>
  <div class="app-container">
    <el-breadcrumb class="top-crumb" separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>消息列表</el-breadcrumb-item>
    </el-breadcrumb>
    <h1 class="titleStyle">消息列表</h1>
    <div class="tableStyle">
      <el-table :data="tableData">
        <el-table-column label="标题" prop="content"></el-table-column>
        <el-table-column label="创建日期" prop="createTime" width="200"></el-table-column>
      </el-table>
      <pagination
          v-show="total > 0"
          :limit.sync="queryParams.pageSize"
          :page.sync="queryParams.pageNum"
          :total="total"
          @pagination="e_changePage"
      />
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, getCurrentInstance, onMounted} from 'vue'

const instance = getCurrentInstance()
// 获取vue实例相当于this
const vm = instance['proxy']
let tableData = ref([])
let total = ref(0)

onMounted(() => {
  getList()
})
let queryParams = reactive({
  pageSize: 10,
  pageNum: 1,
  userId: vm.$store.state.user.user.userId
})
const getList = () => {
  vm.$net('message/list', 'get', queryParams).then(res => {
    if (res.code === 200) {
      tableData.value = res.data
      total.value = res.total
    }
  })
}
const e_changePage = (val) => {
  console.log(`每页 ${val} 条`);
}

</script>
<style lang="less" scoped>
.app-container {
  width: 1200px;
  margin: 0 auto;

  .titleStyle {
    margin-top: 20px;
  }

  .tableStyle {
    margin-top: 30px;
  }

  .top-crumb {
    padding-top: 20px;
  }
}
</style>

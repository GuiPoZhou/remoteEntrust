<template>
  <boContainer ref="BoContainer" :total="total" @changePage="changePage">
    <template slot="boMain">
      <BoMain>
        <template slot="botabs">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="待确认" name="0"></el-tab-pane>
            <el-tab-pane label="已确认" name="1"></el-tab-pane>
          </el-tabs>
        </template>
        <template slot="bosearch">
          <el-form :model="queryParams"
                   label-width="100px"
          >
            <el-row :gutter="1.5">
              <el-col :span="8">
                <el-form-item label="采购申请单号" prop="code">
                  <el-input v-model="queryParams.code" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备名称" prop="instrustName">
                  <el-input v-model="queryParams.instrustName" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col v-if="activeName == 1" :span="8">
                <el-form-item label="验收时间">
                  <el-date-picker v-model="acceptTime"
                                  end-placeholder="结束日期"
                                  format="yyyy-MM-dd"
                                  range-separator="至"
                                  size="small"
                                  start-placeholder="开始日期"
                                  type="daterange"
                                  value-format="yyyy-MM-dd"
                                  @change="acceptTimeChange"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col v-if="activeName == 1" :span="8">
                <el-form-item label="验收人" prop="createBy">
                  <el-input v-model="queryParams.createBy" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col v-if="activeName == 1" :span="8">
                <el-form-item label="验收结果" prop="acceptResult">
                  <el-select v-model="queryParams.acceptResult" size="small">
                    <el-option label="通过" value="0"></el-option>
                    <el-option label="不通过" value="1"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">

                <el-button icon="el-icon-search" size="mini" type="primary" @click="queryData">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>

              </el-col>
            </el-row>


          </el-form>
        </template>
        <template slot="tableArea">
          <el-table :data="tableData"
                    border
                    stripe
          >
            <el-table-column align="center" type="selection" width="50"></el-table-column>
            <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
            <el-table-column align="center" label="委托编号" prop="entrustNo"></el-table-column>
            <el-table-column align="center" label="委托类型" prop="entrustType">
              <template v-slot="scope">
                <span>计量委托</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="委托人" prop="entrustPerson"></el-table-column>
            <el-table-column align="center" label="委托部门" prop="entrustDept"></el-table-column>
            <el-table-column align="center" label="仪器名称" prop="instrumentName"></el-table-column>
            <el-table-column align="center" label="仪器编号" prop="instrumentNo"></el-table-column>
            <el-table-column align="center" label="校准方法" prop="calibrationMethod"></el-table-column>
            <el-table-column align="center" label="校准情况" prop="calibrationSituation"></el-table-column>
            <el-table-column align="center" label="校准类型" prop="calibrationType"></el-table-column>
            <el-table-column v-if="activeName == 1" align="center" label="验收结果"
                             prop="acceptanceResult"></el-table-column>
            <el-table-column v-if="acceptTime == 1" align="center" label="验收时间"
                             prop="acceptanceTime"></el-table-column>
            <el-table-column v-if="activeName == 1" align="center" label="验收人"
                             prop="acceptancePerson"></el-table-column>
            <el-table-column align="center" label="操作">
              <template v-slot="scope">
                <el-button size="mini" type="text" @click="check(scope.row)">验收</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </BoMain>
    </template>

  </boContainer>

</template>

<script setup>
import {ref, reactive, getCurrentInstance} from 'vue'

const instance = getCurrentInstance()
// 获取vue实例相当于this
const vm = instance['proxy']
let activeName = ref('0')
let queryParams = reactive({
  pageSize: 10,
  pageNum: 1,
  code: null,
  instrustName: null,
  startTime: null,
  endTime: null,
  createBy: null,
  acceptResult: null,
})
let acceptTime = ref([])
let total = ref(0)
const changePage = (e) => {
  queryParams.pageNum = e.page
  queryParams.pageSize = e.limit
  queryData()
}
const acceptTimeChange = (e) => {
  if (e) {
    queryParams.startTime = e[0]
    queryParams.endTime = e[1]
  } else {
    queryParams.startTime = null
    queryParams.endTime = null
  }
}
const handleClick = (tab, event) => {

}
let tableData = ref([])
// 查询
const queryData = () => {

}
// 重置
const resetQuery = () => {

}

const check = (row) => {

}
</script>
<style scoped>

</style>

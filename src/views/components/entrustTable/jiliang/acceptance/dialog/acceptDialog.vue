<template>
  <BoDialog :dia-log-show="showLog" dia-log-title="校准验收" dia-log-width="30%" @close="e_cancel">
    <template slot="bologbody">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="校准验收确认" name="1">
          <el-form :model="queryParams">
            <el-col :span="12">
              <el-form-item label="验收时间">
                <el-time-picker
                    v-model="queryParams.time"
                    format="yyyy-MM-DD"
                    placeholder="选择日期"
                    size="mini"
                    type="datatime"
                    value-format="yyyy-MM-DD"
                >
                </el-time-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="整体验收结果" prop="result">
                <el-radio-group v-model="queryParams.result">
                  <el-radio label="1">通过</el-radio>
                  <el-radio label="2">不通过</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-form>
          <el-table :data="tableData">
            <el-table-column align="center" label="计量要求"></el-table-column>
            <el-table-column align="center" label="校准验收确认">
              <template v-slot="scope">
                <el-input v-model="scope.row.result"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="校准情况" name="2">配置管理</el-tab-pane>
        <el-tab-pane label="附件信息" name="3">角色管理</el-tab-pane>
      </el-tabs>

    </template>
    <template slot="bologfooter">
      <el-button size="small" @click="e_cancel">关闭</el-button>
    </template>
  </BoDialog>
</template>

<script setup>
import {ref, reactive, getCurrentInstance} from 'vue'

const instance = getCurrentInstance()
// 获取vue实例相当于this
const vm = instance['proxy']
const emit = defineEmits(['cancel'])
let showLog = ref(false)
let showType = ref('')
let activeName = ref('1')
let queryParams = reactive({})
let tableData = ref([])
const init = (type, data) => {
  showLog.value = true
}
const e_cancel = () => {
  emit('cancel')
}
defineExpose({init})
</script>
<style scoped>

</style>

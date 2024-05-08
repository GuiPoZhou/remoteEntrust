<template>
  <el-dialog :before-close="e_close" :close-on-click-modal="false" :visible.sync="diaLogShow"
             append-to-body center title="项目详情"
             width="50%"
             @close="e_close"
  >
    <el-table
        ref="multipleTable"
        :data="listData"
        border
        stripe
    >
      <el-table-column align="center" label="序号" type="index" width="50"/>
      <el-table-column align="center" label="样品编号" prop="sampleCode" show-overflow-tooltip/>
      <el-table-column align="center" label="测试项名称" prop="itemNameCN" show-overflow-tooltip/>
      <el-table-column align="center" label="测试项英文名称" prop="itemNameEN" show-overflow-tooltip/>
      <el-table-column align="center" label="标准编号" prop="standardCode" show-overflow-tooltip/>
      <el-table-column align="center" label="标准名称" prop="standardNameCn" show-overflow-tooltip/>
      <el-table-column align="center" label="测试员" prop="testPerson" show-overflow-tooltip/>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="e_close">返回</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import {ref, getCurrentInstance} from "vue";

const vm = getCurrentInstance().proxy

let diaLogShow = ref(false)
let listData = ref([])

function init(row, itemId) {
  diaLogShow.value = true
  vm.$net('/progress/getSampleDetail', 'get', {entrustId: row.entrustId, itemId}).then(res => {
    listData.value = res.data
  })
}

const emit = defineEmits(['close'])

function e_close() {
  emit('close')
}

defineExpose({
  init,
})
</script>


<style scoped>

</style>

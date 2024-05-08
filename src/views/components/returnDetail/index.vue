<template>
  <bo-dialog
      :dia-log-show="dialogShow"
      :is-full-screen="false"
      dia-log-title="退回原因"
      @close="close"
  >
    <template #bologbody>
      <el-table :data="tableData"
                border
                stripe
      >
        <el-table-column align="center" label="退回人" prop="createBy"></el-table-column>
        <el-table-column align="center" label="日期" prop="createTime"></el-table-column>
        <el-table-column align="center" label="退回原因" prop="reason"></el-table-column>
      </el-table>
    </template>
    <template #bologfooter>
      <el-button size="small" type="primary" @click="close">关闭</el-button>
    </template>
  </bo-dialog>
</template>

<script setup>
import {ref} from 'vue'
import {net} from "@/api/requestList";

let dialogShow = ref(false)
let tableData = ref([])

function init(row) {
  dialogShow.value = true
  let parmas = {
    entrustId: row.id,
  }
  net('/v1/entrustRemoteAgreement/selectAgreementReturn', 'get', parmas).then(res => {
    if (res.code === 200) {
      tableData.value = res.data
    }
  })
}

defineExpose({
  init
})
const emit = defineEmits(["close"])

function close() {
  dialogShow.value = false
  emit('close')
}
</script>

<style lang="scss" scoped>

</style>

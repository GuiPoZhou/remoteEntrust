<template>
  <bo-dialog
      :dia-log-show="dialogShow"
      dia-log-title="查看"
      @close="close"
  >
    <template #bologbody>
      <vue-office-excel
          v-if="dialogShow"
          v-loading="loading"
          :src="excel"
          style="height: 100vh;"
          @error="errorHandler"
          @rendered="renderedHandler"
      />
    </template>

  </bo-dialog>

</template>

<script setup>
//引入VueOfficeExcel组件
import VueOfficeExcel from '@vue-office/excel'
//引入相关样式
import '@vue-office/excel/lib/index.css'
import {ref} from "vue";

let loading = ref(false)
let isComplate = ref(false)
let dialogShow = ref(false)
let excel = ref('')

function init(file) {
  loading.value = true
  excel.value = window.location.protocol + '//' + window.location.host + '/prod-api/' + encodeURI(file.url)
  dialogShow.value = true
  console.log(excel.value)
}

function renderedHandler() {
  loading.value = false
  console.log("渲染完成")
}

function errorHandler() {
  loading.value = false
  console.log("渲染失败")
}

const emit = defineEmits(["close"])

function close() {
  excel.value = null
  dialogShow.value = false
  emit('close')
}

defineExpose({
  init
})
</script>

<style lang="scss" scoped>

</style>

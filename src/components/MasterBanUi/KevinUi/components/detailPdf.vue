<template>
  <bo-dialog
      :dia-log-show="dialogShow"
      dia-log-title="查看"
      @close="close"
  >
    <template #bologbody>
      <vue-office-pdf
          v-if="dialogShow"
          v-loading="loading"
          :src="pdf"
          @error="errorHandler"
          @rendered="renderedHandler"
      />
    </template>

  </bo-dialog>

</template>

<script setup>
//引入VueOfficePdf组件
import VueOfficePdf from '@vue-office/pdf'
//引入相关样式
import {ref} from "vue";

let loading = ref(false)
let dialogShow = ref(false)
let pdf = ref('')

function init(file) {
  loading.value = true
  pdf.value = window.location.protocol + '//' + window.location.host + '/prod-api/' + encodeURI(file.url)
  dialogShow.value = true
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
  dialogShow.value = false
  emit('close')
}

defineExpose({
  init
})
</script>

<style lang="scss" scoped>

</style>

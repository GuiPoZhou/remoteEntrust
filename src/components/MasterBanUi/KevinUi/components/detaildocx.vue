<template>
  <bo-dialog
      :dia-log-show="dialogShow"
      dia-log-title="查看"
      @close="close"
  >
    <template #bologbody>
      <vue-office-docx
          v-if="dialogShow"
          v-loading="loading"
          :src="docx"
          style="height: 100vh;"
          @error="errorHandler"
          @rendered="rendered"
      />
    </template>

  </bo-dialog>

</template>

<script setup>
//引入VueOfficeDocx组件
import VueOfficeDocx from '@vue-office/docx'
//引入相关样式
import '@vue-office/docx/lib/index.css'
import {ref} from "vue";
import VueOfficePdf from "@vue-office/pdf";

let loading = ref(false)
let dialogShow = ref(false)
let docx = ref('')

function init(file) {
  loading.value = true
  docx.value = window.location.protocol + '//' + window.location.host + '/prod-api/' + encodeURI(file.url)
  console.log(docx.value, '123')
  dialogShow.value = true
}

function rendered() {
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

<template>
  <bo-dialog
      :dia-log-show="dialogShow"
      :is-full-screen="false"
      dia-log-title="查看"
      @close="close"
  >
    <template #bologbody>
      <el-image
          :preview-src-list="[url]"
          :src="url"
          style="width: 100%; height: 100%">
      </el-image>
    </template>

  </bo-dialog>

</template>

<script setup>
import {ref} from "vue";

let dialogShow = ref(false)
let url = ref('')

function init(file) {
  console.log(file, 'file')
  url.value = window.location.protocol + '//' + window.location.host + '/prod-api/' + encodeURI(file.url)
  dialogShow.value = true
}

function renderedHandler() {
  console.log("渲染完成")
}

function errorHandler() {
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

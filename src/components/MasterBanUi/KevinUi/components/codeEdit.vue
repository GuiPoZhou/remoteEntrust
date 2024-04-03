<template>
  <div class="codeEdit">
    <Codemirror
        ref="cmRef"
        :options="cmOptions"
        v-model:value="codeSnippets"
        border
        height="400"
        width="600"
        @change="e_inputCode"
        @input="onInput"
        @ready="onReady"
    >
    </Codemirror>
  </div>
</template>
<script lang="ts" setup>
import {ref, onMounted, onUnmounted, watch} from "vue"
import "codemirror/mode/javascript/javascript.js"
import Codemirror from "codemirror-editor-vue3"
import type {CmComponentRef} from "codemirror-editor-vue3"
import type {EditorConfiguration} from "codemirror"

const emit = defineEmits(['input'])
const prop = defineProps({
  codeInfo: Object
})
let codeInfo = ref(prop.codeInfo)
watch(codeInfo, (newValue) => {
  if (newValue) {
    codeSnippets.value = (JSON.stringify(JSON.parse(JSON.stringify(newValue)), null, 2))
  }
})
const cmRef = ref<CmComponentRef>()
const cmOptions: EditorConfiguration = {
  mode: "text/javascript",
  tabSize: 4,
  extraKeys: {'Ctrl-Space': 'autocomplete'},
  theme: 'base16-dark',  // 主题
  lineNumbers: true,  // 是否显示行数
  viewportMargin: Infinity,  // 处理高度自适应时搭配使用
  autofocus: false,
  indentUnit: 2,
  smartIndent: true,
  readOnly: false,  // 只读
  showCursorWhenSelecting: true,
}
let codeSnippets = ref('')

const onInput = (val) => {
  console.log(val)
}

const onReady = (cm) => {
  console.log(cm.focus())
}

function e_inputCode(val: string) {
  let codeObj = eval('(' + val + ')')
  emit('input', codeObj)
}

onMounted(() => {
  setTimeout(() => {
    cmRef.value?.refresh()
  }, 1000)

  setTimeout(() => {
    cmRef.value?.resize(300, 200)
  }, 2000)

  setTimeout(() => {
    cmRef.value?.cminstance.isClean()
  }, 3000)
})

onUnmounted(() => {
  cmRef.value?.destroy()
})
</script>
<style lang="less" scoped>
.codeEdit {
  width: 100%;
  border: 1px solid #DCDFE6;
  border-right: 4px;
  height: 100px;
  overflow: auto;
  -ms-overflow-style: none;
  padding-right: 1px;
  font-size: 13px;
}

.codeEdit::-webkit-scrollbar {
  width: 0
}

</style>

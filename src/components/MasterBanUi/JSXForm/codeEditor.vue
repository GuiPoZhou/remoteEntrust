<template>
  <ml-dialog :dia-log-show="showlog" dia-log-title="表单编码（仅供查看）" @close="e_close">
    <template slot="bologbody">
      <div ref="codeEditor" class="monaco-container"></div>
    </template>
    <template slot="bologfooter">
      <el-button size="small" @click="e_confirm">确定</el-button>
      <el-button size="small" @click="e_close">取消</el-button>
    </template>

  </ml-dialog>
</template>
<script lang="ts" setup>
import * as monaco from "monaco-editor"
import {reactive, ref} from "vue";
import {ElMessage} from "element-plus";

const emit = defineEmits(['close'])
defineComponent({
  name: 'ml-editor'
})
let showlog = ref(false)
let codeSnippets = ref('')
let defaultOptions = reactive({
  tabSize: 4,
  mode: 'text/javascript',  // 模式
  theme: 'base16-dark',  // 主题
  lineNumbers: true,  // 是否显示行数
  line: true,
  viewportMargin: Infinity,  // 处理高度自适应时搭配使用
  highlightDifferences: true,
  autofocus: false,
  indentUnit: 2,
  smartIndent: true,
  readOnly: false,  // 只读
  showCursorWhenSelecting: true,
  listLabel: ''
})
let list = ref([
  {
    id: 1,
    title: 2
  }
])
let listLabel = ref('')

function e_confirm() {
  if (codeSnippets.value == '') {
    ElMessage.error('请输入内容')
    return
  }
  let codeObj = eval('(' + codeSnippets.value + ')')
  if (!(codeObj instanceof Array)) {
    ElMessage.error('请输入正确的json格式')
    return
  }
  let listL = listLabel.value
}

function e_close() {
  showlog.value = false
  emit('close')
}

function init(list, Label) {
  listLabel.value = Label
  let codeList = JSON.parse(JSON.parse(list))
  showlog.value = true
  codeSnippets.value = (JSON.stringify(JSON.parse(JSON.stringify(codelist)), null, 2))
  // 初始化编辑器实例
  monaco.languages.registerDocumentFormattingEditProvider('javascript', formatProvider)

  monacoEditor.value = monaco.editor.create(vm.$refs['codeEditor'], {
    value: codeSnippets.value,
    autoIndex: true,
    ...defaultOptions,
  })
  monacoEditor.value.getAction(['editor.action.formatDocument'])._run()
  // 监听编辑器content变化
  monacoEditor.value.onDidChangeModelContent(() => {
    emit('input', vm.monacoEditor.getValue())
  })
}
</script>


<style lang="less">
/deep/ .CodeMirror {
  font-family: monospace;
  height: 100% !important;
  color: black;
  direction: ltr;
}

.cm-s-base16-dark {

}
</style>

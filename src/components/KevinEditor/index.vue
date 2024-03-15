<template>
  <div ref="codeEditor" class="monaco-container"></div>
</template>
<script setup>
import * as monaco from "monaco-editor"

const vm = getCurrentInstance().proxy
const emit = defineEmits(['input'])
const defaultOptions = {
  selectOnLineNumbers: true,
  roundedSelection: false,
  wordWrap: 'on', // 自动换行 'on','off'
  language: 'javascript', // 常用的有css/html/java/javascript/json/csharp(.net)'
  overviewRulerBorder: false,
  minimap: { // 关闭小地图
    enabled: true,
  },
  autoIndent: true, // 自动布局
  automaticLayout: false, // 自动布局
  theme: 'vs', // vs, hc-black, or vs-dark
  formatOnPaste: true,
  formatOnType: true,
  glyphMargin: true, //字形边缘
  fontSize: 14, // 字体大小
  readOnly: false // 只读
}
const props = defineProps({
  options: {
    type: Object,
    default: () => {
    }
  },
  value: {
    type: String,
    default: ''
  }
})
let content = ref(props.value)
let monacoEditor = ref(null)

watch(props.value, (val) => {
  content.value = val
}, {
  deep: true
})
watch(props.options, (val) => {
  monacoEditor.updateOptions({...val})
}, {deep: true})

function spliceSemiAndDoubleQoute(val) {
  // eslint-disable-next-line no-undef
  return prettier.format(val, {
    parser: 'babel',
    semi: true,
    //字符串用单引号包,裹，开发规范统一
    singleQuote: true,
    useTabs: true,
    //函数后不带空格
    spaceBeforeFunctionParen: false,
    // eslint-disable-next-line no-undef
    plugins: prettierPlugins,
  })
}

const formatProvider = {
  provideDocumentFormattingEdits(model) {
    return [{
      text: spliceSemiAndDoubleQoute(model.getValue()),
      range: model.getFullModelRange()
    }]
  }
}

function initEditor() {
  // 初始化编辑器实例
  monaco.languages.registerDocumentFormattingEditProvider('javascript', formatProvider)

  monacoEditor.value = monaco.editor.create(vm.$refs['codeEditor'], {
    value: content.value,
    autoIndex: true,
    ...defaultOptions,
    ...props.options
  })
  monacoEditor.value.getAction(['editor.action.formatDocument'])._run()
  // 监听编辑器content变化
  monacoEditor.value.onDidChangeModelContent(() => {
    emit('input', vm.monacoEditor.getValue())
  })
}

function changeEditor(data) {
  monacoEditor.value.setValue(data.value)
  monacoEditor.value.updateOptions({...data.options})
  monacoEditor.value.getAction(['editor.action.formatDocument'])._run()
}

function layout() {
  console.log('重新渲染')
  initEditor()
}

function insert(text) {
  text = text || ''
  var position = monacoEditor.value.getPosition();
  monacoEditor.value.executeEdits('', [
    {
      range: {
        startLineNumber: position.lineNumber,
        startColumn: position.column,
        endLineNumber: position.lineNumber,
        endColumn: position.column
      },
      text: text
    }
  ]);
}
defineExpose({
  initEditor,
  changeEditor,
  layout,
  insert,
})
</script>
<script>
export default {
  name: 'KevinEditor',
}
</script>
<style lang="less" scoped>
.monaco-container {
  height: 900px;
  width: 100%;
  overflow: hidden;
}
</style>

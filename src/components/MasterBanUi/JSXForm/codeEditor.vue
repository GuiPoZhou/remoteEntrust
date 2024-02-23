<template>
  <ml-dialog :dia-log-show="showlog" dia-log-title="表单编码（仅供查看）" @close="e_close">
    <template slot="bologbody">
      <codemirror
          ref="jsonEditor"

          v-model="codeSnippets"
          :options="cmOptions"
          style="height:100%;"
      ></codemirror>
    </template>
    <template slot="bologfooter">
      <el-button size="small" @click="e_confirm">确定</el-button>
      <el-button size="small" @click="e_close">取消</el-button>
    </template>

  </ml-dialog>
</template>

<script>
import {codemirror} from "vue-codemirror-lite";

export default {
  name: 'ml-editor',
  components: {
    codemirror
  },
  data() {
    return {
      showlog: false,
      codeSnippets: '',
      cmOptions: {
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
      },
      list: [
        {
          id: 1,
          title: 2
        }
      ]
    }
  },
  computed: {
    codemirror() {
      return this.$refs.jsonEditor.codemirror
    }
  },
  methods: {
    e_confirm() {
      if (this.codeSnippets == '') {
        this.$message.error('别瞎改啊')
        return
      }
      let codeObj = eval('(' + this.codeSnippets + ')')
      if (codeObj instanceof Array == false) {
        this.$message.error('不要对之前的内容做结构和类型上的变化')
        return
      }
      var listLabel = this.listLabel
      this.$emit('save', {listLabel, codeObj})

    },
    e_get() {
    },
    e_close() {
      this.$emit('close')
    },
    init(list, listLabel) {
      this.listLabel = listLabel
      var codelist = JSON.parse(JSON.stringify(list))
      this.showlog = true
      this.codeSnippets = (JSON.stringify(JSON.parse(JSON.stringify(codelist)), null, 2))

    }
  }
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

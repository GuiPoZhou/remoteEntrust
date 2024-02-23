<template>
  <div class="codeEdit">
    <codemirror
        ref="jsonEditor"
        :options="cmOptions"
        :value="codeSnippets"
        style="height:100%;margin-right: 10px;font-size: 12px"
        @change="e_inputCode"
    ></codemirror>
  </div>
</template>
<script>
import {codemirror} from "vue-codemirror-lite";

export default {
  components: {
    codemirror
  },
  data() {
    return {
      cmOptions: {
        tabSize: 4,
        mode: 'javascript',
        extraKeys: {'Ctrl-Space': 'autocomplete'},
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
        listLabel: '',
        editCodeParams: {},

      },
      codeSnippets: ""

    }
  },
  props: {
    codeInfo: Object
  },
  watch: {
    codeInfo(val) {
      if (val) {
        this.codeSnippets = (JSON.stringify(JSON.parse(JSON.stringify(val)), null, 2))
      }
    }
  },
  methods: {
    e_inputCode() {
      let codeObj = eval('(' + this.codeSnippets + ')')
      this.$emit('input', codeObj)
    }
  }
}
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

<template>
  <div class="kevinFormEditor">
    <el-drawer
        :append-to-body="true"
        :close-on-press-escape="false"
        :visible.sync="showDrawer"
        :with-header="false"
        :wrapperClosable="false"
        size="90%">

      <codemirror
          ref="jsonEditor"
          v-model="codeSnippets"
          :options="cmOptions"
          style="height:100%;"
      ></codemirror>
      <div class="drawbtns">
        <el-button size="small" type="primary" @click="handleClose">保存</el-button>
        <el-button size="small" @click="e_close">取消</el-button>
      </div>
    </el-drawer>


  </div>
</template>
<script>
import {codemirror} from "vue-codemirror-lite";

export default {
  data() {
    return {
      showDrawer: false,
      codeSnippets: '',
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
        editCodeParams: {}
      },
    }
  },
  components: {
    codemirror
  },
  methods: {
    /**
     * @author Coder
     * @date 2023/3/23
     * @des 初始化
     */
    init(params) {
      this.editCodeParams = JSON.parse(JSON.stringify(params))
      this.showDrawer = true
      var codelist = JSON.parse(JSON.stringify(this.editCodeParams.codeJson))
      this.codeSnippets = (JSON.stringify(JSON.parse(JSON.stringify(codelist)), null, 2))
    },
    /**
     * @author Coder
     * @date 2023/3/23
     * @des 关闭抽屉弹框
     */
    handleClose() {
      this.$confirm('确定保存关闭？').then(_ => {
        this.e_confirm()
      })
    },
    e_confirm() {
      if (this.codeSnippets == '') {
        this.$message.error('别瞎改啊')
        return
      }
      try {
        let codeObj = eval('(' + this.codeSnippets + ')')
        this.editCodeParams.codeJson = codeObj
        this.$emit('save', this.editCodeParams)
      } catch {
        this.$message.error('请检查代码规范')
      }

    },
    e_close() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="less" scoped>
.kevinFormEditor {
  position: relative;
}

/deep/ .CodeMirror {
  font-family: monospace;
  height: 100% !important;
  color: black;
  direction: ltr;
}

.drawbtns {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 23px;
  right: 10px;
}
</style>

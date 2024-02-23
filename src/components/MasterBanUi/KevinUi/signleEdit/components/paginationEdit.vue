<template>
  <div class="buttonEdit">
    <div class="be-right">
      <el-form ref="signleParams" :model="signleParams" class="demo-ruleForm" label-width="130px">
        <el-form-item
            :rules="[{ required: true, message: '此项若为空请在json编辑器中进行维护(且唯一)', trigger: 'blur' }]"
            label="单项唯一值"
            prop="anchorPoint">
          <el-input v-model="signleParams.anchorPoint" disabled></el-input>
        </el-form-item>
        <el-form-item :rules="[{ required: true, message: 'tabs切换事件脚本不能为空', trigger: 'change' }]"
                      label="切换页码事件"
                      prop="events">
          <el-input v-model="signleParams.events" readonly>
            <el-button slot="append" size="small" @click="e_editEvents">编辑</el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="e_save">保存</el-button>
          <el-button size="small" @click="e_close">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="be-left">
      <KevinEditor ref="KevinEditor" :options="options" @input="handleEditorInput"/>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'

export default {
  data() {
    return {
      signleParams: {
        events: ''
      },
      options: {
        language: 'javascript'
      },
    }
  },
  methods: {
    e_save() {
      this.$refs.signleParams.validate(v => {
        if (v) {
          this.$emit('save', this.signleParams)
        }
      })
    },
    appendParams(params) {

      this.signleParams = JSON.parse(JSON.stringify(params))
      if (!this.signleParams.events) {
        this.signleParams.events = "console.log('选择')"
      }
    },
    e_close() {
      this.$emit('close')
    },
    e_editEvents() {
      this.$refs.KevinEditor.changeEditor({value: this.signleParams.events})
    },
    handleEditorInput(value) {
      this.$set(this.signleParams, 'events', this.formatCode(value))
      this.$forceUpdate()
    },
    formatCode(code) {
      // 去除开头和结尾的空白字符
      code = code.trim();

      // 在大括号前后添加空格
      code = code.replace(/\s*{\s*/g, ' { ').replace(/\s*}\s*/g, ' } ');

      // 在逗号前后添加空格
      code = code.replace(/,(\S)/g, ', $1');

      // 返回格式化后的代码
      return code;
    },
  },
  created() {

  }
}
</script>
<style lang="less" scoped>
.buttonEdit {
  width: 100%;
  height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: row;
  overflow: hidden;

  .be-right {
    width: 50%;
    height: 100%;
    overflow: auto;
  }

  .be-left {
    flex: 1;
    height: 100%;
    overflow: auto;
  }

}
</style>

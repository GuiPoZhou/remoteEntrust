<template>
  <div class="buttonEdit">
    <div class="be-right">
      <el-form ref="signleParams" :model="signleParams" class="demo-ruleForm" label-width="120px">
        <el-form-item label="单项唯一值" prop="anchorPoint">
          <el-input v-model="signleParams.anchorPoint" disabled></el-input>
        </el-form-item>
        <el-form-item :rules="[{ required: true, message: '按钮名称不能为空', trigger: 'blur' }]" label="输入框名称"
                      prop="label">
          <el-input v-model="signleParams.label"></el-input>
        </el-form-item>

        <el-form-item label="onBlur事件" prop="blur">
          <el-input v-model="signleParams.events.blur" readonly>
            <el-button slot="append" size="small" @click="e_editInputBlurEvents">编辑</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="回车事件" prop="blur">
          <el-input v-model="signleParams.events.enter" readonly>
            <el-button slot="append" size="small" @click="e_editInputEnterEvents">编辑</el-button>
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="onFocus事件" prop="focus">
            <el-input v-model="signleParams.options.focus" readonly>
                <el-button slot="append" size="small" @click="e_editEvents">编辑</el-button>
            </el-input>
        </el-form-item>
        <el-form-item label="输入框插槽事件" prop="slotBtnFunc">
            <el-input v-model="signleParams.options.slotBtnFunc" readonly>
                <el-button slot="append" size="small" @click="e_editEvents">编辑</el-button>
            </el-input>
        </el-form-item> -->
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
      signleParams: {},
      options: {
        language: 'javascript'
      },
      editTarget: ''
    }
  },
  methods: {
    e_editInputEnterEvents() {
      this.editTarget = 'inputEnterCode'
      this.$refs.KevinEditor.changeEditor({value: this.signleParams.events.enter})
    },
    e_editInputBlurEvents() {
      this.editTarget = 'inputBlurCode'
      this.$refs.KevinEditor.changeEditor({value: this.signleParams.events.blur})
    },
    e_save() {
      this.$refs.signleParams.validate(v => {
        if (v) {
          this.$emit('save', this.signleParams)
        }
      })
    },
    appendParams(params) {
      console.log('params', params)
      if (!params.events) {
        params.events = {
          blur: '',
          enter: ''
        }
      }
      this.signleParams = JSON.parse(JSON.stringify(params))
    },
    e_close() {
      this.$emit('close')
    },
    e_editEvents() {
      this.$refs.KevinEditor.changeEditor({value: this.signleParams.events})
    },
    handleEditorInput(value) {
      if (this.editTarget == 'inputBlurCode') {
        this.signleParams.events.blur = this.formatCode(value)
      } else if (this.editTarget == 'inputEnterCode') {
        this.signleParams.events.enter = this.formatCode(value)
      }
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
    width: 30%;
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

<template>
  <el-form ref="signleParams" :model="signleParams" class="demo-ruleForm" label-width="120px">
    <el-row style="padding: 2rem;">
      <el-col :span="10">
        <el-row>
          <el-col :span="24">
            <el-form-item
                :rules="[{ required: true, message: '此项若为空请在json编辑器中进行维护(且唯一)', trigger: 'blur' }]"
                label="单项唯一值"
                prop="anchorPoint">
              <el-input v-model="signleParams.anchorPoint" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :rules="[{ required: true, message: '请填写单项标题', trigger: 'blur' }]" label="单项标题"
                          prop="label">
              <el-input v-model="signleParams.label"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :rules="[{ required: true, message: '脚本不能为空', trigger: 'change' }]" label="输入建议脚本"
                          prop="events.fetchSuggestions">
              <el-input v-model="signleParams.events.fetchSuggestions" readonly>
                <el-button slot="append" size="small" @click="e_editFetchScript">编辑</el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :rules="[{ required: true, message: '脚本不能为空', trigger: 'change' }]" label="选择事件脚本"
                          prop="events.select">
              <el-input v-model="signleParams.events.select" readonly>
                <el-button slot="append" size="small" @click="e_editSelectScript">编辑</el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="blur事件脚本" prop="events.blur"
            >
              <el-input v-model="signleParams.events.blur" readonly>
                <el-button slot="append" size="small" @click="e_editBlurScript">编辑</el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="focus事件脚本" prop="events.focus"
            >
              <el-input v-model="signleParams.events.focus" readonly>
                <el-button slot="append" size="small" @click="e_editFocusScript">编辑</el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-form-item>
            <el-button size="small" type="primary" @click="e_save">保存</el-button>
            <el-button size="small" @click="e_close">取消</el-button>
          </el-form-item>
        </el-row>
      </el-col>
      <el-col :span="14">
        <KevinEditor ref="KevinEditor" @input="handleEditorInput"/>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import Vue from 'vue'

export default {
  data() {
    return {
      signleParams: {
        events: {
          select: '',
          fetchSuggestions: '',
          blur: '',
          focus: '',
        }
      },
      editType: ''
    }
  },
  methods: {
    e_editFetchScript() {
      this.editType = "fetchScript"
      this.$refs.KevinEditor.changeEditor({value: this.signleParams.events.fetchSuggestions})
    },
    e_editSelectScript() {
      this.editType = "selectScript"
      this.$refs.KevinEditor.changeEditor({value: this.signleParams.events.select})
    },
    e_editBlurScript() {
      this.editType = "blurScript"
      this.$refs.KevinEditor.changeEditor({value: this.signleParams.events.blur})
    },
    e_editFocusScript() {
      this.editType = "focusScript"
      this.$refs.KevinEditor.changeEditor({value: this.signleParams.events.focus})
    },
    handleEditorInput(code) {
      if (this.editType == 'fetchScript') {
        this.signleParams.events.fetchSuggestions = this.formatCode(code)
      } else if (this.editType == 'selectScript') {
        this.signleParams.events.select = this.formatCode(code)
      } else if (this.editType == 'blurScript') {
        this.signleParams.events.blur = this.formatCode(code)
      } else if (this.editType == 'focusScript') {
        this.signleParams.events.focus = this.formatCode(code)
      }
    },
    e_save() {
      console.log(this.signleParams, '312')
      this.$refs.signleParams.validate(v => {
        if (v) {
          this.$emit('save', this.signleParams)
        }
      })
    },
    appendParams(params) {
      console.log('params', params)
      this.signleParams = JSON.parse(JSON.stringify(params))
    },
    e_close() {
      this.$emit('close')
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

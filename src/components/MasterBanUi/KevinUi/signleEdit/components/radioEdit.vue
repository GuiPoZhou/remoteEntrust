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
            <el-form-item :rules="[{ required: true, message: '请填写上传组件的名称', trigger: 'blur' }]"
                          label="单项标题"
                          prop="label">
              <el-input v-model="signleParams.label"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="选择事件脚本" prop="events.input">
              <el-input v-model="signleParams.events.input" readonly>
                <el-button slot="append" size="small" @click="e_editInputScript">编辑</el-button>
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
          input: ''
        }
      },
      editType: ''
    }
  },
  methods: {
    e_editInputScript() {
      this.$refs.KevinEditor.changeEditor({value: this.signleParams.events.input})
    },
    handleEditorInput(code) {
      this.$set(this.signleParams.events, 'input', this.formatCode(code))
      this.$forceUpdate()
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

      this.signleParams = JSON.parse(JSON.stringify(params))
      if (!this.signleParams.events || !this.signleParams.events.input) {
        this.signleParams.events = {
          input: ''
        }
      }
      this.$refs.KevinEditor.changeEditor({value: this.signleParams.events.input})
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

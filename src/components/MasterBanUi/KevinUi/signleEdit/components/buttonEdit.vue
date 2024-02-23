<template>
  <div class="buttonEdit">
    <div class="be-right">
      <el-form ref="signleParams" :model="signleParams" class="demo-ruleForm" label-width="100px">
        <el-form-item
            :rules="[{ required: true, message: '此项若为空请在json编辑器中进行维护(且唯一)', trigger: 'blur' }]"
            label="单项唯一值"
            prop="anchorPoint">
          <el-input v-model="signleParams.anchorPoint" disabled></el-input>
        </el-form-item>
        <el-form-item :rules="[{ required: true, message: '按钮名称不能为空', trigger: 'blur' }]" label="按钮名称"
                      prop="label">
          <el-input v-model="signleParams.label"></el-input>
        </el-form-item>
        <el-form-item :rules="[{ required: true, message: '请选择按钮大小', trigger: 'change' }]" label="按钮尺寸"
                      prop="size">
          <el-select v-model="signleParams.size">
            <el-option label="中等" value="medium"></el-option>
            <el-option label="小型" value="small"></el-option>
            <el-option label="超小型" value="mini"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :rules="[{ required: true, message: '请选择按钮类型', trigger: 'change' }]" label="按钮类型"
                      prop="type">
          <el-select v-model="signleParams.type">
            <el-option label="主要按钮" value="primary"></el-option>
            <el-option label="成功按钮" value="success"></el-option>
            <el-option label="信息按钮" value="info"></el-option>
            <el-option label="警告按钮" value="warning"></el-option>
            <el-option label="危险按钮" value="danger"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :rules="[{ required: true, message: '按钮事件不能为空', trigger: 'change' }]" label="按钮事件"
                      prop="events">
          <el-input v-model="signleParams.events" readonly>
            <el-button slot="append" size="small" @click="e_editEvents">编辑</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="按钮回调事件" prop="callbackEvents">
          <el-input v-model="signleParams.callbackEvents" readonly>
            <el-button slot="append" size="small" @click="e_editCallBackEvents">编辑</el-button>
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
      signleParams: {},
      options: {
        language: 'javascript'
      },
      editType: '',
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
        this.signleParams.events = "console.log('按钮点击')"
      }
      if (!this.signleParams.callbackEvents) {
        this.signleParams.callbackEvents = "console.log('按钮回调事件')"
      }
    },
    e_close() {
      this.$emit('close')
    },
    e_editEvents() {
      this.editType = "btnClick"
      this.$refs.KevinEditor.changeEditor({value: this.signleParams.events})
    },
    e_editCallBackEvents() {
      this.editType = "btnCallBack"
      this.$refs.KevinEditor.changeEditor({value: this.signleParams.callbackEvents})
    },
    handleEditorInput(value) {
      if (this.editType == 'btnClick') {
        this.signleParams.events = this.formatCode(value)
      } else if (this.editType == 'btnCallBack') {
        this.signleParams.callbackEvents = this.formatCode(value)
      }

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

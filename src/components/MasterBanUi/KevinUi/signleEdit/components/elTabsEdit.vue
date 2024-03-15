<template>
  <div class="buttonEdit">
    <div class="be-right">
      <el-form ref="signleParamsRef" :model="signleParams" class="demo-ruleForm" label-width="130px">
        <el-form-item
            :rules="[{ required: true, message: '此项若为空请在json编辑器中进行维护(且唯一)', trigger: 'blur' }]"
            label="单项唯一值"
            prop="anchorPoint">
          <el-input v-model="signleParams.anchorPoint" disabled></el-input>
        </el-form-item>
        <el-form-item :rules="[{ required: true, message: '请选择Tabs风格类型', trigger: 'change' }]"
                      label="Tabs风格类型"
                      prop="type">
          <el-select v-model="signleParams.type">
            <el-option label="普通" value="-"></el-option>
            <el-option label="卡片" value="card"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :rules="[{ required: true, message: 'tabs切换事件脚本不能为空', trigger: 'change' }]"
                      label="Tabs被选中事件"
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
<script lang="ts" setup>
import {reactive, ref, getCurrentInstance} from "vue";

const vm = getCurrentInstance()?.proxy as any
const emit = defineEmits(['close', 'save'])
let signleParams = reactive({
  anchorPoint: '',
  type: '',
  events: ''
})
let options = reactive({
  language: 'javascript'
})

function e_save() {
  vm.$refs.signleParamsRef.validate(v => {
    if (v) {
      emit('save', signleParams)
    }
  })
}

function appendParams(params) {

  signleParams = JSON.parse(JSON.stringify(params))
  if (!signleParams.events) {
    signleParams.events = "console.log('选择')"
  }
}

function e_close() {
  emit('close')
}

function e_editEvents() {
  vm.$refs.KevinEditor.changeEditor({value: signleParams.events})
}

function handleEditorInput(value) {
  signleParams.events = formatCode(value)
}

function formatCode(code) {
  // 去除开头和结尾的空白字符
  code = code.trim();

  // 在大括号前后添加空格
  code = code.replace(/\s*{\s*/g, ' { ').replace(/\s*}\s*/g, ' } ');

  // 在逗号前后添加空格
  code = code.replace(/,(\S)/g, ', $1');

  // 返回格式化后的代码
  return code;
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

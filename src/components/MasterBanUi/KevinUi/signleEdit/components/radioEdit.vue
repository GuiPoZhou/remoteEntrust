<template>
  <el-form ref="signleParamsRef" :model="signleParams" class="demo-ruleForm" label-width="120px">
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
<script lang="ts" setup>
import {reactive, ref, getCurrentInstance} from "vue";

const vm = getCurrentInstance()?.proxy as any
const emit = defineEmits(['close', 'save'])

let signleParams = reactive({
  anchorPoint: '',
  label: '',
  events: {
    input: ''
  }
})
let editType = ref('')

function e_editInputScript() {
  vm.$refs.KevinEditor.changeEditor({value: signleParams.events.input})
}

function handleEditorInput(code) {
  signleParams.events.input = formatCode(code)
}

function e_save() {
  vm.$refs.signleParamsRef.validate(v => {
    if (v) {
      emit('save', signleParams)
    }
  })
}

function appendParams(params) {
  console.log('params', params)

  signleParams = JSON.parse(JSON.stringify(params))
  if (!signleParams.events || !vm.signleParams.events.input) {
    signleParams.events = {
      input: ''
    }
  }
  vm.$refs.KevinEditor.changeEditor({value: vm.signleParams.events.input})
}

function e_close() {
  emit('close')
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

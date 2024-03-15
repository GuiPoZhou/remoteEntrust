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
<script lang="ts" setup>
import {ref, reactive, getCurrentInstance} from 'vue'

const vm = getCurrentInstance()?.proxy as any
const emit = defineEmits(['close', 'save'])
let signleParams = reactive({
  events: {
    select: '',
    fetchSuggestions: '',
    blur: '',
    focus: '',
  }
})
let editType = ref('')

function e_editFetchScript() {
  editType.value = "fetchScript"
  vm.$refs.KevinEditor.changeEditor({value: signleParams.events.fetchSuggestions})
}

function e_editSelectScript() {
  editType.value = "selectScript"
  vm.$refs.KevinEditor.changeEditor({value: signleParams.events.select})
}

function e_editBlurScript() {
  editType.value = "blurScript"
  vm.$refs.KevinEditor.changeEditor({value: signleParams.events.blur})
}

function e_editFocusScript() {
  editType.value = "focusScript"
  vm.$refs.KevinEditor.changeEditor({value: signleParams.events.focus})
}

function handleEditorInput(code) {
  if (editType.value == 'fetchScript') {
    signleParams.events.fetchSuggestions = formatCode(code)
  } else if (editType.value == 'selectScript') {
    signleParams.events.select = formatCode(code)
  } else if (editType.value == 'blurScript') {
    signleParams.events.blur = formatCode(code)
  } else if (editType.value == 'focusScript') {
    signleParams.events.focus = formatCode(code)
  }
}

function e_save() {
  console.log(signleParams, '312')
  vm.$refs.signleParamsRef.validate(v => {
    if (v) {
      emit('save', signleParams)
    }
  })
}

function appendParams(params) {
  console.log('params', params)
  signleParams = JSON.parse(JSON.stringify(params))
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

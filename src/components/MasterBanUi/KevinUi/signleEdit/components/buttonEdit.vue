<template>
  <div class="buttonEdit">
    <div class="be-right">
      <el-form ref="signleParamsRef" :model="signleParams" class="demo-ruleForm" label-width="100px">
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
<script lang="ts" setup>
import {getCurrentInstance, ref, reactive} from "vue";

const vm = getCurrentInstance()?.proxy as any
const emit = defineEmits(['save', 'close'])
let signleParams = reactive({
  events: '',
  callbackEvents: '',
  anchorPoint: '',
  label: '',
  size: '',
  type: '',
})
let options = reactive({
  language: 'javascript'
})
let editType = ref('')

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
    signleParams.events = "console.log('按钮点击')"
  }
  if (!signleParams.callbackEvents) {
    signleParams.callbackEvents = "console.log('按钮回调事件')"
  }
}

function e_close() {
  emit('close')
}

function e_editEvents() {
  editType.value = "btnClick"
  vm.$refs.KevinEditor.changeEditor({value: signleParams.events})
}

function e_editCallBackEvents() {
  editType.value = "btnCallBack"
  vm.$refs.KevinEditor.changeEditor({value: signleParams.callbackEvents})
}

function handleEditorInput(value) {
  if (editType.value == 'btnClick') {
    signleParams.events = formatCode(value)
  } else if (editType.value == 'btnCallBack') {
    signleParams.callbackEvents = formatCode(value)
  }

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

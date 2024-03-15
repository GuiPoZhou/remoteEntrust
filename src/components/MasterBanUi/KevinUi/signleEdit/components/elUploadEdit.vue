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
            <el-form-item :rules="[{ required: true, message: '请填写上传组件的名称', trigger: 'blur' }]" label="标题"
                          prop="label">
              <el-input v-model="signleParams.label"></el-input>
            </el-form-item>
          </el-col>
          <el-form-item>
            <el-button size="small" type="primary" @click="e_save">保存</el-button>
            <el-button size="small" @click="e_close">取消</el-button>
          </el-form-item>
        </el-row>
      </el-col>
      <el-col :span="14">

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
  label: ''
})

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
}

function e_close() {
  emit('close')
}
</script>

<template>
  <el-dialog
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="dialogShow"
      title="评价"
      width="20%"
      @before-close="close"
  >
    <el-row>
      <el-form
          label-position="left"
      >
        <!--        <el-form-item label="报检编号">{{checkRow.entrustCode}}</el-form-item>-->
        <el-form-item label="样品名称">1</el-form-item>
        <el-form-item label="项目名称">2</el-form-item>
        <el-form-item label="金额">3</el-form-item>
      </el-form>
    </el-row>
    <el-divider></el-divider>
    <el-input v-model="remark" :rows="4" type="textarea"></el-input>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">提交</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import {ref, reactive, getCurrentInstance, watch} from 'vue'

const instance = getCurrentInstance()
// 获取vue实例相当于this
const vm = instance['proxy']
const {dialogShow, checkRow} = defineProps(['dialogShow', 'checkRow'])
const emit = defineEmits(['update:dialogShow'])
let remark = ref('')

function submit() {

}

function close() {
  emit('update:dialogShow', false)
}

watch(() => checkRow, (val) => {
  console.log('check', val)
}, {deep: true})
</script>
<style scoped>

</style>

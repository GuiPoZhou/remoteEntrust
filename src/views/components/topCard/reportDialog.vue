<template>
  <el-dialog v-if="showLog"
             :append-to-body="true"
             title="消息提示"
             width="30%"
             :modal-append-to-body="true"
             :visible.sync="showLog"
             @close="close"
  >
    <div class="centerBox isMore">
      <p>{{ localData.content }}</p>
      <p>{{ localData.createTime }}</p>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="close">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import {ref, reactive, toRefs, getCurrentInstance} from 'vue'
const emit = defineEmits(['close'])
const instance = getCurrentInstance()
// 获取vue实例相当于this
const vm = instance['proxy']
let showLog = ref(false)
let localData = ref({})
const init = (item) => {
  showLog.value = true
  localData.value = item
  console.log(item, 'item')
}
const close = () => {
  emit('close')
}
defineExpose({init})
</script>
<style lang="less" scoped>
.centerBox {
  width: 100%;
  height: 100%;
  background: #f6f6f8;
  padding: 20px;
}
</style>

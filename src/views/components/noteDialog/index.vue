<template>
  <bo-dialog
      :diaLogShow="diaLogShow"
      :isFullScreen="false"
      diaLogTitle="通知详情"
      diaLogWidth="35%"
      @close="closeDialog"
  >
    <template slot="bologbody">
      <div>
        <div style="height: 100%">
          <div class="titleStyle">
            <p>{{ title }}</p>
            <p class="timeStyle" v-html="form.createTime"></p>
          </div>
          <div class="contentStyle">
            <p v-html="form.noticeContent"></p>
          </div>
        </div>
      </div>
    </template>
    <template slot="bologfooter">
      <el-button @click="closeDialog">关闭</el-button>
    </template>
  </bo-dialog>
</template>

<script setup>
import {ref, reactive, getCurrentInstance} from 'vue'

const instance = getCurrentInstance()
// 获取vue实例相当于this
const vm = instance['proxy']
let diaLogShow = ref(false)
let noticeId = ref(null)
let title = ref('')
const init = (id) => {
  console.log('打开弹框')
  noticeId.value = id
  diaLogShow.value = true
  getDetail()
}
let typeList = ref([])
vm.$net('/system/dict/data/type/sys_notice_type', 'get').then(res => {
  typeList.value = res.data
})
let form = ref({})
const getDetail = () => {
  vm.$net(`/v1/entrustRemoteAgreement/getNoticeInfo/${noticeId.value}`, 'get').then(res => {
    if (res.code === 200) {
      form.value = res.data
      console.log(form)
      title.value = Checktitle()
    }
  })
}
const closeDialog = () => {
  diaLogShow.value = false
}

function Checktitle() {
  console.log(typeList.value)
  console.log(form.value.noticeType)
  console.log(form.value.noticeTitle)
  let typeLabel = typeList.value.filter(item => item.dictValue == form.value.noticeType)[0].dictLabel
  console.log(typeLabel, 'typeLabel')
  return ('关于' + form.value.noticeTitle + '的') + (typeLabel ? typeLabel : '')

}

defineExpose({init, form})
</script>
<style lang="less" scoped>
.titleStyle {
  font-size: 16px;
  font-weight: bolder;
  text-align: center;
  margin: 0 auto;
  margin-top: 5rem;
}

.timeStyle {
  font-size: 12px;
  color: #999;
}

.contentStyle {
  text-align: left;
  width: 80%;
  margin: 0 auto;
}
</style>

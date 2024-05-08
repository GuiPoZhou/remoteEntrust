<template>
  <div class="fox-dialog">
    <!--        :title="diaLogTitle"-->
    <el-dialog ref="el_dialog123" v-model="diaLogShows" :append-to-body="true"
               :class="!isFullScreen ? 'minClass' : 'fox-dialog'"
               :close-on-click-modal="false" :fullscreen="isFullScreen" :show-close="false"
               :width="diaLogWidth"
               class="fox-dialog" @close="e_dialogClose" @open="e_dialogOpen">
      <div slot="title" class="dialog-title">
        <span class="topTilte">{{ diaLogTitle }}</span>
        <div class="topRight">
          <template v-if="showEditDrag && HasPermi">
            <el-button v-if="!closeDrag" size="small" type="warning"
                       @click="e_confirmFormDesgin">保存表单布局
            </el-button>
            <!-- 开启拖拽 -->
            <el-icon v-if="closeDrag" class="rightIcon" @click="e_changeDrag(false)">
              <Edit/>
            </el-icon>
            <el-icon v-if="!closeDrag" class="rightIcon" @click="e_changeDrag(true)">
              <Rank/>
            </el-icon>
          </template>
          <!-- 最小化 -->
          <el-icon v-if="isFullScreen" class="rightIcon" @click="e_changeBox(false)">
            <Minus/>
          </el-icon>
          <!-- 最大化 -->
          <el-icon v-if="!isFullScreen" class="rightIcon" @click="e_changeBox(true)">
            <FullScreen/>
          </el-icon>
          <!-- 关闭 -->
          <el-icon class="rightIcon" @click="e_dialogClose">
            <Close/>
          </el-icon>
        </div>
      </div>
      <!-- 弹框中间内容区域 -->
      <div class="foxlogbody">
        <slot name="bologbody"></slot>
      </div>
      <!-- 弹框底部按钮区域 -->
      <div slot="footer" class="dialog-footer">
        <slot name="bologfooter"></slot>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import {ElMessageBox} from "element-plus";
import {useStore} from "vuex";
import {Close, Edit, FullScreen, Minus, Rank} from "@element-plus/icons-vue";

const store = useStore();
const vm = getCurrentInstance().proxy
let isFullScreen = ref(true);
let closeDrag = ref(true);//表单是否开启拖拽布局
const prop = defineProps({
  HasPermi: {
    typeof: Boolean,
    default: false
  },
  showEditDrag: {
    typeof: Boolean,
    default: false
  },
  diaLogWidth: {
    typeof: String,
    default: '50%'
  },
  diaLogTitle: {
    typeof: String,
    default: '弹框'
  },
  diaLogShow: {
    typeof: Boolean,
    default: false
  }
})
let diaLogShows = computed(() => prop.diaLogShow)

console.log(prop, 'prop')
let HasPermi = ref(prop.HasPermi)
let showEditDrag = ref(prop.showEditDrag)
let diaLogWidth = ref(prop.diaLogWidth)
let diaLogTitle = ref(prop.diaLogTitle)
let diaLogShow = ref(prop.diaLogShow)
const emit = defineEmits(['confirmFormDesgin', 'close', 'open'])
// watch(diaLogShow, (val) => {
//   console.log(val);
//   diaLogShows.value = val
// })
onBeforeMount(() => {
  window.MlDialogThis = vm
})

function e_confirmFormDesgin() {
  ElMessageBox.confirm('确定保存当前form布局?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    closeDrag.value = true
    emit('confirmFormDesgin')
  })
}

/**
 * @author Coder
 * @date 2023/1/4
 * @des 开启表单拖拽
 */
function e_changeDrag(b) {
  closeDrag.value = b
  store.commit('set_closeDrag', b)
}

/*
        *@author: 焦政
        *@date: 2022-02-21 09:15:45
        *@description:关闭弹框
        */
function e_dialogClose() {
  emit('close')
}

function e_dialogOpen() {
  emit('open')
}

// 是否全屏
function e_changeBox(type) {
  isFullScreen.value = type
}
</script>
<script>
export default {
  name: 'ml-dialog',
}
</script>

<style lang="less">
.el-dialog__wrapper {
  right: -14px;
  top: -15px;
  bottom: -15px;
  left: -14px;
}

.fox-dialog .el-input {
  // width: 220px;
}

.fox-dialog .el-form--inline .el-form-item {
  width: 100%;
}

.fox-dialog .el-form-item__content {
  width: calc(100% - 120px);
}

.fox-dialog .el-date-editor.el-input,
.fox-dialog .el-date-editor.el-input__inner {
  width: 100% !important;
}

.fox-dialog .el-input-number {
  width: 100% !important;
}

.el-date-editor--datetimerange.el-input,
.el-date-editor--datetimerange.el-input__inner {
  width: 220px;
}

.fox-dialog .el-select {
  width: 100%;
}

.fox-dialog .el-autocomplete {
  width: 100%;
}

.fox-dialog .el-dialog__body .el-col {
  // margin-bottom: 0px !important;
}

// 百叶窗标题部分
.fox-dialog .foxlogbody .el-collapse-item__header {
  background-color: #f5f6f7 !important;
  padding-left: 0.5rem;
  height: 2.3rem;
}

// 百叶窗内容部分
.fox-dialog .foxlogbody .el-collapse-item__content {
  padding-bottom: 0 !important;
  padding: 0.5rem !important;
}

.fox-dialog .el-dialog__header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.fox-dialog .el-dialog {
  // width: 75%;
  border-radius: 0px !important;
  padding: 0 0.4rem;
  padding-top: 3.4rem;
  // margin: 0 auto !important;
  top: 50%;
  height: 100% !important;
  overflow: hidden;
  padding-bottom: 3.4rem;
  display: flex;
  margin-right: 80%;
  flex-direction: column;
}

.minClass .el-dialog {
  // width: 75%;
  border-radius: 0px !important;
  padding: 0 0.4rem;
  padding-top: 3.4rem;
  // margin: 0 auto !important;
  top: 48%;
  max-height: 80%;
  overflow: hidden;
  padding-bottom: 3.4rem;
  display: flex;
  margin-right: 80%;
  flex-direction: column;
}

.fox-dialog .el-dialog__body {
  overflow: hidden;
  overflow-y: scroll;
  height: 100%;
  border: 1px solid #dcdee1;
  padding: 0.5rem;
}

.fox-dialog .el-dialog__header {
  width: 100%;
  position: absolute;
  height: 50px;
  top: 0;
  background-color: #f1f2f3;
  line-height: 50px;
  left: 0;
}

.fox-dialog .el-dialog__body::-webkit-scrollbar {
  /*display: none;*/
  /*隐藏滚动条*/
}

.el-dialog__headerbtn {
  margin-top: 0px;
}

.fox-dialog .el-dialog__footer {
  height: 50px;
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: #f5f6f7;
  z-index: 11;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  border-top: 1px solid #dcdee1;
  padding: 0 20px;
  left: 0;
}

.fox-dialog .el-dialog__title {
  font-size: 20px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: bold;
  color: #333;
}

.fox-dialog .el-dialog--center .el-dialog__body {
  padding: 13px 25px 30px;
}

.fox-dialog .el-dialog__body .el-tabs__nav-wrap::after {
  background: none !important;
}

// 弹框内容中卡片tab样式修改

// .el-dialog__body .el-tabs--card > .el-tabs__header{
//   border: none;
// }
// .el-dialog__body .el-tabs--card > .el-tabs__header .el-tabs__nav{
//   border: none;
// }
// .el-dialog__body .el-tabs--card > .el-tabs__header .el-tabs__item{
//   border: none;
// }

// .el-dialog__body .el-tabs__item.is-active{
//   background-color: #F7F9FC;
// }

// 弹框中 table样式修改
.fox-dialog .el-dialog__body .el-table tr {
  /*background: none;*/
}

.fox-dialog .el-dialog__body .el-table .el-table__header-wrapper th,
.el-table .el-table__fixed-header-wrapper th {
  background-color: #f7f9fc;
}

.fox-dialog .el-dialog__body .el-table {
  background-color: #f7f9fc;
}

.fox-dialog .el-collapse-item__wrap {
  border-bottom: none;
}

.fox-dialog .el-radio-group {
  padding-left: 15px;
}

.fox-dialog .el-textarea__inner {
  /*border: none;*/
}

.fox-dialog .el-upload--picture-card {
  width: 120px;
  height: 120px;
  margin: 10px 0;
  line-height: 128px;
}

.fox-dialog .el-upload {
  margin: 10px;
}

/*label过长*/
.overLable .el-form-item--medium .el-form-item__label {
  line-height: 20px;
  text-align: right;
  padding-left: 10px;
}

.fox-dialog .el-input-number--medium {
  width: 100%;
}

.fox-dialog .el-dialog__headerbtn {
  top: 0;
}
</style>

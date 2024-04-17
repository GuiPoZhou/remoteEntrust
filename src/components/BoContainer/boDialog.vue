<template>
  <div class="fox-dialog">
    <!--        :title="diaLogTitle"-->
    <el-dialog
        ref="el_dialog123"
        :append-to-body="true"
        :class="!isFullScreen?'minClass':'fox-dialog'"
        :close-on-click-modal="false"
        :fullscreen="isFullScreen"
        :show-close="false"
        v-model="diaLogShows"
        :width="diaLogWidth"
        class="fox-dialog"
        @close="e_dialogClose"
        @open="e_dialogOpen"
    >
      <div slot="title" class="dialog-title">
        <span class="topTilte">{{ diaLogTitle }}</span>
        <div class="topRight">
          <template v-if="showEditDrag">
            <!-- 开启拖拽 -->
            <i
                v-if="closeDrag"
                class="el-icon-edit rightIcon"
                style="font-size: 15px"
                @click="e_changeDrag(false)"
            ></i>
            <i
                v-if="!closeDrag"
                class="el-icon-rank rightIcon"
                style="font-size: 15px"
                @click="e_changeDrag(true)"
            ></i>
          </template>
          <!-- 最小化 -->
          <i
              v-if="isFullScreen"
              class="el-icon-minus rightIcon"
              @click="e_changeBox(false)"
          ></i>
          <!-- 最大化 -->
          <i
              v-if="!isFullScreen"
              class="el-icon-full-screen rightIcon"
              @click="e_changeBox(true)"
          ></i>
          <!-- 关闭 -->
          <i class="el-icon-close rightIcon" @click="e_dialogClose"></i>
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
import {watch} from "vue";
import {useStore} from "vuex";

const store = useStore();
let diaLogShows = ref(false)
let closeDrag = ref(false)
const emit = defineEmits(['close'])
let {showEditDrag, diaLogWidth, diaLogTitle, diaLogShow, isFullScreen} =
    defineProps({
      showEditDrag: {
        type: Boolean,
        default: false
      },
      diaLogWidth: {
        type: String,
        default: '50%'
      },
      diaLogTitle: {
        type: String,
        default: '弹框'
      },
      diaLogShow: {
        type: Boolean,
        default: false
      },
      isFullScreen: {
        type: Boolean,
        default: true
      }
    })
watch(diaLogShow, (val: boolean) => {
  diaLogShows.value = val
})
const e_changeDrag = (b: boolean) => {
  closeDrag.value = b
}
const e_dialogClose = () => {
  emit("close")
}
const e_dialogOpen = () => {
  emit("open")
}
const e_changeBox = (type) => {
  isFullScreen = type
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
  margin-bottom: 0px !important;
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

.dialog-footer {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
</style>

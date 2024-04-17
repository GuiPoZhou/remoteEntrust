<template ref="localRef">
  <div class="app-container">
    <listContainer
        ref="listContainerRef"
        :businessConfigId="businessConfigId + ''"
        :runType="2"
        @handleSelectionChange="handleSelectionChange"
    >
      <template #tableColumn.status="row">
        {{ checkStatus(row.slotScopt.status) }}
      </template>
      <template #tableColumn.extSampleSource="row">
        {{ checkSource(row.slotScopt) }}
      </template>
      <template #tableColumn.sampleProductType="row">
        {{ checkSampleProductType(row.slotScopt) }}
      </template>
      <template #bobutton>
        <!--    按钮-->
        <el-row :gutter="10" class="mb8">
          <el-col
              v-for="(v, i) in pluginsInfo.mainHomeButtons"
              :key="i"
              :span="1.5"
          >
            <el-button
                :size="v.size === 'mini' ? 'small' : v.size"
                :type="v.type"
                @click="e_slotButtonEvents(v)"
            >{{ v.label }}
            </el-button>
          </el-col>
        </el-row>
      </template>
      <template #action="scope">
        <el-button
            v-for="(actionInfo, actionIndex) in pluginsInfo.mainTableButtons"
            v-show="
            !actionInfo.disabled || actionInfo.disabled == ''
              ? true
              : checkActionButtonNew(actionInfo.disabled, scope.slotScopt)
          "
            :key="actionIndex + Math.random()"
            :loading="actionInfo.isLoading"
            size="small"
            text type="primary"
            @click="e_actionButtonEventsNew(actionInfo, scope.slotScopt)"
        >{{ actionInfo.label }}
        </el-button>
      </template>
    </listContainer>

    <MicroProgress
        v-if="showProgress"
        ref="MicroProgress"
        @close="showProgress = false"
    ></MicroProgress>
    <addEntrustDialog
        v-if="entrustShow"
        ref="entrustDialog"
        :businessConfigId="businessConfigId"
        @close="entrustShow = false"
        @saveReload="e_saveReload"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      showProgress: false,
      entrustShow: false,
    }
  }
}
</script>
<script setup>
import MicroProgress from "@/components/detectionProgress/entruroPgress.vue";
import listContainer from "@/components/executionTemplate/tableColumnConfig/listContainer.vue";
import addEntrustDialog from "./addEntrustDialog.vue";
import {cloneTask, recallTask} from "@/api/index/index.js";
import {deleteTask} from "@/api/entrust/entrustConfirm.js";
import {getPluginsForButtons} from "@/utils/index.js"
import {useRoute} from "vue-router";

const route = useRoute()

const vm = getCurrentInstance().proxy

let businessConfigId = ref(null)
let pluginsInfo = reactive({})

businessConfigId.value = route.query.itemId.toString() + 3333;
getPluginsForButtons("remoteBtn", (e) => {
  console.log('这是e', e);
  Object.assign(pluginsInfo, e)
});
watch(route, (val) => {
  businessConfigId.value = val.query?.itemId.toString() + 3333;
}, {
  deep: true,
  immediate: true,
})
let sampleSourceList = ref([])
let productTypeList = ref([])
onMounted(() => {
  vm.$net("/v1/entrustRemoteAgreement/indexData", "get").then((res) => {
  });
  vm.getDicts("sample_source_list", "get").then((res) => {
    if (res.code === 200) {
      sampleSourceList.value = res.data;
    }
  });
  vm.getDicts("product_type").then((res) => {
    if (res.code === 200) {
      productTypeList.value = res.data;
    }
  });
})


function e_saveReload() {
  entrustShow.value = false
  vm.$refs.listContainerRef.$refs.query.getList();
}
let selectList = ref([])
//多选回调
function handleSelectionChange(e) {
  selectList.value = e;
}

let statusList = ref([
  {label: "待确认", value: null},
  {label: "暂存", value: 0},
  {label: "待提交", value: 1},
  {label: "报检流程审批中", value: 2},
  {label: "报检流程撤回", value: 3},
  {label: "报检流程退回", value: 4},
  {label: "待受理", value: 5},
  {label: "受理退回", value: 6},
  {label: "已受理", value: 7},
  {label: "检测中", value: 9},
  {label: "检测中", value: 10},
  {label: "检测完成", value: 11},
])

function checkStatus(e) {
  return statusList.value.filter((item) => item.value == e)[0]?.label;
}

// 来源
function checkSource(row) {
  return sampleSourceList.value.filter(
      (item) => item.dictCode == row.extSampleSource
  )[0]?.dictLabel;
}

function checkSampleProductType(row) {
  return productTypeList.value.filter(
      (item) => item.dictCode == row.sampleProductType
  )[0]?.dictLabel;
}


function checkActionButtonNew(events, scope) {
  return new Function("ctx", "scope", events)(vm, scope);
}
// 新版 table 行内按钮事件
function e_actionButtonEventsNew(widgetInfo, scope) {
  new Function("ctx", "scope", "widgetInfo", widgetInfo.clickEvents)(
      vm,
      scope,
      widgetInfo
  );
}

/**
 * @author Coder
 * @date 2023/4/20
 * @des 插槽按钮事件
 */
function e_slotButtonEvents(v) {
  new Function("ctx", v.events)(vm);
}
/**
 * @author Coder
 * @date 2023/4/20
 * @des table 自定义操作按钮事件
 */
function e_actionButtonEvents(v, scope) {
  new Function("ctx", "scope", v.clickEvents)(vm, scope);
}
</script>
<style scoped>
.app-container {
  text-align: center;
  margin: 0 auto;
  width: 80%;
}
</style>

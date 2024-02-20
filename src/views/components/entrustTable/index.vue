<template>
  <div class="app-container">
    <listContainer ref="listContainerRef" :businessConfigId="businessConfigId + ''" :runType="2"
                   @handleSelectionChange="handleSelectionChange"
    >
      <template v-slot:tableColumn.status="row">
        {{ checkStatus(row.slotScopt.status) }}
      </template>
      <template v-slot:tableColumn.extSampleSource="row">
        {{ checkSource(row.slotScopt) }}
      </template>
      <template v-slot:tableColumn.sampleProductType="row">
        {{ checkSampleProductType(row.slotScopt) }}
      </template>
      <template v-slot:bobutton>
        <!--    按钮-->
        <el-row :gutter="10" class="mb8">
          <el-col v-for="(v, i) in pluginsInfo.mainHomeButtons" :key="i" :span="1.5">
            <el-button :size="v.size" :type="v.type" @click="e_slotButtonEvents(v)">{{ v.label }}
            </el-button>
          </el-col>
        </el-row>
      </template>
      <template v-slot:action="scope">
        <el-button v-for="(actionInfo, actionIndex) in pluginsInfo.mainTableButtons"
                   v-show="(!actionInfo.disabled || actionInfo.disabled == '') ? true : checkActionButtonNew(actionInfo.disabled, scope.slotScopt)"
                   :key="actionIndex + Math.random()"
                   :loading="actionInfo.isLoading" size="small"
                   type="text" @click="e_actionButtonEventsNew(actionInfo, scope.slotScopt)">{{
            actionInfo.label
          }}
        </el-button>
      </template>
    </listContainer>

  </div>
</template>
<script setup>
import {ElMessageBox, ElMessage} from "element-plus";
// import {getPluginsForButtons} from "@/mixins/masterbanUtil.js";
import listContainer from '@/components/executionTemplate/tableColumnConfig/listContainer.vue'
import addEntrustDialog from './addEntrustDialog.vue'
import {cloneTask, recallTask} from '@/api/index/index.js'
import {deleteTask} from '@/api/entrust/entrustConfirm.js'

const vm = getCurrentInstance().proxy
import {useRoute, useRouter} from "vue-router";

let route = useRoute()
let businessConfigId = ref('')
let pluginsInfo = reactive({})
onBeforeMount(() => {
  let query = route.query
  console.log(route.query, 'route')
  businessConfigId.value = query.itemId.toString() + 3333
  // getPluginsForButtons('remoteBtn', (e) => {
  //   console.log('插件按钮', e)
  //   Object.assign(pluginsInfo,e)
  // })
})
watch(route.query, (val) => {
  businessConfigId.value = val?.itemId.toString() + 3333
})

let sampleSourceList = ref([])
let productTypeList = ref([])
onMounted(() => {
  vm.$net('/v1/entrustRemoteAgreement/indexData', 'get',).then(res => {
  });
  vm.getDicts('sample_source_list', 'get').then(res => {
    if (res.code === 200) {
      sampleSourceList.value = res.data
    }
  })
  vm.getDicts('product_type').then(res => {
    if (res.code === 200) {
      productTypeList.value = res.data
    }
  })
})

let statusList = ref([
  {label: '待确认', value: null},
  {label: '暂存', value: 0},
  {label: '待提交', value: 1},
  {label: '报检流程审批中', value: 2},
  {label: '报检流程撤回', value: 3},
  {label: '报检流程退回', value: 4},
  {label: '待受理', value: 5},
  {label: '受理退回', value: 6},
  {label: '已受理', value: 7},
  {label: '检测中', value: 9},
  {label: '检测中', value: 10},
  {label: '检测完成', value: 11},
])

function checkStatus(e) {
  return statusList.value.filter(item => item.value == e)[0]?.label
}

// 来源
function checkSource(row) {
  return sampleSourceList.value.filter(item => item.dictCode == row.extSampleSource)[0]?.dictLabel
}

function checkSampleProductType(row) {
  return productTypeList.value.filter(item => item.dictCode == row.sampleProductType)[0]?.dictLabel
}

let entrustShow = ref(false)

function e_saveReload() {
  entrustShow.value = false
  vm.$refs.listContainerRef.$refs.query.getList()
}

let selectList = ref([])

//多选回调
function handleSelectionChange(e) {
  selectList.value = e
}

function handlepush(row) {
  ElMessageBox.confirm('确定要推送所选数据吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(res => {
    let params = {
      entrustCode: row.entrustCode,
      status: 3
    }
    vm.$net('/v1/entrustRemoteAgreement/submit', 'post', params).then(res => {
      if (res.code === 200) {
        ElMessage.success(res.msg)
        vm.$refs.listContainerRef.$refs.query.getList()
      }
    })
  })

}


//复制
function handleCopy(row) {
  ElMessageBox.confirm(`确认复制委托[编号:${row.entrustCode}]？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
      .then(() => {
        cloneTask(row.id).then(
            res => {
              if (res.code == 200) {
                ElMessage.success(res.msg)
                vm.$refs.listContainerRef.$refs.query.getList();
              }
            },
            err => {
            }
        );
      })
      .catch(function () {
      });
}

/**
 * @author Coder
 * @date 2023/4/20
 * @des 处理table action表格按钮
 */
function checkActionButton(events, scope) {
  return eval(events)
}

function checkActionButtonNew(events, scope) {
  return new Function('ctx', 'scope', events)(this, scope)
}

// 新版 table 行内按钮事件
function e_actionButtonEventsNew(widgetInfo, scope) {
  new Function('ctx', 'scope', 'widgetInfo', widgetInfo.clickEvents)(vm, scope, widgetInfo)
}

/**
 * @author Coder
 * @date 2023/4/20
 * @des 插槽按钮事件
 */
function e_slotButtonEvents(v) {
  new Function('ctx', v.events)(vm)
}

/**
 * @author Coder
 * @date 2023/4/20
 * @des table 自定义操作按钮事件
 */
function e_actionButtonEvents(v, scope) {
  new Function('ctx', 'scope', v.clickEvents)(vm, scope)
}
</script>
<style scoped>
.app-container {
  text-align: center;
  margin: 0 auto;
  width: 80%;
}
</style>

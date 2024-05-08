<template>
  <div>
    <bo-dialog
        :dia-log-show="diaLogShow"
        dia-log-title="检测进度"
        @close="e_close"
    >
      <template #bologbody>
        <el-table
            :cell-style="addClass"
            :data="tableData"
            border
            max-height="800"
            stripe
        >
          <el-table-column :render-header="linefeed" fixed label="委托单号" prop="entrustCode"></el-table-column>
          <el-table-column :render-header="linefeed" fixed label="委托人" prop="applyUserName"></el-table-column>
          <el-table-column :render-header="linefeed" fixed label="业务类型" prop="v2">
            <template v-slot="scope">
              <span v-if="scope.row.entrustType == 1">成品检测</span>
              <span v-if="scope.row.entrustType == 2">元器件检测</span>
              <span v-if="scope.row.entrustType == 3">失效检测</span>
            </template>
          </el-table-column>
          <el-table-column :render-header="linefeed" fixed label="委托部门" prop="principalDept"></el-table-column>
          <el-table-column :render-header="linefeed" fixed label="受理人" prop="acceptPerson"></el-table-column>
          <el-table-column :render-header="linefeed" fixed label="预计完成日期" prop="completeDate"></el-table-column>
          <el-table-column align="center" label="检测项目">
            <el-table-column v-for="(v,i) in tList" :key="i" :label="v.itemName" align="center">
              <template v-slot="scope">
                <div style="cursor: pointer" @click="handleDetail(scope.row, scope.row['itemId' + v.itemName])">
                  {{ scope.row[v.itemName] || '-' }}
                </div>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </template>
    </bo-dialog>
    <!-- 项目详情   -->
    <itemDetail v-if="showDetail" ref="detailRef" @close="showDetail = false"></itemDetail>
  </div>
</template>

<script setup>
import itemDetail from "./dialog/itemDetail.vue";
import {ref, getCurrentInstance, reactive, nextTick} from "vue";

const vm = getCurrentInstance().proxy
let diaLogShow = ref(false)

function init(data) {
  diaLogShow.value = true
  getDetail(data)
}

let tableData = ref([])
let tList = ref([])
let queryParams = reactive({
  remoteEntrustCode: null
})

//查询进度
function getDetail(data) {
  queryParams.remoteEntrustCode = data.entrustCode
  if (data.entrust_code) {
    queryParams.remoteEntrustCode = data.entrust_code
  }
  vm.$net('/progress/itemProgress', 'get', queryParams).then(res => {
    if (res.code === 200) {
      tableData.value = res.data.list
      rendertitleList()
    }
  })
}

function rendertitleList() {
  let arr = []
  tableData.value.forEach(item => {
    if (item.itemStatusVos) {
      if (item.itemStatusVos == null) {
        item.itemStatusVos = []
      }
      item.itemStatusVos.forEach(iteminfo => {
        arr.push({
          itemName: iteminfo.itemName
        })
      })
    }

  })
  tList.value = unique(arr)
  console.log(tList.value)
  tableData.value.forEach((item, index) => {
    if (item.itemStatusVos) {
      let executeListLength = item.itemStatusVos.length
      for (let i = 0; i < executeListLength; i++) {
        if (item.itemStatusVos[i].itemStatus == 0) {
          item.itemStatusVos[i].itemStatusName = '待分配'
        } else if (item.itemStatusVos[i].itemStatus == 1) {
          item.itemStatusVos[i].itemStatusName = '已分配'
        } else if (item.itemStatusVos[i].itemStatus == 2) {
          item.itemStatusVos[i].itemStatusName = '待接收'
        } else if (item.itemStatusVos[i].itemStatus == 3) {
          item.itemStatusVos[i].itemStatusName = '测试中'
        } else if (item.itemStatusVos[i].itemStatus == 4) {
          item.itemStatusVos[i].itemStatusName = '审核中'
        } else if (item.itemStatusVos[i].itemStatus == 9) {
          item.itemStatusVos[i].itemStatusName = '委外中'
        } else if (item.itemStatusVos[i].itemStatus == 6) {
          item.itemStatusVos[i].itemStatusName = '已完成'
        } else if (item.itemStatusVos[i].itemStatus == 7) {
          item.itemStatusVos[i].itemStatusName = '异常'
        } else if (item.itemStatusVos[i].itemStatus == 8) {
          item.itemStatusVos[i].itemStatusName = 'N/A'
        } else if (item.itemStatusVos[i].itemStatus == 5) {
          item.itemStatusVos[i].itemStatusName = '被退回'
        } else if (item.itemStatusVos[i].itemStatus == 10) {
          item.itemStatusVos[i].itemStatusName = '补测'
        } else if (item.itemStatusVos[i].itemStatus == 20) {
          item.itemStatusVos[i].itemStatusName = '复测'
        }
        item[`${item.itemStatusVos[i].itemName}`] = item.itemStatusVos[i].itemStatusName
        item[`itemStatus${item.itemStatusVos[i].itemName}`] = item.itemStatusVos[i].itemStatus
        item[`itemId${item.itemStatusVos[i].itemName}`] = item.itemStatusVos[i].itemId
      }
    }
  })
}

function unique(arr) { // 根据唯一标识id来对数组进行过滤
  const res = new Map();//定义常量 res,值为一个Map对象实例
  //返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
  return arr.filter((arr) => !res.has(arr.itemName) && res.set(arr.itemName, 1))
}

// 设置背景颜色
function addClass({row, column, rowIndex, columnIndex}) {
  for (var i = 0; i < tList.value.length; i++) {
    if (column.label == tList.value[i].itemName) {
      if (row[`itemStatus${tList.value[i].itemName}`] == 0) {
        return 'background-color: #9E9E9E;color: #333'
      } else if (row[`itemStatus${tList.value[i].itemName}`] == 2) {
        return 'background-color: #EEAD0E;color: #333'
      } else if (row[`itemStatus${tList.value[i].itemName}`] == 3) {
        return 'background-color: #EEEE00;color: #333'
      } else if (row[`itemStatus${tList.value[i].itemName}`] == 4) {
        return 'background-color: #5CACEE;color: #333'
      } else if (row[`itemStatus${tList.value[i].itemName}`] == 6 || row[`itemStatus${tList.value[i].itemName}`] == 8) {
        return 'background-color: #43CD80;color: #333'
      } else if (row[`itemStatus${tList.value[i].itemName}`] == 7) {
        return 'background-color: #FF0000;color: #333'
      } else if (row[`itemStatus${tList.value[i].itemName}`] == 5) {
        return 'background-color: #1874CD;color: #333'
      } else if (row[`itemStatus${tList.value[i].itemName}`] == 9) {
        return 'background-color: #836FFF;color: #333'
      }
    }
  }
}

let showDetail = ref(false)

function handleDetail(row, itemId) {
  if (itemId !== undefined) {
    showDetail.value = true
    nextTick(() => {
      vm.$refs.detailRef.init(row, itemId)
    })
  }
}

const emit = defineEmits(['close'])

function e_close() {
  emit('close')
}

defineExpose({
  init,
})
</script>

<style lang="scss" scoped>

</style>

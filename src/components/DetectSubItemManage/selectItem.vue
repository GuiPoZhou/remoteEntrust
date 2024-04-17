<!--选择项目-->
<template>
  <BoDialog :dia-log-show="selectItemShow" :dia-log-title="`已选择项目（共 ${sampleNum} 个）`" dia-log-width="70%"
            @close="close">
    <template v-slot:bologbody>
      <el-table ref="selectedItemTable" :cell-style="{ padding: '2px' }" :data="selectedItemTableData"
                :row-style="{ height: '20px' }" :tree-props="{ children: 'voListZ' }"
                border
                element-loading-background="rgba(0, 0, 0, 0.8)" element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中" height="300"
                row-key="id" style="width: 100%">
        <el-table-column :show-overflow-tooltip="true" label="项目名称" prop="itemName">
        </el-table-column>
        <el-table-column label="方法编码" prop="itemCode" show-overflow-tooltip/>
        <el-table-column label="子法名称" prop="subname"/>
        <el-table-column label="方法中文名称" prop="methodNameCn"/>
        <el-table-column label="基质" prop="stroma"/>
        <el-table-column label="现场检测">
          <template #default="scope">
            <el-switch :active-value="1" :inactive-value="0" :value="scope.row.sceneDetect" active-color="#5B7BFA"
                       disabled inactive-color="#dadde5">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="客户指定" prop="customerAppoint">
          <template #default="scope">
            <el-switch v-model="scope.row.customerAppoint" :active-value="1" :inactive-value="0"></el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="scope">
            <el-button icon="el-icon-delete" size="small" text type="primary"
                       @click="deleteItem(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 10px; height: 400px">
        <el-tabs :value="selectItemType" tab-position="left" type="border-card" @tab-click="handleClick">
          <el-tab-pane label="按检测项目" name="item">
            <itemList ref="itemList" :paramObj="paramObj" :selectedItems="selectedItemTableData"
                      @parseSelectedItems="parseSelectedItems"/>
          </el-tab-pane>
          <el-tab-pane label="按项目分组" name="group">
            <groupList ref="groupList" :paramObj="paramObj" :selectedItems="selectedItemTableData"
                       @parseSelectedItems="parseSelectedItems"/>
          </el-tab-pane>
        </el-tabs>
      </div>
    </template>
    <template v-slot:bologfooter>
      <el-button center size="small" type="primary" @click="saveItem">保存</el-button>
      <el-button size="small" @click="close">取消</el-button>
    </template>
  </BoDialog>
</template>
<script setup>
import itemList from './itemList.vue'
import groupList from './groupList.vue'
import {useStore} from "vuex";

const emit = defineEmits(['saveItem', 'cancel'])
const vm = getCurrentInstance().proxy
const store = useStore()
const sampleNum = computed(() => {
  return selectedItemTableData.length
})

let selectItemShow = ref(false)
//选中项目的方式 item:按项目选择 ，group:按组选择
let selectItemType = ref('item')
// 检测类别
let detectType = ref(store.state.BeiYuan.detectType)
//记录单类别
let recordType = ref(undefined)
let selectedItemTableData = ref([])
let isFullScreen = ref(true)
let paramObj = reactive({})

function itemListData(data) {
  let arr = []
  for (let i = 0; i < data.length; i++) {
    if (data[i].recordItemList) {
      for (let j = 0; j < data[i].recordItemList.length; j++) {
        arr.push(data[i].recordItemList[j])
      }
    }
  }
  return arr;
}

function initItemList(detectType, selectedItems, Type, e) {
  selectItemShow.value = true
  Object.assign(paramObj, e)
  if (selectedItems.length === 0) {
    nextTick(() => {
      vm.$refs.itemList.clearBtn()
    })
  }
  let isAdd = true;
  let arr = []
  selectedItems.forEach(item => {
    if (item.parentId !== undefined) {
      item.itemParentId = item.parentId
    }
    if (item.recordItemList) {
      isAdd = false
      item.recordItemList.forEach(items => {
        arr.push(items)
      })
    }
  })
  if (isAdd) {
    selectedItemTableData.value = selectedItems
  } else {
    selectedItemTableData.value = itemListData(selectedItems)
  }
  selectItemType.value = 'item'
  nextTick(() => {
    recordType.value = Type
    vm.$refs.itemList.initItemList(detectType, recordType.value)
  })
}

function flatten(array) {
  return [].concat(...array.map(item => [].concat(item, ...this.flatten(item.voListZ))))
}

// 保存选中项目
function saveItem() {
  selectedItemTableData.value.forEach((item) => {
    if (!item.voListZ) {
      item.voListZ = []
    } else {
      item.voListZ.forEach(aa => {
        if (!aa.voListZ) {
          aa.voListZ = []
        }
      })
    }
    if (!item.detectTypeStr) {
      item.detectTypeStr = store.state.BeiYuan.detectName
    }
    Reflect.set(item, 'customerAppoint', item.customerAppoint === undefined ? false : item.customerAppoint)
  })
  emit('saveItem', selectedItemTableData.value)
  close()
}

function close() {
  selectItemShow.value = false
  emit('cancel')
}

function handlelick(tab, event) {
  selectItemType.value = tab.name
  nextTick(() => {
    if (selectItemType.value === 'group') {
      vm.$refs.groupList.initGroupList(detectType.value, recordType.value)
    } else {
      vm.$refs.itemList.initItemList(detectType.value, recordType.value)
    }
  })
}

//操作未选中项目时解析已选中项目
function parseSelectedItems({currentSelectedItems, allItem}) {
  //所有项目列表--选中项目id
  let currentSelectedItemIds = currentSelectedItems.map(item => item.itemId)
  //所有项目列表中--项目id
  let allItemIds = allItem.map((itemMethod) => itemMethod.itemId)
  //所有项目列表--未选中 项目id
  let currentUnSelectedItemIds = allItemIds.filter((id) => {
    return currentSelectedItemIds.indexOf(id) < 0
  })

  //已选项目列表中 项目id
  let alreadySelectedItemIds = selectedItemTableData.value.map((itemMethod) => itemMethod.itemId)
  //添加
  currentSelectedItems.map((itemMethod) => {
    if (alreadySelectedItemIds.indexOf(itemMethod.itemId) < 0) {
      selectedItemTableData.value.push(itemMethod)
    }
  })
  //删除未选中项
  for (let i = selectedItemTableData.value.length - 1; i >= 0; i--) {
    let itemId = selectedItemTableData.value[i].itemId
    if (currentUnSelectedItemIds.indexOf(itemId) >= 0) {
      selectedItemTableData.value.splice(i, 1)
    }
  }
}

function deleteItem(index, item) {
  if (item.itemParentId == 0) {
    selectedItemTableData.value.splice(index, 1)
  } else {
    console.log(item)
    var findIndex = selectedItemTableData.value.findIndex(items => items.itemId == item.itemParentId)
    if (findIndex > -1) {
      if (selectedItemTableData.value[findIndex].voListZ.length == 1) {
        item = selectedItemTableData.value[findIndex]
        selectedItemTableData.value.splice(findIndex, 1)
      } else {
        selectedItemTableData.value[findIndex].voListZ.map((itemss, indexss) => {
          if (itemss.itemId == item.itemId) {
            selectedItemTableData.value[findIndex].voListZ.splice(indexss, 1)
          }
        })
      }
    }
  }

  if (selectItemType.value == 'item') {
    vm.$refs.itemList.customerSel(item.itemId)
  } else {
    vm.$refs.groupList.customerSel(item.itemId)
  }
}

defineComponent({
  name: 'selectItem'
})
</script>

<style scoped></style>

<template>
  <el-container style="height: 420px; border: 1px solid #eee">
    <el-aside width="300px">
      <el-form ref="form" :model="form" label-width="80px" @submit.native.prevent>
        <el-form-item label="类别名称" prop="detectName">
          <el-input v-model="groupName" style="width: 150px" @keydown.enter.native="getGroupListQuery"></el-input>
        </el-form-item>
      </el-form>
      <el-table
          ref="groupTable"
          v-loading="loading"
          :cell-style="{ padding: '5px' }"
          :data="groupTableData"
          :row-style="{ height: '20px' }"
          border
          element-loading-background="rgba(0, 0, 0, 0.8)"
          element-loading-spinner="el-icon-loading"
          element-loading-text="拼命加载中"
          height="230"
          style="width: 100%"
          @row-click="initGroupItemList"
      >
        <el-table-column label="分组名称" prop="groupName"/>
      </el-table>
    </el-aside>
    <el-container style="margin-left: 10px">
      <div style="width: 100%">
        <el-table
            ref="groupItemTable"
            v-loading="loading"
            :cell-style="{ padding: '2px' }"
            :data="groupItemTableData"
            :row-key="getRowKeys"
            :row-style="{ height: '20px' }"
            :tree-props="{children: 'voListZ'}"
            border
            element-loading-background="rgba(0, 0, 0, 0.8)"
            element-loading-spinner="el-icon-loading"
            element-loading-text="拼命加载中"
            height="420"
            style="width: 100%"
            @select="parseSelectedItems"
            @select-all="parseSelectedAllItems"
            @selection-change="selectionChange"
        >
          <el-table-column :selectable="checkSelect" type="selection" width="50"></el-table-column>
          <el-table-column
              :show-overflow-tooltip="true"
              label="检测项目名称"
              prop="itemName"
          >
            <template #default="scope">
              {{ scope.row.itemParentId == 0 ? scope.row.itemName : '' }}
            </template>
          </el-table-column>
          <!-- <el-table-column
              prop="itemNameEn"
              label="项目英文名称"
              :show-overflow-tooltip="true"
          >
          </el-table-column> -->
          <el-table-column
              :show-overflow-tooltip="true"
              label="子项目名称"
              prop="itemName"
          >
            <template #default="scope">
              {{ scope.row.itemParentId != 0 ? scope.row.itemName : '' }}
            </template>
          </el-table-column>
          <el-table-column
              :show-overflow-tooltip="true"
              label="方法编码"
              prop="itemCode"
          />
          <el-table-column
              :show-overflow-tooltip="true"
              label="方法中文名称"
              prop="methodNameCn"
          />
          <el-table-column
              :show-overflow-tooltip="true"
              label="子法名称"
              prop="subname"
          />
          <el-table-column
              :show-overflow-tooltip="true"
              label="基质"
              prop="stroma"
          />
          <el-table-column label="现场检测">
            <template #default="scope">
              <el-switch
                  :active-value="1"
                  :inactive-value="0"
                  :value="scope.row.sceneDetect"
                  active-color="#5B7BFA"
                  disabled
                  inactive-color="#dadde5"
              >
              </el-switch>
            </template>
          </el-table-column>
        </el-table>
        <pagination
            v-show="total > 0"
            :limit.sync="queryParams.pageSize"
            :page.sync="queryParams.pageNum"
            :total="total"
            @pagination="getGroupItems"
        />
      </div>
    </el-container>
  </el-container>
</template>

<script setup>
import {getGroupItemList, getGroupList} from '@/api/envCheckScheme/config'

defineComponent({
  name: 'groupList'
})
const vm = getCurrentInstance().proxy
let form = reactive({})
let loading = ref(false)
let groupItemTableData = ref([])
let groupTableData = ref([])
let groupName = ref(null)
// 检测类别
let detectCategory = ref(null)
//记录单类别
let recordType = ref(null)
// 查询参数
let queryParams = reactive({
  pageSize: 1000,
  pageNum: 1,
  //记录单类别
  recordType: undefined
})
let groupId = ref(null)
let total = ref(0)
const emit = defineEmits(['parseSelectedItems'])
const props = defineProps({
  selectedItems: Array,
  paramObj: {
    type: Object,
    default: () => ({})
  }
})
let selectedItems = ref(props.selectedItems)
let paramObj = reactive(props.paramObj)

function getRowKeys(row) {
  return row.id
}

function check() {
  //已选项目名称列表
  let selItemNameList = selectedItems.value.map(item => {
    return item.itemName
  })
  //  获取已选项目ID
  let selItemIDList = selectedItems.value.map(item => {
    return item.itemId
  })
  //    获取未选项
  let notSelItemList = groupItemTableData.value.filter(item => {
    return selItemIDList.indexOf(item.itemId) == -1
  })
  //    比对未选项目列表中的项目名称 与已选项目项目名称进行比对 筛选出相同项目名称的ID
  let sameItemNameList = notSelItemList.filter(item => {
    return selItemNameList.indexOf(item.itemName) != -1
  })
  //    获取相同项的id
  let sameItemIdList = sameItemNameList.map(item => {
    return item.itemId
  })
  //    根据相同项的ID 进行取消勾选
  groupItemTableData.value.map(item => {
    item.isSelect = sameItemIdList.indexOf(item.itemId) == -1;
  })
}

function initGroupList(detectType, recordType) {
  detectCategory.value = detectType
  queryParams.recordType = recordType
  getGroupList()
}

function getGroupListQuery() {
  let param = {}
  param.groupName = groupName.value
  getGroupList(param, detectCategory.value).then((response) => {
    groupTableData.value = response.data
    groupItemTableData.value = []
    return false
  })
}

function initGroupItemList(row, column, event) {
  groupId.value = row.id
  getGroupItems()
}

function getGroupItems() {
  groupItemTableData.value = []
  if (paramObj.contactId) {
    queryParams.contactId = paramObj.contactId
    queryParams.customerId = paramObj.customerId
  }
  let params = {
    groupId: groupId.value,
    query: queryParams
  }
  getGroupItemList(params, detectCategory.value).then((res) => {
    groupItemTableData.value = res.data.list
    groupItemTableData.value.map(item => {
      item.itemId = item.id
      item.detectType = item.detectCategory
      item.itemCode = item.methodCode
      item.subname = item.childMethodName
      item.subItemName = item.subItemNameCn
      item.sceneDetect = Number(item.isScene)
      item.parentId = item.itemParentId
      item.customerAppoint = 0
      item.itemPrice = (item.itemPrice - 0).toFixed(2) || 0
      item.discount = (item.discount - 0).toFixed(2) || 10
      if (item.voListZ !== null) {
        item.voListZ.map(items => {
          items.itemId = items.id
          items.detectType = items.detectCategory
          items.customerAppoint = 0
          items.parentId = items.itemParentId
          items.itemCode = items.methodCode
          items.subname = items.childMethodName
          items.subItemName = items.subItemNameCn
          items.sceneDetect = Number(items.isScene)
          items.itemPrice = (item.itemPrice - 0).toFixed(2) || 0
          items.discount = (item.discount - 0).toFixed(2) || 10
        })
      }
    })
    total.value = res.data.total
    // 初始化勾选项
    nextTick(() => {
      let alreadySelectedItemIds = selectedItems.value.map(
          (item) => item.itemId
      )
      groupItemTableData.value.forEach((itemMethod) => {
        if (alreadySelectedItemIds.indexOf(itemMethod.itemId) >= 0) {
          vm.$refs.groupItemTable.toggleRowSelection(itemMethod, true)
        } else {
          vm.$refs.groupItemTable.toggleRowSelection(itemMethod, false)
        }
      })
    })
  })
}

function checkSelect(row) {
  return row.itemParentId == 0;
}

function parseSelectedItems(selection, row) {
  groupItemTableData.value.map((itemA) => {
    selection.map((itemB) => {
      if (itemA.itemParentId === itemB.itemId) {
        selection.push(itemA)
      }
    })
  })
  let currentSelectedItems = JSON.parse(JSON.stringify(selection))
  emit('parseSelectedItems', {
    currentSelectedItems: currentSelectedItems,
    allItem: groupItemTableData.value
  })
  check()
}

function selectionChange(selection) {

  let currentSelectedItems = JSON.parse(JSON.stringify(selection))
  emit('parseSelectedItems', {
    currentSelectedItems: currentSelectedItems,
    allItem: groupItemTableData.value
  })
  check()
}

function parseSelectedAllItems(selection) {
  let currentSelectedItems = []
  if (selection.length) {
    currentSelectedItems = JSON.parse(JSON.stringify(groupItemTableData.value))
  }
  emit('parseSelectedItems', {
    currentSelectedItems: currentSelectedItems,
    allItem: groupItemTableData.value
  })
  check()
}

/**
 * @author 焦政
 * @date 2022/7/23
 * @des 对底部全部检测项目列表 根据上方已选进行勾选
 */
function customerSel(itemId) {
  nextTick(() => {
    if (selectedItems.value.length == 0) {
      vm.$refs.groupItemTable.clearSelection()
      return
    }
    nextTick(() => {
      groupItemTableData.value.map((item) => {
        if (itemId == item.itemId) {
          vm.$refs.groupItemTable.toggleRowSelection(item, false);
        }
      });
    });
  });
}

function unSelectItem(delItem) {
  //去掉勾选
  vm.groupItemTableData.forEach((item) => {
    if (item.itemId === delItem.itemId) {
      vm.$refs.groupItemTable.toggleRowSelection(item, false)
    }
  })
}

defineExpose({initGroupItemList, initGroupList})
</script>

<style scoped>
.el-aside {
  padding: 5px !important;
  margin: 0px !important;
}

/*aside{*/
/*  padding:10px*/
/*}*/
</style>

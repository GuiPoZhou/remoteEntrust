<template>
  <div>
    <el-tabs v-model="showActiveName" style="margin-bottom: 5px" type="card" @tab-click="e_changeShow">
      <el-tab-pane label="单项目查询" name="first">
        <el-form ref="queryParams" :model="queryParams" label-width="80px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="项目名称">
                <el-input v-model="queryParams.itemName" clearable @clear="getItemListQuery"
                          @keyup.enter.native="getItemListQuery"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="方法编号">
                <el-input v-model="queryParams.methodCode" clearable @clear="getItemListQuery"
                          @keyup.enter.native="getItemListQuery"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="现场检测">
                <el-select v-model="queryParams.isScene" clearable @change="getItemListQuery">
                  <el-option label="否" value="false"></el-option>
                  <el-option label="是" value="true"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="多项目查询" name="second">
        <el-input v-model="searchItemNames" placeholder="输入项目名称，多个项目名称以中文顿号 '  、' 间隔"
                  type="textarea"
                  @blur="e_searchItemByMostName"></el-input>
      </el-tab-pane>
    </el-tabs>
    <el-row style="margin-bottom: 10px">
      <el-col :span="24">
        <span>查询范围：</span>
        <el-radio-group v-model="searchScope">
          <el-radio :label="-1">全部方法</el-radio>
          <el-radio :label="1">常用方法</el-radio>
          <el-radio :label="0">非常用方法</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>
    <!--@select="parseSelectedItems" @select-all="parseSelectedAllItems"      -->
    <el-table ref="itemTable" v-loading="loading" :cell-style="{ padding: '2px' }" :data="itemTableData"
              :row-key="getRowKeys" :row-style="{ height: '20px' }"
              :tree-props="{children: 'voListZ'}" border element-loading-background="rgba(0, 0, 0, 0.8)" element-loading-spinner="el-icon-loading"
              element-loading-text="拼命加载中" height="330"
              style="width: 100%" @selection-change="selectionChange">
      <el-table-column :reserve-selection="true" :selectable="checkSelect" type="selection" width="50">
      </el-table-column>
      <el-table-column
          :show-overflow-tooltip="true"
          label="检测项目名称"
          prop="itemName"
      >
        <!--        <template scope="scope">-->
        <!--          {{scope.row.itemParentId == 0?scope.row.itemName:''}}-->
        <!--        </template>-->
      </el-table-column>
      <!-- <el-table-column
          prop="itemNameEn"
          label="项目英文名称"
          :show-overflow-tooltip="true"
      >
      </el-table-column> -->
      <!--      <el-table-column-->
      <!--        prop="itemName"-->
      <!--        label="子项目名称"-->
      <!--        :show-overflow-tooltip="true"-->
      <!--      >-->
      <!--        <template scope="scope">-->
      <!--          {{scope.row.itemParentId != 0?scope.row.itemName:''}}-->
      <!--        </template>-->
      <!--      </el-table-column>-->
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
    <pagination v-show="total > 0" :limit.sync="queryParams.pageSize" :page.sync="queryParams.pageNum"
                :total="total" @pagination="paginationChange"/>
  </div>
</template>
<script setup>
import {getItemList} from '@/api/standardManagement/itemMethod'

defineComponent({
  name: 'itemList'
})
const vm = getCurrentInstance().proxy
let searchItemNames = ref('') //多项目查询
let searchScope = ref(-1) //查询范围初始值
let showActiveName = ref('first')
//遮罩层
let loading = ref(false)
let itemTableData = ref([])
let queryParams = reactive({
  itemName: undefined,
  methodCode: undefined,
  //检测类别
  detectCategory: undefined,
  // 记录单类别
  recordType: undefined,
  isScene: undefined,
  pageNum: 1,
  pageSize: 10
})
let selectedItem = ref([])
let total = ref(0)
const props = defineProps({
  selectedItems: Array,
  required: true,
  paramObj: {
    type: Object,
    default: () => ({})
  }
})
let selectedItems = computed(() => props.selectedItems)
let required = computed(() => props.required)
let paramObj = reactive(props.paramObj)

watch(searchScope, (val) => {
  if (val != -1) {
    queryParams.commonMethod = searchScope.value
  } else {
    delete queryParams.commonMethod
  }
  if (showActiveName.value == 'first') {
    getItemListQuery()
  } else {
    e_searchItemByMostName()
  }
})
watch(showActiveName, (val) => {
  if (val == 'first') {
    getItemListQuery()
  } else if (val == 'second' && searchItemNames.value) {
    e_searchItemByMostName()
  }
})
const emit = defineEmits(['parseSelectedItems'])

function clearBtn() {
  vm.$refs.itemTable.clearSelection()
}

function getRowKeys(row) {
  return row.id
}

//切换分页效果
function paginationChange() {
  if (showActiveName.value === 'second') {
    e_searchItemByMostName()
  } else {
    getItemListQuery()
  }
}

/*
      *@author: 焦政
      *@date: 2022-05-05 17:19:35
      *@description:多项目查询
      */
async function e_searchItemByMostName() {
  if (!searchItemNames.value) {
    getItemListQuery()
    return
  }
  queryParams.itemMethodNames = searchItemNames.value
  let getRes = await vm.$net(
      '/standard/v1/itemMethods/getItemsByNames',
      'get',
      queryParams
  )
  itemTableData.value = getRes.data.list
  itemTableData.value.map(item => {
    item.itemId = item.id
    item.detectType = item.detectCategory
    item.itemCode = item.methodCode
    item.subname = item.childMethodName
    item.subItemName = item.subItemNameCn
    item.sceneDetect = Number(item.isScene)
    item.parentId = item.itemParentId
    item.itemPrice = (item.itemPrice - 0).toFixed(2) || 0
    item.customerAppoint = 0
    if (item.voListZ !== null) {
      item.voListZ.map(items => {
        items.itemId = items.id
        items.parentId = items.itemParentId
        items.detectType = items.detectCategory
        items.customerAppoint = 0
        items.itemCode = items.methodCode
        items.subname = items.childMethodName
        items.subItemName = items.subItemNameCn
        items.sceneDetect = Number(items.isScene)
        items.itemPrice = (item.itemPrice - 0).toFixed(2) || 0
      })
    }
  })

  total.value = getRes.data.total
  //初始化勾选
  nextTick(() => {
    let rowIds = []
    for (let i = 0; i < selectedItems.length; i++) {
      rowIds.push(selectedItems[i]['itemId'])
    }
    vm.$refs.itemTable.clearSelection()
    itemTableData.value.forEach(row => {
      if (rowIds.indexOf(row.itemId) >= 0) {
        vm.$refs.itemTable.toggleRowSelection(row, true)
      }
    })
    check()
  })

}

/*
       *@author: 焦政
       *@date: 2022-04-25 15:25:43
       *@description:切换 单项目查询 多项目查询
       */
function e_changeShow(e) {
  searchScope.value = -1
}

/*
      *@author: 焦政
      *@date: 2022-05-05 17:07:42
      *@description:切换查询范围
      */
function e_changeSearchScope() {
  getItemListQuery()
}

function getItemListQuery() {
  if (paramObj.contactId) {
    queryParams.contactId = paramObj.contactId
    queryParams.customerId = paramObj.customerId
  }
  getItemList(queryParams).then((response) => {
    itemTableData.value = response.data.list
    itemTableData.value.map(item => {
      item.itemId = item.id
      item.detectType = item.detectCategory
      item.itemCode = item.methodCode
      item.subname = item.childMethodName
      item.subItemName = item.subItemNameCn
      item.sceneDetect = Number(item.isScene)
      item.parentId = item.itemParentId
      item.itemPrice = (item.itemPrice - 0).toFixed(2) || 0
      item.discount = (item.discount - 0).toFixed(2) || 10
      item.customerAppoint = 0
      if (item.voListZ !== null) {
        item.voListZ.map(items => {
          items.itemId = items.id
          items.parentId = items.itemParentId
          items.detectType = items.detectCategory
          items.customerAppoint = 0
          items.itemCode = items.methodCode
          items.subname = items.childMethodName
          items.subItemName = items.subItemNameCn
          items.sceneDetect = Number(items.isScene)
          items.itemPrice = (item.itemPrice - 0).toFixed(2) || 0
          items.discount = (item.discount - 0).toFixed(2) || 10
        })
      }
    })

    // this.itemTableData = this.handleTree(this.itemTableData, "itemId", "itemParentId");
    total.value = response.data.total;
    // 初始化勾选项
    nextTick(() => {

      let rowIds = []
      for (let i = 0; i < selectedItems.value.length; i++) {
        //切记：贝源里面所有选择检测项目的地方，或者用到检测项目id地方 要用itemId
        rowIds.push(selectedItems.value[i]['itemId'])
      }
      vm.$refs.itemTable.clearSelection()
      itemTableData.value.forEach((row) => {
        if (rowIds.indexOf(row.itemId) >= 0) {
          if (row.itemParentId == 0) {
            vm.$refs.itemTable.toggleRowSelection(row, true)
          }
        }
      })
      check()
    })
  })
}

async function initItemList(detectType, recordType) {
  queryParams.detectCategory = detectType
  // this.queryParams.detectCategory = this.$store.state.BeiYuan.categoriesId ? this.$store.state.BeiYuan.categoriesId : detectType;
  nextTick(() => {
    queryParams.recordType = recordType
    vm.$forceUpdate()
  })
  await getItemListQuery()
}

/**
 * @author Coder
 * @date 2023/3/31
 * @des 根据产品类别 查询检测项目
 */
async function useDetectSearch(detectType, recordType) {
  queryParams.detectCategory = detectType
  nextTick(() => {
    queryParams.recordType = recordType
    vm.$forceUpdate()
  })
  await getItemListQuery()
}

function checkSelect(row) {
  return row.itemParentId == 0;
}

function parseSelectedItems(selection, row) {
  itemTableData.value.map((itemA) => {
    selection.map((itemB) => {
      if (itemA.itemParentId === itemB.itemId) {
        selection.push(itemA)
      }
    })
  })
  let currentSelectedItems = JSON.parse(JSON.stringify(selection))
  emit('parseSelectedItems', {
    currentSelectedItems: currentSelectedItems,
    allItem: itemTableData.value
  })
  check()
}

function selectionChange(selection) {
  let currentSelectedItems = JSON.parse(JSON.stringify(selection))
  emit('parseSelectedItems', {
    currentSelectedItems: currentSelectedItems,
    allItem: itemTableData.value
  })
  check()
}

function parseSelectedAllItems(selection) {
  let currentSelectedItems = []
  if (selection.length) {
    currentSelectedItems = JSON.parse(JSON.stringify(itemTableData.value))
  }
  emit('parseSelectedItems', {
    currentSelectedItems: currentSelectedItems,
    allItem: itemTableData.value
  })
  check()
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
  let notSelItemList = itemTableData.value.filter(item => {
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
  itemTableData.value.map(item => {
    item.isSelect = sameItemIdList.indexOf(item.itemId) == -1;
  })
}

/**
 * @author 焦政
 * @date 2022/7/23
 * @des 对底部全部检测项目列表 根据上方已选进行勾选
 */
function customerSel(itemId) {
  nextTick(() => {
    if (selectedItems.value.length == 0) {
      vm.$refs.itemTable.clearSelection()
      return
    }
    nextTick(() => {
      itemTableData.value.map((item) => {
        if (itemId == item.itemId) {
          vm.$refs.itemTable.toggleRowSelection(item, false);
        }
      });
    });
  });
}

function unSelectItem(delItem) {
  //去掉勾选
  itemTableData.value.forEach((item) => {
    if (item.itemId === delItem.itemId) {
      vm.$refs.itemTable.toggleRowSelection(item, false)
    }
  })
}

defineExpose({initItemList})
</script>


<style scoped>
</style>

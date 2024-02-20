<template>
  <div>
    <BoContainer ref="BoContainer" :total="total" pageTitle="预览动态列表" @changePage="changePage">
      <template v-slot:boMain>
        <BoMain4DynamicList>
          <template v-slot:botabs>
            <slot name="botabs"></slot>
          </template>
          <template v-slot:bosearch>
            <queryParam ref="query" :businessConfigId="businessConfigId" :finalTableConfig="finalTableConfig"
                        @getList="getList" @reset="reset"/>
          </template>
          <template v-slot:bobutton>
            <div class="toolarea">
              <slot name="bobutton"></slot>
              <tableListConfigToolBar v-if="canEdit" @showConfig="tableColumnsConfig"/>
            </div>

          </template>
          <!-- 表格 -->
          <template v-slot:tableArea>
            <!--    列表-->
            <el-table v-if="finalTableConfig && finalTableConfig.allColumns" ref="listTable" v-loading="loading"
                      :data="dynamicList" :default-sort="defaultSort" :max-height="800" border
                      stripe @selection-change="handleSelectionChange" @sort-change="sortChange">
              <el-table-column align="center" type="selection" width="55"/>
              <el-table-column align="center" label="序号" type="index" width="50"/>
              <el-table-column v-for="item in finalTableConfig.allColumns" v-if="!item?.hidden"
                               :label="item.label"
                               :prop="!item.aliasName ? item.id : item.aliasName"
                               :show-overflow-tooltip="true" :sortable="item.sort ? 'custom' : false"
                               :width="item.width">
                <template #default="scope">
                  <slot v-if="!item.aliasName || item.aliasName === ''" :name="'tableColumn.' + item.id"
                        :slot-scopt="scope.row">
                    {{ scope.row[item.id] }}
                  </slot>
                  <slot :name="'tableColumn.' + item.aliasName" :slot-scopt="scope.row">
                    {{ scope.row[item.aliasName] }}
                  </slot>
                </template>
              </el-table-column>
              <el-table-column v-if="showAction" :label="'操作'" :width="showActionWidth" align="center" fixed="right">
                <template #default="scope">
                  <slot :slot-scopt="scope" name="action"/>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </BoMain4DynamicList>
      </template>
    </BoContainer>
    <tableColumnConfig v-if="showTableColumnConfig" :businessConfigId="String(businessConfigId)"
                       :runType="runType" :showTableColumnConfig="showTableColumnConfig"
                       @closeTableColumnsConfig="closeTableColumnsConfig"/>
  </div>
</template>
<script>
export default {
  name: 'listContainer'
}
</script>
<script setup>
import {
  getTableInfo,
  getColumnInfo,
  getBusinessConfig,
  getColumnInfoWithBusinessId,
  getExDataConfigOptions,
  saveTableListConfig,
  getTableListConfig,
  getBusinessConfigWithId,
  getDynamicListData,
} from "@/api/tableColumnConfig/api.js";

import queryParam from '@/components/executionTemplate/tableColumnConfig/queryParam/queryParam.vue';
import tableListConfigToolBar from '@/components/RightToolbar/tableListConfigToolBar.vue'
import tableColumnConfig from '@/components/executionTemplate/tableColumnConfig/index.vue';
import axios from 'axios';
import {getToken} from '@/utils/auth'
import {update} from "@/api/standardManagement/itemMethod.js";

const vm = getCurrentInstance().proxy
const {
  businessConfigId,
  showAction,
  showActionWidth,
  canEdit,
  runType,
} = defineProps({
  businessConfigId: {
    type: String,
    default: null,
  },
  showAction: {
    type: Boolean,
    default: true
  },
  showActionWidth: {
    type: Number,
    default: 220,
  },
  //  外部传入 根据不同页面 不同业务 不同角色权限
  canEdit: {
    type: Boolean,
    default: true
  },
  runType: {
    type: Number,
    default: 1,
  }
})
let finalTableConfig = reactive({})
let total = ref(0)
let loading = ref(false)
let dynamicList = ref(null)
let pageTitle = ref(null)
let orderCondition = ref([])
let selection = ref(null)
let showTableColumnConfig = ref(false)
let defaultSort = ref(null)
let queryData = reactive({})
let pageLimit = ref(10)
let configId = ref(null)

let businessConfigIdRef = ref(businessConfigId)
watch(businessConfigIdRef, (val) => {
      console.log(val, 'id变了')
      orderCondition.value.splice(0);
      getTableListConfig(businessConfigId).then(res => {
        if (res && res.data) {
          configId.value = res.data.id;
          Object.assign(finalTableConfig, res.data.listConfig)
          let defaultSortList = finalTableConfig.allColumns.filter(item => item.sort && item.defaultSort);
          defaultSortList.sort((a, b) => {
            return a.defaultSortNum - b.defaultSortNum
          });
          console.log('defaultSortList', defaultSortList);
          defaultSortList.forEach(item => {
            if (item.defaultSort) {
              let order = {
                // key: item.tableAlias ? item.tableAlias + '.' + item.id : item.id,
                key: item.aliasName ? item.aliasName : item.id,
                orderType: item.sortType === 0 ? 2 : 1
              }
              orderCondition.value.push(order);
            }
          })
        }
      })
      if (runType !== 2) {
        getBusinessConfigWithId(businessConfigId).then(res => {
          if (res && res.data) {
            pageTitle.value = res.data.configName;
          }
        })
      }
    },
    {
      deep: true,
      immediate: true
    }
)

/**
 * @author Coder
 * @date 2023/5/4
 * @des 为纳通检测适配同路由不同菜单打开
 * 被动调用
 */
function getIndexTable() {
  getTableListConfig(businessConfigId).then(res => {
    if (res && res.data) {
      configId.value = res.data.id;
      finalTableConfig = res.data.listConfig;
      Object.assign(finalTableConfig, res.data.listConfig)
      finalTableConfig.allColumns.filter(item => item.sort).forEach(item => {
        if (item.defaultSort) {
          let order = {
            key: item.aliasName ? item.aliasName : item.id,
            orderType: item.sortType === 0 ? 2 : 1
          }
          orderCondition.value.push(order);
        }
      })
    }
  })
}

function reset() {
  vm.$refs.BoContainer.resetPage();
  pageLimit.value = 10;
}

function getList(queryParams) {
  let queryDataF = {
    queryParams: queryParams,
    pageNum: 1,
    pageSize: pageLimit.value,
    orderConditionList: orderCondition.value,
    runType: runType,
  }
  if (!queryParams) {
    queryDataF.queryParams = vm.$refs.query.getListQueryParams()
  }
  Object.assign(queryData, queryDataF)
  getDynamicListData(businessConfigId, queryData).then(res => {
    if (res && res.data && res.data.list) {
      dynamicList.value = res.data.list;
      total.value = res.data.total;
    }
  })
}

function downloadExcel(withQueryParam, sheetName = 'sheet1', downloadName) {
  let queryDataf = {
    orderConditionList: orderCondition.value,
    runType,
    withQueryParam: withQueryParam,
    sheetName: sheetName
  }
  queryDataf.queryParams = vm.$refs.query.getListQueryParams()
  Object.assign(queryData, queryDataf)
  console.log('downloadExcel', queryData);
  axios({
    method: 'post',
    url: window.globalEnv.VUE_APP_BASE_API + '/dbConfig/getDynamicListDataExcel/' + businessConfigId,
    responseType: 'blob',
    headers: {'Authorization': 'Bearer ' + getToken()},
    data: queryData
  }).then(async (res) => {
    const blob = new Blob([res.data])
    saveAs(blob, decodeURIComponent(downloadName + ".xlsx"))
  })
}

function saveAs(blob, filename) {
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    const link = document.createElement("a");
    const body = document.querySelector("body");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;

    // fix Firefox
    link.style.display = "none";
    body.appendChild(link);

    link.click();
    body.removeChild(link);

    window.URL.revokeObjectURL(link.href);
  }
}

function getQueryParams() {
  return vm.$refs.query.getListQueryParams();
}

function changePage(e) {
  let queryData = {
    queryParams: vm.$refs.query.getListQueryParams(),
    pageNum: e.page,
    pageSize: e.limit,
    orderConditionList: orderCondition.value,
    runType,
  }
  pageLimit.value = e.limit;
  getDynamicListData(businessConfigId, queryData).then(res => {
    if (res && res.data && res.data.list) {
      dynamicList.value = res.data.list;
      total.value = res.data.total;
    }
  })
}

const emit = defineEmits(['handleSelectionChange'])

// 多选框选中数据
function handleSelectionChange(e) {
  selection.value = e;
  emit('handleSelectionChange', selection);
}

function getSelection() {
  return selection.value;
}

function sortChange(v1, v2) {
  console.log('sortChange', v1, v2);
  console.log('sortChange', v1, finalTableConfig.allColumns);
  let keyName = v1.prop;
  let mateColumnConfig = finalTableConfig.allColumns.filter(item => item.id === v1.prop);
  console.log('mateColumnConfig', mateColumnConfig, finalTableConfig);
  if (mateColumnConfig.length > 0) {
    // keyName = mateColumnConfig[0].tableAlias ? mateColumnConfig[0].tableAlias + '.' + mateColumnConfig[0].id : mateColumnConfig[0].id;
    keyName = mateColumnConfig[0].id;
  }
  if (v1.order != null) {
    let order = {
      key: keyName,
      orderType: v1.order === 'ascending' ? 1 : 2
    }
    console.log('sortChange1', order);
    let temp = orderCondition.value.filter(item => item.key === keyName);
    console.log('sortChange1', temp, orderCondition.value, orderCondition.value.filter(item => item.key !== keyName));
    if (temp.length === 0) {
      orderCondition.value.unshift(order);
    } else {
      orderCondition.value = orderCondition.value.filter(item => item.key !== keyName);
      orderCondition.value.unshift(order);
    }
  } else {
    orderCondition.value = orderCondition.value.filter(item => item.key !== keyName);
  }
  getList();
}

function tableColumnsConfig() {
  showTableColumnConfig.value = true;
}

function closeTableColumnsConfig() {
  showTableColumnConfig.value = false;
}

onUpdated(() => {
  if (vm.$refs.listTable && vm.$refs.listTable.doLayout) {
    vm.$refs.listTable.doLayout();
  }
})
</script>

<style lang="less" scoped>
.toolarea {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

:deep(.el-button+.el-button)
.el-checkbox.is-bordered + .el-checkbox.is-bordered {
  margin-left: 0 !important;
  margin-right: 10px !important;
}

:deep(.el-button--text) {
  margin-right: 10px !important;
}
</style>

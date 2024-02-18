<template>
  <div>
    <BoContainer ref="BoContainer" :total="total" pageTitle="预览动态列表" @changePage="changePage">
      <template slot="boMain">
        <BoMain4DynamicList>
          <template slot="botabs">
            <slot name="botabs"></slot>
          </template>
          <template slot="bosearch">
            <queryParam ref="query" :businessConfigId="businessConfigId" :finalTableConfig="finalTableConfig"
                        @getList="getList" @reset="reset"/>
          </template>
          <template slot="bobutton">
            <div class="toolarea">
              <slot name="bobutton"></slot>
              <tableListConfigToolBar v-if="canEdit" @showConfig="tableColumnsConfig"/>
            </div>

          </template>
          <!-- 表格 -->
          <template slot="tableArea">
            <!--    列表-->
            <el-table v-if="finalTableConfig && finalTableConfig.allColumns" ref="listTable" v-loading="loading"
                      :data="dynamicList" :default-sort="defaultSort" :height="mainTableHeight" border
                      stripe @selection-change="handleSelectionChange" @sort-change="sortChange">
              <el-table-column align="center" type="selection" width="55"/>
              <el-table-column align="center" label="序号" type="index" width="50"/>
              <el-table-column v-for="item in finalTableConfig.allColumns" v-if="!item.hidden"
                               :label="item.label"
                               :prop="!item.aliasName ? item.id : item.aliasName"
                               :show-overflow-tooltip="true" :sortable="item.sort ? 'custom' : false" :width="item.width">
                <template scope="scope">
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
                <template scope="scope">
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

export default {
  name: "listContainer",
  components: {
    queryParam,
    tableListConfigToolBar,
    tableColumnConfig,
  },
  props: {
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
  },
  data() {
    return {
      finalTableConfig: null,
      total: 0,
      loading: false,
      dynamicList: null,
      pageTitle: null,
      orderCondition: [],
      selection: null,
      showTableColumnConfig: false,
      defaultSort: null,
      queryData: null,
      pageLimit: 10,

    }
  },
  //计算属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {
    businessConfigId() {
      this.orderCondition.splice(0);
      getTableListConfig(this.businessConfigId).then(res => {
        if (res && res.data) {
          this.configId = res.data.id;
          this.finalTableConfig = res.data.listConfig;
          let defaultSortList = this.finalTableConfig.allColumns.filter(item => item.sort && item.defaultSort);
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
              this.orderCondition.push(order);
              // this.$set(this, 'defaultSort', {
              //     prop: item.id,
              //     order: item.sortType === 0 ? 'descending' : 'ascending'
              // })
              // this.$refs.listTable.sort(order.key, order.orderType);
            }
          })
        }
        // this.getList();
      })
      if (this.runType !== 2) {
        getBusinessConfigWithId(this.businessConfigId).then(res => {
          if (res && res.data) {
            this.pageTitle = res.data.configName;
          }
        })
      }
    }
  },
  //方法集合
  methods: {
    // aa(){
    //     this.orderCondition.splice(0);
    //     getTableListConfig(this.businessConfigId).then(res => {
    //         if (res && res.data) {
    //             this.configId = res.data.id;
    //             this.finalTableConfig = res.data.listConfig;
    //             this.finalTableConfig.allColumns.filter(item => item.sort).forEach(item => {
    //                 let order = {
    //                     key: item.tableAlias ? item.tableAlias + '.' + item.id : item.id,
    //                     orderType: item.order === 'ascending' ? 1 : 2
    //                 }
    //                 this.orderCondition.push(order);
    //             })
    //         }
    //         // this.getList();
    //     })
    //     getBusinessConfigWithId(this.businessConfigId).then(res => {
    //         if (res && res.data) {
    //             this.pageTitle = res.data.configName;
    //         }
    //     })
    // },
    /**
     * @author Coder
     * @date 2023/5/4
     * @des 为纳通检测适配同路由不同菜单打开
     * 被动调用
     */
    getIndexTable() {
      getTableListConfig(this.businessConfigId).then(res => {
        if (res && res.data) {
          this.configId = res.data.id;
          this.finalTableConfig = res.data.listConfig;
          this.finalTableConfig.allColumns.filter(item => item.sort).forEach(item => {
            if (item.defaultSort) {
              let order = {
                // key: item.tableAlias ? item.tableAlias + '.' + item.id : item.id,
                key: item.aliasName ? item.aliasName : item.id,
                orderType: item.sortType === 0 ? 2 : 1
              }
              this.orderCondition.push(order);
              // this.$set(this, 'defaultSort', {
              //     key: item.aliasName ? item.aliasName : item.id,
              //     order: item.sortType === 0 ? 'descending' : 'ascending'
              // })
              // this.$refs.listTable.sort(order.key, order.orderType);
            }
          })
        }
      })
    },
    reset() {
      this.$refs.BoContainer.resetPage();
      this.pageLimit = 10;
    },
    getList(queryParams) {
      let queryData = {
        queryParams: queryParams,
        pageNum: 1,
        pageSize: this.pageLimit,
        orderConditionList: this.orderCondition,
        runType: this.runType,
      }
      if (!queryParams) {
        queryData.queryParams = this.$refs.query.getListQueryParams()
      }
      this.queryData = queryData
      console.log('getList', queryData);
      getDynamicListData(this.businessConfigId, queryData).then(res => {
        if (res && res.data && res.data.list) {
          this.dynamicList = res.data.list;
          this.total = res.data.total;
        }
      })
    },
    downloadExcel(withQueryParam, sheetName = 'sheet1', downloadName) {
      let queryData = {
        orderConditionList: this.orderCondition,
        runType: this.runType,
        withQueryParam: withQueryParam,
        sheetName: sheetName
      }
      queryData.queryParams = this.$refs.query.getListQueryParams()
      this.queryData = queryData;
      console.log('downloadExcel', queryData);
      axios({
        method: 'post',
        url: window.globalEnv.VUE_APP_BASE_API + '/dbConfig/getDynamicListDataExcel/' + this.businessConfigId,
        responseType: 'blob',
        headers: {'Authorization': 'Bearer ' + getToken()},
        data: queryData
      }).then(async (res) => {
        const blob = new Blob([res.data])
        this.saveAs(blob, decodeURIComponent(downloadName + ".xlsx"))
      })
    },
    saveAs(blob, filename) {
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
    },
    getQueryParams() {
      return this.$refs.query.getListQueryParams();
    },
    changePage(e) {
      let queryData = {
        queryParams: this.$refs.query.getListQueryParams(),
        pageNum: e.page,
        pageSize: e.limit,
        orderConditionList: this.orderCondition,
        runType: this.runType,
      }
      this.pageLimit = e.limit;
      getDynamicListData(this.businessConfigId, queryData).then(res => {
        if (res && res.data && res.data.list) {
          this.dynamicList = res.data.list;
          this.total = res.data.total;
        }
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selection = selection;
      this.$emit('handleSelectionChange', selection);
    },
    getSelection() {
      return this.selection;
    },
    sortChange(v1, v2) {
      console.log('sortChange', v1, v2);
      console.log('sortChange', v1, this.finalTableConfig.allColumns);
      let keyName = v1.prop;
      let mateColumnConfig = this.finalTableConfig.allColumns.filter(item => item.id === v1.prop);
      console.log('mateColumnConfig', mateColumnConfig, this.finalTableConfig);
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
        let temp = this.orderCondition.filter(item => item.key === keyName);
        console.log('sortChange1', temp, this.orderCondition, this.orderCondition.filter(item => item.key !== keyName));
        if (temp.length === 0) {
          this.orderCondition.unshift(order);
        } else {
          this.orderCondition = this.orderCondition.filter(item => item.key !== keyName);
          this.orderCondition.unshift(order);
        }
      } else {
        this.orderCondition = this.orderCondition.filter(item => item.key !== keyName);
      }
      this.getList();
    },
    showConfig() {

    },
    tableColumnsConfig() {
      this.showTableColumnConfig = true;
    },
    closeTableColumnsConfig() {
      this.showTableColumnConfig = false;
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    // this.aa()
  },
  //生命周期 - 创建之前
  beforeCreate() {
  },
  //生命周期 - 挂载之前
  beforeMount() {
  },
  //生命周期 - 更新之前
  beforeUpdate() {
  },
  //生命周期 - 更新之后
  updated() {
    if (this.$refs.listTable && this.$refs.listTable.doLayout) {
      this.$refs.listTable.doLayout();
    }
  },
  //生命周期 - 销毁之前
  beforeDestroy() {
  },
  //生命周期 - 销毁完成
  destroyed() {
  },
  //如果页面有keep-alive缓存功能，这个函数会触发
  activated() {
  }
};
</script>

<style lang="less" scoped>
.toolarea {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

:deep(.el-button+.el-button),
.el-checkbox.is-bordered + .el-checkbox.is-bordered {
  margin-left: 0 !important;
  margin-right: 10px !important;
}

:deep(.el-button--text) {
  margin-right: 10px !important;
}
</style>

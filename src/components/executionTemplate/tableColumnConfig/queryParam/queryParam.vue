<template>
  <div>
    <el-form
        ref="queryForm"
        :model="queryParams"
        class="demo-ruleForm"
        label-position="right"
        label-width="100px"
    >
      <el-row v-if="!getShowQueryPanel">
        <el-col
            v-for="item in getRenderQueryParam"
            v-show="!item.searchHidden"
            :span="item.gridWidth ? item.gridWidth : 6"
        >
          <renderFormItem
              :cacheRemoteDataSource="cacheRemoteDataSource"
              :item="item"
              :pickerRangeOptions="pickerRangeOptions"
              :queryParams="queryParams"
              @getList="getList"
          />
        </el-col>
        <el-col :span="6" style="margin-top: 5px">
          <el-button
              icon="el-icon-search"
              size="mini"
              style="margin:0 1rem"
              type="primary"
              @click="getList"
          >搜索
          </el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置
          </el-button
          >
        </el-col>
      </el-row>
      <el-row v-else>
        <div class="dongtai-grid-container">
          <div class="dgc-list" style="width: 100%">
            <el-col
                v-for="item in getRenderQueryParam"
                v-show="!item.searchHidden"
                :span="item.gridWidth ? item.gridWidth : 6"
            >
              <renderFormItem
                  :cacheRemoteDataSource="cacheRemoteDataSource"
                  :item="item"
                  :pickerRangeOptions="pickerRangeOptions"
                  :queryParams="queryParams"
                  @getList="getList"
              />
            </el-col>
          </div>
          <div class="dgc-button">
            <el-button
                icon="el-icon-search"
                size="mini"
                style="margin:0 0.6rem"
                type="primary"
                @click="getList"
            >搜索
            </el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >重置
            </el-button
            >
            <el-button
                icon="el-icon-s-operation"
                size="mini"
                @click="showMorePanel = true"
            >高级搜索
            </el-button
            >
          </div>
        </div>
      </el-row>
    </el-form>

    <div class="kevin_drawer">
      <el-drawer
          :show-close="false"
          :visible.sync="showMorePanel"
          :wrapperClosable="false"
          close-on-press-escape
          custom-class="customerdraw"
          destroy-on-close
          direction="rtl"
          size="40%"
          @close="showMorePanel = false"
      >
        <div ref="kevin_drawer_head" slot="title" class="kevin_drawer_head">
          <span class="drawertitle">高级搜索</span>
          <div class="kevin_top_buttons">
            <el-button
                icon="el-icon-search"
                size="small"
                style="margin-right: 0.6rem"
                type="primary"
                @click="getList"
            >搜索
            </el-button
            >
            <el-button icon="el-icon-refresh" size="small" @click="resetQuery"
            >重置
            </el-button
            >
            <el-button
                icon="el-icon-close"
                size="small"
                @click="showMorePanel = false"
            >取消
            </el-button
            >
          </div>
        </div>
        <div ref="kevin_drawer_body" class="kevin_drawer_body">
          <el-form
              ref="queryFormMore"
              :model="queryParams"
              label-position="right"
          >
            <el-row>
              <el-col v-for="item in getQueryParam">
                <el-form-item
                    v-show="!item.searchHidden"
                    :label="item.label"
                    :label-width="
                    item.labelWidth ? item.labelWidth + 'px' : '120px'
                  "
                >
                  <el-input
                      v-if="item.searchType === 0"
                      v-model="queryParams[item.id]"
                      :clearable="true"
                      placeholder="请输入查询条件"
                      size="medium"
                      @keyup.enter.native="getList"
                  />

                  <el-select
                      v-else-if="item.searchType === 2"
                      v-model="queryParams[item.id]"
                      :clearable="true"
                      :multiple="item.multipleOptions === 2"
                      :placeholder="'请选择查询逻辑'"
                      filterable
                      placeholder="请选择"
                      size="medium"
                      @keyup.enter.native="getList"
                  >
                    <el-option
                        v-for="subItem in item.staticOptions"
                        v-if="item.selectOptionType === 1"
                        :key="subItem.key"
                        :label="subItem.label"
                        :value="subItem.key"
                    />
                    <el-option
                        v-for="subItem in cacheRemoteDataSource[item.dynamicUrl]"
                        v-if="item.selectOptionType === 2"
                        :key="subItem.key"
                        :label="subItem.label"
                        :value="subItem.key"
                    />
                    <el-option
                        v-for="subItem in cacheRemoteDataSource[
                        item.bindDataSourceId
                      ]"
                        v-if="item.selectOptionType === 3"
                        :key="subItem.key"
                        :label="subItem.label"
                        :value="subItem.key"
                    />
                  </el-select>
                  <selectTree
                      v-else-if="item.searchType === 7"
                      v-model="queryParams[item.id]"
                      :clearable="true"
                      :config="item"
                      :dataSource="cacheRemoteDataSource[item.bindDataSourceId]"
                      :placeholder="'请选择查询逻辑'"
                      filterable
                      placeholder="请选择"
                      size="medium"
                      @keyup.enter.native="getList"
                  ></selectTree>

                  <el-input-number
                      v-else-if="item.searchType === 1 && item.searchLogic !== 7"
                      v-model="queryParams[item.id]"
                      controls-position="right"
                  />

                  <el-row
                      v-else-if="item.searchType === 1 && item.searchLogic === 7"
                  >
                    <el-col :span="24">
                      <NumberRange
                          v-model="queryParams[item.id]"
                          :clearable="true"
                          style="width: 100%"
                          @keyup.enter.native="getList"
                      />
                    </el-col>
                  </el-row>
                  <el-row v-else-if="item.searchType === 4">
                    <el-col :span="24">
                      <el-time-picker
                          v-if="item.searchLogic !== 7"
                          v-model="queryParams[item.id]"
                          :clearable="true"
                          placeholder="请选择时间"
                          size="medium"
                          style="width: 100%"
                          value-format="HH:mm:ss"
                          @keyup.enter.native="getList"
                      />
                      <el-time-picker
                          v-if="item.searchLogic === 7"
                          v-model="queryParams[item.id]"
                          :clearable="true"
                          end-placeholder="结束时间"
                          is-range
                          placeholder="选择时间范围"
                          range-separator="至"
                          size="medium"
                          start-placeholder="开始时间"
                          style="width: 100%"
                          value-format="HH:mm:ss"
                          @keyup.enter.native="getList"
                      />
                    </el-col>
                  </el-row>
                  <el-row v-else-if="item.searchType === 5">
                    <el-col :span="24">
                      <el-date-picker
                          v-if="item.searchLogic !== 7 && item.searchLogic !== 9"
                          v-model="queryParams[item.id]"
                          :clearable="true"
                          :default-time="['00:00:00', '23:59:59']"
                          :picker-options="pickerOptions"
                          align="right"
                          placeholder="选择日期"
                          size="medium"
                          style="width: 100%"
                          type="date"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          @keyup.enter.native="getList"
                      />
                      <el-date-picker
                          v-if="item.searchLogic === 7 || item.searchLogic === 9"
                          v-model="queryParams[item.id]"
                          :clearable="true"
                          :default-time="['00:00:00', '23:59:59']"
                          :picker-options="pickerRangeOptions"
                          align="right"
                          end-placeholder="结束日期"
                          range-separator="至"
                          size="medium"
                          start-placeholder="开始日期"
                          style="width: 100%"
                          type="daterange"
                          unlink-panels
                          value-format="yyyy-MM-dd HH:mm:ss"
                          @keyup.enter.native="getList"
                      />
                    </el-col>
                  </el-row>
                  <el-row v-else-if="item.searchType === 6">
                    <el-col :span="24">
                      <el-date-picker
                          v-if="item.searchLogic !== 7 && item.searchLogic !== 9"
                          v-model="queryParams[item.id]"
                          :clearable="true"
                          :picker-options="pickerOptions"
                          align="right"
                          placeholder="选择日期时间"
                          size="medium"
                          style="width: 100%"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          @keyup.enter.native="getList"
                      />
                      <el-date-picker
                          v-if="item.searchLogic === 7 || item.searchLogic === 9"
                          v-model="queryParams[item.id]"
                          :clearable="true"
                          :picker-options="pickerRangeOptions"
                          align="right"
                          end-placeholder="结束日期"
                          range-separator="至"
                          size="medium"
                          start-placeholder="开始日期"
                          style="width: 100%"
                          type="datetimerange"
                          unlink-panels
                          value-format="yyyy-MM-dd HH:mm:ss"
                          @keyup.enter.native="getList"
                      />
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import {
  getPageConfig,
  getDynamicData,
  getExecutionList,
  submitProcess,
} from "@/api/runDynamicPage/config";
import {getBusinessData} from "@/api/tableColumnConfig/api.js";

import NumberRange from "@/components/executionTemplate/tableColumnConfig/queryParam/NumberRange.vue";
import selectTree from "@/components/executionTemplate/tableColumnConfig/queryParam/selectTree.vue";

import moment from "moment";
import renderFormItem from "./components/renderFormItem.vue";

export default {
  name: "queryParam",
  components: {
    NumberRange,
    selectTree,
    renderFormItem,
  },
  props: {
    finalTableConfig: {
      type: Object,
      default: null,
    },
    businessConfigId: String,
  },
  data() {
    return {
      queryParams: {},
      defaultQueryParams: {},
      cacheRemoteDataSource: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },

      pickerRangeOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      showMorePanel: false,
    };
  },
  //计算属性 类似于data概念
  computed: {
    getQueryParam() {
      console.log("getQueryParam finalTableConfig", this.finalTableConfig);
      if (this.finalTableConfig && this.finalTableConfig.allColumns) {
        let queryConfigList = this.finalTableConfig.allColumns.filter(
            (item) => item.search && !item.searchHidden
        );
        console.log("getQueryParam", queryConfigList);
        if (queryConfigList.length < 2) {
          return queryConfigList;
        }
        queryConfigList.sort((a, b) => {
          let numA = a.queryOrderIndex ?? 0;
          let numB = b.queryOrderIndex ?? 0;
          if (numA < numB) {
            return 1;
          } else {
            return -1;
          }
        });
        return queryConfigList;
      }
      return null;
    },
    getShowQueryPanel() {
      let gridWidth = 0;
      if (this.getQueryParam) {
        for (let i = 0; i < this.getQueryParam.length; i++) {
          if (this.getQueryParam[i].gridWidth) {
            gridWidth += this.getQueryParam[i].gridWidth;
          } else {
            gridWidth += 6;
          }
        }
      }
      return gridWidth > 24 && this.finalTableConfig.showMorePanel;
    },
    getRenderQueryParam() {
      let gridWidth = 0;
      let index = 0;
      console.log("getRenderQueryParam", gridWidth, index, this.getQueryParam);
      if (!this.getQueryParam) {
        return null;
      }
      for (let i = 0; i < this.getQueryParam.length; i++) {
        if (this.getQueryParam[i].gridWidth) {
          gridWidth += this.getQueryParam[i].gridWidth;
        } else {
          gridWidth += 6;
        }
        if (gridWidth > 24) {
          console.log("getRenderQueryParam", index);
          break;
        }
        index++;
      }
      console.log(
          "getRenderQueryParam",
          this.getQueryParam,
          this.getQueryParam.slice(0, index)
      );
      return this.finalTableConfig.showMorePanel
          ? this.getQueryParam.slice(0, index)
          : this.getQueryParam;
    },
  },
  //监控data中的数据变化
  watch: {
    businessConfigId(v) {
      this.queryParams = {};
    },
    finalTableConfig(val) {
      let queryConfigList = val.allColumns.filter((item) => item.search);
      queryConfigList.forEach((item) => {
        if (item.hasOwnProperty("sysQueryType")) {
          if (item.sysQueryType) {
            if (item.sysQueryValue === 0) {
              this.$set(
                  this.queryParams,
                  item.id,
                  this.$store.state.user.userInfo.userId
              );
            } else if (item.sysQueryValue === 1) {
              this.$set(
                  this.queryParams,
                  item.id,
                  this.$store.state.user.userInfo.nickName
              );
            } else if (item.sysQueryValue === 2) {
              this.$set(
                  this.queryParams,
                  item.id,
                  this.$store.state.user.userInfo.dept.deptId
              );
            } else if (item.sysQueryValue === 3) {
              this.$set(
                  this.queryParams,
                  item.id,
                  this.$store.state.user.userInfo.dept.deptName
              );
            }
          } else if (item.hasOwnProperty("defaultQueryValue")) {
            this.$set(this.queryParams, item.id, item.defaultQueryValue);
          }
        } else if (item.searchLogic === 9) {
          console.log("动态日期区间", item.dynamicDateType);
          let result = [];
          let startDate, endDate, startDateTime, endDateTime;
          switch (item.dynamicDateType) {
            case 0:
              startDate = new Date(
                  new Date(
                      new Date() - (new Date().getDay() - 1) * 24 * 60 * 60 * 1000
                  ).setHours(0, 0, 0)
              );
              startDateTime =
                  moment(startDate).format("YYYY-MM-DD") + " 00:00:00";
              endDate = new Date(
                  new Date().setHours(23, 59, 59) +
                  (7 - new Date().getDay()) * 24 * 60 * 60 * 1000
              );
              endDateTime = moment(endDate).format("YYYY-MM-DD") + " 23:59:59";
              result.push(startDateTime);
              result.push(endDateTime);
              break;
            case 1:
              startDate = new Date(
                  new Date(
                      new Date(
                          new Date().getFullYear(),
                          new Date().getMonth(),
                          1
                      ).setHours(0, 0, 0)
                  )
              );
              startDateTime =
                  moment(startDate).format("YYYY-MM-DD") + " 00:00:00";
              endDate = new Date(
                  new Date(
                      new Date().getFullYear(),
                      new Date().getMonth() + 1,
                      0
                  ).setHours(23, 59, 59, 59)
              );
              endDateTime = moment(endDate).format("YYYY-MM-DD") + " 23:59:59";
              result.push(startDateTime);
              result.push(endDateTime);
              break;
            case 2:
              const time = {};
              const date = new Date();
              const month = date.getMonth();
              const quarter = Math.floor(month / 3) + 1; // 从1开始，到4
              const startMonth = quarter * 3 - 2;
              const lastMonth = quarter * 3;
              date.setMonth(startMonth - 1);
              const startDay = date.setDate(1);
              time.dateForm =
                  moment(startDay).format("YYYY-MM-DD") + " 00:00:00";
              date.setMonth(lastMonth);
              const lastDay = date.setDate(0);
              time.dateTo = moment(lastDay).format("YYYY-MM-DD") + " 23:59:59";
              console.log(time);
              result.push(time.dateForm);
              result.push(time.dateTo);
              break;
            default:
              break;
          }
          this.$set(this.queryParams, item.id, result);
        } else if (item.searchLogic === 10) {
          console.log("动态日期", item.dynamicDateType);
          let result = "";
          let startDate;
          switch (item.dynamicDateType) {
            case 0:
              startDate = new Date().setHours(0, 0, 0);
              result = moment(startDate).format("YYYY-MM-DD") + " 00:00:00";
              break;
            case 1:
              startDate = new Date(
                  new Date(
                      new Date() - (new Date().getDay() - 1) * 24 * 60 * 60 * 1000
                  ).setHours(0, 0, 0)
              );
              result = moment(startDate).format("YYYY-MM-DD") + " 00:00:00";
              break;
            case 2:
              startDate = new Date(
                  new Date(
                      new Date(
                          new Date().getFullYear(),
                          new Date().getMonth(),
                          1
                      ).setHours(0, 0, 0)
                  )
              );
              result = moment(startDate).format("YYYY-MM-DD") + " 00:00:00";
              break;
            case 3:
              const date = new Date();
              const month = date.getMonth();
              const quarter = Math.floor(month / 3) + 1; // 从1开始，到4
              const startMonth = quarter * 3 - 2;
              date.setMonth(startMonth - 1);
              const startDay = date.setDate(1);
              result = moment(startDay).format("YYYY-MM-DD") + " 00:00:00";
              break;
            default:
              break;
          }
          this.$set(this.queryParams, item.id, result);
        } else if (item.hasOwnProperty("defaultQueryValue")) {
          this.$set(this.queryParams, item.id, item.defaultQueryValue);
        }
        if (item.hasOwnProperty("selectOptionType")) {
          if (item.selectOptionType === 1) {
            item.staticOptions.forEach((subItem) => {
              if (subItem.default) {
                this.$set(this.queryParams, item.id, subItem.key);
              }
            });
          } else {
            this.loadRemoteDataSource(item);
          }
        }
      });
      Object.assign(this.defaultQueryParams, this.queryParams);
      this.getList();
    },
  },
  //方法集合
  methods: {
    getList() {
      for (let key in this.queryParams) {
        console.log(
            key,
            this.queryParams[key],
            this.queryParams[key] === null,
            this.queryParams[key] === undefined,
            this.queryParams[key] === ""
        );
        if (
            this.queryParams[key] === null ||
            this.queryParams[key] === undefined ||
            this.queryParams[key] === ""
        ) {
          delete this.queryParams[key];
        }
      }
      this.$emit("getList", this.queryParams);
      this.showMorePanel = false;
    },
    resetQuery() {
      // let queryConfigList = this.finalTableConfig.allColumns.filter(item => item.search);
      // queryConfigList.forEach(item => {
      //   if(item.hasOwnProperty('defaultQueryValue')){
      //     this.$set(this.queryParams, item.id, item.defaultQueryValue);
      //   }
      //   if(item.hasOwnProperty('selectOptionType')){
      //     if(item.selectOptionType === 1){
      //       item.staticOptions.forEach(subItem => {
      //         if(subItem.default){
      //           this.$set(this.queryParams, item.id, subItem.key);
      //         }
      //       })
      //     }else{
      //       this.loadRemoteDataSource(item);
      //     }
      //   }
      // })
      let tempQueryParam = {};
      Object.assign(tempQueryParam, this.defaultQueryParams);
      for (let key in tempQueryParam) {
        console.log(
            key,
            tempQueryParam[key],
            tempQueryParam[key] === null,
            tempQueryParam[key] === undefined,
            tempQueryParam[key] === ""
        );
        if (
            tempQueryParam[key] === null ||
            tempQueryParam[key] === undefined ||
            tempQueryParam[key] === ""
        ) {
          delete tempQueryParam[key];
        }
      }
      this.$set(this, "queryParams", tempQueryParam);
      this.$emit("reset");
      // this.resetForm("queryForm");
      this.getList();
    },
    getListQueryParams() {
      return this.queryParams;
    },
    loadRemoteDataSource(item) {
      console.log("loadRemoteDataSource", item);
      if (
          item.searchType === 2 &&
          item.selectOptionType === 2 &&
          (!this.cacheRemoteDataSource ||
              !this.cacheRemoteDataSource[item.dynamicUrl] ||
              this.cacheRemoteDataSource[item.dynamicUrl].length < 1)
      ) {
        getDynamicData(item.dynamicUrl).then((res) => {
          let dataSource = [];
          if (res && res.data) {
            res.data.forEach((row, key) => {
              dataSource.push({
                key: row[item.dynamicKeyName],
                value: row[item.dynamicKeyName],
                label: row[item.dynamicLabelName],
              });
            });
          }
          this.$set(this.cacheRemoteDataSource, item.dynamicUrl, dataSource);
        });
      } else if (item.searchType === 7 || item.selectOptionType === 3) {
        getBusinessData(item.bindDataSourceId).then((res) => {
          console.log("loadRemoteDataSource getBusinessData", res);
          if (res && res.data) {
            let tempOptions = res.data[item.selectTreeLabel];
            console.log("loadRemoteDataSource tempOptions", tempOptions);
            let dataSource = [];
            if (tempOptions instanceof Array) {
              tempOptions.forEach((record) => {
                dataSource.push({
                  key: record[item.dataSourceKey],
                  value: record[item.dataSourceKey],
                  label: record[item.dataSourceLabel],
                  parentId: record[item.dataSourceParentKey],
                });
              });
            } else if (tempOptions instanceof Object) {
              dataSource.push({
                key: tempOptions[item.dataSourceKey],
                value: tempOptions[item.dataSourceKey],
                label: tempOptions[item.dataSourceLabel],
              });
            }
            this.$set(
                this.cacheRemoteDataSource,
                item.bindDataSourceId,
                dataSource
            );
          }
        });
      }
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
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
  },
  //生命周期 - 销毁之前
  beforeDestroy() {
  },
  //生命周期 - 销毁完成
  destroyed() {
  },
  //如果页面有keep-alive缓存功能，这个函数会触发
  activated() {
  },
};
</script>


<style lang="less" scoped>
.kevin_drawer {
  width: 100%;
  height: 100%;
  overflow: hidden;

  :deep(.el-tree-node.is-current > .el-tree-node__content) {
    background-color: #4468ee !important;
    color: #ffd55e;
    font-size: 1.2rem;
    font-weight: bold;
    border-radius: 0.2rem;
  }

  :deep(.el-drawer) {
    padding: 0 !important;
    overflow: hidden;
  }

  :deep(.el-drawer__body) {
    overflow: hidden !important;
  }

  :deep(.el-form-item__content > div) {
    width: 98.5%;
  }

  :deep(.el-drawer__header) {
    padding: 0 !important;
    margin: 0 !important;
  }

  :deep(.el-form-item__content) {
    margin-left: 100px;
  }

  .kevin_drawer_head {
    width: 100%;
    height: 3.5rem;
    background-color: #fff;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #ebeef5;

    .kevin_top_buttons {
      width: 20%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      margin-right: 1rem;
    }
  }

  .kevin_drawer_body {
    width: 100%;
    height: 100%;
    /*background-color: #EBEEF5;*/
    overflow: hidden;
    padding: 0.5rem;

    .tree_area {
      width: 100%;
      height: 100%;
      overflow: auto;
      scrollbar-width: none;
      /* 隐藏标准滚动条（适用于Firefox） */
      -ms-overflow-style: none;

      /* 隐藏IE和Edge浏览器的滚动条 */

      &::-webkit-scrollbar {
        width: 0;
        /* 隐藏滚动条（适用于WebKit引擎，如Chrome和Safari） */
      }
    }
  }

  .drawertitle {
    margin-left: 1rem;
    font-size: 1rem;
    font-weight: 700;
  }
}

.dongtai-grid-container {
  width: 100%;
  height: 50px;
  display: grid;
  grid-template-columns: 3fr 1fr;

  .dgc-list {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .dgc-button {
    padding-top: 5.5px;
  }
}
</style>

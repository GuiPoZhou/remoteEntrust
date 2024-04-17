<template>
  <div class="app-container">
    <div class="baseInfo">
      <div class="header">
        <div class="hader-content">
          <span class="header-title">委托报检</span>
          <img
              alt=""
              class="header-image"
              src="../../../assets/image/header-img.png"
          />
        </div>
      </div>
      <div class="container">
        <el-form
            ref="queryForm"
            :inline="true"
            :model="queryData"
            label-width="90px"
            style="margin-top: 36px"
            @submit.native.prevent
        >
          <!-- 搜索栏 -->

          <el-row>
            <el-col :span="8">
              <el-form-item label="委托编号:" prop="idCode">
                <el-input
                    v-model="queryData.idCode"
                    class="rule-input"
                    placeholder="请输入搜索"
                    @keyup.enter.native="handleQuery"
                >
                  <i
                      slot="suffix"
                      class="el-input__icon el-icon-search"
                      @click="handleQuery"
                  ></i>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="overLable">
              <el-form-item label="委托单位名称:" prop="customerName">
                <el-input v-model="queryData.customerName" placeholder="请输入搜索">
                  <!--                  <el-option-->
                  <!--                    v-for="item in taskStatusList"-->
                  <!--                    :key="item.dictValue"-->
                  <!--                    :label="item.dictLabel"-->
                  <!--                    :value="Number(item.dictValue)"-->
                  <!--                  >-->
                  <!--                  </el-option>-->
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系人:" prop="customerContact">
                <el-input v-model="queryData.customerContact" placeholder="请输入搜索">
                  <!--                  <el-option-->
                  <!--                    v-for="item in serviceTypeList"-->
                  <!--                    :key="item.dictValue"-->
                  <!--                    :label="item.dictLabel"-->
                  <!--                    :value="item.dictValue"-->
                  <!--                  >-->
                  <!--                  </el-option>-->
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col v-if="this.$route.query.type !== 'return'" :span="8">
              <el-form-item label="电话:" prop="customerTel">
                <el-input v-model="queryData.customerTel" placeholder="请输入搜索">
                  <!--                  <el-option-->
                  <!--                    v-for="item in agreementStatusList"-->
                  <!--                    :key="item.dictValue"-->
                  <!--                    :label="item.dictLabel"-->
                  <!--                    :value="Number(item.dictValue)"-->
                  <!--                  >-->
                  <!--                  </el-option>-->
                </el-input>
              </el-form-item>
            </el-col>
            <el-col v-else :span="8" class="overLable">
              <el-form-item label="检测项目名称:" prop="measureItemName">
                <el-input v-model="queryData.measureItemName" placeholder="请输入搜索">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10.5">
              <el-form-item label="委托日期:" prop="commissionedDate">
                <el-date-picker
                    v-model="dateRange"
                    end-placeholder="结束日期"
                    size="small"
                    start-placeholder="开始日期"
                    type="datetimerange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-button
                    icon="el-icon-search"
                    size="small"
                    type="cyan"
                    @click="handleQuery"
                >搜索
                </el-button>
                <el-button
                    icon="el-icon-refresh"
                    size="small"
                    @click="resetQuery"
                >重置
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 统一样式 - 查询区域 按钮 -->
          <div class="a-c-t-btnarea"></div>
        </el-form>

        <div v-if="type !== 'return'" class="add-button">
          <el-button
              icon="el-icon-plus"
              size="small"
              type="primary"
              @click="handleAdd()"
          >
            新增委托
          </el-button>
        </div>
        <div class="a-c-bottom">
          <el-table
              ref="multipleTable"
              :cell-style="cellStyle"
              :data="tableData"
              border
              row-key="id"
              @row-click="rowClick"
              @expand-change="expandchange"
          >
            <el-table-column v-if="type == 'return'" :key="Math.random()" type="expand">
              <template v-slot="props">
                <el-table
                    v-if="type == 'return'"
                    :data="[props]"
                    style="margin-top: -5px;margin-bottom: -5px"
                >
                  <el-table-column align="center" label="样品编号" show-overflow-tooltip width="200">
                    {{ props.row.sampleId }}
                  </el-table-column>
                  <el-table-column align="center" label="检测项目" show-overflow-tooltip width="130">
                    {{ props.row.measureItemName }}
                  </el-table-column>
                  <el-table-column align="center" label="方法编号" show-overflow-tooltip width="100">
                    {{ props.row.methodStandardNo }}
                  </el-table-column>
                  <el-table-column align="center" label="方法名称" show-overflow-tooltip width="200">
                    {{ props.row.methodStandardName }}
                  </el-table-column>
                  <el-table-column align="center" label="不合格情况说明" show-overflow-tooltip width="120">
                    {{ props.row.nodescription }}
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column
                v-if="type !== 'return'"
                :show-overflow-tooltip="true"
                align="center"
                label="委托编号"
                prop="idCode"
                width="150"
            >
              <template scope="scope">
                <div
                    style="text-decoration: underline; cursor: pointer"
                    @click="detailEntrust(scope.row)"
                >
                  <el-tooltip
                      v-if="scope.row.status == 2"
                      :content="scope.row.actionRecord"
                      class="item"
                      effect="dark"
                      placement="top"
                  >
                    <i
                        :style="{ color: 'red' }"
                        class="el-icon-warning"
                        style="font-size: 135%"
                    />
                  </el-tooltip>
                  {{ scope.row.idCode }}
                </div>
              </template>
            </el-table-column>
            <el-table-column v-if="type === 'return'" align="center" label="委托编号" prop="taskId" width="200">
              <template v-slot="scope">
                {{ scope.row.taskId }}
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" label="委托单位名称" prop="customerName"
                             width="100"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" label="联系人" prop="customerContact"
                             width="100"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" label="电话" prop="customerTel"
                             width="119"></el-table-column>
            <el-table-column
                :formatter="comfirmFormatter"
                :show-overflow-tooltip="true"
                align="center"
                label="委托状态"
                prop="status"
                width="100"
            >
            </el-table-column>
            <el-table-column
                v-if="type !== 'return'"
                :formatter="agreementFormatter"
                :show-overflow-tooltip="true"
                align="center"
                label="委托书状态"
                prop="agreement"
                width="100"
            >
            </el-table-column>

            <el-table-column
                :formatter="dateFormatter"
                :show-overflow-tooltip="true"
                align="center"
                label="委托日期"
                prop="commissionedDate"
                width="150"
            >
            </el-table-column>
            <el-table-column
                v-if="type !== 'return'"
                :show-overflow-tooltip="true"
                align="center"
                label="应收金额"
                prop="receivableMoney"
                width="100"
            >
            </el-table-column>
            <el-table-column
                v-if="type !== 'return'"
                :show-overflow-tooltip="true"
                align="center"
                label="已收金额"
                prop="writeOffAmount"
                width="100"
            >
            </el-table-column>
            <el-table-column
                v-if="type !== 'return'"
                :show-overflow-tooltip="true"
                align="center"
                label="未收金额"
                prop="notOffMoney"
                width="100"
            >
            </el-table-column>
            <el-table-column
                v-if="type === 'return'"
                label="委托类型"
                prop="taskType"
            >
              <template v-slot="scope">
                普通委托
              </template>
            </el-table-column>

            <el-table-column v-if="type !== 'return'" fixed="right" label="操作" width="100">
              <template v-slot="scope">
                <el-button
                    v-show="scope.row.handler && scope.row.handler.edit"
                    icon="el-icon-edit"
                    size="small"
                    text type="primary"
                    @click="handleEdit(scope.row)"
                >编辑
                </el-button>
                <el-button
                    v-show=" scope.row.handler && scope.row.handler.clone"
                    icon="el-icon-document-copy"
                    size="small"
                    text type="primary"
                    @click="handleCopy(scope.row)"
                >复制
                </el-button>
                <el-button
                    v-show="scope.row.handler && scope.row.handler.recall"
                    icon="el-icon-refresh-right"
                    size="small"
                    text type="primary"
                    @click="handleRecall(scope.row)"
                >撤回
                </el-button>
                <el-button
                    v-show="scope.row.handler && scope.row.handler.delete"
                    icon="el-icon-delete"
                    size="small"
                    text type="primary"
                    @click="handleDetele(scope.row)"
                >删除
                </el-button>

                <el-button
                    v-show="
                 scope.row.handler &&    scope.row.handler.uploadAgreement ||
                  scope.row.handler &&     scope.row.handler.downloadAgreement
                  "
                    icon="el-icon-upload2"
                    size="small"
                    text type="primary"
                    @click="handleUploadDownBook(scope.row)"
                >委托书管理
                </el-button>

                <el-button
                    v-show="scope.row.handler && scope.row.handler.downReport"
                    icon="el-icon-download"
                    size="small"
                    text type="primary"
                    @click="handleDownReport(scope.row)"
                >下载报告
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <pagination
              v-show="total > 0"
              :limit.sync="queryData.pageSize"
              :page.sync="queryData.pageNum"
              :total="total"
              @pagination="changePage"
          />
        </div>
      </div>
    </div>
    <entrustBook :entrustBookShow.sync="entrustBookShow" :rowData="rowData"/>
    <downReport :downReportShow.sync="downReportShow" :rowData="rowData"/>
  </div>
</template>

<script>
import {
  tasksList,
  selectDict,
  cloneTask,
  recallTask, returnList
} from '@/api/index/index'
import {deleteTask} from "@/api/entrust/entrustConfirm";
import indexCustomerNav from "./indexCustomerNav.vue";
import entrustBook from "./components/entrustBook";
import downReport from "./components/downReport";
import dayjs from 'dayjs'

export default {
  name: "Index",
  components: {indexCustomerNav, entrustBook, downReport},
  data() {
    return {
      queryData: {
        idCode: "",
        pageNum: 1,
        pageSize: 10,
        status: "",
        serviceType: "",
        agreement: "",
        dateStart: "",
        dateEnd: "",
        customerName: "",
        commissionedDate: "",
        customerAddress: "",
        customerContact: "",
        customerTel: "",
        sampleForm: "",
        numberWeight: "",
        trademark: "",
        qualityGrade: "",
        specifications: "",
        batchNumber: "",
        identificationTag: "",
        producersName: "",
        producersAddress: "",
        sampLeStorageRequire: "",
        checkMoreSampleRefund: "",
        testMethods: "",
        measureItemName: "",
      },
      baseInfoShow: true,
      dateRange: [],

      tableData: [],
      total: 0,
      loading: false,
      taskStatusList: [],
      serviceTypeList: [],
      agreementStatusList: [],
      rowData: {}, //行数据
      entrustBookShow: false,
      downReportShow: false,
      type: null,
    };
  },
  methods: {
    //上传/下载委托书
    handleUploadDownBook(row) {
      this.rowData = row;
      this.entrustBookShow = true;
    },
    dateFormatter(row, column) {
      if (this.type === 'return') {
        return row.commissionedDate
      } else {
        if (row.createTime) {
          return row.createTime.substring(0, 10);
        } else {
          ("-");
        }
      }

    },
    detailEntrust(row) {
      if (!row || !row.idCode) return;
      this.$router.push({
        name: "entrustDetail",
        query: {taskIdCode: row.idCode, pageFlag: "view"}
      });
    },
    //列表委托扩展属性格式化
    extDataFormatter(row, column) {
      let property = column.property; //要提取的key
      if (!property) return "-";
      if (!row.extData) return "-";
      let extDataObj = JSON.parse(row.extData);
      if (!extDataObj) return "-";
      let extDataValue = extDataObj[property];
      if (!extDataValue) return "-";
      let returnValue = "-";
      if (property == "reports3") {
        //报告费用
        switch (extDataValue) {
          case "c1":
            returnValue = "即付";
            break;
          case "c2":
            returnValue = "银行转账";
            break;
          case "c3":
            returnValue = "定期结算";
            break;
          case "c4":
            returnValue = "从预付款扣";
            break;
        }
      } else if (property == "Reportcatalog") {
        //报告类别
        switch (extDataValue) {
          case "a1":
            returnValue = "非认证认可报告";
            break;
          case "a2":
            returnValue = "认证报告（含非认证项目）";
            break;
          case "a3":
            returnValue = "认可报告（含非认可项目）";
            break;
          case "a4":
            returnValue = "测试数据";
            break;
        }
      } else if (property == "taskType") {
        //委托类型  key和value相同
        returnValue = extDataValue;
      } else if (property == "reportosa") {
        // <el-option label="与委托方相同" value="z1"></el-option>
        //     <el-option label="其他" value="z2"></el-option>
        if (extDataValue == "z1") {
          returnValue = row.customerName;
        } else {
          returnValue = extDataObj.addressosaz;
        }
      }
      return returnValue;
    },
    //加急状态颜色
    cellStyle(row, column, rowIndex, columnIndex) {
      if (row.column.label === "加急状态") {
        const extData = JSON.parse(row.row.extData); //row.extData.serviceType
        let string = "-";
        let color = "#000000";
        if (typeof extData == "object" && extData) {
          if (extData.serviceType == "bz") {
            color = "#39BD65";
          } else if (extData.serviceType == "ts") {
            color = "#FFA033";
          } else if (extData.serviceType == "jj") {
            color = "#F05656";
          }
        }
        return `color:${color}`;
      }
    },
    //处理加急状态
    serviceTypeFormatter(row, column) {
      let keyVal = column.property.split(".");
      const extData = JSON.parse(row[keyVal[0]]); //row.extData.serviceType
      let string = "-";
      if (typeof extData == "object" && extData) {
        if (extData.serviceType == "bz") {
          string = "标准";
        } else if (extData.serviceType == "ts") {
          string = "加急";
        } else if (extData.serviceType == "jj") {
          string = "特急";
        } else if (extData.serviceType == "qt") {
          string = row[keyVal[0]].service_Type || "其他";
        }
      }
      return string;
    },
    //编辑
    handleEdit(row) {
      if (!row || !row.idCode) return;
      this.$router.push({
        name: "entrustDetail",
        query: {taskIdCode: row.idCode, pageFlag: "edit"}
      });
    },
    //复制
    handleCopy(row) {
      if (!row || !row.idCode) return;
      this.$confirm(`确认复制委托[编号:${row.idCode}]？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
          .then(() => {
            cloneTask(row.idCode).then(
                res => {
                  if (res.code == 200) {
                    this.msgSuccess("复制成功");
                    this.init();
                  }
                },
                err => {
                }
            );
          })
          .catch(function () {
          });
    },
    //撤回
    handleRecall(row) {
      if (!row || !row.idCode) return;
      this.$confirm(`确认撤回委托[编号:${row.idCode}]？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
          .then(() => {
            let params = {
              idCode: row.idCode
            };
            recallTask(params).then(res => {
              if (res.code == 200) {
                this.msgSuccess("撤回成功");
                this.init();
              }
            });
          })
          .catch(function () {
          });
    },
    //删除
    handleDetele(row) {
      if (!row || !row.idCode) return;
      this.$confirm(`确认删除委托[编号:${row.idCode}]？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
          .then(() => {
            deleteTask(row.idCode).then(res => {
              if (res.code == 200) {
                //删除新增时缓存的id标识
                if (localStorage.getItem("taskIdCode") && row.idCode === localStorage.getItem("taskIdCode")) {
                  localStorage.removeItem("taskIdCode");
                }
                this.msgSuccess("删除成功");
                this.init();
              }
            });
          })
          .catch(function () {
          });
    },
    //下载报告
    handleDownReport(row) {
      this.rowData = row;
      this.downReportShow = true;
    },
    //搜索按钮操作1
    handleQuery() {
      this.queryData.pageNum = 1;
      this.queryData.dateStart = "";
      this.queryData.dateEnd = "";
      if (this.dateRange && this.dateRange.length > 0) {
        this.queryData.dateStart = this.dateRange[0];
        this.queryData.dateEnd = this.dateRange[1];
        this.queryData.start = this.dateRange[0]
        this.queryData.end = this.dateRange[1]
      }
      localStorage.setItem(
          "task_page_queryData",
          JSON.stringify(this.queryData)
      );
      localStorage.setItem(
          "task_page_dateRange",
          JSON.stringify(this.dateRange)
      );

      if (this.type === 'return') {
        returnList(this.queryData).then(res => {
              if (res.code === 200) {
                console.log(res)
                this.tableData = res.data.rows
                this.total = res.data.total
                this.loading = false
              }
            },
            () => {
              // this.$store.dispatch("LogOut").then(() => {
              //   location.href = "/remote/login";
              // });
            }
        )
      } else {
        tasksList(this.queryData).then(
            res => {
              this.tableData = res.rows;
              this.total = res.total;
              this.loading = false;
            },
            err => {
              // this.$store.dispatch("LogOut").then(() => {
              //   location.href = "/remote/login";
              // });
            }
        );
      }
      //this.init();
    },
    //重置按钮操作
    resetQuery(methodMaintainForm) {
      this.dateRange = [];
      (this.queryData = {
        idCode: "",
        pageNum: 1,
        pageSize: 10,
        status: "",
        serviceType: "",
        agreement: "",
        dateStart: "",
        dateEnd: "",
        measureItemName: "",
        commissionedDate: "",
        customerTel: "",
        customerName: "",
        customerContact: "",
      }),
          this.$refs["queryForm"].resetFields();
      this.handleQuery();
    },
    //从本地存储中获取查询条件
    queryTaskByStorage() {
      let storageQueryData = JSON.parse(
          localStorage.getItem("task_page_queryData")
      );
      let storageDateRange = JSON.parse(
          localStorage.getItem("task_page_dateRange")
      );
      if (storageQueryData && storageDateRange) {
        // localStorage.removeItem("task_page_queryData");
        // localStorage.removeItem("task_page_dateRange");
        this.queryData = storageQueryData;
        this.dateRange = storageDateRange;
        tasksList(this.queryData).then(
            res => {
              this.tableData = res.rows;
              this.total = res.total;
              this.loading = false;
            },
            err => {
              // this.$store.dispatch("LogOut").then(() => {
              //   location.href = "/remote/login";
              // });
            }
        );
      } else {
        this.init();
      }
    },
    changePage(e) {
      this.queryData.pageNum = e.page
      this.queryData.pageSize = e.limit
      this.init()
    },
    //页面初始化
    init() {
      //路由参数
      this.type = this.$route.query.type
      let type = this.$route.query.type; //委托状态 or 委托书状态
      let value = this.$route.query.value; //状态值
      if (type == "status") {
        this.queryData.status = Number(value);
      } else if (type == "agreement") {
        this.queryData.agreement = Number(value);
      }
      this.loading = true;
      this.queryData.dateStart = "";
      this.queryData.dateEnd = "";
      if (this.dateRange && this.dateRange.length > 0) {
        this.queryData.dateStart = this.dateRange[0];
        this.queryData.dateEnd = this.dateRange[1];
      }
      this.$forceUpdate();
      if (type === 'return') {
        returnList().then(res => {
          if (res.code === 200) {
            this.tableData = res.data.rows
            this.total = res.data.total
            this.loading = false
            console.log(this.tableData)
            this.$nextTick(() => {
              this.$refs.multipleTable.doLayout()
            })
          }
        })
      } else {
        tasksList(this.queryData).then(
            res => {
              this.tableData = res.rows;
              this.total = res.total;
              this.loading = false;
              //渲染表格前就先把 样品名称和批次的html组织好
              if (this.tableData.length == 0) {
                return false;
              }
              for (let i = 0; i < this.tableData.length; i++) {
                let task = this.tableData[i];
                let sampleNameHtml = '';
                let sampleBatchHtml = '';
                if (task.sampleName && task.sampleBatch) {
                  let nameArray = task.sampleName.split(",")
                  let batchArray = task.sampleBatch.split(",")
                  nameArray.forEach((name) => {
                    sampleNameHtml += '<div v-html="true" style="text-align: left">' + name + '</div>'
                  });
                  batchArray.forEach((batch) => {
                    sampleBatchHtml += '<div v-html="true" style="text-align: left">' + batch + '</div>'
                  });
                }
                // if(task.samples && task.samples.length > 0){
                //   let sampleArray = task.samples;
                //   //<div  style="text-align: center">
                //   sampleArray.forEach((sample) => {
                //     if(sample.productionName){
                //       sampleNameHtml += '<div v-html="true" style="text-align: left">' + sample.productionName + '</div>'
                //     }else{
                //       sampleNameHtml += '<div v-html="true" style="text-align: left">' + '-' + '</div>'
                //     }
                //     if(sample.samplebatch){
                //       sampleBatchHtml += '<div v-html="true" style="text-align: left">' + sample.samplebatch + '</div>'
                //     }else{
                //       sampleBatchHtml += '<div v-html="true" style="text-align: left">' + '-' + '</div>'
                //     }
                //   });
                // }
                this.tableData[i]["sampleName"] = sampleNameHtml;
                this.tableData[i]["sampleBatch"] = sampleBatchHtml;
              }
            },
            err => {
              // this.$store.dispatch("LogOut").then(() => {
              //   location.href = "/remote/login";
              // });
            }
        );
      }

    },
    ////委托状态 加急状态 委托书状态
    selectDict() {
      selectDict().then(response => {
        if (response.code == 200) {
          console.log("selectDict");
          //委托
          this.taskStatusList = response.data.taskStatusList;
          //加急
          this.serviceTypeList = response.data.serviceTypeList;
          //委托书
          this.agreementStatusList = response.data.agreementStatusList;
          for (let i = 0; i < this.agreementStatusList; i++) {
            console.log(1);
            this.agreementStatusList[i].dictValue = Number(
                this.agreementStatusList[i].dictValue
            );
          }
          //this.$forceUpdate();
        }
      });
    },
    //委托状态
    comfirmFormatter(row, column) {
      /**
       * @params demand 预期完成时间
       * @params finish 完成时间
       * */
      if (this.type === 'return') {
        let demand = row.demandFinishDate
        let finish = row.finishTime
        if (demand && finish) {
          if (dayjs(demand) >= dayjs(finish)) return '已完成'
          if (dayjs(demand) < dayjs(finish)) return '超期完成'
        }
        if (demand && !finish) {
          let localTime = dayjs().format("YYYY-MM-DD HH:mm:ss")
          if (demand >= localTime) return '超期未完成'
          else return '进行中'
        }
        if (!demand && !finish) {
          return ''
        }
      } else {
        const statusProp = row[column.property];
        var string = null;
        if (statusProp == 0) {
          string = "暂存";
        } else if (statusProp == 1) {
          string = "撤回";
        } else if (statusProp == 2) {
          string = "退回";
        } else if (statusProp == 3) {
          string = "待受理";
        } else if (statusProp == 4) {
          string = "已受理";
        } else if (statusProp == 5) {
          string = "检测中";
        } else if (statusProp == 6) {
          string = "检验完成";
        } else if (statusProp == 7) {
          string = "作废";
        }
        return string;
      }

    },
    //委托书状态
    agreementFormatter(row, column) {
      const statusProp = row[column.property];
      var string = null;
      if (statusProp == 0) {
        string = "未上传";
      } else if (statusProp == 1) {
        string = "委托方上传";
      } else if (statusProp == 2) {
        string = "受理方上传";
      } else if (statusProp == 3) {
        string = "双方上传";
      }
      return string;
    },
    //新增委托
    handleAdd() {
      this.$router.push({
        name: "entrustDetail",
        query: {taskIdCode: -1, pageFlag: "edit"}
      });
    },
    // 点中当前行
    rowClick(row, column, event) {
      if (this.type != 'return') return
      else {
        this.$refs.multipleTable.toggleRowExpansion(row)
      }
    },
    expandchange() {
      if (this.type != 'return') return
    }
  },

  computed: {},
  created() {
  },
  mounted() {
    this.selectDict();
    //this.init();
    console.log("this.$route.meta.isBack=", this.$route.meta.isBack);
    if (this.$route.meta.isBack) {
      //从委托详情页面跳转回来    从本地存储中读取查询条件
      this.queryTaskByStorage();
    } else {
      localStorage.removeItem("task_page_queryData");
      localStorage.removeItem("task_page_dateRange");
      this.init();
    }
  },
  beforeRouteEnter(to, from, next) {
    if (from.name == "entrustDetail") {
      to.meta.isBack = true;
    } else {
      to.meta.isBack = false;
    }
    next();
  }
};
</script>

<style lang="less" scoped>
/deep/ .baseInfo {
  height: 100%;
  margin-top: 20px;
}

.header {
  width: 100%;
  height: 224px;
  padding-top: 44px;
  position: relative;
  background: linear-gradient(270deg,
  rgba(51, 119, 255, 0.93) 0%,
  #1f73f3 100%);
  display: flex;
  flex-direction: row;
  justify-content: center;

  .hader-content {
    width: 57.3%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .header-title {
      display: block;
      width: 400px;
      font-size: 26px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #ffffff;
    }

    .header-image {
      width: 312px;
      height: 156px;
    }
  }
}

/deep/ .container {
  width: 1090px;
  padding: 0 10px;
  height: 100%;
  background: #ffffff;
  position: absolute;
  margin-top: -70px;
  left: 50%;
  margin-left: -550px;
}

.entrustInfo-left {
  margin-left: 13%;
  margin-top: 30px;
}

//委托编号去掉input框
.rule-input {
  .el-input__inner {
    border: none;
    border-bottom: 1px solid #b4bccc;
    background-color: white;
  }
}

/*label过长*/
/deep/ .overLable .el-form-item--medium .el-form-item__label {
  line-height: 20px;
  text-align: right;
  padding-left: 10px;
}

.app-container {
}

.expandClass {
  table {
    margin-top: -5px;
    margin-bottom: -5px;
  }

  .table1 {
    width: 200px;
    text-align: center;
  }

  .table2 {
    width: 100px;
    text-align: center;
  }

  .table3 {
    width: 100px;
    text-align: center;
    overflow: auto;
  }
}

.el-table__expanded-cell {
  padding-top: 0;
}

.el-table--border th, .el-table--border td {
  border-right: none;
}
</style>

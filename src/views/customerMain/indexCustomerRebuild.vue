<template>
  <div class="app-container">
    <div class="app-index">
      <div class="app-left" style="width:19%">
        <div class="my-entrust">
          <p style="color:#1F2E4D"><b>我的委托</b></p>
          <p class="more" @click="jump2List('', '')">更多 ></p>
        </div>
        <div class="noConfirm">
          <p style="color:#1F2E4D">
            <b>报检统计</b>
            <el-date-picker
                v-model="reportTime"
                placeholder="选择日期"
                size="small"
                type="date"
                width="200px">
            </el-date-picker>
          </p>
          <!--<el-divider></el-divider>-->
          <div class="left-text" style="">
            <div @click="jump2List('status', 0)">
              <p style="color: #3377FF">
                {{ indexData.temporaryCount }}
              </p>

              <p class="left-title">暂存</p>
            </div>
            <!--            ddd-->
            <p style="color: #d3dbeb">|</p>
            <div @click="jump2List('status', 1)">
              <p style="color: #3377FF">{{ indexData.recallCount }}</p>
              <p class="left-title">已撤回</p>
            </div>
            <p style="color: #d3dbeb">|</p>
            <div @click="jump2List('status', 2)">
              <p style="color: #3377FF">{{ indexData.returnCount }}</p>
              <p class="left-title">被退回</p>
            </div>
          </div>
        </div>
        <div class="confirmed">
          <p style="color:#1F2E4D"><b>已提交</b></p>
          <div class="left-text">
            <div @click="jump2List('status', 3)">
              <p style="color: #39BD65">{{ indexData.submitCount }}</p>
              <p class="left-title">待受理</p>
            </div>
            <p style="color: #d3dbeb">|</p>
            <div @click="jump2List('status', 4)">
              <p style="color: #39BD65">
                {{ indexData.acceptedCount }}
              </p>
              <p class="left-title">已受理</p>
            </div>
            <p style="color: #d3dbeb">|</p>
            <div @click="jump2List('status', 5)">
              <p style="color: #39BD65">
                {{ indexData.detectingCount }}
              </p>
              <p class="left-title">检测中</p>
            </div>
            <p style="color: #d3dbeb">|</p>
            <div @click="jump2List('status', 6)">
              <p style="color: #39BD65">
                {{ indexData.detectedCount }}
              </p>
              <p class="left-title">已完成</p>
            </div>
          </div>
        </div>
        <div class="entrust-book">
          <p style="color:#1F2E4D"><b>委托书</b></p>
          <div class="left-text">
            <div @click="jump2List('agreement', 0)">
              <p style="color: #FFA033">
                {{ indexData.agreement0 }}
              </p>
              <p class="left-title">未上传</p>
            </div>
            <p style="color: #d3dbeb">|</p>
            <div @click="jump2List('agreement', 3)">
              <p style="color: #FFA033">
                {{ indexData.agreement3 }}
              </p>
              <p class="left-title">双方上传</p>
            </div>
          </div>
          <div class="left-text">
            <div @click="jump2List('agreement', 2)">
              <p style="color: #FFA033">
                {{ indexData.agreement2 }}
              </p>
              <p class="left-title">受理方上传</p>
            </div>
            <p style="color: #d3dbeb">|</p>
            <div @click="jump2List('agreement', 1)">
              <p style="color: #FFA033">
                {{ indexData.agreement1 }}
              </p>
              <p class="left-title">委托方上传</p>
            </div>
          </div>
        </div>
        <div class="returnPro">
          <p style="color:#1F2E4D"><b>不符合项</b></p>
          <div @click="jump2List('return', 1)">
            <p style="color: #3377FF">{{ returnProTotal }}</p>
            <p class="middle-title">总计</p>
          </div>
        </div>
      </div>
      <div class="app-middle">
        <div class="later-entrust">
          <p>近期委托</p>
          <p class="more" @click="jump2List('', '')">更多 ></p>
          <!-- 统一样式 - 主列表区域 -->
        </div>
        <div class="a-c-bottom" style="padding:10px">
          <el-table
              ref="multipleTable"
              :cell-style="cellStyle"
              :data="tableData"
              border
              style="width: 100%"
          >
            <el-table-column
                :show-overflow-tooltip="true"
                label="委托编号"
                prop="idCode"
                width="180"
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
            <el-table-column align="center" label="委托单位名称" prop="customerName">
            </el-table-column>
            <el-table-column align="center" label="联系人" prop="customerContact">
            </el-table-column>
            <el-table-column align="center" label="电话" prop="customerTel">
            </el-table-column>
            <el-table-column
                :formatter="comfirmFormatter"
                align="center"
                label="委托状态"
                prop="status"
            >
            </el-table-column>
            <el-table-column
                :formatter="agreementFormatter"
                align="center"
                label="委托书状态"
                prop="agreement"
            >
            </el-table-column>
            <el-table-column
                :formatter="dateFormatter"
                label="委托日期"
                prop="createTime"
            >
            </el-table-column>
            <el-table-column align="center" fixed="right" label="操作" width="150">
              <template v-slot="scope">
                <el-button
                    v-show="scope.row.handler.edit"
                    icon="el-icon-edit"
                    size="small"
                    type="text"
                    @click="handleEdit(scope.row)"
                >编辑
                </el-button>
                <el-button
                    v-show="scope.row.handler.clone"
                    icon="el-icon-document-copy"
                    size="small"
                    type="text"
                    @click="handleCopy(scope.row)"
                >复制
                </el-button>
                <el-button
                    v-show="scope.row.handler.recall"
                    icon="el-icon-refresh-right"
                    size="small"
                    type="text"
                    @click="handleRecall(scope.row)"
                >撤回
                </el-button>
                <el-button
                    v-show="scope.row.handler.delete"
                    icon="el-icon-delete"
                    size="small"
                    type="text"
                    @click="handleDetele(scope.row)"
                >删除
                </el-button>

                <el-button
                    v-show="
                    scope.row.handler.uploadAgreement ||
                      scope.row.handler.downloadAgreement
                  "
                    icon="el-icon-upload2"
                    size="small"
                    type="text"
                    @click="handleUploadDownBook(scope.row)"
                >委托书管理
                </el-button>

                <el-button
                    v-show="scope.row.handler.downReport"
                    icon="el-icon-download"
                    size="small"
                    type="text"
                    @click="handleDownReport(scope.row)"
                >下载报告
                </el-button>
                <!-- v-show="scope.row.handler.downReport" -->
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <pagination
              v-show="total > 0"
              :limit.sync="queryData.pageSize"
              :page.sync="queryData.pageNum"
              :total="total"
              @pagination="init()"
          />
        </div>
      </div>
      <div class="app-right">
        <div class="my-entrust">
          <p style="color:#1F2E4D"><b>常用工具</b></p>
        </div>
        <div class="alwayInfo" style="cursor: pointer">
          <div style="height: 79px;" @click="jump2Page('task')">
            <div
                style="border:1px solid #3377FF; width:80%;height: 55%;color:#3377FF;opacity: 1;border-radius: 1px;font-family: PingFangSC-Medium;"
            >
              新增委托
            </div>
          </div>
          <div
              v-hasRole="['companyAdmin']"
              class="menuList"
              @click="jump2Page('user')"
          >
            <img class="m-icon" src="../../../assets/image/add_user.png"/>
            <div class="m-right">
              <span style="color:#3D4966">添加用户</span>
              <p>></p>
            </div>
          </div>
          <div
              v-hasRole="['companyAdmin']"
              class="menuList"
              @click="jump2Page('company')"
          >
            <img
                class="m-icon"
                src="../../../assets/image/modify_company.png"
            />
            <div class="m-right">
              <span style="color:#3D4966">修改企业信息</span>
              <p>></p>
            </div>
          </div>
        </div>
        <div class="dataTip">
          <div class="dataInfo">
            {{ currentDate.year }}年{{ currentDate.month }}月
            {{ currentDate.week }}
          </div>
          <div class="dayInfo">
            <p style="font-size: 56px; line-height: 40px">
              {{ currentDate.date }}
            </p>
            <div>{{ indexData.lunarStr }}</div>
            <div>{{ indexData.ganzhiStr }}</div>
          </div>
        </div>
      </div>
      <entrustBook :entrustBookShow.sync="entrustBookShow" :rowData="rowData"/>
      <downReport :downReportShow.sync="downReportShow" :rowData="rowData"/>
    </div>
  </div>
</template>

<script>
import {
  tasksList,
  queryIndexData,
  cloneTask,
  recallTask, returnList
} from '@/api/index/index'
import {deleteTask} from "@/api/entrust/entrustConfirm";
import indexCustomerNav from "./indexCustomerNav";
import entrustBook from "./components/entrustBook";
import downReport from "./components/downReport";

export default {
  name: "Index",
  components: {indexCustomerNav, entrustBook, downReport},
  data() {
    return {
      total: 0,
      loading: false,
      tableData: [],
      //查询参数
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

      },
      activeIndex: "1",
      activeIndex2: "1",
      indexData: {}, //统计数据
      currentDate: {}, //年月日
      rowData: {}, //行数据
      entrustBookShow: false,
      downReportShow: false,
      returnProTotal: 0,
      reportTime: null,
    };
  },
  methods: {
    dateFormatter(row, column) {
      if (row.createTime) {
        return row.createTime.substring(0, 10);
      } else {
        ("-");
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
    jump2Page(pageValue) {
      if (pageValue == "user") {
        this.$router.push({
          name: "users",
          query: {addUserShow: true}
        });
      } else if (pageValue == "task") {
        this.$router.push({
          name: "entrustDetail",
          query: {taskIdCode: -1, pageFlag: "edit"}
        });
      } else if (pageValue == "company") {
        this.$router.push({
          name: "company"
        });
      }
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
    //计算当前年月日
    initDate() {
      let nowDate = new Date();
      let weeks = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六"
      ];
      this.currentDate.year = nowDate.getFullYear();
      this.currentDate.month = nowDate.getMonth() + 1;
      this.currentDate.date = nowDate.getDate();
      this.currentDate.weekIndex = nowDate.getDay();
      this.currentDate.week = weeks[this.currentDate.weekIndex];
    },
    //跳转至委托列表
    jump2List(type, value) {
      this.$router.push({
        name: "entrust",
        query: {type: type, value: value}
      });
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
    //上传/下载委托书
    handleUploadDownBook(row) {
      this.rowData = row;
      this.entrustBookShow = true;
    },
    //下载报告
    handleDownReport(row) {
      this.rowData = row;
      this.downReportShow = true;
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
    //委托状态
    comfirmFormatter(row, column) {
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
    //页面初始化
    init() {
      this.loading = true;
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
      queryIndexData().then(
          res => {
            this.indexData = res.data;
          },
          err => {
          }
      );
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    // 获取不符合项
    returnPro() {
      let obj = {
        pageSize: 10,
        pageNum: 1
      }
      returnList(obj).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.returnProTotal = res.data.total
        }
      })
    }
  },
  computed: {},
  created() {
    this.init();
    this.initDate();
    this.returnPro()
  },
  mounted() {
  }
};
</script>

<style lang="less" scoped>
/deep/ .app-index {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  font-size: 14px;
}

/deep/ .app-left,
.app-right {
  width: 15.8%;
  height: auto;
  background: #f6f6f8;
  border-radius: 1px;

  p {
    display: inline-block;
    padding-left: 10px;
  }

  .more {
    display: inline-block;
    padding-right: 10px;
    color: #8f9bb3;
    cursor: pointer;
  }

  .more:hover {
    color: #666666;
  }

  .my-entrust {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    background: #fff;
    margin-bottom: 3px;
    color: #1f2e4d;
  }

  .noConfirm,
  .confirmed {
    height: 158px;
    background: #fff;
    margin-bottom: 10px;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    p {
      border-bottom: 1px solid #f8f8f8;
      height: 40px;
    }

    .left-text {
      display: flex;
      justify-content: space-around;
      align-items: center;

      div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 80px;
        color: #8f9bb3;
        cursor: pointer;
      }

      div:hover {
        color: #666666;
      }
    }
  }

  .entrust-book {
    height: 213px;
    background: #fff;
    margin-bottom: 10px;

    .left-text {
      display: flex;
      justify-content: space-around;
      align-items: center;
      border-top: 1px solid #f6f6f8;

      div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 80px;
        color: #8f9bb3;
        cursor: pointer;
      }

      div:hover {
        color: #666666;
      }
    }
  }

  .entrust-book {
    margin-bottom: 0px;
  }
}

.returnPro {
  height: 180px;
  background: #fff;
  margin-top: 10px;

  div {
    font-size: 18px;
    width: 100px;
    margin: 0 auto;
    text-align: center;
    cursor: pointer;

    .middle-title {
      display: block;
      color: #8f9bb3;
    }

    p:hover {
      color: #666666;
    }

    .middle-title:hover {
      color: #666666;
    }
  }

}

/deep/ .app-middle {
  width: 55.5%;
  height: auto;
  background: #f6f6f8;
  margin-left: 13px;
  margin-right: 13px;
  margin-bottom: 23px;

  .later-entrust {
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;

    p {
      display: inline-block;
      padding-left: 27px;
    }

    .more {
      display: inline-block;
      padding-right: 10px;
      color: #8f9bb3;
      cursor: pointer;
    }

    .more:hover {
      color: #666666;
    }
  }
}

/deep/ .app-right {
  width: 15.8%;
  height: auto;
  background: #f6f6f8;
  border-radius: 1px;
}

/deep/ .app-right {
  .alwayInfo {
    div {
      height: 79px;
      background: #fff;
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-bottom: 5px;
    }

    div:hover {
      background: #f6f6f8;
    }
  }

  .dataTip {
    .dataInfo {
      background: #fff;
      height: 56px;
      margin-bottom: 5px;
      line-height: 56px;
      text-align: center;
      font-size: 16px;
      color: #1f2e4d;
    }

    .dayInfo {
      height: 168px;
      background: #ffffff;
      text-align: center;
      // line-height: 168px;
      font-size: 16px;
      // line-height: 84px;
      color: #1f2e4d;

      div {
        font-size: 14px;
        line-height: 14px;
        color: #3d4966;
      }

      div:nth-of-type(1) {
        margin-top: -40px;
        margin-bottom: 17px;
      }
    }
  }

  .number-color {
    color: #3377ff;
  }
}

.menuList {
  width: 100%;
  height: 35px !important;
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: space-between !important;
}

.m-icon {
  width: 18px;
  height: 18px;
  margin-left: 30px;
}

.m-right {
  flex: 1;
  height: 100% !important;
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: space-between !important;
  margin: 0 8px;
  margin-bottom: 0 !important;
}

.left-title {
  font-size: 12px
}
</style>

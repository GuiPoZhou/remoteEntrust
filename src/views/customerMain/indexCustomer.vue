<template>
  <div style="padding: 0">
    <div class="app-index">
      <el-row :gutter="10" class="row-bg" justify="space-around" type="flex">
        <el-col :lg="6" :md="24" :sm="24" :span="6" :xs="24" class="cm-center-left">
          <indexleft
              :reportStatis="reportStatis"
              ref="leftRef"
          />
        </el-col>
        <el-col :lg="12" :md="24" :sm="24" :span="12" :xs="24">
          <indexCenter
              :tableData="tableData"
              :checkRow="checkRow"
              @changePage="changePage"
              @evaluate="evaluate"
              :queryData="queryData"
              :total="total"
              @init="init"
          />
        </el-col>
        <el-col :lg="6" :md="24" :sm="24" :span="6" :xs="24" class="cm-center-right">
          <indexRight></indexRight>
        </el-col>
      </el-row>
      <entrustBook :entrustBookShow.sync="entrustBookShow" :rowData="rowData"/>
      <downReport :downReportShow.sync="downReportShow" :rowData="rowData"/>
      <indexEvaluate v-if="dialogShow" :dialogShow.sync="dialogShow"/>
    </div>

  </div>
</template>

<script>
import indexCustomerNav from "./indexCustomerNav.vue";
import entrustBook from "./components/entrustBook.vue";
import downReport from "./components/downReport.vue";
// index模板布局
import indexleft from './indexCustomerComponents/indexleft.vue'
import indexCenter from './indexCustomerComponents/indexCenter.vue'
import indexRight from './indexCustomerComponents/indexRight.vue'
import indexEvaluate from './indexCustomerComponents/indexEvaluate.vue'

export default {
  name: "Index",
  components: {
    indexCustomerNav,
    entrustBook,
    downReport,
    indexleft,
    indexCenter,
    indexRight,
    indexEvaluate,
  },
  data() {
    return {
      total: 0,
      loading: false,
      tableData: [],
      //查询参数
      queryData: {
        pageNum: 1,
        pageSize: 10,
        customerId: null,
        contactId: null,
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
      reportStatis: {
        temporaryCount: 0, //待提交
        submitCount: 0, //待受理
        returnCount: 0, //被退回
        acceptedCount: 0, //已受理
        detectingCount: 0, //检测中
        detectedCount: 0, //检测完成
      },
      dialogShow: false,// 评价页面
      checkRow: {},
      entrustShow: false,
      businessConfigId: null,
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
      this.getReportStatus()
    },
    changePage(e) {
      this.queryData.pageSize = e.limit
      this.queryData.pageNum = e.page
      this.init()
    },
    //左侧报告
    getReportStatus() {
      this.$net('/v1/entrustRemoteAgreement/indexData', 'get').then(res => {
        // console.log(res)
        if (res.code === 200) {
          this.reportStatis.temporaryCount = res.data.temporaryCount;
          this.reportStatis.submitCount = res.data.submitCount;
          this.reportStatis.returnCount = res.data.returnCount;
          this.reportStatis.acceptedCount = res.data.acceptedCount;
          this.reportStatis.detectingCount = res.data.detectingCount;
          this.reportStatis.detectedCount = res.data.detectedCount;
          this.$store.dispatch('getStaticData')
          this.getCenterData()
        }
      })
    },
    //中间委托
    getCenterData() {
      this.queryData.contactId = this.$store.state.user.user.userId
      this.queryData.customerId = this.$store.state.user.user.deptId
      this.$net('/v1/entrustRemoteAgreement/agreementList', 'get', this.queryData).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.total = res.total
          this.tableData = res.rows
        }
      })
    },
    //评价
    evaluate(row) {
      this.dialogShow = true
      this.checkRow = row
    },
    // 中间
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    // 获取不符合项
    returnPro() {

    }
  },
  computed: {},
  created() {
    this.init();
    this.returnPro()
  },
  mounted() {
  }
};
</script>

<style lang="less" scoped>
/deep/ .app-index {
  margin: 10px auto;
  width: 100%;
  //width: 80%;
  //display: flex;
  //justify-content: center;
  //margin-top: 20px;
  //font-size: 14px;
  .cm-center-left {
    display: flex;
    justify-content: flex-end;
  }
  .cm-center-right {
    display: flex;
    justify-content: flex-start;
  }
}
</style>

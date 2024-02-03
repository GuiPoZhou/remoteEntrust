<template>
  <div class="app-container">
    <!-- <div class="container"> -->
    <indexCustomerNav/>
    <el-tabs
        v-model="activeIndex"
        :tab-position="tabPosition"
        class="containerInfo"
        type="card"
        @tab-click="handleClick"
    >
      <div class="btns">
        <el-button type="" @click="close">返回</el-button>
        <el-button type="" @click="handleReject">暂存</el-button>
        <el-button type="primary" @click="handlePass">提交</el-button>
      </div>
      <el-tab-pane label="委托信息" name="entrustInfo">
        <div v-show="showSearch" class="a-c-top">
          <el-form
              v-show="showSearch"
              ref="tasks"
              :inline="true"
              :model="tasks"
              :rules="rules"
              class="tasks"
              label-width="140px"
              @submit.native.prevent
          >
            <div class="tipMessage" style="margin-bottom: 20px">
              <p>基本信息</p>
            </div>
            <el-form-item label="委托日期:">
              <el-input
                  v-model="extDataObj.commissionedDate"
                  disabled
                  style="width: 200px"
              >
              </el-input>
            </el-form-item>

            <el-form-item label="委托单号:">
              <el-input v-model="tasks.idCode" disabled style="width: 200px">
              </el-input>
            </el-form-item>
            <el-form-item label="委托方单号:" prop="projectcode">
              <el-input v-model="extDataObj.projectcode" clearable></el-input>
            </el-form-item>
            <el-form-item label="委托单位:" prop="customerName">
              <el-input v-model="tasks.customerName" clearable></el-input>
            </el-form-item>
            <el-form-item label="联系人:" prop="customerContact">
              <el-input v-model="tasks.customerContact" clearable></el-input>
            </el-form-item>
            <el-form-item label="联系电话:" prop="customerTel">
              <el-input v-model="tasks.customerTel" clearable></el-input>
            </el-form-item>
            <el-form-item label="联系地址:" prop="customerAddress">
              <el-input v-model="tasks.customerAddress" clearable></el-input>
            </el-form-item>
            <el-form-item label="邮编:" prop="taskPostCode">
              <el-input v-model="extDataObj.taskPostCode" clearable></el-input>
            </el-form-item>
            <el-form-item label="传真:" prop="taskFax">
              <el-input v-model="extDataObj.taskFax" clearable></el-input>
            </el-form-item>
            <el-form-item label="电子邮箱:" prop="customerEmail">
              <el-input v-model="extDataObj.customerEmail" clearable>
              </el-input>
            </el-form-item>
            <el-divider></el-divider>
            <div class="tipMessage" style="margin-bottom: 20px">
              <p>报告抬头</p>
            </div>
            <el-form-item label="报告抬头:" prop="reportosa">
              <!-- <el-input v-model="extDataObj.reportosa" clearable> </el-input> -->
              <div class="inputText">
                <el-select v-model="extDataObj.reportosa" placeholder="请选择">
                  <el-option label="与委托方相同" value="z1"></el-option>
                  <el-option label="其他" value="z2"></el-option>
                </el-select>
                <el-input
                    v-model="extDataObj.addressosaz"
                    clearable
                    placeholder="其他报告抬头"
                    style="width: 180px"
                >
                </el-input>
              </div>
            </el-form-item>
            <el-form-item label="报告联系人:" prop="customerContact">
              <el-input v-model="extDataObj.customerContact" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="报告联系地址:" prop="customerAddress">
              <el-input v-model="extDataObj.customerAddress" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="邮寄地址:" prop="report">
              <!-- <el-input v-model="extDataObj.report" clearable>
                </el-input> -->
              <div class="inputText">
                <el-select v-model="extDataObj.report" placeholder="请选择">
                  <el-option label="与联系地址相同" value="zq"></el-option>
                  <el-option label="其他" value="yj"></el-option>
                </el-select>
                <el-input
                    v-model="extDataObj.address"
                    clearable
                    placeholder="其他邮寄地址"
                    style="width: 180px"
                >
                </el-input>
              </div>
            </el-form-item>
            <el-divider></el-divider>
            <div class="tipMessage" style="margin-bottom: 20px">
              <p>服务要求</p>
            </div>
            <el-form-item label="测试方法:" prop="serviceTypes">
              <el-select v-model="extDataObj.serviceTypes" placeholder="请选择">
                <el-option label="委托方指定检验依据" value="wt"></el-option>
                <el-option
                    label="实验室选定检验项目或标准"
                    value="sy"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务时限:" prop="serviceType">
              <el-select v-model="extDataObj.serviceType" placeholder="请选择">
                <el-option label="标准（5个工作日）" value="bz"></el-option>
                <el-option
                    label="加急（3个工作日/加收50%检测费）"
                    value="ts"
                ></el-option>
                <el-option
                    label="特急（1个工作日/加收100%检测费）"
                    value="jj"
                ></el-option>
                <el-option label="其他" value="qt"></el-option>
              </el-select>
              <el-input
                  v-model="extDataObj.service_Type"
                  clearable
                  placeholder="其他服务时限"
                  style="width: 180px"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="委托书回执要求:" prop="ext_data">
              <el-select v-model="tasks.ext_data" placeholder="请选择">
                <el-option :value="0" label="无"></el-option>
                <el-option :value="1" label="有"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="判定依据:" style="margin-top: 10px">
              <el-radio-group v-model="extDataObj.reports1">
                <el-radio label="pd">不判定</el-radio>
                <el-radio label="bp">判定(委托方指定)</el-radio>
                <el-radio label="cp">判断(产品)标准</el-radio>
              </el-radio-group>
              <el-input
                  v-model="extDataObj.basisStandar"
                  clearable
                  placeholder="请输入标准"
                  style="width: 180px; margin-left: 10px"
              ></el-input>
            </el-form-item>
            <el-divider></el-divider>
            <div class="tipMessage" style="margin-bottom: 20px">
              <p>报告要求</p>
            </div>
            <el-form-item label="报告格式:">
              <el-radio-group v-model="extDataObj.reportformat">
                <el-radio label="zw">中文</el-radio>
                <el-radio label="yw">英文(加收 50元)</el-radio>
                <el-radio label="zy">中英文对照(加收 50元)</el-radio>
                <el-radio label="fy">附来样照片(加收 50元/张)</el-radio>
                <el-radio label="fb">副本(20元/份)</el-radio>
              </el-radio-group>
              <el-input-number
                  v-model="extDataObj.geshiNum"
                  :max="100"
                  :min="1"
                  :step-strictly="true"
                  controls-position="right"
                  @change="handleChange"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="报告类别:" prop="Reportcatalog">
              <el-select
                  v-model="extDataObj.Reportcatalog"
                  placeholder="请选择"
              >
                <el-option label="非认证认可报告" value="a1"></el-option>
                <el-option
                    label="认证报告（含非认证项目）"
                    value="a2"
                ></el-option>
                <el-option
                    label="认可报告（含非认可项目）"
                    value="a3"
                ></el-option>
                <el-option label="测试数据" value="a4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="报告发送:" prop="reports2">
              <div class="inputText">
                <el-select v-model="extDataObj.reports2" placeholder="请选择">
                  <el-option label="自取" value="b1"></el-option>
                  <el-option label="快递到付" value="b2"></el-option>
                  <el-option label="快递寄付（收20元）" value="b3"></el-option>
                  <el-option label="传真" value="b4"></el-option>
                  <el-option label="其他" value="b5"></el-option>
                </el-select>
                <el-input
                    v-model="extDataObj.send"
                    clearable
                    placeholder="其他报告发送方式"
                    style="width: 180px"
                >
                </el-input>
              </div>
            </el-form-item>
            <el-divider></el-divider>
            <div class="tipMessage" style="margin-bottom: 20px">
              <p>报告交付</p>
            </div>
            <el-form-item
                label="报告费用:"
                prop="reports3"
                style="margin-bottom: 10px"
            >
              <el-radio-group v-model="extDataObj.reports3">
                <el-radio label="c1">即付</el-radio>
                <el-radio label="c2">银行转账</el-radio>
                <el-radio label="c3">定期结算</el-radio>
                <el-radio label="c4">从预付款扣</el-radio>
              </el-radio-group>
              <el-input
                  v-model="extDataObj.Paycost"
                  clearable
                  placeholder="请输入协议编号"
                  style="width: 180px; margin-left: 10px"
              ></el-input>
            </el-form-item>

            <el-form-item label="发票抬头:" prop="reports4">
              <div class="inputText">
                <el-select v-model="extDataObj.reports4" placeholder="请选择">
                  <el-option label="与委托方相同" value="d1"></el-option>
                  <el-option label="其他" value="d2"></el-option>
                </el-select>
                <el-input
                    v-model="extDataObj.invoice"
                    clearable
                    placeholder="必须与付款方一致"
                    style="width: 180px"
                >
                </el-input>
              </div>
            </el-form-item>

            <el-form-item label="发票类别:" prop="reportes">
              <div class="inputText">
                <el-select v-model="extDataObj.reportes" placeholder="请选择">
                  <el-option label="普票" value="ea"></el-option>
                  <el-option
                      label="专票（需提供开票资料）"
                      value="ee"
                  ></el-option>
                </el-select>
                <el-input
                    v-model="extDataObj.categorys"
                    clearable
                    placeholder="请输入税号"
                    style="width: 180px"
                >
                </el-input>
              </div>
            </el-form-item>
            <el-form-item label="委托类型:" prop="taskType">
              <el-select v-model="extDataObj.taskType" placeholder="请选择">
                <el-option label="委托测试" value="委托测试"></el-option>
                <el-option label="委托检验" value="委托检验"></el-option>
                <el-option label="委托检测" value="委托检测"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注:" style="margin-left: 180px">
              <el-input
                  v-model="extDataObj.taskBeizhu"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  clearable
                  style="width: 380px"
                  type="textarea"
              >
              </el-input>
            </el-form-item>

            <el-divider></el-divider>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="样品信息" name="sampleInfo">
        <div class="a-c-bottom">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                  icon="el-icon-download"
                  size="mini"
                  type="primary"
                  @click="handleAdd"
              >
                新增样品
              </el-button>
            </el-col>
          </el-row>
          <el-table
              ref="multipleTable"
              :data="tableData"
              @selection-change="handleSelectionChange"
          >
            <el-table-column align="center" type="selection" width="55"/>
            <el-table-column label="序号" type="index" width="55"/>
            <el-table-column label="样品编号" prop="idCode"></el-table-column>
            <el-table-column label="样品名称" prop="productionName">
            </el-table-column>
            <el-table-column label="样品类别" prop="category">
            </el-table-column>
            <el-table-column label="样品量" prop="dataCount" width="150px">
            </el-table-column>
            <el-table-column
                label="检测项目数量"
                prop="itemCount"
                width="150px"
            >
              <template scope="scope">
                <div
                    style="
                    text-decoration: underline;
                    color: #1890ff;
                    cursor: pointer;
                  "
                    @click="detailItem(scope.row)"
                >
                  {{ scope.row.itemCount }}
                </div>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button
                    v-show="distinguishCode == 'noConfirm'"
                    size="mini"
                    type="text"
                    @click="handleEdit(scope.row)"
                >修改
                </el-button>
                <el-button
                    v-show="distinguishCode == 'confirmed'"
                    size="mini"
                    type="text"
                    @click="handleEdit(scope.row)"
                >查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <!-- <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="tasks.pageNum"
            :limit.sync="tasks.pageSize"
            @pagination="init(activeIndex, radio)"
          /> -->
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- </div> -->
    <!-- <selectItem :selectItemShow.sync="selectItemShow" :itemRowData='itemRowData' @init="init" />
    <editSample :editSampleShow.sync="editSampleShow" :taskIdCode = "tasks.idCode" :itemRowData='itemRowData'  @init="init" />
    <returnEntrust
      :returnEntrustShow.sync="returnEntrustShow"
      :rowData="rowData"
    /> -->
  </div>
</template>
<script>
import indexCustomerNav from "../indexCustomerNav";
// import editSample from "./editSample";
// import selectItem from "./selectItem";
// import returnEntrust from "./returnEntrust";
import {
  // getEntrustInfo,
  // getSamplesInfo,
  // confirmPass,
  // addTask,
} from "@/api/entrust/entrustConfirm";

export default {
  name: "noReceived",
  components: {
    indexCustomerNav
    // editSample,
    // returnEntrust,
    // selectItem,
  },
  data() {
    return {
      // 显示搜索条件
      showSearch: true,
      //委托信息的数据
      tasks: {
        pageNum: 1,
        pageSize: 10,
        idCode: "", //委托单号
        customerName: "", //委托单位
        customerContact: "", //联系人
        customerTel: "", //联系电话
        customerAddress: "", //联系地址
        ext_data: "", //委托书回执要求（没找到）
        extData: {}, //扩展属性
      },
      extDataObj: {
        commissionedDate: new Date().toLocaleDateString(), //委托日期(当前日期)
        reportosa: "", //报告抬头
        addressosaz: "", //报告抬头其他
        customerContact: "", //报告联系人
        taskFax: "", //传真
        customerAddress: "", //报告联系地址
        taskPostCode: "", //邮编
        report: "", //邮寄地址
        address: "", //邮寄地址其他
        customerEmail: "",

        projectcode: "", //委托方单号
        serviceTypes: "", //测试方法
        serviceType: "", //服务时限
        service_Type: "", //其他服务时限
        reports1: "", //判定依据
        basisStandar: "", //判断标准
        reportformat: [], //报告格式
        geshiNum: "", //选择多少份
        Reportcatalog: "", //报告类别
        reports2: "", //报告发送
        send: "", //报告发送其他
        reports3: 0, //报告费用
        Paycost: "", //协议编号
        reports4: "", //发票抬头
        invoice: "", //发票抬头其他
        reportes: "", //发票类型
        categorys: "",
        taskType: "", //委托类型
        taskBeizhu: "", //备注
      },
      rules: {
        customerTel: [
          {required: true, message: "请输入联系电话", trigger: "blur"},
        ],
        reportosa: [
          {required: true, message: "请输入报告抬头", trigger: "blur"},
        ],
        customerContact: [
          {required: true, message: "请输入报告联系人", trigger: "blur"},
        ],
        customerAddress: [
          {required: true, message: "请输入报告联系地址", trigger: "blur"},
        ],
        Reportcatalog: [
          {required: true, message: "请选择报告类别", trigger: "blur"},
        ],
        reports2: [
          {required: true, message: "请选择报告发送", trigger: "blur"},
        ],
        reports3: [
          {required: true, message: "请选择报告费用", trigger: "blur"},
        ],
        reports4: [
          {required: true, message: "请选择发票抬头", trigger: "blur"},
        ],
        reportes: [
          {required: true, message: "请选择发票类别", trigger: "blur"},
        ],
        taskType: [
          {required: true, message: "请选择委托类型", trigger: "blur"},
        ],
      },
      //样品信息数据
      tableData: [],
      activeIndex: "entrustInfo",
      currentIndex: "",
      itemRowData: {},
      queryData: {
        pageNum: 1,
        pageSize: 10,
      },

      editSampleShow: false,
      selectItemShow: false,
      returnEntrustShow: false,

      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      //多选框选中的数据
      checkData: [],
      total: 0,
      loading: false,

      tableData2: [],
      receiveTaskShow: false,
      temp: "entrustInfo",

      // rowData: {}, //单行数据
      rowDatas: [], //批量多选数据
      radio: 3, //单选按钮
      radio1: 3, //单选按钮
      checkList: [], //多选框
      num: null,
      cateShow: false,
      tabPosition: "left",
    };
  },
  props: {
    entrustInfoShow: {
      type: Boolean,
      default: false,
    },
    rowData: {
      type: Object,
      default: () => ({}),
    },
    distinguishCode: "",
  },
  methods: {
    //新增样品
    handleAdd() {
      this.$router.push({
        name: "sampleInfo",
        query: {},
      });

    },
    //新增委托
    addTask() {
    },
    open() {
      //   this.init();
    },
    //查看检验项目
    detailItem(row) {
      this.itemRowData = row;
      this.selectItemShow = true;
    },
    //通过按钮操作
    handlePass() {
      let temp = {
        taskIdCode: this.rowData.idCode,
      };
      confirmPass(temp).then(
          (res) => {
            if (res.code == 200) {
              this.msgSuccess("已通过");
              this.$emit("init", null);
              this.close();
            }
          },
          (err) => {
          }
      );
    },
    //退回按钮操作
    handleReject() {
      this.returnEntrustShow = true;
    },
    handleChange() {
    },

    close() {
      this.$emit("update:entrustInfoShow", false);
    },
    //样品信息的修改按钮
    handleEdit(row) {
      this.itemRowData = row;
      this.editSampleShow = true;
    },
    //切换tab标签
    handleClick(tab, event) {
      console.log("tab=>", tab);
      console.log("event=>", event);
      console.log("tab.name==>", tab.name);
      // this.temp = tab.name;
      this.currentIndex = tab.name;
      // this.init(this.activeIndex, this.currentIndex);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      console.log("多选框选中的ids=>", this.ids.join(","));
      console.log("多选选中的数据的个数=>", this.ids.length);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
      //多选框选中的数据
      this.checkData = selection;
      // console.log('多选数据=>',this.$refs.multipleTable.selection)
      console.log("多选数据=>", this.checkData);
    },
    //处理数据(样品)
    handleData(row) {
      let obj = {
        entrustId: row.entrustId,
        detectType: row.detectType,
        sampleId: row.sampleId,
        detectCompleteDate: row.detectCompleteDate,
      };
      this.rowDatas.push(obj);
    },
    //处理数据(项目)
    handleData1(row) {
      let obj = {
        entrustId: row.entrustId,
        detectType: row.detectType,
        itemName: row.itemName,
        itemCode: row.itemCode,
      };
      this.rowDatas.push(obj);
    },

    //页面初始化
    init(activeIndex, currentIndex) {
      this.loading = true;
      activeIndex = activeIndex || "entrustInfo";
      currentIndex = currentIndex || "entrustInfo";
      this.activeIndex = activeIndex;
      this.currentIndex = currentIndex;
      console.log("currentIndex==>", currentIndex);
      console.log("activeIndex==>", activeIndex);
      if (currentIndex === "entrustInfo") {
        this.loading = true;
        //获取委托信息
        //委托id
        let idCode = this.rowData.idCode;
        getEntrustInfo(idCode).then(
            (res) => {
              this.tasks = res.data;
              this.extDataObj = JSON.parse(res.data.extData);
            },
            (err) => {
            }
        );
      } else if (currentIndex === "sampleInfo") {
        //获取样品信息
        this.loading = true;
        let idCode = this.rowData.idCode;

        getSamplesInfo(idCode, this.queryData).then(
            (res) => {
              console.log("获取样品信息==>", res.rows);
              this.tableData = res.rows;
              this.total = res.total;
              this.loading = false;
            },
            (err) => {
            }
        );
      }
    },
  },
  computed: {},
  created() {
  },
  mounted() {
  },
};
</script>
<style lang="less" scoped>
// 按钮
:deep(.btns) {
  height: 66px;
  background-color: white;
  display: flex;
  justify-content: flex-end;

  button {
    width: 98px;
    height: 34px;
    margin-top: 16px;
    margin-left: 16px;
    // background: #3377ff;
    // opacity: 1;
    border-radius: 4px;
  }

  button:nth-of-type(3) {
    margin-right: 44px;
  }
}

:deep(.containerInfo) {
  margin: 15px auto; /*上下距离为0px，左右距离自动*/
  width: 73.4%;
}

:deep(.tipMessage) {
  width: 100%;
  height: 60px;
  background: #f8f9fb;
  margin-top: 10px;

  p {
    margin-left: 10px;
    font-size: 18px;
    font-weight: bold;
    line-height: 60px;
    color: #475166;
  }
}

//tab切换样式
:deep(#tab-entrustInfo) {
  background: #ffffff;
  width: 206px;
  height: 70px;
  font-size: 18px;
  font-weight: 400;
  line-height: 70px;
  text-align: center;
  // color: #8F9BB3;
}

:deep(#tab-sampleInfo) {
  background: #ffffff;
  width: 206px;
  height: 70px;
  font-size: 18px;
  font-weight: 400;
  line-height: 70px;
  text-align: center;
  // color: #8F9BB3;
}

// 表单
:deep(.tasks ) {
  // width: 80px;
  // height: 22px;
  // font-size: 16px;
  // font-weight: 400;
  // line-height: 16px;
  // color: #8f9bb3;
  :deep(p) {
    font-weight: 600;
  }

  :deep(.inputText) {
    display: flex;
    justify-content: flex-start;
  }
}

:deep(.el-row-toolbar) {
  margin: 5px;
}
</style>

<template>
  <div class="app-container">
    <el-tabs
        ref="appContainer"
        v-model="activeIndex"
        :tab-position="tabPosition"
        class="containerInfo"
        type="card"
        @tab-click="handleClick"
    >
      <div :style="{ width: clientWidth + 'px' }" class="btns">
        <el-button type="" @click="backTo">返回</el-button>
        <el-button v-show="!onlySee" type="" @click="handleSaveAs"
        >暂存
        </el-button
        >
        <el-button v-show="!onlySee" type="primary" @click="handleSubmit"
        >提交
        </el-button
        >
      </div>
      <el-tab-pane label="委托信息" name="entrustInfo">
        <div class="a-c-top" style="margin-top:70px">
          <el-form
              ref="tasks"
              :inline="true"
              :model="tasks"
              :prop="tasks"
              :rules="rules"
              class="demo-form-inline"
              label-position="right"
              label-width="140px"
              style="height: 680px"
              @submit.native.prevent
          >
            <div class="tipMessage" style="margin-bottom: 20px">
              <p>基本信息</p>
            </div>
            <div class="basicInfo">
              <el-col>
                <el-form-item class="rule-input" label="委托日期:">
                  <el-date-picker
                      v-model="tasks.extDataObj.commissionedDate"
                      :disabled="onlySee"
                      placeholder="选择日期时间"
                      prop="commissionedDate"
                      style="width: 200px"
                      type="datetime">
                  </el-date-picker>
                </el-form-item>
                <el-form-item class="rule-input" label="委托编号:">
                  <el-input v-model="tasks.idCode" disabled style="width: 200px">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item
                    class="rule-input"
                    label="委托单位名称:"
                    prop="customerName"
                >
                  <el-input
                      v-model="tasks.customerName"
                      :disabled="onlySee"
                      clearable
                  >
                  </el-input>
                </el-form-item>
                <el-form-item
                    class="rule-input"
                    label="委托单位地址:"
                    prop="customerAddress"
                >
                  <el-input
                      v-model="tasks.customerAddress"
                      :disabled="onlySee"
                      clearable
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item
                    class="rule-input"
                    label="联系人:"
                    prop="customerContact"
                >
                  <el-input
                      v-model="tasks.customerContact"
                      :disabled="onlySee"
                      clearable
                  >
                  </el-input>
                </el-form-item>
                <el-form-item
                    class="rule-input"
                    label="电话:"
                    prop="customerTel"
                >
                  <el-input
                      v-model="tasks.customerTel"
                      :disabled="onlySee"
                      clearable
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item
                    class="rule-input"
                    label="邮箱:"
                    prop="customerEmail"
                >
                  <el-input
                      v-model="tasks.customerEmail"
                      :disabled="onlySee"
                      clearable
                  >
                  </el-input>
                </el-form-item>
                <el-form-item
                    class="rule-input"
                    label="报告邮寄地址："
                    prop="extData.sendMessage"
                >
                  <el-input
                      v-model="tasks.extDataObj.sendMessage"
                      :disabled="onlySee"
                      clearable
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item
                    class="rule-input"
                    label="项目所属分支："
                    prop="extDataObj.branch"
                >
                  <el-input
                      v-model="tasks.extDataObj.branch"
                      :disabled="onlySee"
                      clearable
                  >
                  </el-input>
                </el-form-item>
                <el-form-item
                    class="rule-input"
                    label="检测类型："
                    prop="extDataObj.testType"
                >
                  <el-input
                      v-model="tasks.extDataObj.testType"
                      :disabled="onlySee"
                      clearable
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item
                    class="rule-input"
                    label="生产企业名称："
                    prop="extDataObj.manufacturerName"
                >
                  <el-input
                      v-model="tasks.extDataObj.manufacturerName"
                      :disabled="onlySee"
                      clearable
                  >
                  </el-input>
                </el-form-item>
                <el-form-item
                    class="rule-input"
                    label="生产企业联系电话："
                    prop="extDataObj.manufacturerTel"
                >
                  <el-input
                      v-model="tasks.extDataObj.manufacturerTel"
                      :disabled="onlySee"
                      clearable
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item
                    class="rule-input"
                    label="交费单位信息："
                    prop="extDataObj.unitInformation"
                >
                  <el-input
                      v-model="tasks.extDataObj.unitInformation"
                      :disabled="onlySee"
                      clearable
                  >
                  </el-input>
                </el-form-item>
                <el-form-item
                    class="rule-input"
                    label="检验要求："
                    prop="extDataObj.testResultsFor"
                >
                  <el-radio-group
                      v-model="tasks.extDataObj.testResultsFor"
                      :disabled="onlySee"
                      clearable
                  >
                    <el-radio label="cjsj">出具数值结果</el-radio>
                    <el-radio label="cjpd">出具判定报告（判定依据）</el-radio>
                    <el-radio label="zs">CMA/CNAS证书</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item
                    class="rule-input"
                    label="检验周期："
                    prop="extDataObj.testCycle"
                >
                  <el-input
                      v-model="tasks.extDataObj.testCycle"
                      :disabled="onlySee"
                      clearable
                  >
                  </el-input>
                </el-form-item>
                <el-form-item
                    class="rule-input"
                    label="报告份数："
                    prop="extDataObj.reportNumber"
                >
                  <el-input-number
                      v-model="tasks.extDataObj.reportNumber"
                      :disabled="onlySee"
                      clearable
                  >
                  </el-input-number>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item
                    class="rule-input"
                    label="交付方式："
                    prop="extDataObj.deliveryMethod"
                >
                  <el-input
                      v-model="tasks.extDataObj.deliveryMethod"
                      :disabled="onlySee"
                      clearable
                  >
                  </el-input>
                </el-form-item>
                <el-form-item
                    class="rule-input"
                    label="样品处理："
                    prop="extDataObj.sampleHandle"
                >
                  <el-input
                      v-model="tasks.extDataObj.sampleHandle"
                      :disabled="onlySee"
                      clearable
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item
                    class="rule-input"
                    label="缴费情况："
                    prop="extDataObj.payment"
                >
                  <el-input
                      v-model="tasks.extDataObj.payment"
                      :disabled="onlySee"
                      clearable
                  >
                  </el-input>
                </el-form-item>
                <el-form-item
                    class="rule-input"
                    label="其他约定说明："
                    prop="extDataObj.otherInstructions"
                >
                  <el-input
                      v-model="tasks.extDataObj.otherInstructions"
                      :disabled="onlySee"
                      clearable
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item

                    class="rule-input"
                    label="是否开票："
                    prop="extDataObj.isInvoicing"
                >
                  <el-radio-group v-model="tasks.extDataObj.isInvoicing" :disabled="onlySee">
                    <el-radio label="是"></el-radio>
                    <el-radio label="否"></el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                    class="rule-input"
                    label="开票类型："
                    prop="extDataObj.invoicingType"
                    style="margin-left: 98px"
                >
                  <el-input
                      v-model="tasks.extDataObj.invoicingType"
                      :disabled="onlySee || tasks.extDataObj.isInvoicing === '否'"
                      clearable
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-form-item
                  v-if="false"
                  class="rule-input"
                  label="检测用途:"
                  prop="testPurpose"
              >
                <el-radio-group
                    v-model="tasks.extDataObj.testPurpose"
                    :disabled="onlySee"
                    clearable
                    @change="qtchange"
                >
                  <el-col>
                    <el-radio label="xsjy">型式检验</el-radio>
                    <el-radio label="fzjy">发证检验</el-radio>
                    <el-radio label="zjzk">自检自控</el-radio>
                    <el-radio label="ypfj">样品复验</el-radio>
                    <el-radio label="khyq">客户要求</el-radio>
                  </el-col>
                  <el-col>
                    <el-radio label="yjkf">研究开发</el-radio>
                    <el-radio label="tscl">投诉处理</el-radio>
                    <el-radio label="qt">其他</el-radio>
                    <el-input v-if="show1" v-model="tasks.extDataObj.purposeOther " :disabled="onlySee" clearable
                              style="width: 200px"></el-input>
                  </el-col>
                </el-radio-group>
              </el-form-item>

              <el-form-item
                  v-if="false"
                  class="rule-input"
                  label="检测结果要求:"
                  prop="testResultsFor "
              >
                <el-radio-group
                    v-model="tasks.extDataObj.testResultsFor"
                    :disabled="onlySee"
                    clearable
                >
                  <el-radio label="cjsj">出具数值结果</el-radio>
                  <el-radio label="cjpd">出具判定报告（判定依据）</el-radio>
                  <el-radio label="zs">CMA/CNAS证书</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-col v-if="false">
                <el-form-item
                    class="rule-input"
                    label="报告形式:"
                    prop="reportForm"
                >
                  <el-radio-group
                      v-model="tasks.extDataObj.reportForm"
                      :disabled="onlySee"
                      clearable
                  >
                    <el-radio label="zw">中文报告</el-radio>
                    <el-radio label="zyw">中英文报告</el-radio>
                    <el-radio label="yw">英文报告</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col v-if="false">
                <el-form-item
                    class="rule-input"
                    label="报告领取方式:"
                    prop="reportGetWay"
                >
                  <el-radio-group
                      v-model="tasks.extDataObj.reportGetWay"
                      :disabled="onlySee"
                      clearable
                      @change="costomchange"
                  >
                    <el-radio label="zq">自取</el-radio>
                    <el-radio label="yj">邮寄</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>

              <div v-if="show">
                <el-form-item
                    class="rule-input"
                    label="邮寄电话:"
                    prop="mailTel"
                >
                  <el-input
                      v-model="tasks.extDataObj.mailTel"
                      :disabled="onlySee"
                      clearable
                  >
                  </el-input>
                </el-form-item>
                <el-form-item
                    class="rule-input"
                    label="检测费:"
                    prop="testFee"
                >
                  <el-input
                      v-model="tasks.extDataObj.testFee"
                      :disabled="onlySee"
                      clearable
                  >
                  </el-input>
                </el-form-item>
                <el-form-item
                    class="rule-input"
                    label="邮寄地址:"
                    prop="taskPostCode"
                >
                  <el-input
                      v-model="tasks.extDataObj.taskPostCode"
                      :disabled="onlySee"
                      clearable
                  >
                  </el-input>
                </el-form-item>
                <!--                <el-form-item-->
                <!--                  label="业务员:"-->
                <!--                  class="rule-input"-->
                <!--                  prop="salesman"-->
                <!--                >-->
                <!--                  <el-input-->
                <!--                    v-model="tasks.extDataObj.salesman"-->
                <!--                    clearable-->
                <!--                    :disabled="onlySee"-->
                <!--                  >-->
                <!--                  </el-input>-->
                <!--                </el-form-item>-->
                <el-form-item
                    class="rule-input"
                    label="邮寄联系人:"
                    prop="mailContact"
                >
                  <el-input
                      v-model="tasks.extDataObj.mailContact"
                      :disabled="onlySee"
                      clearable
                  >
                  </el-input>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="样品信息" name="sampleInfo">
        <div class="a-c-bottom" style="margin-top:70px">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                  v-show="!onlySee"
                  icon="el-icon-plus"
                  size="mini"
                  type="primary"
                  @click="addSample"
              >
                新增样品
              </el-button>
            </el-col>
          </el-row>
          <el-table ref="multipleTable" :data="tableData">
            <!-- <el-table-column type="selection" width="55" align="center" /> -->
            <!--            <el-table-column-->
            <!--              type="index"-->
            <!--              width="55"-->
            <!--              align="center"-->
            <!--              label="序号"-->
            <!--            >-->
            <!--              <template slot-scope="scope">-->
            <!--                <span>{{-->
            <!--                  (queryData.pageNum - 1) * queryData.pageSize +-->
            <!--                    scope.$index +-->
            <!--                    1-->
            <!--                }}</span>-->
            <!--              </template>-->
            <!--            </el-table-column>-->
            <el-table-column label="样品编号" prop="idCode">
            </el-table-column>
            <el-table-column label="样品名称" prop="productionName">
            </el-table-column>
            <el-table-column label="样品批号" prop="extData.batchNumber">
              <template v-slot="scope">
                {{ checkData(scope.row, 'batchNumber') }}
              </template>
            </el-table-column>
            <el-table-column label="样品数量" prop="extData.sampleQuantity">
              <template v-slot="scope">
                {{ checkData(scope.row, 'sampleQuantity') }}
              </template>
            </el-table-column>
            <el-table-column
                label="样品状态"
                prop="extData.sampleForm1"
                width="150px"
            >
              <template v-slot="scope">
                {{ checkData(scope.row, 'sampleForm1') }}
              </template>
            </el-table-column>
            <!--            <el-table-column-->
            <!--              prop="itemCount"-->
            <!--              label="批号/生产日期"-->
            <!--              width="150px"-->
            <!--            >-->
            <!--              <template scope="scope">-->
            <!--                <div-->
            <!--                  style="-->
            <!--                    text-decoration: underline;-->
            <!--                    color: #1890ff;-->
            <!--                    cursor: pointer;-->
            <!--                  "-->
            <!--                  @click="detailItem(scope.row)"-->
            <!--                >-->
            <!--                  {{ scope.row.itemCount }}-->
            <!--                </div>-->
            <!--              </template>-->
            <el-table-column label="样品等级" prop="extData.qualityGrade">
              <template v-slot="scope">
                {{ checkData(scope.row, 'qualityGrade') }}
              </template>
            </el-table-column>
            <el-table-column label="规格型号" prop="extData.specifications">
              <template v-slot="scope">
                {{ checkData(scope.row, 'specifications') }}
              </template>
            </el-table-column>
            <el-table-column label="生产日期" prop="extData.sampleSJGDate">
              <template v-slot="scope">
                {{ checkData(scope.row, 'sampleSJGDate') }}
              </template>
            </el-table-column>
            <el-table-column label="样品商标" prop="extData.trademark">
              <template v-slot="scope">
                {{ checkData(scope.row, 'trademark') }}
              </template>
            </el-table-column>
            <el-table-column label="保存条件" prop="extData.taskSaveCondition">
              <template v-slot="scope">
                {{ checkData(scope.row, 'taskSaveCondition') }}
              </template>
            </el-table-column>
            <el-table-column v-if="!onlySee" fixed="right" label="操作" style="width: 100px">
              <template slot-scope="scope">
                <el-button
                    size="mini"
                    type="text"
                    @click="editSample(scope.row.idCode)"
                >修改
                </el-button>
                <el-button
                    size="mini"
                    type="text"
                    @click="deleteSample(scope.row.idCode)"
                >删除
                </el-button>
                <el-button
                    size="mini"
                    type="text"
                    @click="openCloneSampleDialog(scope.row.idCode)"
                >复制
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
              @pagination="init(activeIndex, currentIndex)"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
    <selectItem
        :itemRowData="itemRowData"
        :selectItemShow.sync="selectItemShow"
        @init="init"
    />
    <el-dialog :visible.sync="cloneSampleVisible" title="复制样品" width="25%">
      <div style="text-align: center; margin: 0 auto">
        <span style="margin-right: 18px; font-size: 14px; font-weight: 600"
        >复制份数</span
        >
        <el-input-number
            v-model="cloneSampleCount"
            :max="100"
            :min="1"
            :step-strictly="true"
            label="复制份数"
        ></el-input-number>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cloneSample()">确 定</el-button>
        <el-button @click="cloneSampleVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getEntrustInfo,
  getSamplesInfo,
  confirmPass,
  addTask,
  submitTask,
  saveAsTask,
  deleteSample,
  cloneSample,
  addEmptySample
} from "@/api/entrust/entrustConfirm";
import indexCustomerNav from "../indexCustomerNav";
import selectItem from "./selectItem";

export default {
  name: "entrustDetail",
  components: {
    indexCustomerNav,
    selectItem
  },
  data() {
    //报告抬头
    const validateReportosa = (rule, value, callback) => {
      if (value === "z2" && !this.tasks.extDataObj.addressosaz) {
        callback(new Error("请填写报告抬头"));
      } else {
        callback();
      }
    };
    //报告发送 校验
    const validateReports2 = (rule, value, callback) => {
      if (value === "b5" && !this.tasks.extDataObj.send) {
        callback(new Error("请填写报告发送"));
      } else {
        callback();
      }
    };
    //发票抬头校验
    const validateReports4 = (rule, value, callback) => {
      if (value === "d2" && !this.tasks.extDataObj.invoice) {
        callback(new Error("请填写发票抬头"));
      } else {
        callback();
      }
    };
    //发票类别校验
    const validateReportes = (rule, value, callback) => {
      if (value === "ea" && !this.tasks.extDataObj.categorys) {
        callback(new Error("请填写发票类别"));
      } else {
        callback();
      }
    };
    return {
      show: false,
      show1: false,
      currentSampleIdcode: "",
      cloneSampleCount: 0,
      cloneSampleVisible: false,
      pageFlag: null, //view 查看     edit编辑
      onlySee: true, //true 查看状态    false编辑
      queryData: {
        pageNum: 1,
        pageSize: 10
      },
      //委托信息的数据
      tasks: {

        extData: {
          sendMessage: '',
        }, //扩展属性
        extDataObj: {
          productionName: "",
          sampleForm: "",
          numberWeight: "",
          batchNumber: "",
          producersName: "",
          sampLeStorageRequi: "",
          checkMoreSampleRefund: "",
          sendMessage: '',
          purposeOther: "",
          customerContact: "", //报告联系人
          testResultsFor: "",//检测用途
          testPurpose: "",//检测结果要求
          judgment: "", //判断依据
          reportForm: "",//报告形式
          reportGetWay: "",//报告领取方式
          mailContact: "",//邮寄联系人
          mailTel: "",//邮寄电话
          testFee: "",//检测费用
          salesman: "",//业务员
          idCode: "", //委托单号
          customerName: "", //委托单位名称
          customerTel: "", //联系电话
          customerDepartment: "", //所属部门
          commissionedDate: "", //委托日期(当前日期)
          reportosa: "", //报告抬头
          addressosaz: "", //报告抬头其他

          taskFax: "", //传真
          customerAddress: "", //报告联系地址
          taskPostCode: "", //邮编
          report: "", //邮寄地址
          address: "", //邮寄地址其他
          projectcode: "", //委托方单号
          customerEmail: "",
          serviceTypes: "", //测试方法
          serviceType: "", //服务时限
          service_Type: "", //其他服务时限
          reports1: "pd", //判定依据
          basisStandar: "", //判断标准
          reportformat: [], //报告格式
          geshiNum: "", //选择多少份
          Reportcatalog: "", //报告类别
          reports2: "", //报告发送
          send: "", //报告发送其他
          reports3: "c1", //报告费用
          Paycost: "", //协议编号
          reports4: "", //发票抬头
          invoice: "", //发票抬头其他
          reportes: "", //发票类型
          categorys: "",
          taskType: "", //委托类型
          taskBeizhu: "", //备注
          agreementReceipt: "", //委托书回执要求
          invoicingType: "", //开票类型
          isInvoicing: "否", //是否开票
          otherInstructions: "", //其他约定说明
          payment: "", //缴费情况
          sampleHandle: "", //样品处理
          deliveryMethod: "", //交付方式
          reportNumber: 1, //交付方式
          testCycle: "", //检验周期
          unitInformation: "", //交费单位信息
          manufacturerTel: "", //生产企业联系电话
          manufacturerName: "", //生产企业名称
          testType: "", //检测类型
          branch: "", //项目所属分支
        }
      },
      //TODO  RU
      rules: {
        mailContact: [{required: true, message: '此选项为必填项', trigger: 'blur'}],
        mailTel: [{required: true, message: '此选项为必填项', trigger: 'change'}],
        testFee: [{required: true, message: '此选项为必填项', trigger: 'blur'}],
        taskPostCode: [{required: true, message: '此选项为必填项', trigger: 'blur'}],
        customerTel: [{required: true, message: "请输入联系电话", trigger: "change"}],
        customerAddress: [{required: true, message: "请输入委托单位地址", trigger: "change"}],
        customerContact: [{required: true, message: "请输入联系人", trigger: "change"}],
      },
      //样品信息数据
      tableData: [],
      activeIndex: "entrustInfo",
      currentIndex: "",
      itemRowData: {},
      selectItemShow: false,
      returnEntrustShow: false,
      loading: false,
      total: 0,

      temp: "entrustInfo",
      radio: 3, //单选按钮
      num: null,
      tabPosition: "left",
      clientWidth: ''
    };
  },
  methods: {
    qtchange(val) {
      if (val == 'qt') {
        this.show1 = true;
      } else {
        this.show1 = false;
      }
    },
    costomchange(val) {
      if (val == 'yj') {
        this.show = true;
      } else {
        this.show = false;
      }
    },


    selectReportRise(val) {
      // <el-option label="与委托方相同" value="z1"></el-option>
      //     <el-option label="其他" value="z2"></el-option>
      if (val === "z1") {
        //联系地址填充报告联系地址   联系人填充报告联系人
        if (this.tasks.customerContact) {
          this.tasks.extDataObj.customerContact = this.tasks.customerContact;
        }
        if (this.tasks.customerAddress) {
          this.tasks.extDataObj.customerAddress = this.tasks.customerAddress;
        }
      }
    },
    //扩展属性 样品量拼接
    extDataFormat(row, column) {
      let str = "-";
      if (row.extData) {
        let extDataObj = JSON.parse(row.extData);
        if (extDataObj["sample_Amout"] && extDataObj["sampleAmout"]) {
          str = extDataObj["sample_Amout"] + extDataObj["sampleAmout"];
        }
      }
      return str;
    },
    detailSample(row) {
      if (!row || !row.idCode) return;
      this.$router.push({
        name: "sampleInfo",
        query: {
          sampleIdCode: row.idCode,
          taskIdCode: this.tasks.idCode,
          pageFlag: "view",
          parentPageFlag: this.pageFlag
        }
      });
    },
    //新增样品
    addSample() {
      //20210317  逻辑调整  跳转之前先调接口创建一个空白样品数据 再带着样品id跳转
      let emptySample = {taskIdCode: this.tasks.idCode};
      addEmptySample(emptySample).then(
          res => {
            if (res.code == 200) {
              this.$router.push({
                name: "sampleInfo",
                query: {
                  sampleIdCode: res.msg,
                  taskIdCode: this.tasks.idCode,
                  pageFlag: this.pageFlag,
                  parentPageFlag: this.pageFlag
                }
              });
            }
          },
          error => {
          }
      );
    },
    //编辑样品
    editSample(sampleIdCode) {
      if (!sampleIdCode) return;
      this.$router.push({
        name: "sampleInfo",
        query: {
          sampleIdCode: sampleIdCode,
          taskIdCode: this.tasks.idCode,
          pageFlag: this.pageFlag,
          parentPageFlag: this.pageFlag
        }
      });
    },
    //删除样品
    deleteSample(sampleIdCode) {
      if (!sampleIdCode) return;
      this.$confirm(`确认删除样品[编号:${sampleIdCode}]？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
          .then(() => {
            deleteSample(sampleIdCode).then(
                res => {
                  this.msgSuccess("删除样品成功");
                  this.querySampleList();
                },
                error => {
                }
            );
          })
          .catch(function () {
          });
    },
    //复制样品
    cloneSample() {
      if (!this.currentSampleIdcode) {
        return false;
      }
      if (!this.cloneSampleCount) {
        this.msgError("请输入复制份数");
        return false;
      }
      let queryParam = {
        taskIdCode: this.tasks.idCode,
        sampleIdCode: this.currentSampleIdcode,
        count: this.cloneSampleCount
      };
      cloneSample(queryParam).then(
          res => {
            this.msgSuccess("复制样品成功");
            this.querySampleList();
            this.cloneSampleVisible = false;
          },
          error => {
          }
      );
    },
    //打开复制样品复制样品
    openCloneSampleDialog(sampleIdCode) {
      if (!sampleIdCode) return;
      this.cloneSampleCount = 1;
      this.currentSampleIdcode = sampleIdCode;
      this.cloneSampleVisible = true;
    },
    //查询委托下的样品列表
    querySampleList() {
      getSamplesInfo(this.tasks.idCode, this.queryData).then(
          res => {
            this.tableData = res.rows;
            this.total = res.total;
            this.loading = false;
          },
          err => {
          }
      );
    },
    //暂存
    handleSaveAs() {
      //校验
      this.tasks = JSON.parse(JSON.stringify(this.tasks))
      this.tasks.extData = JSON.stringify(this.tasks.extDataObj);
      if (this.tableData.length === 0) return this.$message.warning('请添加样品信息')
      this.$refs["tasks"].validate(valid => {
        if (valid) {
          saveAsTask(this.tasks).then(
              res => {
                if (res.code == 200) {
                  localStorage.removeItem("taskIdCode");
                  this.msgSuccess("委托暂存成功！");
                  //暂存停留在当前页面
                }
              },
              error => {
              }
          );
        } else {
          if ("sampleInfo" == this.activeIndex) {
            this.msgError("请完善委托信息");
            return false;
          }
          //this.msgError("请完善委托信息");
          //报告抬头未填写  不需要滚动页面
          if (
              !this.tasks.extDataObj.reportosa ||
              (this.tasks.extDataObj.reportosa == "z2" &&
                  !this.tasks.extDataObj.addressosaz)
          ) {
            //scrollPointReport
            return false;
          }
          //联系电话 联系地址不为空时  那就是页面底部信息未填写  滑动滚动条
          if (this.tasks.customerTel && this.tasks.customerAddress) {
            document.querySelector("#scrollPoint").scrollIntoView(true);
          }
          return false;
        }
      });
    },
    //提交
    handleSubmit() {
      //校验
      this.tasks.extData = JSON.stringify(this.tasks.extDataObj);
      this.$refs["tasks"].validate(valid => {
        if (valid) {
          submitTask(this.tasks).then(
              res => {
                if (res.code == 200) {
                  localStorage.removeItem("taskIdCode");
                  this.msgSuccess("委托提交成功，即将跳转委托报检页面");
                  setTimeout(() => {
                    this.backTo();
                  }, 1000);
                }
              },
              error => {
              }
          );
        } else {
          if ("sampleInfo" == this.activeIndex) {
            this.msgError("请完善委托信息");
            return false;
          }
          //this.msgError("请完善委托信息");
          //报告抬头未填写  不需要滚动页面
          if (
              !this.tasks.extDataObj.reportosa ||
              (this.tasks.extDataObj.reportosa == "z2" &&
                  !this.tasks.extDataObj.addressosaz)
          ) {
            //scrollPointReport
            return false;
          }
          //联系电话 联系地址不为空时  那就是页面底部信息未填写  滑动滚动条
          if (this.tasks.customerTel && this.tasks.customerAddress) {
            document.querySelector("#scrollPoint").scrollIntoView(true);
          }
          return false;
        }
      });
    },
    //新增委托
    addTask() {
      addTask().then(
          res => {
            let task = res.data.task;
            let company = res.data.company;
            this.tasks.idCode = task.idCode;
            this.tasks.customerName = task.customerName;
            this.tasks.customerContact = task.customerContact;
            this.tasks.customerTel = task.customerTel;
            this.tasks.customerAddress = task.customerAddress;
            if (task.extData) {
              let extObj = JSON.parse(task.extData);
              this.tasks.extDataObj.commissionedDate = extObj.commissionedDate;
              this.tasks.extDataObj.taskPostCode = extObj.taskPostCode;
              this.tasks.extDataObj.taskFax = extObj.taskFax;
              this.tasks.extDataObj.customerContact = extObj.customerContact;
              this.tasks.extDataObj.customerDepartment =
                  extObj.customerDepartment;
              this.tasks.extDataObj.reportosa = extObj.reportosa; //报告抬头
              this.tasks.extDataObj.report = extObj.report; //邮寄地址
              this.tasks.extDataObj.serviceTypes = extObj.serviceTypes; //测试方法
              this.tasks.extDataObj.agreementReceipt = extObj.agreementReceipt; //回执要求
              this.tasks.extDataObj.serviceType = extObj.serviceType; //服务时限
              this.tasks.extDataObj.reports1 = extObj.reports1; //判定依据
              this.tasks.extDataObj.reportformat = extObj.reportformat; //报告格式
              this.tasks.extDataObj.Reportcatalog = extObj.Reportcatalog; //报告类别
              this.tasks.extDataObj.reports2 = extObj.reports2; //报告发送
              this.tasks.extDataObj.reports3 = extObj.reports3; //报告费用
              this.tasks.extDataObj.reports4 = extObj.reports4; //发票抬头
              this.tasks.extDataObj.taskType = extObj.taskType; //委托类型
              this.tasks.extDataObj.reportes = extObj.reportes; //发票类别

              //tasks.extDataObj.reportosa
              if (this.tasks.extDataObj.reportosa === "z1") {
                //联系地址填充报告联系地址   联系人填充报告联系人
                if (this.tasks.customerContact) {
                  this.tasks.extDataObj.customerContact = this.tasks.customerContact;
                }
                if (this.tasks.customerAddress) {
                  this.tasks.extDataObj.customerAddress = this.tasks.customerAddress;
                }
              }
            } else {
              this.tasks.extDataObj.commissionedDate = new Date().toLocaleDateString();
              this.tasks.extDataObj.taskPostCode = company.postNumber;
              this.tasks.extDataObj.taskFax = company.fax;
              this.tasks.extDataObj.customerContact = task.customerContact;
              this.tasks.extDataObj.customerDepartment = "";
            }
            //填充默认信息  后台填充
            // this.tasks.extDataObj.reportosa = 'z1';//报告抬头
            // this.tasks.extDataObj.report = 'zq';//邮寄地址
            // this.tasks.extDataObj.serviceTypes = 'wt';//测试方法
            // this.tasks.extDataObj.agreementReceipt = 0; //回执要求
            // this.tasks.extDataObj.serviceType = 'bz'; //服务时限
            // this.tasks.extDataObj.reports1 = 'pd';  //判定依据
            // this.tasks.extDataObj.reportformat = 'zw';//报告格式
            // this.tasks.extDataObj.Reportcatalog = 'a4';//报告类别
            // this.tasks.extDataObj.reports2 = 'b1';//报告发送
            // this.tasks.extDataObj.reports3 = 'c3';//报告费用
            // this.tasks.extDataObj.reports4 = 'd1'//发票抬头
            // this.tasks.extDataObj.taskType = '委托测试';//委托类型
            // this.tasks.extDataObj.reportes = 'ea';//发票类别
            //this.tasks.extDataObj.commissionedDate = new Date().toLocaleDateString();
            //新增的委托id存入本地存储
            localStorage.setItem("taskIdCode", task.idCode);
            this.tasks = JSON.parse(JSON.stringify(this.tasks))
          },
          err => {
          }
      );
    },
    //获取委托信息
    queryTask(idCode) {
      getEntrustInfo(idCode).then(
          res => {
            let temp = this.tasks.extDataObj;
            this.tasks = res.data; //赋值时会把extDataObj覆盖
            this.tasks.extDataObj = temp;
            if (res.data.extData) {
              //this.tasks.extDataObj = JSON.parse(res.data.extData);
              let extDataJson = JSON.parse(res.data.extData);
              if (extDataJson) {
                //this.tasks.extDataObj = extDataJson;
                //只遍历复制存在的key
                for (var key in extDataJson) {
                  this.tasks.extDataObj[key] = extDataJson[key];
                }
              }
            }
            //从样品详情页面跳转过来的
            if (this.currentIndex === "sampleInfo") {
              this.querySampleList();
            }
          },
          err => {
            setTimeout(() => {
              this.backTo();
            }, 1000);
          }
      );
    },
    //查看检验项目
    detailItem(row) {
      if (!row.itemCount) {
        this.msgError("请先给样品添加检测项目");
        return false;
      }
      this.itemRowData = row;
      this.selectItemShow = true;
    },

    handleChange() {
    },
    //返回
    backTo() {
      localStorage.removeItem("taskIdCode");
      //history.back();
      //this.$router.back();
      this.$router.push({name: "entrust"});
    },
    //切换tab标签
    handleClick(tab, event) {
      this.currentIndex = tab.name;
      if (tab.name == "sampleInfo") {
        this.querySampleList();
      }
    },
    //页面初始化
    init(activeIndex, currentIndex) {
      let taskIdCode = this.$route.query.taskIdCode;
      let tabIndex = this.$route.query.tabIndex;
      this.pageFlag = this.$route.query.pageFlag || "view";
      this.onlySee = this.pageFlag == "edit" ? false : true;
      //如果没参数就调回委托列表
      // alert(taskIdCode)
      if (!taskIdCode) {
        this.$router.push({
          name: "entrust"
        });
      }
      this.loading = true;
      //样品详情页跳回
      if (tabIndex && tabIndex == "sampleInfo") {
        this.activeIndex = tabIndex;
        this.currentIndex = tabIndex;
      } else {
        this.activeIndex = activeIndex || "entrustInfo";
        this.currentIndex = currentIndex || "entrustInfo";
      }

      if (taskIdCode == -1) {
        //通过新增过来时  查一下本地存储  解决刷新一次就新增一个委托的bug
        let localTaskIdCode = localStorage.getItem("taskIdCode");
        if (localTaskIdCode) {
          taskIdCode = localTaskIdCode;
        }
      }
      if (taskIdCode == -1) {
        //新增  需要创建一个空白委托
        this.addTask();
      } else {
        this.queryTask(taskIdCode);
      }
      // setTimeout(() => {
      //   console.log(this.tasks.idCode);
      //   if (this.currentIndex === "sampleInfo"){
      //     this.querySampleList();
      //   }
      // }, 1000);
    },
    checkData(row, type) {
      let data = JSON.parse(row.extData)
      if (data)
        return data[type]
    },
  },
  computed: {},
  created() {
    this.init();
    //  this.$nextTick(() => {
    //     this.$refs.tasks.clearValidate();
    //   });
  },
  mounted() {
    console.log("宽度", this.$refs.appContainer.$el.clientWidth);
    this.clientWidth = this.$refs.appContainer.$el.clientWidth - 215;
  }
};
</script>
<style lang="less" scoped>
// 按钮
:deep(.btns) {
  height: 66px;
  background-color: white;
  display: flex;
  justify-content: flex-end;
  position: fixed;
  z-index: 111;

  button {
    width: 98px;
    height: 34px;
    margin-top: 16px;
    margin-left: 16px;
    border-radius: 4px;
  }

  button:nth-of-type(3) {
    margin-right: 44px;
  }
}

:deep(.containerInfo) {
  margin: 15px auto; /*上下距离为0px，左右距离自动*/
  width: 73.2%;
  margin-bottom: 80px;
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
}

:deep(.active-input) {
  width: 80px;
}

// 表单
:deep(.tasks) {
  :deep(p) {
    font-weight: 600;
  }

}

:deep(.el-row-toolbar) {
  margin: 5px;
}

.el-input-number .el-input--small .el-input__inner {
  width: 20px;
  line-height: 30px;
  height: 28px;
}

.basicInfo {
  //height: 500px;
  //height: auto;
}

@media (max-width: 1366px) {
  .el-radio-group {
    display: flex;
    flex-direction: column;
  }
}
</style>

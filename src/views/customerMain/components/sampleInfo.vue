<template>
  <div class="app-container">
    <el-tabs
        v-model="activeIndex"
        :tab-position="tabPosition"
        class="containerInfo"
        type="card"
        @tab-click="handleClick"
    >
      <div class="btns">
        <el-button v-show="!onlySee" type="primary" @click="handleUpdateNew"
        >确定
        </el-button
        >
        <el-button type="primary" @click="backTo">返回</el-button>
      </div>
      <el-tab-pane label="基本信息" name="sampleInfo">
        <!-- 统一样式 - 查询区域 -->
        <div class="a-c-top">
          <el-form
              ref="tasks"
              :inline="true"
              :model="tasks"
              :rules="rules"
              class="tasks"
              label-width="240px"
              style="height: 500px"
              @submit.native.prevent
          >
            <div class="tipMessage"><p>样品信息</p></div>
            <el-col>
              <el-form-item label="样品编号:" style="margin-top: 50px">
                <el-input v-model="tasks.idCode" disabled style="width: 200px">
                </el-input>
              </el-form-item>
              <el-form-item label="样品名称:" prop="productionName" style="margin-top: 50px">
                <el-input v-model="tasks.productionName" style="width: 200px">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="样品批号：">
                <el-input
                    v-model="extDataObj.batchNumber"
                    :disabled="onlySee"
                    style="width: 200px"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="样品数量：">
                <el-input-number
                    v-model="extDataObj.sampleQuantity"
                    :disabled="onlySee"
                    clearable
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="样品状态：">
                <el-input
                    v-model="extDataObj.sampleForm1"
                    :disabled="onlySee"
                    style="width: 200px"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="样品等级：">
                <el-input
                    v-model="extDataObj.qualityGrade"
                    :disabled="onlySee"
                    clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="规格型号：">
                <el-input
                    v-model="extDataObj.specifications"
                    :disabled="onlySee"
                    style="width: 200px"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="生产日期：">
                <el-date-picker
                    v-model="extDataObj.sampleSJGDate"
                    :disabled="onlySee"
                    clearable
                    format="yyyy-MM-dd"
                    style="width: 94%"
                    type="date"
                    value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col v-if="false">
              <el-form-item label="样品形态:" prop="sampleForm">
                <el-input
                    v-model="tasks.sampleForm"
                    :disabled="onlySee"
                    style="width: 200px"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="数量/重量:" prop="numberWeight">
                <el-input
                    v-model="tasks.numberWeight"
                    :disabled="onlySee"
                    clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="样品商标:">
                <el-input
                    v-model="extDataObj.trademark"
                    :disabled="onlySee"
                    clearable
                ></el-input>
              </el-form-item>


              <!--            <el-form-item label="生产日期:">-->
              <!--              <el-date-picker-->
              <!--                v-model="extDataObj.sampleProducingDate"-->
              <!--                format="yyyy-MM-dd"-->
              <!--                value-format="yyyy-MM-dd"-->
              <!--                type="date"-->
              <!--                placeholder="选择日期"-->
              <!--                style="width: 200px"-->
              <!--                :disabled="onlySee"-->
              <!--              >-->
              <!--              </el-date-picker>-->
              <!--            </el-form-item>-->
              <el-form-item label="保存条件:">
                <el-input v-model="extDataObj.taskSaveCondition"
                          :disabled="onlySee"
                          clearable style="width: 200px"
                ></el-input>
              </el-form-item>
            </el-col>
            <!--            <el-col v-if="false">-->
            <!--              <el-form-item label="规格型号:" prop="batchNumber">-->
            <!--                <el-input-->
            <!--                  v-model="tasks.batchNumber"-->
            <!--                  clearable-->
            <!--                  :disabled="onlySee"-->
            <!--                ></el-input>-->
            <!--              </el-form-item>-->
            <!--              <el-form-item label="生产商名称:" prop="producersName">-->
            <!--                <el-input-->
            <!--                  v-model="tasks.producersName"-->
            <!--                  clearable-->
            <!--                  :disabled="onlySee"-->
            <!--                ></el-input>-->
            <!--              </el-form-item>-->
            <!--            </el-col>-->
            <!--              <el-form-item label="生产商地址及联系方式:" prop="producersAddress">-->
            <!--                <el-input-->
            <!--                  v-model="tasks.producersAddress"-->
            <!--                  clearable-->
            <!--                  :disabled="onlySee"-->
            <!--                ></el-input>-->
            <!--              </el-form-item>-->
            <!--            <el-form-item label="生产商地址及联系方式:" prop="sample_Amout">-->
            <!--              <el-input-->
            <!--                v-model="tasks.sample_Amout"-->
            <!--                style="width: 80px"-->
            <!--                :controls="false"-->
            <!--                :disabled="onlySee"-->
            <!--              >-->
            <!--              </el-input>-->
            <!--              <el-select-->
            <!--                v-model="extDataObj.sampleAmout"-->
            <!--                style="width: 120px"-->
            <!--                placeholder="请选择"-->
            <!--                :disabled="onlySee"-->
            <!--              >-->
            <!--                <el-option label="kg" value="kg"></el-option>-->
            <!--                <el-option label="g" value="g"></el-option>-->
            <!--                <el-option label="L" value="L"></el-option>-->
            <!--                <el-option label="mL" value="mL"></el-option>-->
            <!--              </el-select>-->
            <!--            </el-form-item>-->
            <!--            <el-form-item-->
            <!--              label="样品储存要求:"-->
            <!--              class="rule-input"-->
            <!--              prop="reportGetWay"-->
            <!--            >-->
            <!--              <el-radio-group-->
            <!--                v-model="tasks.extDataObj.reportGetWay"-->
            <!--                clearable-->
            <!--                :disabled="onlySee"-->
            <!--              >-->
            <!--                <el-radio label="cw">常温</el-radio>-->
            <!--                <el-radio label="lc">冷藏</el-radio>-->
            <!--                <el-radio label="ld">冷冻</el-radio>-->
            <!--                <el-radio label="qt">其他</el-radio>-->
            <!--              </el-radio-group>-->
            <!--            </el-form-item>-->
            <!-- <p>包装方式</p> -->
            <!--            <el-form-item label="样品储存要求:" prop="sampLeStorageRequire">-->
            <!--              <el-radio-group-->
            <!--                v-model="tasks.sampLeStorageRequire"-->
            <!--                :disabled="onlySee"-->
            <!--                @change="ypchange"-->
            <!--              >-->
            <!--                <el-radio label="unsealing">常温</el-radio>-->
            <!--                <el-radio label="bottled_seal">冷藏</el-radio>-->
            <!--                <el-radio label="inBulk">冷冻</el-radio>-->
            <!--                <el-radio label="sacked_seal">其他</el-radio>-->
            <!--              </el-radio-group>-->
            <!--              <el-input v-if="show1" style="width: 200px" v-model="tasks.extDataObj.sampLeStorageRequireOther " clearable :disabled="onlySee"></el-input>-->
            <!--            </el-form-item>-->

            <!--            <el-col>-->
            <!--              <el-form-item label="验余样品退还:" prop="checkMoreSampleRefund">-->
            <!--                <el-radio-group-->
            <!--                  v-model="tasks.checkMoreSampleRefund"-->
            <!--                  :disabled="onlySee"-->
            <!--                >-->
            <!--                  <el-radio label="0">是</el-radio>-->
            <!--                  <el-radio label="1">否</el-radio>-->
            <!--                </el-radio-group>-->
            <!--                <el-radio-group-->
            <!--                  v-model="tasks.samplePackaging"-->
            <!--                  :disabled="onlySee"-->
            <!--                >-->
            <!--                </el-radio-group>-->
            <!--                <el-input-->
            <!--                  style="width: 100px;display: inline-block;margin-left: 20px"-->
            <!--                  v-model="tasks.sample_Packaging"-->
            <!--                  clearable-->
            <!--                  placeholder=""-->
            <!--                  :disabled="onlySee"-->
            <!--                  v-show="tasks.samplePackaging == 'mannerOfPacking_other'"-->
            <!--                ></el-input>-->
            <!--              </el-form-item>-->
            <!--            </el-col>-->
            <!--            <el-col>-->
            <!--              <el-form-item label="检测方法:">-->
            <!--                <el-radio-group-->
            <!--                  v-model="tasks.testMethods"-->
            <!--                  :disabled="onlySee"-->
            <!--                >-->
            <!--                  <el-radio label="jc">由检测方指定方法</el-radio>-->
            <!--                  <el-radio label="zd">指定方法</el-radio>-->
            <!--                </el-radio-group>-->
            <!--                <el-radio-group-->
            <!--                  v-model="tasks.samplePackaging"-->
            <!--                  :disabled="onlySee"-->
            <!--                >-->
            <!--                </el-radio-group>-->
            <!--                <el-input-->
            <!--                  style="width: 100px;display: inline-block;margin-left: 20px"-->
            <!--                  v-model="tasks.sample_Packaging"-->
            <!--                  clearable-->
            <!--                  placeholder=""-->
            <!--                  :disabled="onlySee"-->
            <!--                  v-show="tasks.samplePackaging == 'mannerOfPacking_other'"-->
            <!--                ></el-input>-->
            <!--              </el-form-item>-->
            <!--            </el-col>-->

          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="检测项目" name="itemInfo">
        <div class="a-c-bottom">
          <!-- 按钮 -->
          <el-row v-show="!onlySee" :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button size="small" type="primary" @click="handleAdd">
                添加
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button size="small" type="primary" @click="handleCopyAdd">
                复制添加
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button size="small" type="primary" @click="handleDeleteItems">
                批量删除
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
            <el-table-column label="项目名称" prop="itemName">
            </el-table-column>
            <el-table-column label="英文名称" prop="englishName">
            </el-table-column>
            <el-table-column label="方法编号" prop="methodStandardCode">
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="方法名称" prop="methodStandardName">
            </el-table-column>
            <el-table-column
                :show-overflow-tooltip="true"
                label="所需样品量"
                prop="sampleSize"
            />
            <!--<el-table-column prop="detectionLimit" label="方法检出限">-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="unit" label="检出限单位">-->
            <!--<template slot-scope="scope">-->
            <!--<span v-html="scope.row.detectionLimitUnit">{{-->
            <!--scope.row.detectionLimitUnit-->
            <!--}}</span>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="stroma" label="基质"> </el-table-column>-->
            <el-table-column
                v-if="!onlySee"
                fixed="right"
                label="操作"
                width="130"
            >
              <template slot-scope="scope">
                <el-button
                    size="small"
                    type="text"
                    @click="handleDeleteItem(scope.row)"
                >删除
                </el-button>
                <el-button
                    size="small"
                    type="text"
                    @click="configUp(scope.$index, scope.row)"
                >上移
                </el-button>
                <el-button
                    size="small"
                    type="text"
                    @click="configDown(scope.$index, scope.row)"
                >下移
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
    <addItem
        v-if="addItemShow"
        ref="addItem"
        :sampleIdCode="tasks.idCode"
        :taskIdCode="taskIdCode"
        @close="addItemShow = false"
        @saveItem="saveItem"
    />
    <copyAddItem
        :copyAddItemShow.sync="copyAddItemShow"
        :targetSampleIdCode="tasks.idCode"
        @saveItem="saveItem"
    />
    <sampleCategory
        :sampleCategoryShow.sync="sampleCategoryShow"
        @backfillCategory="backfillCategory"
    />
  </div>
</template>
<script>
import addItem from "./addItem.vue";
import copyAddItem from "./copyAddItem.vue";
import sampleCategory from "./sampleCategory";
import indexCustomerNav from "../indexCustomerNav";
import {
  deleteItem,
  getSamplesBaseInfo,
  itemListBySample,
  saveOrder,
  updateSamples
} from "@/api/entrust/entrustConfirm";

export default {
  name: "noReceived",
  components: {
    indexCustomerNav,
    addItem,
    copyAddItem,
    // // receiveTask,
    sampleCategory
  },
  data() {
    //样品量 校验
    const validateSampleAmout = (rule, value, callback) => {
      if (!this.extDataObj.sampleAmout) {
        callback(new Error("请选择样品量单位"));
      } else {
        callback();
      }
    };
    return {
      show: "",
      show1: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6; //如果没有后面的-8.64e6就是不可以选择今天的
        }
      },
      pageFlag: null, //view 查看     edit编辑
      onlySee: true, //true 查看状态    false编辑
      parentPageFlag: null, //记录委托页面的flag   用于返回
      sampleCategoryShow: false,
      //委托信息的数据
      tasks: {
        pageNum: 1,
        pageSize: 10,
        idCode: "", //样品编号
        productionName: "", //样品名称
        productionId: "", //样品类别id
        taskIdCode: "",
        category: "", //样品类别名称
        sample_Amout: "", //样品量   放到样品上   实现表单校验   存储时在放到扩展属性里
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
        extData: {
          batchNumber: '', //样品批号
          sampleQuantity: '', //样品数量
          sampleForm1: '', //样品状态
          qualityGrade: '', //样品等级
          specifications: '', //规格型号
          sampleSJGDate: '', //生产日期
          trademark: '', //样品商标
          taskSaveCondition: '', //保存条件
        }
      },
      extDataObj: {
        sampLeStorageRequireOther: "",


        reportGetWay: "",
        sampleBrand: "", //商标
        sampleModelType: "", //规格型号
        sampleProducingDate: "", //生产日期
        sampleBatch: "", //生产批次
        samplebatch: "", //样品批次
        sampleunit: "", //生产/使用单位
        sample_Amout: "", //样品量
        sampleAmout: "kg", //样品量单位
        sampleType: "", //样品类型
        sample_Type: "", //其他样品类型
        sample_type_lims: "", //样品类别

        samplePackaging: "", //包装方式
        sampleCatagory: "", //样品分类
        sample_Catagory: "", //其他样品分类
        sampleAppearance: "", //样品外观
        sampleAppearance_color: "", //样品外观颜色
        sampleAppearance_other: "", //其他样品外观
        samplerisk: "", //危险性
        sample_risk: "", //其他危险性
        sampleSerialnumber: "", //设备编号
        sampleSerialnumbers: "", //设备名称
        sampleLocation: "", //取样位置
        sampleModele: "", //设备型号
        quyangDate: "", //取样日期
        sampleOilbrand: "", //油品牌号
        sampleyouDate: "", //油品使用日期
        sampleBeizhu: "", //备注
        sample_Packaging: "", //包装方式其他


        batchNumber: '', //样品批号
        sampleQuantity: '', //样品数量
        sampleForm1: '', //样品状态
        qualityGrade: '', //样品等级
        specifications: '', //规格型号
        sampleSJGDate: '', //生产日期
        trademark: '', //样品商标
        taskSaveCondition: '', //保存条件
      },

      rules: {
        productionName: [
          {required: true, message: "请输入样品名称", trigger: "blur"}
        ],
        sample_Amout: [
          {required: true, message: "请输入样品量", trigger: "blur"},
          {validator: validateSampleAmout, trigger: "blur"}
        ]
      },
      //检验项目信息数据
      tableData: [],
      // selectedItemTableData:[],
      currentIndex: "",
      addItemShow: false, //检验项目
      copyAddItemShow: false, //复制添加检验项目
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
      distinguishCode: "", //识别码
      receiveTaskShow: false,
      temp: "basicInfo",
      activeIndex: "basicInfo",
      rowData: {}, //单行数据
      rowDatas: [], //批量多选数据
      radio: 3, //单选按钮
      radio1: 3, //单选按钮
      checkList: [], //多选框
      num: null,
      cateShow: false,
      tabPosition: "left",
      sampleIdCode: "", //路由跳转的参数
      taskIdCode: "" //路由跳转的参数
    };
  },

  methods: {
    //复制样品检测项目的回调
    cloneSampleItem() {
      this.queryItemList();
    },
    //根据样品获取检测项目
    queryItemList() {
      itemListBySample(this.sampleIdCode).then(
          res => {
            this.tableData = res.data;
            this.loading = false;
          },
          err => {
          }
      );
    },
    //更新样品信息
    updateSample() {
      this.$refs["tasks"].validate(valid => {
        if (valid) {
          //检验项目顺序的保存
          //这个是移动完要把showOrder按新的顺序传给后台
          if (this.tableData.length > 0) {
            for (var i = 0; i < this.tableData.length; i++) {
              this.tableData[i]["showOrder"] = i + 1;
            }
            let params = [];
            this.tableData.forEach((ele, index) => {
              params.push({
                id: ele.id,
                showOrder: ele.showOrder
              });
            });
            this.tasks.itemList = params;
          }
          updateSamples(this.tasks).then(
              res => {
                if (res.code == 200) {
                  this.msgSuccess("修改样品信息成功，即将返回上一页");
                  setTimeout(() => {
                    this.backTo();
                  }, 1000);
                }
              },
              err => {
              }
          );
        } else {
          //校验失败时 如果在检查项目tab  给个提示
          if (this.currentIndex === "itemInfo") {
            this.msgError("请完善样品基本信息");
            return false;
          }
        }
      });
    },
    //查询样品信息
    querySample() {
      getSamplesBaseInfo(this.sampleIdCode).then(
          res => {

            res.data.sample_Amout = "";
            if (res.data.extData) {
              let extDataJson = JSON.parse(res.data.extData);
              if (extDataJson) {
                //只遍历复制存在的key
                for (var key in extDataJson) {
                  this.extDataObj[key] = extDataJson[key];
                  //console.log(key,":",extDataJson[key]);
                }
                res.data.sample_Amout = extDataJson["sample_Amout"] + "";
                // this.tasks.sample_Amout = this.extDataObj.sample_Amout;
              }
            }
            this.tasks = res.data;
          },
          err => {
            this.backToTaskList();
          }
      );
    },
    // 上移
    configUp(index, row) {
      var that = this;
      // console.log('上移', index, row)
      if (index > 0) {
        const upDate = that.tableData[index - 1];
        that.tableData.splice(index - 1, 1);
        that.tableData.splice(index, 0, upDate);
      } else {
        this.$message({
          message: "已经是第一条，不可上移!",
          type: "warning"
        });
      }
    },
    // 下移
    configDown(index, row) {
      var that = this;
      // console.log('下移', index, row)
      if (index + 1 === that.tableData.length) {
        this.$message({
          message: "已经是最后一条，不可下移!",
          type: "warning"
        });
      } else {
        const downDate = that.tableData[index + 1];
        that.tableData.splice(index + 1, 1);
        that.tableData.splice(index, 0, downDate);
      }
    },
    //保存选中项目
    saveItem(selectedItems) {
      // this.selectedItemTableData=selectedItems
      //已添加的合并新添加的项目
      //this.tableData.push(...selectedItems);
      //2021-03-17 hejiawen 后端已保存  直接push没有主键id 后续无法复制删除
      this.queryItemList();
    },
    //确定按钮-点击时 样品与检测项目顺序一同保存
    handleUpdateNew() {
      this.extDataObj.sample_Amout = String(this.tasks.sample_Amout);
      console.log(this.extDataObj)
      // this.tasks.extData = { ...this.extDataObj }
      this.tasks = {...this.tasks, ...this.extDataObj}

      this.updateSample();
    },
    //确定按钮操作
    handleUpdate() {
      //基本信息的保存
      if (this.currentIndex === "sampleInfo") {
        this.extDataObj.sample_Amout = String(this.tasks.sample_Amout);
        this.tasks.extData = JSON.stringify(this.extDataObj);
        this.updateSample();
      } else if (this.currentIndex === "itemInfo") {
        //检验项目顺序的保存
        //这个是移动完要把showOrder按新的顺序传给后台
        for (var i = 0; i < this.tableData.length; i++) {
          this.tableData[i]["showOrder"] = i + 1;
        }
        let params = [];
        this.tableData.forEach((ele, index) => {
          params.push({
            id: ele.id,
            showOrder: ele.showOrder
          });
        });
        saveOrder(params).then(
            res => {
              if (res.code == 200) {
                this.msgSuccess("保存检测项目排序成功，即将返回上一页");
                setTimeout(() => {
                  this.backTo();
                }, 1000);
              }
            },
            err => {
            }
        );
      }
    },
    //回填检测类别
    backfillCategory(detectCategory) {
      this.extDataObj.sample_type_lims = detectCategory.name;
      this.tasks.productionId = detectCategory.id; //样品类别id
      this.tasks.category = detectCategory.name;
    },
    //添加按钮操作
    handleAdd() {
      //  let selectedItems=this.selectedItemTableData.map((item)=>{
      //         return item;
      //       })
      // this.$refs.addItem.initItemList(selectedItems)
      this.addItemShow = true;
      this.$nextTick(() => {
        this.$refs.addItem.initItemList();
      });
    },
    handleCopyAdd() {
      this.copyAddItemShow = true;
      return;
      if (this.ids.length <= 0) {
        this.msgError("请选择要复制添加的样品");
      } else if (this.ids.length > 1) {
        this.msgError("只能复制一条样品");
      } else {
      }
    },

    //删除
    handleDeleteItem(row) {
      console.log(row.id);
      this.ids = [];
      this.ids.push(row.id);
      const itemName = row.itemName;
      this.$confirm('确定要删除"' + itemName + '"检测项目？', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
          .then(() => {
            deleteItem([row.id]).then(res => {
              if (res.code == 200) {
                this.msgSuccess("删除成功");
                this.queryItemList();
              }
            });
          })
          .catch(function () {
          });
    },
    //批量删除
    handleDeleteItems() {
      if (this.ids.length == 0) {
        this.msgError("请选择要删除的检测项目");
        return false;
      }
      console.log("this.ids", this.ids);
      this.$confirm("确定要删除选中检测项目？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
          .then(() => {
            deleteItem(this.ids).then(res => {
              if (res.code == 200) {
                this.msgSuccess("删除成功");
                this.queryItemList();
              }
            });
          })
          .catch(function () {
          });
    },
    handleChange() {
    },
    backTo() {
      this.$router.push({
        name: "entrustDetail",
        query: {
          taskIdCode: this.taskIdCode,
          tabIndex: "sampleInfo",
          pageFlag: this.parentPageFlag
        }
      });
    },
    //样品信息的修改按钮
    handleEdit() {
    },

    //切换tab标签
    handleClick(tab, event) {
      if (tab.name == "itemInfo") {
        //查询检测项目列表
        this.queryItemList();
      }
      this.currentIndex = tab.name;
      //this.init(this.activeIndex, this.currentIndex);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      // console.log("多选框选中的ids=>", this.ids.join(","));
      // console.log("多选选中的数据的个数=>", this.ids.length);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
      //多选框选中的数据
      // this.checkData = selection;
      // console.log('多选数据=>',this.$refs.multipleTable.selection)
    },
    //页面初始化
    init(activeIndex, currentIndex) {
      let taskIdCode = this.$route.query.taskIdCode;
      let sampleIdCode = this.$route.query.sampleIdCode;
      this.pageFlag = this.$route.query.pageFlag || "view";
      this.onlySee = this.pageFlag == "edit" ? false : true;
      this.parentPageFlag = this.$route.query.parentPageFlag;
      //如果没参数就跳回委托列表
      if (!taskIdCode || !sampleIdCode) {
        this.$router.push({
          name: "entrust"
        });
      }
      this.taskIdCode = taskIdCode;
      this.sampleIdCode = sampleIdCode;
      this.tasks.taskIdCode = taskIdCode;
      this.loading = true;
      activeIndex = activeIndex || "sampleInfo";
      currentIndex = currentIndex || "sampleInfo";
      this.activeIndex = activeIndex;
      this.currentIndex = currentIndex;
      if (currentIndex === "sampleInfo") {
        this.querySample();
      } else if (currentIndex === "itemInfo") {
        //检验项目信息
        this.queryItemList();
      }
    },
    //返回委托列表
    backToTaskList() {
      this.$router.push({name: "entrust"});
    }
  },
  computed: {},
  created() {
    this.init();
  },
  mounted() {
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

  button {
    width: 98px;
    height: 34px;
    margin-top: 16px;
    margin-left: 16px;
    border-radius: 4px;
  }

  button:nth-of-type(2) {
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
  // margin-top: 10px;
  margin-bottom: 20px;

  p {
    margin-left: 10px;
    font-size: 18px;
    font-weight: bold;
    line-height: 60px;
    color: #475166;
  }
}

// 表单
:deep(.tasks) {
  :deep(p) {
    font-weight: 600;
  }

  :deep(.inputText) {
    // display: flex;
    // justify-content: flex-start;
  }
}

:deep(.el-row-toolbar) {
  margin: 5px;
}

:deep(.spec) .el-radio {
  margin-bottom: 10px;
}

//tab切换样式
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

:deep(#tab-itemInfo) {
  background: #ffffff;
  width: 206px;
  height: 70px;
  font-size: 18px;
  font-weight: 400;
  line-height: 70px;
  text-align: center;
}

.radioarea {
  display: flex;
  flex-direction: row;
}
</style>

<template>
  <div>
    <el-tabs v-model="currentDetection" @tab-click="e_selDetectionPlan">
      <el-tab-pane
          v-for="(plan, planIndex) in infoPickList"
          :key="planIndex"
          :label="`检测计划${planIndex + 1}`"
          :name="planIndex.toString()"
      >
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <div class="card-header-left">
              <el-form-item label="计划执行日期" style="margin-bottom: 0">
                <el-date-picker
                    v-model="plan.executeDate"
                    placeholder="选择日期"
                    style="width: 200px !important"
                    type="date"
                    value-format="yyyy-MM-dd"
                >
                </el-date-picker>
              </el-form-item>
            </div>
            <div
                v-if="this.microStore.state.BeiYuan.planElementShowType == 0"
                class="card-header-right"
            >
              <el-button
                  plain
                  size="small"
                  type="primary"
                  @click="e_addPlainInfo(planIndex)"
              >新增检测信息
              </el-button>
              <el-button
                  plain
                  size="small"
                  type="warning"
                  @click="e_copayPlanInfo(planIndex)"
              >复制计划
              </el-button>
              <el-button
                  plain
                  size="small"
                  type="danger"
                  @click="e_deletePlanInfo(planIndex)"
              >删除计划
              </el-button>
            </div>
          </div>
          <!-- 检测信息 -->
          <div
              v-for="(planInfo, planInfoIndex) in plan.planInfoList"
              :key="planInfoIndex"
              style="margin-bottom: 20px"
          >
            <el-row justify="space-between">
              <el-col :span="5">
                <el-form-item label="检测类别">
                  <el-input v-model="planInfo.detectName"></el-input>
                </el-form-item>
              </el-col>
              <el-col
                  v-if="this.microStore.state.BeiYuan.planElementShowType == 0"
                  :span="10"
              >
                <el-form-item label="点位示意图">
                  <el-input
                      v-model="fileName"
                      class="input-with-select"
                      placeholder="点击上传"
                      readonly
                  >
                    <el-button
                        slot="append"
                        @click="e_upload(planInfoIndex, planIndex)"
                    >上传
                    </el-button>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col
                  v-if="this.microStore.state.BeiYuan.planElementShowType == 0"
                  :span="8"
              >
                <el-form-item>
                  <el-button
                      plain
                      size="small"
                      type="success"
                      @click="
                      e_addPoint(
                        planInfo.detectName,
                        planInfo.type,
                        planInfo.detectType,
                        planInfoIndex,
                        planIndex
                      )
                    "
                  >增加点位
                  </el-button>
                  <el-button
                      plain
                      size="small"
                      type="danger"
                      @click="e_deletePlainInfo(planInfoIndex, planIndex)"
                  >删除检测信息
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-table
                ref="singleTable"
                :data="planInfo.pointList"
                style="width: 100%"
            >
              <el-table-column type="index" width="50"></el-table-column>
              <el-table-column label="点位名称" property="pointName">
              </el-table-column>
              <el-table-column label="位置说明" property="placeExplain">
              </el-table-column>
              <el-table-column label="布点意义" property="pointMeaning">
              </el-table-column>
              <el-table-column label="天数" property="detectDays">
              </el-table-column>
              <el-table-column
                  label="检测项目"
                  property="detectItem"
              ></el-table-column>
              <el-table-column
                  v-if="this.microStore.state.BeiYuan.planElementShowType == 0"
                  label="操作"
              >
                <template v-slot="scope">
                  <el-button
                      size="small"
                      text type="primary"
                      @click.native.prevent="
                      editRow(scope.row, scope.$index, planInfoIndex, planIndex)
                    "
                  >编辑
                  </el-button>
                  <el-button
                      icon="el-icon-delete"
                      size="small"
                      text type="primary"
                      @click.native.prevent="
                      deleteRow(scope.$index, planInfoIndex, planIndex)
                    "
                  >移除
                  </el-button>
                  <el-button
                      icon="icon iconfont iconbsl-icon-fuzhi"
                      size="small"
                      text type="primary"
                      @click.native.prevent="
                      copyRow(scope.$index, planInfoIndex, planIndex)
                    "
                  >复制
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <input
        ref="fileInput"
        class="upload"
        style="display: none"
        type="file"
        @change="e_getUploadFile($event)"
    />
    <!-- 新增点位 -->
    <NewAddPoint
        v-if="showAddPoint"
        ref="NewAddPoint"
        :editType="editType"
        @close="showAddPoint = false"
        @confirm="e_savePointInfo"
    />
    <!-- 检测类别选择 -->
    <DetectType
        v-if="showDetectType"
        ref="DetectType"
        :visible="showDetectType"
        @cancel="showDetectType = false"
        @handleClick="e_selDetectType"
    />
  </div>
</template>

<script>
import {uploadFile} from "@/api/system/common";
import DetectType from "@/components/project/detectType.vue";
import NewAddPoint from "@/views/customerService/projectManagement/projectCompile/components/point/newAddPoint";

export default {
  name: "testPlan",
  props: {
    infoPickList: Array,
  },
  components: {
    NewAddPoint,
    DetectType,
  },
  data() {
    return {
      fileName: "",
      currentDetection: "0",
      currentPlanIndex: null,
      currentPlanInfoIndex: null,
      fileList: [],
      showAddPoint: false,
      editType: 0, //打开点位弹框的类型 0 增加点位   1编辑点位
      currentDetectName: "",
      currentDetectType: 0,
      currentPointIndex: null,
      showDetectType: false,
    };
  },
  watch: {
    fileList(val) {
      if (val.length > 0) {
        let nameList = val.map((item) => {
          return item.fileName;
        });

        this.fileName = nameList.join(",");
      }
    },
    // infoPickList (val) {
    //   console.log(val)
    //   // this.infoPickLists = val
    //   // console.log(this.infoPickLists)
    //   val.forEach((item) => {
    //     item.planInfoList = item.detectInfoPickVOList;
    //     if (val.planInfoList !== undefined) {
    //       item.planInfoList.forEach((e) => {
    //         e.detectName = e.detectTypeStr;
    //         e.pointList = e.detectPointPickVOList;
    //       });
    //     }
    //   });
    // }
  },
  mounted() {
    // this.e_dealWithPointData()
  },
  methods: {
    // e_dealWithPointData () {
    //   this.infoPickList.forEach((item) => {
    //     item.planInfoList = item.detectInfoPickVOList;
    //     if (val.planInfoList !== undefined) {
    //       item.planInfoList.forEach((e) => {
    //         e.detectName = e.detectTypeStr;
    //         e.pointList = e.detectPointPickVOList;
    //       });
    //     }
    //   });
    // },
    //   选择其中一个检测计划
    e_selDetectionPlan(e) {
      this.currentDetection = e.name;
    },
    // 新增检测信息
    e_addPlainInfo(planIndex) {
      this.currentPlanIndex = planIndex;
      this.showDetectType = true;
    },
    //   复制计划
    e_copayPlanInfo(planIndex) {
      let obj = {
        planInfoList: this.infoPickList[planIndex].planInfoList,
      };
      this.infoPickList.push(obj);
    },
    //   删除计划
    e_deletePlanInfo(planIndex) {
      this.infoPickList.splice(planIndex, 1);
      if (planIndex != 0 && planIndex == this.infoPickList.length - 1) {
        let index = Number(this.currentDetection) - 1;
        this.currentDetection = String(index);
      }
    },
    // 检测类别
    selDetecData(data) {
      // console.log(this.infoPickList)
      this.infoPickList[this.currentPlanIndex].planInfoList.push(data);
    },
    // 新增检测计划
    addDetectionPlan(data) {
      console.log(data);
    },
    /*
     *@author: 焦政
     *@date: 2021-07-21 09:56:12
     *@description:上传文件
     */
    e_upload(planInfoIndex, planIndex) {
      this.currentPlanIndex = planIndex;
      this.currentPlanInfoIndex = planInfoIndex;
      this.$refs.fileInput.click(); //上传文件
    },
    e_getUploadFile(event) {
      let file = event.target.files; //target事件
      let formData = new FormData();
      formData.append("file", file[0]);
      uploadFile(formData).then((re) => {
        console.log("上传结果", re); //fileName  url
        let obj = {
          fileName: re.fileName,
          filePath: re.url,
        };
        this.infoPickList[this.currentPlanIndex].planInfoList[
            this.currentPlanInfoIndex
            ].pointFileList.push(obj);
        this.fileList.push(obj);
        this.$refs.fileInput.value = ""; //上传文件后重置
      });
    },
    /*
     *@author: 焦政
     *@date: 2021-07-17 10:03:32
     *@description:增加点位
     */
    e_addPoint(detectName, type, detectTypeId, planInfoIndex, planIndex) {

      this.editType = 0;
      this.currentDetectName = detectName;
      this.microStore.commit("set_detectName", detectName);
      this.currentDetectType = type;
      this.microStore.commit("set_categoriesId", detectTypeId);
      this.microStore.commit("set_categoriesType", Number(type));
      console.log("类型", typeof this.microStore.state.editPonit.detectType);
      this.currentPlanInfoIndex = planInfoIndex;
      this.currentPlanIndex = planIndex;
      this.showAddPoint = true;
      this.$nextTick(() => {
        this.$refs.NewAddPoint.initAdd();
      });
    },
    // 确定
    e_savePointInfo(pointInfo) {
      this.showAddPoint = false;
      if (this.currentPointIndex != null) {
        this.$set(
            this.infoPickList[this.currentPlanIndex].planInfoList[
                this.currentPlanInfoIndex
                ].pointList,
            this.currentPointIndex,
            pointInfo
        );
      } else {
        if (
            !this.infoPickList[this.currentPlanIndex].planInfoList[
                this.currentPlanInfoIndex
                ].pointList
        ) {
          this.$set(
              this.infoPickList[this.currentPlanIndex].planInfoList[
                  this.currentPlanInfoIndex
                  ],
              "pointList",
              []
          );
        }
        this.infoPickList[this.currentPlanIndex].planInfoList[
            this.currentPlanInfoIndex
            ].pointList.push(pointInfo);
      }
      console.log("pointInfo", pointInfo);
    },
    // 删除检测信息
    e_deletePlainInfo(planInfoIndex, planIndex) {
      console.log("planIndex", planIndex);
      console.log("planInfoIndex", planInfoIndex);
      let arr = JSON.parse(
          JSON.stringify(this.infoPickList[planIndex].planInfoList)
      );
      arr.splice(planInfoIndex, 1);
      this.infoPickList[planIndex].planInfoList = arr;
      console.log("infoPickList", this.infoPickList);
    },
    // 编辑
    editRow(row, currentPointIndex, planInfoIndex, planIndex) {
      this.currentPointIndex = currentPointIndex;
      this.currentPlanInfoIndex = planInfoIndex;
      this.currentPlanIndex = planIndex;
      this.editType = 1;
      this.showAddPoint = true;
      this.$nextTick(() => {
        this.$refs.NewAddPoint.editShow(row);
      });
    },
    // 删除一行点位
    deleteRow(pointIndex, planInfoIndex, planIndex) {
      this.$confirm("确定要移除当前行?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.infoPickList[planIndex].planInfoList[
            planInfoIndex
            ].pointList.splice(pointIndex, 1);
      });
    },
    // 复制点位
    copyRow(pointIndex, planInfoIndex, planIndex) {
      console.log("cc", this.microStore.state.project.planType);
      let target = JSON.parse(
          JSON.stringify(
              this.infoPickList[planIndex].planInfoList[planInfoIndex].pointList[
                  pointIndex
                  ]
          )
      );
      this.infoPickList[planIndex].planInfoList[planInfoIndex].pointList.push(
          target
      );
    },
    // 选择检测类别
    e_selDetectType(row) {
      let obj = {
        detectType: row.id,
        detectName: row.detectName,
        type: row.type,
        pointFileList: [],
        pointList: [],
      };
      let arr = JSON.parse(
          JSON.stringify(this.infoPickList[this.currentPlanIndex].planInfoList)
      );
      arr.push(obj);
      this.infoPickList[this.currentPlanIndex].planInfoList = arr;
    },
  },
};
</script>

<style scoped>
</style>

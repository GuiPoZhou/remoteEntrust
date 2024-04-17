<template>
  <div>
    <el-tabs v-model="currentDetection" @tab-click="e_selDetectionPlan">
      <el-tab-pane
          v-for="(plan, planIndex) in infoGiveList"
          :key="planIndex"
          :name="planIndex.toString()"
      >
        <el-input v-if="plan.isDbClick" slot="label" v-model="plan.planName" size="small"
                  @blur="e_overPlanTitle(plan.planName,planIndex)"></el-input>
        <span v-else slot="label" @dblclick="e_dbClickPlanName(planIndex)">{{ plan.planName }}</span>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <div class="card-header-left">
              <el-form-item
                  label="计划执行日期"
                  style="margin-bottom: 0"
              >
                <el-date-picker
                    v-model="plan.executeDate"
                    :picker-options="pickeroptions()"
                    placeholder="选择日期"
                    style="width: 200px !important"
                    type="date" value-format="yyyy-MM-dd"
                >
                </el-date-picker>
              </el-form-item>
            </div>
            <div v-if="microStore.state.BeiYuan.planElementShowType == 0" class="card-header-right">
              <template v-if="projectSlotButtonList.entrySlotButtonList && !entrustCode && openType !=='view'">
                <el-button v-for="(v, i) in projectSlotButtonList.entrySlotButtonList" :size="v.size" :type="v.type"
                           @click="e_slotButtonEvents(v, planIndex)">{{ v.label }}
                </el-button>
              </template>
              <template v-else>
                <el-button
                    v-if="!entrustCode && openType !=='view'"
                    plain
                    size="small"
                    type="primary"
                    @click="e_addPlainInfo(planIndex)"
                >新增检测信息
                </el-button
                >
              </template>
              <el-button
                  v-if="!entrustCode && openType !=='view'"
                  plain
                  size="small"
                  type="warning"
                  @click="e_copayPlanInfo(planIndex)"
              >可选择复制份数
              </el-button
              >
              <el-button
                  v-if="!entrustCode && openType !=='view'"
                  plain
                  size="small"
                  type="danger"
                  @click="e_deletePlanInfo(planIndex)"
              >删除计划
              </el-button
              >
            </div>
          </div>
          <!-- 检测信息 -->

          <el-table
              ref="singleTable"
              :data="plan.planInfoList"
              :expand-row-keys="expand"
              :row-key="getKey"
              style="width: 100%"
          >
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-table :data="scope.row.itemList" style='width:95%;margin: 10px auto'>
                  <el-table-column align="center" label="项目名称" property="itemName"/>
                  <el-table-column align="center" label="方法编号" property="itemCode"/>
                  <el-table-column align="center" label="基质" property="stroma"/>
                  <el-table-column align="center" label="客户指定" property="customerAppoint">
                    <template v-slot="scope">
                      <span>{{ scope.row.customerAppoint == 0 ? '否' : '是' }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="子项目" property="" show-overflow-tooltip>
                    <template v-slot="scope">
                      <el-button v-if="scope.row.voListZ.length > 0" size="small"
                                 type="text"
                                 @click="handleItem(scope.row.voListZ)">{{ scope.row.chilitemName }}
                      </el-button>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="项目费用" property="itemPrice"/>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column label="检测类别" property="detectTypeName">
              <!--                            <template slot="header" v-slot="scope">-->
              <!--                                <div class="tablehead">-->
              <!--                                    <div class="iconplus" v-if="showicon" @click="toogleExpand">+</div>-->
              <!--                                    <div class="iconplus" v-if="!showicon" @click="toogleExpand1">-</div>-->
              <!--                                    <span><span style="color: red"></span>检测类别</span>-->
              <!--                                </div>-->
              <!--                            </template>-->
            </el-table-column>
            <el-table-column label="样品名称" property="sampleName">
            </el-table-column>
            <el-table-column
                label="样品原标识"
                property="sampleOriginalLabel"
            >
            </el-table-column>
            <el-table-column label="样品数量" property="sampleNumber">
            </el-table-column>
            <el-table-column
                label="样品状态"
                property="sampleStatus"
            >
              <template v-slot="scope">
                {{ sampleStatus[scope.row.sampleStatus] }}
              </template>
            </el-table-column>
            <el-table-column
                label="保存方式"
                property="saveCondition"
            ></el-table-column>
            <el-table-column
                label="检测项目"
                property="detectItem"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column v-if="microStore.state.BeiYuan.planElementShowType == 0" label="操作">
              <template v-slot="scope">
                <template v-if="!projectSlotButtonList.actionButtons">
                  <el-button
                      v-if="!scope.row.entrustCode && openType !=='view'"
                      size="small"
                      type="text"
                      @click.native.prevent="
                            editRow(scope.row, scope.$index, planIndex,plan.planInfoList)
                          "
                  >编辑
                  </el-button
                  >
                </template>
                <template v-else>
                  <el-button v-for="(actionInfo,actionIndex) in projectSlotButtonList.actionButtons"
                             v-if="!scope.row.entrustCode && openType !=='view'"
                             :key="actionIndex"
                             size="small" type="text"
                             @click="e_actionButtonEvents(actionInfo,scope.row, scope.$index, planIndex,plan.planInfoList)">
                    {{ actionInfo.label }}
                  </el-button>
                </template>
                <el-button
                    v-if="!scope.row.entrustCode && openType !=='view'"
                    icon="el-icon-delete"
                    size="small"
                    type="text"
                    @click.native.prevent="
                            deleteRow(scope.$index, planIndex)
                          "
                >移除
                </el-button
                >
                <el-button
                    v-if="!scope.row.entrustCode && openType !=='view'"
                    icon="icon iconfont iconbsl-icon-fuzhi"
                    size="small"
                    type="text"
                    @click.native.prevent="
                            copyRow(scope.$index, planIndex,plan.planInfoList)
                          "
                >复制
                </el-button
                >
                <el-button
                    v-if="scope.row.entrustCode ||  openType =='view'"
                    icon="icon iconfont iconbsl-icon-fuzhi"
                    size="small"
                    type="text"
                    @click.native.prevent="
                                    editRow(scope.row, scope.$index, planIndex,plan.planInfoList, 'detail')
                          "
                >查看
                </el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <!-- 检测类别选择 -->
    <DetectType
        v-if="showDetectType"
        ref="DetectType"
        :addSampleShow="showDetectType"
        :list="List"
        :openType="openType"
        @cancel="showDetectType = false"
        @handleClick="e_savePointInfo"
    />
    <!-- 华淼新增检测信息 -->
    <addDetectInfo
        v-if="showDetectTypenew"
        ref="DetectTypenew"
        :addSampleShow="showDetectTypenew"
        :list="List"
        :openType="openType"
        @cancel="showDetectTypenew = false"
        @handleClick="e_savePointInfo"
    />
    <copyPlan :copyPlanShow="copyPlanShow" :planIndex1="planIndex1" @cancel="copyPlanShow = false"
              @savePlanNum="savePlanNum"></copyPlan>
    <!--  子项目    -->
    <itemsDetail v-if="showItems" ref="itemsRef" @close="showItems = false"></itemsDetail>
  </div>
</template>

<script>

import DetectType from '@/views/customerService/projectManagement/projectCompile/components/sendSample/addDetectInfo'
import copyPlan from '@/views/priceService/development_price/dialog/components/copyPlan.vue'
import itemsDetail from "@/views/priceService/development_price/dialog/itemsDetail.vue";
import Vue from "vue";
// import DetectType from '@/components/project/detectType'
export default {
  name: 'testPlan',
  props: {
    infoGiveList: Array,
    entrustCode: {
      typeof: String,
      default: ''
    },
    openType: {
      typeof: String,
      default: ''
    },
    queryParams: {
      typeof: Object,
      default: () => {
      }
    }
  },
  components: {
    DetectType,
    copyPlan,
    itemsDetail
  },
  data() {
    return {
      projectSlotButtonList: {},//
      showicon: false,
      showItems: false,
      showDetectTypenew: false,
      fileName: '',
      currentDetection: '0',
      currentPlanIndex: null,
      currentPlanInfoIndex: null,
      fileList: [],
      expand: [],
      showAddPoint: false,
      editType: 0, //打开点位弹框的类型 0 增加点位   1编辑点位
      currentDetectName: '',
      currentDetectType: 0,
      currentPointIndex: null,
      showDetectType: false,
      sampleStatus: [],
      copyPlanShow: false,
      planIndex1: 1,
      List: {}
    }
  },
  watch: {
    fileList(val) {
      if (val.length > 0) {
        let nameList = val.map((item) => {
          return item.fileName
        })

        this.fileName = nameList.join(',')
      }
    },
  },
  async created() {
    await this.doLoadMicroApp('microProject', this.microProjectEntry)
    Vue.component('addDetectInfo', window.commonComponents.addDetectInfo)
    this.projectSlotButtonList = await this.getProjectSlotButtons('quotationSampleButton')
  },
  mounted() {
    console.log(this.infoGiveList)
    // this.e_dealWithPointData()
    this.$net('/system/dict/data/listAll', 'get', {dictType: 'sample_status'}).then(res => {
      for (var i in res.data) {
        this.sampleStatus[res.data[i].dictCode] = res.data[i].dictLabel
      }
    })
  },
  methods: {
    e_actionButtonEvents(v, row, pointIndex, planIndex, list, type) {
      var that = this
      new Function('that', 'row', 'pointIndex', 'planIndex', 'list', 'type', v.clickEvents)(that, row, pointIndex, planIndex, list, type)
    },
    e_slotButtonEvents(v, planIndex) {
      var that = this
      new Function('that', 'planIndex', v.events)(that, planIndex)
    },
    getKey(row) {
      if (row.id) {
        return row.id
      } else {
        return row.roundID
      }
    },
    // 查看子项目
    handleItem(data) {
      this.showItems = true
      this.$nextTick(() => {
        this.$refs.itemsRef.init(data)
      })
    },
    //计划标题修改完毕
    e_overPlanTitle(title, index) {
      if (!title) {
        this.infoGiveList[index].planName = `检测计划${index + 1}`
      }
      let obj = this.infoGiveList[index]
      obj.isDbClick = false
      this.$set(this.infoGiveList, index, obj)
    },
    //双击修改计划名称
    e_dbClickPlanName(index) {
      let obj = this.infoGiveList[index]
      obj.isDbClick = true
      this.$set(this.infoGiveList, index, obj)
    },
    pickeroptions() {
      let dates = []
      for (var i in this.infoGiveList) {
        if (this.infoGiveList[i].executeDate) {
          dates.push(Number(new Date(this.infoGiveList[i].executeDate + ' 00:00')))
        }
      }
      if (dates.length > 0) {
        return {
          disabledDate: time => {
            return dates.indexOf(Number(new Date(time))) != -1 ? true : false
          }
        }
      }
    },
    //   选择其中一个检测计划
    e_selDetectionPlan(e) {
      this.currentDetection = e.name
    },
    // 新增检测信息
    e_addPlainInfo(planIndex) {
      this.currentPlanIndex = planIndex
      this.currentPointIndex = null
      this.showDetectType = true
      this.$nextTick(() => {
        this.$refs.DetectType.paramInit(this.queryParams)
      })
      console.log(this.queryParams)
    },
    e_savePointInfo(pointInfo) {
      this.showDetectType = false
      this.showDetectTypenew = false
      if (this.currentPointIndex != null) {
        this.$set(
            this.infoGiveList[this.currentPlanIndex].planInfoList,
            this.currentPointIndex,
            pointInfo
        )
      } else {
        if (!this.infoGiveList[this.currentPlanIndex].planInfoList) {
          this.$set(
              this.infoGiveList[this.currentPlanIndex].planInfoList,
              'planInfoList', []
          )
        }
        this.infoGiveList[this.currentPlanIndex].planInfoList.push(pointInfo)

        this.infoGiveList[this.currentPlanIndex].planInfoList.map(item => {
          if (item.id) {
            this.expand.push(item.id)
          } else {
            this.expand.push(item.roundID)
          }
          item.itemList.map(items => {
            let names = []
            if (items.voListZ.length !== 0) {
              items.voListZ.map(iteminfo => {
                names.push(iteminfo.itemName)
              })
              items.chilitemName = names.join(',')
            }
            if (!items.itemPrice) {
              items.itemPrice = 0.00
            }
          })
        })

      }
    },
    addDetectionPlan(data) {
    },
    savePlanNum(num, planIndex) {
      for (var i = 1; i <= num; i++) {
        // let obj = JSON.parse(
        //     JSON.stringify({
        //         planInfoList: this.infoPickList[planIndex].planInfoList
        //     })
        // )
        // obj.planName = `检测计划${planIndex + 1}`
        // obj.isDbClick = false
        // this.infoPickList.push(obj)
        let obj = {
          planInfoList: JSON.parse(JSON.stringify(this.infoGiveList[planIndex].planInfoList))
        }
        obj.planName = `检测计划${planIndex + 1}`
        this.infoGiveList.push(obj)
      }
      this.copyPlanShow = false
    },
    //   复制计划
    e_copayPlanInfo(planIndex) {
      // let obj = {
      //     planInfoList: JSON.parse(JSON.stringify(this.infoGiveList[planIndex].planInfoList))
      // }
      // this.infoGiveList.push(obj)
      this.planIndex1 = planIndex
      this.copyPlanShow = true
    },
    // 删除计划
    e_deletePlanInfo(planIndex) {
      this.infoGiveList.splice(planIndex, 1)
      if (planIndex != 0 && planIndex == this.infoGiveList.length - 1) {
        let index = Number(this.currentDetection) - 1
        this.currentDetection = String(index)
      }
    },
    editRow(row, pointIndex, planIndex, list, type) {
      list.map((item, index) => {
        item.identification = index
      })
      this.editType = 1
      this.currentPointIndex = pointIndex
      this.currentPlanIndex = planIndex
      this.showDetectType = true
      /*  this.$nextTick(() => {
          this.$refs.DetectType.editAdd(row);
        });*/
      this.$nextTick(() => {
        this.$refs.DetectType.editAdd(
            JSON.parse(JSON.stringify(row)), 1, list, type
        )
      })
    },
    // 删除一行点位
    deleteRow(pointIndex, planIndex) {
      this.$confirm('确定要移除当前行?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.infoGiveList[planIndex].planInfoList.splice(pointIndex, 1)
      })
    },
    // 复制点位
    copyRow(pointIndex, planIndex, list) {
      if (this.microStore.state.project.planType == 1) {
        let target = JSON.parse(
            JSON.stringify(this.infoGiveList[planIndex].planInfoList[pointIndex])
        )
        this.checkRepeat(list, target, 'sampleName', '_副')
        this.checkRepeat(list, target, 'sampleOriginalLabel', '_副')
        this.infoGiveList[planIndex].planInfoList.push(target)
      } else {
        let target = JSON.parse(
            JSON.stringify(this.infoGiveList[planIndex].planInfoList[pointIndex])
        )
        this.checkRepeat(list, target, 'sampleName', '_副')
        this.checkRepeat(list, target, 'sampleOriginalLabel', '_副')
        this.infoGiveList[planIndex].planInfoList.push(target)
      }
    }
  }
}
</script>

<style scoped>
.iconplus {
  width: 12px;
  height: 12px;
  background: rgba(255, 255, 255, 0);
  border: 1px solid #384354;
  border-radius: 2px;
  color: #384354;
  text-align: center;
  line-height: 9px;
  margin-right: 10px;
  cursor: pointer;
}

/*/deep/ .el-table__expand-icon > .el-icon {*/
/*    display: none;
//}*/
</style>

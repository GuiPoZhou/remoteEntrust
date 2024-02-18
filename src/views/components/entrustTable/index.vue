<template>
  <div class="app-container">
    <listContainer ref="listContainerRef" :businessConfigId="businessConfigId + ''" :runType="2"
                   @handleSelectionChange="handleSelectionChange"
    >
      <template slot="tableColumn.status" scope="row">
        {{ checkStatus(row.slotScopt.status) }}
      </template>
      <template slot="tableColumn.extSampleSource" scope="row">
        {{ checkSource(row.slotScopt) }}
      </template>
      <template slot="tableColumn.sampleProductType" scope="row">
        {{ checkSampleProductType(row.slotScopt) }}
      </template>
      <template slot="bobutton">
        <!--    按钮-->
        <el-row :gutter="10" class="mb8">
          <el-col v-for="(v, i) in pluginsInfo.mainHomeButtons" :key="i" :span="1.5">
            <el-button :size="v.size" :type="v.type" @click="e_slotButtonEvents(v)">{{ v.label }}
            </el-button>
          </el-col>
        </el-row>
      </template>
      <template slot="action" slot-scope="scope">
        <el-button v-for="(actionInfo, actionIndex) in pluginsInfo.mainTableButtons" v-show="(!actionInfo.disabled || actionInfo.disabled == '') ? true : checkActionButtonNew(actionInfo.disabled, scope.slotScopt)"
                   :key="actionIndex + Math.random()"
                   :loading="actionInfo.isLoading" size="mini"
                   type="text" @click="e_actionButtonEventsNew(actionInfo, scope.slotScopt)">{{
            actionInfo.label
          }}
        </el-button>
      </template>
    </listContainer>


    <addEntrustDialog
        v-if="entrustShow"
        ref="entrustDialog"
        :businessConfigId="businessConfigId"
        @close="entrustShow = false"
        @saveReload="e_saveReload"
    />
  </div>
</template>
<script>
import listContainer from '@/components/executionTemplate/tableColumnConfig/listContainer.vue'
import addEntrustDialog from './addEntrustDialog.vue'
import {cloneTask, recallTask} from '@/api/index/index.js'
import {deleteTask} from '@/api/entrust/entrustConfirm.js'

export default {
  components: {
    listContainer,
    addEntrustDialog,
  },
  created() {
    let query = this.$route.query
    this.businessConfigId = query.itemId.toString() + 3333
    this.getPluginsForButtons('remoteBtn', (pluginsInfo) => {
      console.log('插件按钮', pluginsInfo)
      this.pluginsInfo = pluginsInfo
    })
  },
  watch: {
    "$route.query": {
      handler(val) {
        if (val) {
          this.businessConfigId = val?.itemId.toString() + 3333
        }
      },
      deep: true,
      immediate: true
    },
  },
  mounted() {
    this.$net('/v1/entrustRemoteAgreement/indexData', 'get',).then(res => {
    });
    this.getDicts('sample_source_list', 'get').then(res => {
      if (res.code === 200) {
        this.sampleSourceList = res.data
      }
    })
    this.getDicts('product_type').then(res => {
      if (res.code === 200) {
        this.productTypeList = res.data
      }
    })
  },
  data() {
    return {
      productTypeList: [],
      sampleSourceList: [],
      tabConfig: [],
      businessConfigId: null,
      activeIndex: null,
      entrustShow: false,
      activeName: 'first',
      isShowTab: false,
      statusList: [
        {label: '待确认', value: null},
        {label: '暂存', value: 0},
        {label: '待提交', value: 1},
        {label: '报检流程审批中', value: 2},
        {label: '报检流程撤回', value: 3},
        {label: '报检流程退回', value: 4},
        {label: '待受理', value: 5},
        {label: '受理退回', value: 6},
        {label: '已受理', value: 7},
        {label: '检测中', value: 9},
        {label: '检测中', value: 10},
        {label: '检测完成', value: 11},
      ],
      selectList: [],
      pluginsInfo: {},
    }
  },
  methods: {
    handleClick(e) {

    },
    e_saveReload() {
      this.entrustShow = false
      this.$refs.listContainerRef.$refs.query.getList()
    },
//多选回调
    handleSelectionChange(e) {
      this.selectList = e
    },
    handlepush(row) {
      this.$confirm('确定要推送所选数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        let params = {
          entrustCode: row.entrustCode,
          status: 3
        }
        this.$net('/v1/entrustRemoteAgreement/submit', 'post', params).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.$refs.listContainerRef.$refs.query.getList()
          }
        })
      })

    },
    checkStatus(e) {
      return this.statusList.filter(item => item.value == e)[0]?.label
    },
    // 来源
    checkSource(row) {
      return this.sampleSourceList.filter(item => item.dictCode == row.extSampleSource)[0]?.dictLabel
    },
    checkSampleProductType(row) {
      return this.productTypeList.filter(item => item.dictCode == row.sampleProductType)[0]?.dictLabel
    },
    //复制
    handleCopy(row) {
      this.$confirm(`确认复制委托[编号:${row.entrustCode}]？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
          .then(() => {
            cloneTask(row.id).then(
                res => {
                  if (res.code == 200) {
                    this.msgSuccess("复制成功");
                    this.$refs.listContainerRef.$refs.query.getList();
                  }
                },
                err => {
                }
            );
          })
          .catch(function () {
          });
    },
    //删除
    handleDetele(row) {
      this.$confirm(`确认删除委托[编号:${row.entrustCode}]？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
          .then(() => {
            console.log(typeof row.id)
            deleteTask(row.id.toString()).then(res => {
              if (res.code == 200) {
                this.msgSuccess("删除成功");
                this.$refs.listContainerRef.$refs.query.getList();
              }
            });
          })
          .catch(function () {
          });
    },
// 新增委托
    handleAddPrice() {
      this.entrustShow = true
      this.$nextTick(() => {
        this.$refs.entrustDialog.init(this.businessConfigId, 'add')
      })
    },
    editRow(type, row) {
      console.log(row)
      this.entrustShow = true;
      this.$nextTick(() => {
        this.$refs.entrustDialog.editInit(this.businessConfigId, row, type)
      })
    },
    /**
     * @author Coder
     * @date 2023/4/20
     * @des 处理table action表格按钮
     */
    checkActionButton(events, scope) {
      return eval(events)
    },
    checkActionButtonNew(events, scope) {
      return new Function('ctx', 'scope', events)(this, scope)
    },
    // 新版 table 行内按钮事件
    e_actionButtonEventsNew(widgetInfo, scope) {
      new Function('ctx', 'scope', 'widgetInfo', widgetInfo.clickEvents)(this, scope, widgetInfo)
    },
    /**
     * @author Coder
     * @date 2023/4/20
     * @des 插槽按钮事件
     */
    e_slotButtonEvents(v) {
      console.log(this, '213')
      var that = this
      new Function('ctx', v.events)(that)
    },
    /**
     * @author Coder
     * @date 2023/4/20
     * @des table 自定义操作按钮事件
     */
    e_actionButtonEvents(v, scope) {
      var that = this
      new Function('ctx', 'scope', v.clickEvents)(that, scope)
    },
  }
}
</script>
<style scoped>
.app-container {
  text-align: center;
  margin: 0 auto;
  width: 80%;
}
</style>

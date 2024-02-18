<template>
  <div>
    <div class="later-entrust">
      <indexCenterTop></indexCenterTop>
    </div>
    <div class="boTable">
      <el-row type="flex">
        <div class="a-c-bottom">
          <el-row>
            <el-col :span="24">
              <div class="positionBtn">
                <p>近期委托</p>
              </div>
            </el-col>
            <el-col :span="24">
              <el-table
                  ref="multipleTable"
                  :cell-style="cellStyle"
                  :data="tableData"
                  border
                  max-height="525"
                  style="width: 100%"
              >
                <el-table-column
                    :show-overflow-tooltip="true"
                    align="center"
                    label="委托编号"
                    prop="entrustCode"
                >
                </el-table-column>
                <el-table-column
                    :show-overflow-tooltip="true"
                    align="center"
                    label="业务类型"
                    prop="entrustCode"
                >
                  <template v-slot="scope">
                    {{ checkEntrustType(scope.row) }}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="委托人" prop="remoteLeader">
                </el-table-column>
                <el-table-column align="center" label="委托部门">
                  <template v-slot="scope">
                    {{ checkEntrustDept(scope.row) }}
                  </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    label="委托日期"
                    prop="createTime"
                    width="160"
                >
                </el-table-column>
                <el-table-column
                    align="center"
                    label="状态"
                    prop="status"
                >
                  <template v-slot="scope">
                    {{ statusCheck(scope.row) }}
                  </template>
                </el-table-column>
                <!--        <el-table-column-->
                <!--          prop="agreement"-->
                <!--          label="报检书状态"-->
                <!--          align="center"-->
                <!--        >-->
                <!--          <template v-slot="scope">-->
                <!--            {{agreementCheck(scope.row.agreement)}}-->
                <!--          </template>-->
                <!--        </el-table-column>-->

                <!--        <el-table-column-->
                <!--          prop="detectCost"-->
                <!--          label="报检金额"-->
                <!--          align="center"-->
                <!--        >-->
                <!--        </el-table-column>-->
                <el-table-column align="center" fixed="right" label="操作" width="150">
                  <template v-slot="scope">
                    <el-button v-if="scope.row.status === 1 || scope.row.status == 6"
                               size="mini" type="text" @click="handleEdit(scope.row,'edit')">编辑
                    </el-button>
                    <el-button size="mini" type="text" @click="handleEdit(scope.row,'detail')">查看</el-button>
                    <el-button size="mini" type="text" @click="handleCopy(scope.row)">复制</el-button>
                    <el-button v-if="scope.row.status === 1" size="mini" type="text" @click="handleDetele(scope.row)">
                      删除
                    </el-button>
                    <!--            <el-button @click="handleRecall(scope.row)" type="text" size="mini">撤回</el-button>-->
                    <el-button v-if="scope.row.status === 1" size="mini" type="text" @click="handlepush(scope.row)">
                      推送
                    </el-button>

                    <!--            <el-button @click="handleEvaluate(scope.row)" type="text" size="mini">评价</el-button>-->
                  </template>
                </el-table-column>
              </el-table>
              <!-- 分页 -->
              <!--              <pagination-->
              <!--                v-show="total > 0"-->
              <!--                :total="total"-->
              <!--                :page.sync="queryData.pageNum"-->
              <!--                :limit.sync="queryData.pageSize"-->
              <!--                @pagination="changePage"-->
              <!--              />-->
            </el-col>
          </el-row>
        </div>
      </el-row>
    </div>
    <addEntrustDialog
        v-if="entrustShow"
        ref="entrustDialogRef"
        :businessConfigId="businessConfigId"
        @close="entrustShow = false"
        @saveReload="e_saveReload"
    />
  </div>
</template>

<script setup>
import {ref, reactive, getCurrentInstance, onMounted} from 'vue'
import {cloneTask, recallTask} from '@/api/index'
import {deleteTask} from '@/api/entrust/entrustConfirm.js'
import addEntrustDialog from '@/views/customerMain/entrustCommponents/addEntrustDialog.vue'
import indexCenterTop from './indexCenterTop.vue'

const instance = getCurrentInstance()
// 获取vue实例
const vm = instance['proxy']

const {tableData, total, queryData} = defineProps(['tableData', 'total', 'queryData'])
const emit = defineEmits(['init', 'evaluate', 'changePage'])

//跳转
function jump2List() {
  vm.$router.push(
      {
        path: '/remote/entrust'
      }
  )
}

let status = [
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
]

function statusCheck(row) {
  return status.filter(item => item.value == row.status)[0]?.label
}

const agreement = [
  {label: '未上传', value: 0},
  {label: '报检方上传', value: 1},
  {label: '受理方上传', value: 2},
  {label: '双方上传', value: 3},
]
const agreementCheck = (e) => {
  return agreement.filter(item => item.value == e)[0]?.label
}
const handlepush = (row) => {
  vm.$confirm('确定要推送所选数据吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(res => {
    let params = {
      entrustCode: row.entrustCode,
      status: 5
    }
    vm.$net('/v1/entrustRemoteAgreement/submit', 'post', params).then(res => {
      if (res.code === 200) {
        vm.$message.success(res.msg)
        emit('init')
      }
    })
  })

}
const checkEntrustType = (row) => {
  let menu = vm.$store.state.menu.menus
  console.log(row);
  console.log(menu);
  return menu.filter(item => item.id == row.entrustType)[0]?.configName
}
// 委托部门
const checkEntrustDept = (row) => {
  return row.deptName
  if (row.extendedData) {
    let extData = JSON.parse(row.extendedData)
    return extData.principalDept
  }
}

//加急状态颜色
function cellStyle(row, column, rowIndex, columnIndex) {
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
}

// 报检编号详情
function detailEntrust(row) {
  if (!row || !row.idCode) return;
  vm.$router.push({
    name: "entrustDetail",
    query: {taskIdCode: row.idCode, pageFlag: "view"}
  });
}

let entrustShow = ref(false)
let businessConfigId = ref(0)

//编辑
function handleEdit(row, type) {
  console.log(row)
  entrustShow.value = true;
  vm.$nextTick(() => {
    vm.$refs.entrustDialogRef.editInit(row.entrustType, row, type)
  })
}

let businessConfigIdQuery = ref(null)

function changePage(e) {
  emit('changePage', e)
}

const e_saveReload = () => {
  emit('init')
}

//复制
function handleCopy(row) {
  vm.$confirm(`确认复制委托[编号:${row.entrustCode}]？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
      .then(() => {
        cloneTask(row.id).then(
            res => {
              if (res.code == 200) {
                vm.msgSuccess("复制成功");
                emit('init')
              }
            },
            err => {
            }
        );
      })
      .catch(function () {
      });
}

//评价
function handleEvaluate(row) {
  emit('evaluate', row)
}

//撤回
function handleRecall(row) {
  if (!row || !row.idCode) return;
  vm.$confirm(`确认撤回委托[编号:${row.idCode}]？`, "提示", {
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
            vm.msgSuccess("撤回成功");
            emit('init')
          }
        });
      })
      .catch(function () {
      });
}

//删除
function handleDetele(row) {
  vm.$confirm(`确认删除委托[编号:${row.entrustCode}]？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
      .then(() => {
        console.log(typeof row.id)
        deleteTask(row.id.toString()).then(res => {
          if (res.code == 200) {
            vm.msgSuccess("删除成功");
            emit('init')
          }
        });
      })
      .catch(function () {
      });
}
</script>
<style scoped>
.positionBtn {
  display: flex;
  justify-content: space-between;
}

.later-entrust {
  height: 260px;
}

.boTable {
  width: 100%;
}

.a-c-bottom {
  width: 100%;
}
</style>
